"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Leaf, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector, useLanguage } from "@/lib/i18n";

type StoredUser = {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

export function SiteNavbar() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<StoredUser | null>(null);
  const { t } = useLanguage();

  const links = [
    { href: "/marketplace", label: t.marketplace },
    { href: "/ai", label: t.ai },
    { href: "/weather", label: t.weather },
    { href: "/blog", label: t.blog },
    { href: "/contact", label: t.contact },
  ];

  useEffect(() => {
    const updateState = () => {
      if (typeof window === "undefined") return;
      const stored = window.localStorage.getItem("cart");
      const items = stored ? JSON.parse(stored) : [];
      setCartCount(items.reduce((sum: number, item: { qty?: number }) => sum + (item.qty || 0), 0));

      const token = window.localStorage.getItem("accessToken");
      const userJson = window.localStorage.getItem("user");
      if (token && userJson) {
        try {
          setUser(JSON.parse(userJson));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    updateState();
    window.addEventListener("cart:updated", updateState);
    window.addEventListener("storage", updateState);
    return () => {
      window.removeEventListener("cart:updated", updateState);
      window.removeEventListener("storage", updateState);
    };
  }, []);

  const role = user?.role?.toLowerCase();
  const profileUrl =
    role === "farmer"
      ? "/farmer/dashboard"
      : role === "buyer"
        ? "/buyer/dashboard"
        : role === "admin"
          ? "/admin/dashboard"
          : "/login";

  const displayName = user
    ? ([user.first_name, user.last_name].filter((n): n is string => Boolean(n && n.trim())).join(" ") || user.username || t.profile)
    : t.profile;

  return (
    <header className="sticky top-0 z-50 border-b border-dark/5 bg-cream/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" className="flex items-center gap-2 font-display text-xl text-dark">
          <span className="leaf-shape-sm flex h-8 w-8 items-center justify-center bg-primary text-cream">
            <Leaf className="h-4 w-4" />
          </span>
          {t.brand}
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
          <LanguageSelector />

          <Link href="/buyer/cart" className="relative flex items-center gap-2 rounded-full border border-dark/10 px-3 py-2 text-sm text-dark/70">
            <ShoppingCart className="h-4 w-4" />
            <span>{t.cart}</span>
            {cartCount > 0 ? <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-cream">{cartCount}</span> : null}
          </Link>

          {user ? (
            <Button href={profileUrl} variant="primary" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{displayName}</span>
            </Button>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                {t.login}
              </Button>
              <Button href="/signup" variant="primary" size="sm">
                {t.register}
              </Button>
            </>
          )}
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
          <div className="mt-2 flex flex-col gap-3">
            <LanguageSelector />
            <Link href="/buyer/cart" className="flex items-center justify-center gap-2 rounded-full border border-dark/10 px-3 py-2 text-sm text-dark/70">
              <ShoppingCart className="h-4 w-4" /> {t.cart} {cartCount > 0 ? `(${cartCount})` : ""}
            </Link>
            {user ? (
              <Button href={profileUrl} variant="primary" size="sm" className="flex-1 flex items-center justify-center gap-2">
                <User className="h-4 w-4" />
                <span>{t.profile}</span>
              </Button>
            ) : (
              <>
                <Button href="/login" variant="outline" size="sm" className="flex-1">
                  {t.login}
                </Button>
                <Button href="/signup" variant="primary" size="sm" className="flex-1">
                  {t.register}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

