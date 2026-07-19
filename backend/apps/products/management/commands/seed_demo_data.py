"""
Seeds the database with demo data so the Next.js frontend has something
real to render instead of src/data/mock.ts.

Usage: python manage.py seed_demo_data
"""
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.accounts.models import User, FarmerProfile, BuyerProfile
from apps.products.models import Category, Product
from apps.blog.models import BlogCategory, BlogPost


class Command(BaseCommand):
    help = "Seed demo users, categories, products, and blog posts."

    @transaction.atomic
    def handle(self, *args, **options):
        admin, created = User.objects.get_or_create(
            email="admin@krishiai.com",
            defaults={"username": "admin", "role": User.Role.ADMIN, "is_staff": True, "is_superuser": True, "is_verified": True},
        )
        if created:
            admin.set_password("Admin@123")
            admin.save()
            self.stdout.write(self.style.SUCCESS("Created admin@krishiai.com / Admin@123"))

        farmer, created = User.objects.get_or_create(
            email="farmer@krishiai.com",
            defaults={"username": "demo_farmer", "role": User.Role.FARMER, "first_name": "Ram", "last_name": "Thapa", "is_verified": True},
        )
        if created:
            farmer.set_password("Farmer@123")
            farmer.save()
            FarmerProfile.objects.filter(user=farmer).update(
                farm_name="Thapa Organic Farm", farm_location="Chitwan, Nepal",
                farm_size_acres=Decimal("5.5"), verification_status="verified",
            )
            self.stdout.write(self.style.SUCCESS("Created farmer@krishiai.com / Farmer@123"))

        buyer, created = User.objects.get_or_create(
            email="buyer@krishiai.com",
            defaults={"username": "demo_buyer", "role": User.Role.BUYER, "first_name": "Sita", "last_name": "Gurung", "is_verified": True},
        )
        if created:
            buyer.set_password("Buyer@123")
            buyer.save()
            self.stdout.write(self.style.SUCCESS("Created buyer@krishiai.com / Buyer@123"))

        categories = {}
        for name, icon in [
            ("Vegetables", "carrot"), ("Fruits", "apple"), ("Grains", "wheat"),
            ("Dairy", "milk"), ("Spices", "pepper"),
        ]:
            cat, _ = Category.objects.get_or_create(name=name, defaults={"icon": icon})
            categories[name] = cat

        demo_products = [
            ("Fresh Tomatoes", "Vegetables", Decimal("45.00"), Product.Unit.KG, True),
            ("Organic Rice", "Grains", Decimal("120.00"), Product.Unit.KG, True),
            ("Sweet Mangoes", "Fruits", Decimal("180.00"), Product.Unit.KG, False),
            ("Farm Fresh Milk", "Dairy", Decimal("90.00"), Product.Unit.LITRE, False),
            ("Red Chili Powder", "Spices", Decimal("350.00"), Product.Unit.KG, True),
        ]
        for name, cat_name, price, unit, organic in demo_products:
            Product.objects.get_or_create(
                name=name, farmer=farmer,
                defaults={
                    "category": categories[cat_name], "price": price, "unit": unit,
                    "quantity_available": Decimal("100"), "is_organic": organic,
                    "location": "Chitwan, Nepal", "status": Product.Status.APPROVED,
                    "description": f"Freshly harvested {name.lower()} straight from the farm.",
                },
            )

        blog_cat, _ = BlogCategory.objects.get_or_create(name="Farming Tips")
        BlogPost.objects.get_or_create(
            title="5 Tips for Healthier Soil",
            defaults={
                "author": admin, "category": blog_cat, "is_published": True,
                "excerpt": "Simple, low-cost practices to improve soil health this season.",
                "content": "Crop rotation, composting, cover cropping, reduced tillage, and regular soil testing "
                            "all help keep your soil productive year after year.",
            },
        )

        self.stdout.write(self.style.SUCCESS("Demo data seeded successfully."))
