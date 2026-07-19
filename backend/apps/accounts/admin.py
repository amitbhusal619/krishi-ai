from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User, FarmerProfile, BuyerProfile, EmailVerificationToken, PasswordResetToken


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ["email", "username", "role", "is_verified", "is_suspended", "is_staff", "date_joined"]
    list_filter = ["role", "is_verified", "is_suspended", "is_staff"]
    search_fields = ["email", "username", "first_name", "last_name"]
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Krishi AI profile", {
            "fields": ("role", "phone", "avatar", "address", "city", "state", "pincode",
                       "is_verified", "is_suspended"),
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Krishi AI profile", {"fields": ("email", "role")}),
    )


@admin.register(FarmerProfile)
class FarmerProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "farm_name", "farm_location", "verification_status", "created_at"]
    list_filter = ["verification_status"]
    search_fields = ["user__email", "farm_name", "farm_location"]


@admin.register(BuyerProfile)
class BuyerProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "company_name", "created_at"]
    search_fields = ["user__email", "company_name"]


admin.site.register(EmailVerificationToken)
admin.site.register(PasswordResetToken)
