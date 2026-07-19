from rest_framework import serializers

from .models import Wallet, WalletTransaction, Payment


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ["id", "amount", "type", "description", "created_at"]


class WalletSerializer(serializers.ModelSerializer):
    transactions = WalletTransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ["id", "balance", "transactions"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "order", "amount", "method", "status", "transaction_id", "created_at"]
        read_only_fields = ["status", "transaction_id"]


class InitiatePaymentSerializer(serializers.Serializer):
    order = serializers.IntegerField()
    method = serializers.ChoiceField(choices=Payment.Method.choices)


class WithdrawSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=1)
