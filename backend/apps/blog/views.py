from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.common.permissions import IsAdminRole
from .models import BlogCategory, BlogPost
from .serializers import BlogCategorySerializer, BlogPostListSerializer, BlogPostDetailSerializer


class BlogCategoryViewSet(viewsets.ModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [IsAdminRole()]


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related("author", "category")
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__slug", "is_published"]
    search_fields = ["title", "content", "excerpt"]
    ordering_fields = ["created_at"]

    def get_serializer_class(self):
        return BlogPostListSerializer if self.action == "list" else BlogPostDetailSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [IsAdminRole()]

    def get_queryset(self):
        qs = super().get_queryset()
        if not (self.request.user.is_authenticated and getattr(self.request.user, "role", None) == "admin"):
            qs = qs.filter(is_published=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
