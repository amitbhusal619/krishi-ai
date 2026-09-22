"use client";

import { DashboardShell, type NavItem } from "@/components/shared/dashboard-shell";
import { LayoutDashboard, Heart, ShoppingCart, Package, CreditCard, User, MessageSquare } from "lucide-react";

const navItems: NavItem[] = [
  { href: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/krishi-assistant", label: "Krishi Assistant", icon: MessageSquare },
  { href: "/buyer/wishlist", label: "Wishlist", icon: Heart },
  { href: "/buyer/orders", label: "Orders", icon: Package },
  { href: "/buyer/cart", label: "Cart", icon: ShoppingCart },
  { href: "/buyer/payments", label: "Payments", icon: CreditCard },
  { href: "/buyer/profile", label: "Profile", icon: User },
];

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="Buyer" navItems={navItems} userName="Anish Sharma">
      {children}
    </DashboardShell>
  );
}
