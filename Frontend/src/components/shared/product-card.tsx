"use client";

import { Star, MapPin, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

type Product = {
  id: number;
  name: string;
  farmer: string;
  location: string;
  price: number;
  unit: string;
  rating: number;
  image: string;
};

export function ProductCard({ product }: { product: Product }) {
  function addToCart() {
    const existing = typeof window !== "undefined" ? window.localStorage.getItem("cart") : null;
    const cart = existing ? JSON.parse(existing) : [];
    const item = cart.find((entry: { id: number }) => entry.id === product.id);

    if (item) {
      item.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart:updated"));
    }
  }

  return (
    <div className="leaf-shape group border border-dark/5 bg-white/70 p-5 shadow-sm shadow-dark/5 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
      <div className="flex h-32 items-center justify-center rounded-2xl bg-secondary/10 text-5xl">
        {product.image}
      </div>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h3 className="font-display text-lg text-dark">{product.name}</h3>
          <p className="flex items-center gap-1 text-xs text-dark/50">
            <MapPin className="h-3 w-3" /> {product.farmer}, {product.location}
          </p>
        </div>
        <span className="flex items-center gap-1 font-mono text-xs text-accent">
          <Star className="h-3 w-3 fill-accent text-accent" /> {product.rating}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-lg text-primary">
          Rs {product.price}
          <span className="text-xs text-dark/40">/{product.unit}</span>
        </p>
        <Button size="sm" variant="dark" onClick={addToCart}>
          <ShoppingCart className="h-3.5 w-3.5" /> Add
        </Button>
      </div>
    </div>
  );
}
