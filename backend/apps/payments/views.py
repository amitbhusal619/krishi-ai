from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsFarmer
from apps.orders.models import Order
from .models import Wallet, WalletTransaction, Payment
from .serializers import (
    WalletSerializer, PaymentSerializer, InitiatePaymentSerializer, WithdrawSerializer,
)


class WalletView(generics.RetrieveAPIView):
    """GET /api/payments/wallet/ — current user's wallet + transaction history."""

    serializer_class = WalletSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        wallet, _ = Wallet.objects.get_or_create(user=self.request.user)
        return wallet


class WithdrawView(APIView):
    """POST /api/payments/wallet/withdraw/ — farmer withdraws funds from wallet."""

    permission_classes = [permissions.IsAuthenticated, IsFarmer]

    @transaction.atomic
    def post(self, request):
        serializer = WithdrawSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount = serializer.validated_data["amount"]

        wallet, _ = Wallet.objects.get_or_create(user=request.user)
        if amount > wallet.balance:
            return Response({"detail": "Insufficient balance."}, status=status.HTTP_400_BAD_REQUEST)

        wallet.balance -= amount
        wallet.save(update_fields=["balance"])
        WalletTransaction.objects.create(
            wallet=wallet, amount=amount, type=WalletTransaction.Type.DEBIT,
            description="Withdrawal requested",
        )
        return Response(WalletSerializer(wallet).data)


class InitiatePaymentView(APIView):
    """
    POST /api/payments/initiate/ {order, method}
    Creates a Payment record. In this mock implementation the payment is
    marked successful immediately — swap this for a real eSewa/Khalti/Stripe
    integration by calling their init API here and redirecting the frontend.
    """

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = InitiatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = get_object_or_404(Order, id=serializer.validated_data["order"], buyer=request.user)

        payment = Payment.objects.create(
            order=order,
            amount=order.total_amount,
            method=serializer.validated_data["method"],
            status=Payment.Status.SUCCESS if serializer.validated_data["method"] == Payment.Method.COD
            else Payment.Status.PENDING,
        )

        if serializer.validated_data["method"] == Payment.Method.COD:
            order.payment_status = Order.PaymentStatus.PAID
            order.save(update_fields=["payment_status"])

        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    """
    POST /api/payments/verify/ {transaction_id}
    Called by the frontend after redirect back from a payment gateway.
    Mock: always marks the payment successful and the order as paid.
    """

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        transaction_id = request.data.get("transaction_id")
        payment = get_object_or_404(Payment, transaction_id=transaction_id, order__buyer=request.user)

        payment.status = Payment.Status.SUCCESS
        payment.save(update_fields=["status"])
        payment.order.payment_status = Order.PaymentStatus.PAID
        payment.order.save(update_fields=["payment_status"])

        return Response(PaymentSerializer(payment).data)


class OrderPaymentsView(generics.ListAPIView):
    """GET /api/payments/order/{order_id}/ — payment history for one order."""

    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order_id=self.kwargs["order_id"], order__buyer=self.request.user)
