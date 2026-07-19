from django.urls import path

from .views import WalletView, WithdrawView, InitiatePaymentView, VerifyPaymentView, OrderPaymentsView

urlpatterns = [
    path("wallet/", WalletView.as_view(), name="wallet"),
    path("wallet/withdraw/", WithdrawView.as_view(), name="wallet-withdraw"),
    path("initiate/", InitiatePaymentView.as_view(), name="payment-initiate"),
    path("verify/", VerifyPaymentView.as_view(), name="payment-verify"),
    path("order/<int:order_id>/", OrderPaymentsView.as_view(), name="order-payments"),
]
