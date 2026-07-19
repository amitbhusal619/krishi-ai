from django.urls import path

from .views import AdminDashboardView, FarmerDashboardView

urlpatterns = [
    path("admin/", AdminDashboardView.as_view(), name="analytics-admin"),
    path("farmer/", FarmerDashboardView.as_view(), name="analytics-farmer"),
]
