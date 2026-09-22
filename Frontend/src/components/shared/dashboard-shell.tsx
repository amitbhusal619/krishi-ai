"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Leaf, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type StoredUser = {
  id?: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
};

function getDisplayName(user: StoredUser | null, fallback: string) {
  const fullName = [user?.first_name, user?.last_name]
    .filter((value): value is string => Boolean(value && value.trim()))
    .join(" ")
    .trim();

  return fullName || user?.username || fallback;
}

function getInitials(user: StoredUser | null, fallback: string) {
  const fullName = [user?.first_name, user?.last_name]
    .filter((value): value is string => Boolean(value && value.trim()))
    .join(" ")
    .trim();

  if (fullName) {
    return fullName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  if (user?.username) {
    return user.username.slice(0, 2).toUpperCase();
  }

  return fallback.slice(0, 2).toUpperCase();
}

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
  const [storedUser, setStoredUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem("accessToken");
    const userJson = window.localStorage.getItem("user");

    if (!token || !userJson) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userJson) as StoredUser;
      const userRole = String(parsedUser.role || "").toLowerCase();
      const expectedRole = String(role || "").toLowerCase();

      if (
        expectedRole === "admin" && userRole !== "admin" ||
        expectedRole === "buyer" && userRole !== "buyer" ||
        expectedRole === "farmer" && userRole !== "farmer"
      ) {
        router.push("/login");
        return;
      }

      setStoredUser(parsedUser);
    } catch (error) {
      router.push("/login");
    }
  }, [role, router]);

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
      <aside className="hidden w-64 shrink-0 flex-col border-r border-dark/10 bg-linear-to-br from-cream via-beige to-white/85 px-5 py-6 shadow-sm shadow-dark/5 md:flex">
        <Link href="/" className="flex items-center gap-2 font-display text-lg text-dark">
          <span className="leaf-shape-sm flex h-8 w-8 items-center justify-center bg-primary text-cream">
            <Leaf className="h-4 w-4" />
          </span>
          HAMRO KRISHI SEWA
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
                  "relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition",
                  active
                    ? "bg-primary/10 text-primary shadow-md shadow-primary/15"
                    : "text-dark/70 hover:bg-linear-to-r hover:from-primary/10 hover:via-primary/5 hover:to-transparent hover:text-primary"
                )}
              >
                {active ? <span className="absolute left-0 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-primary" /> : null}
                <Icon className={active ? "h-4 w-4 text-primary" : "h-4 w-4 text-dark/40"} />
                <span className="relative">{item.label}</span>
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
          <p className="font-display text-lg text-dark md:hidden">HAMRO KRISHI SEWA</p>
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
              <span className="leaf-shape-sm flex h-9 w-9 items-center justify-center bg-secondary/20 font-mono text-xs font-semibold text-primary">
                {getInitials(storedUser, userName)}
              </span>
              <div className="hidden text-sm text-dark/70 md:block">
                <p className="font-medium">{getDisplayName(storedUser, userName)}</p>
                {storedUser?.id ? (
                  <p className="text-[10px] text-dark/40">ID: {storedUser.id} {storedUser.username ? `· @${storedUser.username}` : ''}</p>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
