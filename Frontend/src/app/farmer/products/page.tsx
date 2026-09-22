"use client";

import { useEffect, useState } from "react";
import { Plus, Package } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ProductCard } from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProducts, ApiProduct } from "@/lib/api";

export default function FarmerProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarmerProducts() {
      try {
        const userStr = typeof window !== "undefined" ? window.localStorage.getItem("user") : null;
        let userId: string | number | undefined;
        if (userStr) {
          try {
            const u = JSON.parse(userStr);
            userId = u.id;
          } catch (e) {
            console.error("Failed to parse user state", e);
          }
        }

        const data = await getProducts(userId ? { farmer: String(userId) } : undefined);
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFarmerProducts();
  }, []);

  return (
    <>
      <PageHeader
        title="My Products"
        description="Manage what you're currently selling."
        action={<Button size="sm"><Plus className="h-4 w-4" /> Add product</Button>}
      />

      {loading ? (
        <Card className="p-8 text-center text-sm text-dark/50">Loading products...</Card>
      ) : products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const farmerName = typeof p.farmer === "object"
              ? (p.farmer.first_name || p.farmer.username)
              : "My Farm";

            return (
              <ProductCard
                key={p.id}
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
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg text-dark font-semibold">No products listed yet</h3>
          <p className="mt-1 text-sm text-dark/50 max-w-sm">
            You haven't listed any crops or farm produce for sale yet. Add your first product to start reaching buyers.
          </p>
          <Button size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-1" /> Add your first product
          </Button>
        </Card>
      )}
    </>
  );
}
