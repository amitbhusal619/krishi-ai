import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

from apps.common.models import TimeStampedModel


class User(AbstractUser):
    """
    Custom user model. Email is the login field; `role` drives which
    dashboard (farmer / buyer / admin) the frontend routes a user into.
    """

    class Role(models.TextChoices):
        FARMER = "farmer", "Farmer"
        BUYER = "buyer", "Buyer"
        ADMIN = "admin", "Admin"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.BUYER)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=20, blank=True)
    is_verified = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"

    @property
    def is_farmer(self):
        return self.role == self.Role.FARMER

    @property
    def is_buyer(self):
        return self.role == self.Role.BUYER

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN


class FarmerProfile(TimeStampedModel):
    """Extra profile data collected for users with role=farmer."""

    class VerificationStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        VERIFIED = "verified", "Verified"
        REJECTED = "rejected", "Rejected"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="farmer_profile")
    farm_name = models.CharField(max_length=150, blank=True)
    farm_location = models.CharField(max_length=255, blank=True)
    farm_size_acres = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    bio = models.TextField(blank=True)
    id_document = models.FileField(upload_to="farmer_documents/", blank=True, null=True)
    verification_status = models.CharField(
        max_length=10, choices=VerificationStatus.choices, default=VerificationStatus.PENDING
    )

    def __str__(self):
        return f"FarmerProfile<{self.user.email}>"


class BuyerProfile(TimeStampedModel):
    """Extra profile data collected for users with role=buyer."""

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="buyer_profile")
    company_name = models.CharField(max_length=150, blank=True)
    preferred_categories = models.CharField(max_length=255, blank=True, help_text="Comma-separated category slugs")

    def __str__(self):
        return f"BuyerProfile<{self.user.email}>"


def _default_expiry(hours):
    return timezone.now() + timedelta(hours=hours)


class EmailVerificationToken(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="verification_tokens")
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at


class PasswordResetToken(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reset_tokens")
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    def is_valid(self):
        return not self.used and timezone.now() < self.expires_at
