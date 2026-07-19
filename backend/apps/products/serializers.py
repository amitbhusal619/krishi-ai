from rest_framework import serializers

from .models import Category, Product, ProductImage, Review


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "icon", "description", "product_count"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image"]


class ReviewSerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source="buyer.get_full_name", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "product", "buyer", "buyer_name", "rating", "comment", "created_at"]
        read_only_fields = ["buyer"]

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value


class ProductListSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source="farmer.get_full_name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "price", "unit", "quantity_available",
            "is_organic", "location", "image", "status", "is_active",
            "farmer", "farmer_name", "category", "category_name",
            "average_rating", "created_at",
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source="farmer.get_full_name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "farmer", "farmer_name", "category", "category_name", "name", "slug",
            "description", "price", "unit", "quantity_available", "is_organic",
            "harvest_date", "location", "image", "images", "status", "is_active",
            "reviews", "average_rating", "created_at", "updated_at",
        ]
        read_only_fields = ["farmer", "status"]


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id", "category", "name", "description", "price", "unit",
            "quantity_available", "is_organic", "harvest_date", "location", "image",
        ]

    def create(self, validated_data):
        validated_data["farmer"] = self.context["request"].user
        return super().create(validated_data)
