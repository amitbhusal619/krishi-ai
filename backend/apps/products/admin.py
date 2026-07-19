from django.contrib import admin

from .models import Category, Product, ProductImage, Review


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "farmer", "category", "price", "unit", "quantity_available", "status", "is_active", "created_at"]
    list_filter = ["status", "is_active", "is_organic", "category"]
    search_fields = ["name", "farmer__email", "location"]
    inlines = [ProductImageInline]
    actions = ["approve_products", "reject_products"]

    @admin.action(description="Approve selected products")
    def approve_products(self, request, queryset):
        queryset.update(status=Product.Status.APPROVED)

    @admin.action(description="Reject selected products")
    def reject_products(self, request, queryset):
        queryset.update(status=Product.Status.REJECTED)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["product", "buyer", "rating", "created_at"]
    list_filter = ["rating"]
