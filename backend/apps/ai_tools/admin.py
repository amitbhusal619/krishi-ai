from django.contrib import admin

from .models import (
    DiseaseDetectionRequest, PricePredictionRequest,
    FertilizerRecommendationRequest, CropRecommendationRequest,
    ChatConversation, ChatMessage,
)

admin.site.register(DiseaseDetectionRequest)
admin.site.register(PricePredictionRequest)
admin.site.register(FertilizerRecommendationRequest)
admin.site.register(CropRecommendationRequest)
admin.site.register(ChatConversation)
admin.site.register(ChatMessage)
