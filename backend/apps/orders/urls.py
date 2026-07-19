from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import CartView, CartItemView, WishlistViewSet, CheckoutView, OrderViewSet

router = DefaultRouter()
router.register("wishlist", WishlistViewSet, basename="wishlist")
router.register("orders", OrderViewSet, basename="order")

urlpatterns = [
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/items/", CartItemView.as_view(), name="cart-items"),
    path("cart/items/<int:item_id>/", CartItemView.as_view(), name="cart-item-detail"),
    path("checkout/", CheckoutView.as_view(), name="checkout"),
] + router.urls
