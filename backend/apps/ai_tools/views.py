from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from . import engine
from .models import (
    DiseaseDetectionRequest, PricePredictionRequest,
    FertilizerRecommendationRequest, CropRecommendationRequest,
    ChatConversation, ChatMessage,
)
from .serializers import (
    DiseaseDetectionSerializer, PricePredictionSerializer,
    FertilizerRecommendationSerializer, CropRecommendationSerializer,
    ChatConversationSerializer, SendChatMessageSerializer,
)


class DiseaseDetectionView(generics.ListCreateAPIView):
    """POST an image -> get a disease diagnosis. GET lists your past requests."""

    serializer_class = DiseaseDetectionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DiseaseDetectionRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        disease, confidence, recommendation = engine.detect_disease(instance.image, instance.crop_type)
        instance.result_disease = disease
        instance.confidence = confidence
        instance.recommendation = recommendation
        instance.save(update_fields=["result_disease", "confidence", "recommendation"])


class PricePredictionView(generics.ListCreateAPIView):
    serializer_class = PricePredictionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return PricePredictionRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        price, trend = engine.predict_price(instance.crop, instance.market, instance.quantity)
        instance.predicted_price = price
        instance.price_trend = trend
        instance.save(update_fields=["predicted_price", "price_trend"])


class FertilizerRecommendationView(generics.ListCreateAPIView):
    serializer_class = FertilizerRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FertilizerRecommendationRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        recommendation = engine.recommend_fertilizer(
            instance.crop, instance.soil_type, instance.nitrogen, instance.phosphorus, instance.potassium,
        )
        instance.recommendation = recommendation
        instance.save(update_fields=["recommendation"])


class CropRecommendationView(generics.ListCreateAPIView):
    serializer_class = CropRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CropRecommendationRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        crops = engine.recommend_crops(instance.soil_type, instance.region, instance.season, instance.rainfall_mm)
        instance.recommended_crops = ", ".join(crops)
        instance.save(update_fields=["recommended_crops"])


class ChatConversationListView(generics.ListAPIView):
    serializer_class = ChatConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ChatConversation.objects.filter(user=self.request.user)


class ChatSendMessageView(APIView):
    """
    POST /api/ai/chatbot/message/  {conversation?, message}
    Creates a conversation on first use, appends the user + bot messages.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = SendChatMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        conv_id = serializer.validated_data.get("conversation")
        message = serializer.validated_data["message"]

        if conv_id:
            conversation, _ = ChatConversation.objects.get_or_create(id=conv_id, user=request.user)
        else:
            conversation = ChatConversation.objects.create(user=request.user, title=message[:50])

        ChatMessage.objects.create(conversation=conversation, sender=ChatMessage.Sender.USER, message=message)
        history = conversation.messages.values_list("sender", "message")
        reply = engine.chatbot_reply(message, history=list(history))
        bot_message = ChatMessage.objects.create(
            conversation=conversation, sender=ChatMessage.Sender.BOT, message=reply,
        )
        conversation.save(update_fields=["updated_at"])

        return Response(ChatConversationSerializer(conversation).data, status=status.HTTP_201_CREATED)
