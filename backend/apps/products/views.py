from django.db.models import Avg, Count
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.common.permissions import IsFarmer, IsProductOwner, IsAdminRole
from .models import Category, Product, ProductImage, Review
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    ProductWriteSerializer, ProductImageSerializer, ReviewSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.annotate(product_count=Count("products")).all()
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [IsAdminRole()]


class ProductViewSet(viewsets.ModelViewSet):
    """
    /api/products/products/            list + create
    /api/products/products/{slug}/     retrieve/update/delete
    /api/products/products/{slug}/reviews/   POST a review
    /api/products/products/{slug}/images/    POST additional gallery images
    """

    queryset = Product.objects.select_related("farmer", "category").prefetch_related("images", "reviews")
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__slug", "status", "is_organic", "farmer", "is_active"]
    search_fields = ["name", "description", "location"]
    ordering_fields = ["price", "created_at", "quantity_available"]

    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        if self.action in ["create", "update", "partial_update"]:
            return ProductWriteSerializer
        return ProductDetailSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        if self.action in ["create"]:
            return [permissions.IsAuthenticated(), IsFarmer()]
        if self.action in ["update", "partial_update", "destroy", "add_image"]:
            return [permissions.IsAuthenticated(), IsProductOwner()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = super().get_queryset().annotate(average_rating=Avg("reviews__rating"))
        if self.action == "list" and not (self.request.user.is_authenticated and
                                           getattr(self.request.user, "role", None) in ("farmer", "admin")):
            qs = qs.filter(status=Product.Status.APPROVED, is_active=True)
        return qs

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def reviews(self, request, slug=None):
        product = self.get_object()
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(buyer=request.user, product=product)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="images")
    def add_image(self, request, slug=None):
        product = self.get_object()
        images = request.FILES.getlist("images")
        created = [ProductImage.objects.create(product=product, image=img) for img in images]
        return Response(ProductImageSerializer(created, many=True).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsAdminRole])
    def moderate(self, request, slug=None):
        """Admin-only: approve or reject a product listing."""
        product = self.get_object()
        new_status = request.data.get("status")
        if new_status not in Product.Status.values:
            return Response({"detail": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)
        product.status = new_status
        product.save(update_fields=["status"])
        return Response(ProductDetailSerializer(product).data)
