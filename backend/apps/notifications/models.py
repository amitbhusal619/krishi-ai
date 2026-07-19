from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class Notification(TimeStampedModel):
    class Type(models.TextChoices):
        ORDER = "order", "Order"
        PAYMENT = "payment", "Payment"
        PRODUCT = "product", "Product"
        SYSTEM = "system", "System"
        AI = "ai", "AI tool"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=10, choices=Type.choices, default=Type.SYSTEM)
    title = models.CharField(max_length=150)
    message = models.TextField(blank=True)
    link = models.CharField(max_length=255, blank=True, help_text="Frontend route to deep-link to")
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} -> {self.user.email}"
