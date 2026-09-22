"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ProductCard } from "@/components/shared/product-card";
import { Card } from "@/components/ui/card";
import { getProducts, ApiProduct } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const tableRows = products.map((p) => {
    const farmerName = typeof p.farmer === "object" ? (p.farmer.first_name || p.farmer.username) : `Farmer #${p.farmer}`;
    return {
      name: p.name,
      farmer: farmerName,
      location: p.location || "Nepal",
      price: `Rs ${Number(p.price).toLocaleString()} / ${p.unit}`,
      status: p.status.toUpperCase(),
    };
  });

  return (
    <>
      <PageHeader title="Products" description="All active listings across the marketplace." />

      {loading ? (
        <Card className="p-8 text-center text-sm text-dark/50">Loading products...</Card>
      ) : products.length > 0 ? (
        <>
          <div className="mb-6">
            <p className="mb-3 text-xs text-dark/40 uppercase font-mono tracking-wider">Featured Marketplace Listings</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const farmerName = typeof p.farmer === "object" ? (p.farmer.first_name || p.farmer.username) : "Farmer";
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
          </div>

          <div>
            <p className="mb-3 text-xs text-dark/40 uppercase font-mono tracking-wider">Inventory Table View</p>
            <DataTable
              columns={[
                { key: "name", label: "Product" },
                { key: "farmer", label: "Farmer" },
                { key: "location", label: "Location" },
                { key: "price", label: "Price" },
                { key: "status", label: "Status" },
              ]}
              rows={tableRows}
            />
          </div>
        </>
      ) : (
        <Card className="p-12 text-center text-sm text-dark/50">
          No products listed on the platform yet.
        </Card>
      )}
    </>
  );
}
