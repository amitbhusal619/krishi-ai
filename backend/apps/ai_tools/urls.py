from django.urls import path

from .views import (
    DiseaseDetectionView, PricePredictionView, FertilizerRecommendationView,
    CropRecommendationView, ChatConversationListView, ChatSendMessageView,
)

urlpatterns = [
    path("disease-detection/", DiseaseDetectionView.as_view(), name="disease-detection"),
    path("price-prediction/", PricePredictionView.as_view(), name="price-prediction"),
    path("fertilizer-recommendation/", FertilizerRecommendationView.as_view(), name="fertilizer-recommendation"),
    path("crop-recommendation/", CropRecommendationView.as_view(), name="crop-recommendation"),
    path("chatbot/conversations/", ChatConversationListView.as_view(), name="chatbot-conversations"),
    path("chatbot/message/", ChatSendMessageView.as_view(), name="chatbot-message"),
]
