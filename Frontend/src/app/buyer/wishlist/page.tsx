"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ProductCard } from "@/components/shared/product-card";
import { Card } from "@/components/ui/card";
import { getWishlist, ApiWishlistItem } from "@/lib/api";

export default function WishlistPage() {
  const [items, setItems] = useState<ApiWishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const data = await getWishlist();
        setItems(data || []);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    }

    loadWishlist();
  }, []);

  return (
    <>
      <PageHeader title="Wishlist" description="Products you've saved for later." />

      {loading ? (
        <Card className="p-8 text-center text-sm text-dark/50">Loading wishlist...</Card>
      ) : items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const p = item.product;
            const farmerName = typeof p.farmer === "object" ? (p.farmer.first_name || p.farmer.username) : "Farmer";

            return (
              <ProductCard
                key={item.id}
                product={{
                  id: p.id,
                  name: p.name,
                  farmer: farmerName,
                  location: p.location || "Nepal",
                  price: Number(p.price),
                  unit: p.unit,
                  rating: 5.0,
                  image: p.image || "🌾",
                }}
              />
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-3">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg text-dark font-semibold">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-dark/50 max-w-sm">
            Save crops and products you are interested in buying later by clicking the heart icon on marketplace listings.
          </p>
        </Card>
      )}
    </>
  );
}
