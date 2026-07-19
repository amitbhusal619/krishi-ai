"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Leaf, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/ai", label: "AI" },
  { href: "/weather", label: "Weather" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      if (typeof window === "undefined") return;
      const stored = window.localStorage.getItem("cart");
      const items = stored ? JSON.parse(stored) : [];
      setCartCount(items.reduce((sum: number, item: { qty?: number }) => sum + (item.qty || 0), 0));
    };

    updateCount();
    window.addEventListener("cart:updated", updateCount);
    return () => window.removeEventListener("cart:updated", updateCount);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-dark/5 bg-cream/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="flex items-center gap-2 font-display text-xl text-dark">
          <span className="leaf-shape-sm flex h-8 w-8 items-center justify-center bg-primary text-cream">
            <Leaf className="h-4 w-4" />
          </span>
          Krishi AI
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-dark/70 transition hover:text-dark"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/buyer/cart" className="relative flex items-center gap-2 rounded-full border border-dark/10 px-3 py-2 text-sm text-dark/70">
            <ShoppingCart className="h-4 w-4" />
            <span>Cart</span>
            {cartCount > 0 ? <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-cream">{cartCount}</span> : null}
          </Link>
          <Button href="/login" variant="ghost" size="sm">
            Login
          </Button>
          <Button href="/signup" variant="primary" size="sm">
            Register
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="flex flex-col gap-4 border-t border-dark/5 px-6 py-6 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-dark/70"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-3">
            <Link href="/buyer/cart" className="flex items-center justify-center gap-2 rounded-full border border-dark/10 px-3 py-2 text-sm text-dark/70">
              <ShoppingCart className="h-4 w-4" /> Cart {cartCount > 0 ? `(${cartCount})` : ""}
            </Link>
            <Button href="/login" variant="outline" size="sm" className="flex-1">
              Login
            </Button>
            <Button href="/signup" variant="primary" size="sm" className="flex-1">
              Register
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
