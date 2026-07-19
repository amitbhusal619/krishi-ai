from rest_framework import serializers

from .models import (
    DiseaseDetectionRequest, PricePredictionRequest,
    FertilizerRecommendationRequest, CropRecommendationRequest,
    ChatConversation, ChatMessage,
)


class DiseaseDetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiseaseDetectionRequest
        fields = ["id", "image", "crop_type", "result_disease", "confidence", "recommendation", "created_at"]
        read_only_fields = ["result_disease", "confidence", "recommendation"]


class PricePredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricePredictionRequest
        fields = ["id", "crop", "market", "quantity", "predicted_price", "price_trend", "created_at"]
        read_only_fields = ["predicted_price", "price_trend"]


class FertilizerRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FertilizerRecommendationRequest
        fields = [
            "id", "crop", "soil_type", "nitrogen", "phosphorus", "potassium",
            "ph_level", "recommendation", "created_at",
        ]
        read_only_fields = ["recommendation"]


class CropRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropRecommendationRequest
        fields = ["id", "soil_type", "region", "season", "rainfall_mm", "recommended_crops", "created_at"]
        read_only_fields = ["recommended_crops"]


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "sender", "message", "created_at"]


class ChatConversationSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatConversation
        fields = ["id", "title", "messages", "created_at", "updated_at"]


class SendChatMessageSerializer(serializers.Serializer):
    conversation = serializers.IntegerField(required=False)
    message = serializers.CharField()
