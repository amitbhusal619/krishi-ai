from django.urls import path

from .views import AdminDashboardView, FarmerDashboardView, BuyerDashboardView

urlpatterns = [
    path("admin/", AdminDashboardView.as_view(), name="analytics-admin"),
    path("farmer/", FarmerDashboardView.as_view(), name="analytics-farmer"),
    path("buyer/", BuyerDashboardView.as_view(), name="analytics-buyer"),
]

