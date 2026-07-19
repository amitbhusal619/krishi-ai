from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status, mixins, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsBuyer, IsFarmer, IsAdminRole
from apps.payments.models import Wallet, WalletTransaction
from .models import Cart, CartItem, Wishlist, Order, OrderItem
from .serializers import (
    CartSerializer, AddCartItemSerializer, WishlistSerializer,
    OrderSerializer, CheckoutSerializer,
)


class CartView(APIView):
    """
    GET    /api/orders/cart/            -> current buyer's cart
    POST   /api/orders/cart/items/      -> add/increment an item
    PATCH  /api/orders/cart/items/{id}/ -> update quantity
    DELETE /api/orders/cart/items/{id}/ -> remove item
    """

    permission_classes = [permissions.IsAuthenticated, IsBuyer]

    def get(self, request):
        cart, _ = Cart.objects.get_or_create(buyer=request.user)
        return Response(CartSerializer(cart).data)


class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsBuyer]

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(buyer=request.user)
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        quantity = serializer.validated_data["quantity"]

        item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"quantity": quantity})
        if not created:
            item.quantity += quantity
            item.save(update_fields=["quantity"])

        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    def patch(self, request, item_id=None):
        cart, _ = Cart.objects.get_or_create(buyer=request.user)
        item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = request.data.get("quantity")
        if quantity is None or float(quantity) <= 0:
            return Response({"detail": "quantity must be > 0"}, status=status.HTTP_400_BAD_REQUEST)
        item.quantity = quantity
        item.save(update_fields=["quantity"])
        return Response(CartSerializer(cart).data)

    def delete(self, request, item_id=None):
        cart, _ = Cart.objects.get_or_create(buyer=request.user)
        CartItem.objects.filter(id=item_id, cart=cart).delete()
        return Response(CartSerializer(cart).data)


class WishlistViewSet(mixins.ListModelMixin, mixins.CreateModelMixin,
                       mixins.DestroyModelMixin, viewsets.GenericViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated, IsBuyer]

    def get_queryset(self):
        return Wishlist.objects.filter(buyer=self.request.user).select_related("product")

    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)


class CheckoutView(APIView):
    """POST /api/orders/checkout/ — converts the buyer's cart into an Order."""

    permission_classes = [permissions.IsAuthenticated, IsBuyer]

    @transaction.atomic
    def post(self, request):
        cart = get_object_or_404(Cart, buyer=request.user)
        items = list(cart.items.select_related("product", "product__farmer"))
        if not items:
            return Response({"detail": "Cart is empty."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        for item in items:
            if item.quantity > item.product.quantity_available:
                return Response(
                    {"detail": f"Not enough stock for {item.product.name}."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        order = Order.objects.create(buyer=request.user, **serializer.validated_data)
        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                farmer=item.product.farmer,
                product_name=item.product.name,
                unit_price=item.product.price,
                quantity=item.quantity,
            )
            item.product.quantity_available -= item.quantity
            item.product.save(update_fields=["quantity_available"])

        order.recalculate_total()
        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    Buyers see their own orders. Farmers see orders containing their products
    (read-only, plus a status-update action). Admins see everything.
    """

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Order.objects.prefetch_related("items")
        if user.role == "buyer":
            return qs.filter(buyer=user)
        if user.role == "farmer":
            return qs.filter(items__farmer=user).distinct()
        return qs  # admin

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        order = self.get_object()
        user = request.user
        if user.role not in ("farmer", "admin"):
            return Response({"detail": "Not permitted."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if new_status not in Order.Status.values:
            return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status
        order.save(update_fields=["status"])

        # Credit the farmer's wallet once an order is marked delivered & paid.
        if new_status == Order.Status.DELIVERED and order.payment_status == Order.PaymentStatus.PAID:
            farmer_totals = {}
            for item in order.items.all():
                if item.farmer_id:
                    farmer_totals[item.farmer_id] = farmer_totals.get(item.farmer_id, 0) + item.subtotal
            for farmer_id, amount in farmer_totals.items():
                wallet, _ = Wallet.objects.get_or_create(user_id=farmer_id)
                wallet.balance += amount
                wallet.save(update_fields=["balance"])
                WalletTransaction.objects.create(
                    wallet=wallet, amount=amount, type=WalletTransaction.Type.CREDIT,
                    description=f"Payout for order #{order.id}",
                )

        return Response(OrderSerializer(order).data)
