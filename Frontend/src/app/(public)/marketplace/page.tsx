"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { Card } from "@/components/ui/card";
import { getProducts, ApiProduct } from "@/lib/api";

const categories = ["All", "Vegetables", "Grains", "Fruits", "Spices"];

export default function MarketplacePage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load marketplace products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCat === "All" ||
      (typeof p.category === "object" ? p.category.name : "") === selectedCat;

    return matchesSearch && matchesCat;
  });

  return (
    <section className="px-6 py-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs tracking-wide text-primary">MARKETPLACE</span>
          <h1 className="font-display text-3xl text-dark md:text-4xl">
            Fresh produce, straight from the farm
          </h1>
        </div>

        {/* Search + filter bar */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="glass leaf-shape flex w-full max-w-md items-center gap-3 p-2 pl-5 md:w-96">
            <Search className="h-4 w-4 text-dark/40" />
            <input
              type="text"
              placeholder="Search crops, farmers, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-dark/40"
            />
          </div>
          <button className="leaf-shape-sm flex items-center gap-2 border border-dark/10 px-4 py-2.5 text-sm text-dark/70 md:self-auto">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                selectedCat === cat
                  ? "bg-primary text-cream"
                  : "border border-dark/10 text-dark/60 hover:bg-dark/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <Card className="mt-10 p-12 text-center text-sm text-dark/50">
            Loading marketplace products...
          </Card>
        ) : filteredProducts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((p) => {
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
        ) : (
          <Card className="mt-10 p-12 text-center text-sm text-dark/50">
            No produce available in the marketplace matching your criteria.
          </Card>
        )}
      </div>
    </section>
  );
}
