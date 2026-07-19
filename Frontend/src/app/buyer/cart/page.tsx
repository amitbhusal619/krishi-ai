"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

type CartItem = {
  id: number;
  name: string;
  price: number;
  unit: string;
  image: string;
  qty: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const readCart = () => {
      const stored = window.localStorage.getItem("cart");
      setCartItems(stored ? JSON.parse(stored) : []);
    };

    readCart();
    window.addEventListener("cart:updated", readCart);
    return () => window.removeEventListener("cart:updated", readCart);
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  function removeItem(id: number) {
    const updated = cartItems.filter((item) => item.id !== id);
    window.localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cart:updated"));
  }

  return (
    <>
      <PageHeader title="Cart" description="Review before checkout." />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {cartItems.length === 0 ? (
            <div className="leaf-shape-sm border border-dark/5 bg-white/70 p-6 text-sm text-dark/60">
              Your cart is empty. Add a product from the marketplace to get started.
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="leaf-shape-sm flex items-center justify-between border border-dark/5 bg-white/70 px-5 py-4">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-2xl">{item.image}</span>
                  <div>
                    <p className="text-sm font-medium text-dark">{item.name}</p>
                    <p className="text-xs text-dark/50">Qty: {item.qty} {item.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-dark">Rs {item.price * item.qty}</span>
                  <button aria-label="Remove" onClick={() => removeItem(item.id)}><Trash2 className="h-4 w-4 text-dark/30" /></button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="leaf-shape h-fit border border-dark/5 bg-white/70 p-6">
          <p className="text-xs text-dark/40">ORDER SUMMARY</p>
          <div className="mt-4 flex justify-between text-sm text-dark/60">
            <span>Subtotal</span><span>Rs {total}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-dark/60">
            <span>Delivery</span><span>Rs 50</span>
          </div>
          <div className="mt-4 flex justify-between border-t border-dark/10 pt-4 font-mono text-lg text-dark">
            <span>Total</span><span>Rs {total + 50}</span>
          </div>
          <Button className="mt-6 w-full" onClick={() => window.alert("Checkout is ready. Connect your payment provider to process real orders.")}>
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
}
