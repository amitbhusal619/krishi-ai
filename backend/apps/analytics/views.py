from django.db.models import Sum, Count, Avg, F
from django.db.models.functions import TruncMonth
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsAdminRole, IsFarmer, IsBuyer
from apps.accounts.models import User
from apps.products.models import Product
from apps.orders.models import Order, OrderItem, Wishlist, Cart


class AdminDashboardView(APIView):
    """GET /api/analytics/admin/ — top-level counts for the admin dashboard."""

    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        revenue = Order.objects.filter(payment_status=Order.PaymentStatus.PAID).aggregate(
            total=Sum("total_amount")
        )["total"] or 0

        monthly_orders = (
            Order.objects.annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(count=Count("id"), revenue=Sum("total_amount"))
            .order_by("month")
        )

        return Response({
            "total_users": User.objects.count(),
            "total_farmers": User.objects.filter(role=User.Role.FARMER).count(),
            "total_buyers": User.objects.filter(role=User.Role.BUYER).count(),
            "total_products": Product.objects.count(),
            "pending_products": Product.objects.filter(status=Product.Status.PENDING).count(),
            "total_orders": Order.objects.count(),
            "total_revenue": float(revenue),
            "orders_by_status": dict(
                Order.objects.values_list("status").annotate(c=Count("id")).order_by()
            ),
            "monthly_orders": list(monthly_orders),
        })


class FarmerDashboardView(APIView):
    """GET /api/analytics/farmer/ — sales & product stats for the logged-in farmer."""

    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    def get(self, request):
        user = request.user
        items = OrderItem.objects.filter(farmer=user).exclude(order__status=Order.Status.CANCELLED)
        revenue = items.aggregate(
            total=Sum(F("unit_price") * F("quantity"))
        )["total"] or 0

        orders_in_progress = Order.objects.filter(
            items__farmer=user,
            status__in=[Order.Status.PENDING, Order.Status.CONFIRMED, Order.Status.SHIPPED]
        ).distinct().count()

        monthly_rev = (
            items.annotate(month=TruncMonth("order__created_at"))
            .values("month")
            .annotate(revenue=Sum(F("unit_price") * F("quantity")))
            .order_by("month")
        )

        monthly_data = [
            {"month": m["month"].strftime("%b %Y") if m["month"] else "N/A", "revenue": float(m["revenue"] or 0)}
            for m in monthly_rev
        ]

        avg_rating = Product.objects.filter(farmer=user).aggregate(
            avg=Avg("reviews__rating")
        )["avg"]

        return Response({
            "total_products": Product.objects.filter(farmer=user).count(),
            "active_products": Product.objects.filter(farmer=user, is_active=True).count(),
            "orders_in_progress": orders_in_progress,
            "total_orders": Order.objects.filter(items__farmer=user).distinct().count(),
            "total_units_sold": float(items.aggregate(total=Sum("quantity"))["total"] or 0),
            "total_revenue": float(revenue),
            "average_rating": float(avg_rating) if avg_rating is not None else None,
            "monthly_revenue": monthly_data,
        })


class BuyerDashboardView(APIView):
    """GET /api/analytics/buyer/ — activity counts for the logged-in buyer."""

    permission_classes = [permissions.IsAuthenticated, IsBuyer]

    def get(self, request):
        user = request.user
        cart = Cart.objects.filter(buyer=user).first()
        cart_items_count = cart.items.count() if cart else 0

        return Response({
            "active_orders": Order.objects.filter(
                buyer=user,
                status__in=[Order.Status.PENDING, Order.Status.CONFIRMED, Order.Status.SHIPPED]
            ).count(),
            "completed_orders": Order.objects.filter(
                buyer=user,
                status=Order.Status.DELIVERED
            ).count(),
            "wishlist_items": Wishlist.objects.filter(buyer=user).count(),
            "cart_items": cart_items_count,
        })

