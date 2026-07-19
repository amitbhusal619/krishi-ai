from django.conf import settings
from django.core.mail import send_mail
from rest_framework import generics, permissions

from apps.common.permissions import IsAdminRole
from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageCreateView(generics.CreateAPIView):
    """POST /api/contact/ — public contact form submission."""

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        instance = serializer.save()
        send_mail(
            subject=f"New contact message: {instance.subject or 'No subject'}",
            message=f"From: {instance.name} <{instance.email}>\n\n{instance.message}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.DEFAULT_FROM_EMAIL],
            fail_silently=True,
        )


class ContactMessageListView(generics.ListAPIView):
    """GET /api/contact/admin/ — admin inbox of contact submissions."""

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]
