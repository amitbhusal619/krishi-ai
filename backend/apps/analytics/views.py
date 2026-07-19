from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncMonth
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.common.permissions import IsAdminRole, IsFarmer
from apps.accounts.models import User
from apps.products.models import Product
from apps.orders.models import Order, OrderItem


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
            "total_revenue": revenue,
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
        items = OrderItem.objects.filter(farmer=user)
        revenue = items.aggregate(total=Sum("unit_price"))["total"] or 0

        return Response({
            "total_products": Product.objects.filter(farmer=user).count(),
            "active_products": Product.objects.filter(farmer=user, is_active=True).count(),
            "total_orders": Order.objects.filter(items__farmer=user).distinct().count(),
            "total_units_sold": items.aggregate(total=Sum("quantity"))["total"] or 0,
            "average_rating": Product.objects.filter(farmer=user).aggregate(
                avg=Avg("reviews__rating")
            )["avg"],
        })
