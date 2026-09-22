"use client";

import { DashboardShell, type NavItem } from "@/components/shared/dashboard-shell";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingCart,
  BarChart3,
  Wallet,
  Bell,
  User,
  Settings,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/farmer/krishi-assistant", label: "Krishi Assistant", icon: MessageSquare },
  { href: "/farmer/products", label: "My Products", icon: Package },
  { href: "/farmer/orders", label: "Orders", icon: ShoppingCart },
  { href: "/farmer/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/farmer/wallet", label: "Wallet", icon: Wallet },
  { href: "/farmer/notifications", label: "Notifications", icon: Bell },
  { href: "/farmer/profile", label: "Profile", icon: User },
  { href: "/farmer/settings", label: "Settings", icon: Settings },
];

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="Farmer" navItems={navItems} userName="Ram Bahadur">
      {children}
    </DashboardShell>
  );
}
