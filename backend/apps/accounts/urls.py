from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView, LoginView, VerifyEmailView, ResendVerificationView,
    RequestPasswordResetView, ResetPasswordView, ChangePasswordView, MeView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("login/refresh/", TokenRefreshView.as_view(), name="login-refresh"),
    path("verify/", VerifyEmailView.as_view(), name="verify-email"),
    path("verify/resend/", ResendVerificationView.as_view(), name="resend-verification"),
    path("forgot-password/", RequestPasswordResetView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("me/", MeView.as_view(), name="me"),
]
