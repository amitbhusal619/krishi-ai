"use client";

import { DashboardShell, type NavItem } from "@/components/shared/dashboard-shell";
import {
  LayoutDashboard,
  Users,
  Sprout,
  Package,
  ShoppingCart,
  CreditCard,
  FileBarChart,
  Cpu,
  CloudSun,
  Settings,
} from "lucide-react";

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/farmers", label: "Farmers", icon: Sprout },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
  { href: "/admin/ai-models", label: "AI Models", icon: Cpu },
  { href: "/admin/weather", label: "Weather", icon: CloudSun },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="Admin" navItems={navItems} userName="Admin">
      {children}
    </DashboardShell>
  );
}
