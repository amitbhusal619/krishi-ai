"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Leaf, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function DashboardShell({
  role,
  navItems,
  userName,
  children,
}: {
  role: string;
  navItems: NavItem[];
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      window.localStorage.removeItem("user");
    }
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-dark/5 bg-white/60 px-5 py-6 md:flex">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-dark">
          <span className="leaf-shape-sm flex h-8 w-8 items-center justify-center bg-primary text-cream">
            <Leaf className="h-4 w-4" />
          </span>
          Krishi AI
        </Link>
        <span className="mt-1 font-mono text-[10px] tracking-wide text-dark/40">
          {role.toUpperCase()} PANEL
        </span>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition",
                  active
                    ? "bg-primary text-cream"
                    : "text-dark/60 hover:bg-dark/5 hover:text-dark"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-dark/50 hover:bg-dark/5"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-dark/5 bg-cream/80 px-6 py-4 backdrop-blur-md md:px-10">
          <p className="font-display text-lg text-dark md:hidden">Krishi AI</p>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="leaf-shape-sm relative flex h-9 w-9 items-center justify-center border border-dark/10 text-dark/60"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-accent" />
            </button>
            <div className="flex items-center gap-2">
              <span className="leaf-shape-sm flex h-9 w-9 items-center justify-center bg-secondary/20 font-mono text-xs text-primary">
                {userName.slice(0, 2).toUpperCase()}
              </span>
              <span className="hidden text-sm text-dark/70 md:inline">{userName}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
