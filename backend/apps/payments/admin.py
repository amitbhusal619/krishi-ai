from django.contrib import admin

from .models import Wallet, WalletTransaction, Payment


@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ["user", "balance", "updated_at"]
    search_fields = ["user__email"]


@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ["wallet", "type", "amount", "created_at"]
    list_filter = ["type"]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["transaction_id", "order", "amount", "method", "status", "created_at"]
    list_filter = ["method", "status"]
