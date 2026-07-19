from django.conf import settings
from django.db import models

from apps.common.models import TimeStampedModel


class DiseaseDetectionRequest(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="disease_requests")
    image = models.ImageField(upload_to="ai/disease_detection/")
    crop_type = models.CharField(max_length=100, blank=True)
    result_disease = models.CharField(max_length=150, blank=True)
    confidence = models.FloatField(null=True, blank=True)
    recommendation = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"DiseaseDetection<{self.user.email}> {self.result_disease}"


class PricePredictionRequest(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="price_predictions")
    crop = models.CharField(max_length=100)
    market = models.CharField(max_length=100, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    predicted_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_trend = models.CharField(max_length=20, blank=True, help_text="rising / falling / stable")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"PricePrediction<{self.crop}> {self.predicted_price}"


class FertilizerRecommendationRequest(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="fertilizer_requests")
    crop = models.CharField(max_length=100)
    soil_type = models.CharField(max_length=100, blank=True)
    nitrogen = models.FloatField(null=True, blank=True)
    phosphorus = models.FloatField(null=True, blank=True)
    potassium = models.FloatField(null=True, blank=True)
    ph_level = models.FloatField(null=True, blank=True)
    recommendation = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"FertilizerRecommendation<{self.crop}>"


class CropRecommendationRequest(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="crop_requests")
    soil_type = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    season = models.CharField(max_length=50, blank=True)
    rainfall_mm = models.FloatField(null=True, blank=True)
    recommended_crops = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"CropRecommendation<{self.region}>"


class ChatConversation(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="chat_conversations")
    title = models.CharField(max_length=150, blank=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Conversation<{self.user.email}> {self.title}"


class ChatMessage(models.Model):
    class Sender(models.TextChoices):
        USER = "user", "User"
        BOT = "bot", "Bot"

    conversation = models.ForeignKey(ChatConversation, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=10, choices=Sender.choices)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender}: {self.message[:40]}"
