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

  const isImageUrl = product.image && (product.image.startsWith("/") || product.image.startsWith("http"));

  return (
    <div className="leaf-shape group border border-dark/5 bg-white/70 p-4 shadow-sm shadow-dark/5 transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 flex flex-col justify-between">
      <div>
        <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-secondary/10 leaf-shape-sm">
          {isImageUrl ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl">
              {product.image}
            </div>
          )}
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-1 text-xs font-mono text-accent shadow-sm">
            <Star className="h-3 w-3 fill-accent text-accent" /> {product.rating}
          </span>
        </div>

        <div className="mt-3.5">
          <h3 className="font-display text-lg text-dark font-semibold leading-tight">{product.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-dark/50">
            <MapPin className="h-3 w-3 shrink-0 text-primary/70" /> {product.farmer}, {product.location}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2 border-t border-dark/5">
        <p className="font-mono text-lg text-primary font-bold">
          Rs {product.price}
          <span className="text-xs text-dark/40 font-normal">/{product.unit}</span>
        </p>
        <Button size="sm" variant="dark" onClick={addToCart} className="leaf-shape-sm shadow-sm">
          <ShoppingCart className="h-3.5 w-3.5" /> Add
        </Button>
      </div>
    </div>
  );
}

