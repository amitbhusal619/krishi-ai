"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StoredUser = {
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
};

function getStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const userJson = window.localStorage.getItem("user");
    return userJson ? (JSON.parse(userJson) as StoredUser) : null;
  } catch {
    return null;
  }
}

export default function BuyerProfilePage() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || user?.username || "Buyer";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "B";

  return (
    <>
      <PageHeader title="Profile" description="Your account details." />
      <Card className="max-w-2xl">
        <div className="flex items-center gap-4">
          <span className="leaf-shape flex h-16 w-16 items-center justify-center bg-secondary/20 font-mono text-xl text-primary">{initials}</span>
          <div>
            <p className="font-display text-lg text-dark">{displayName}</p>
            <p className="text-sm text-dark/50">{user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Buyer"}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs text-dark/50">Full name</label>
            <input value={displayName} readOnly className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs text-dark/50">Username</label>
            <input value={user?.username ?? ""} readOnly className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs text-dark/50">Email</label>
            <input value={user?.email ?? ""} readOnly className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" />
          </div>
          <div>
            <label className="text-xs text-dark/50">Role</label>
            <input value={user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : "Buyer"} readOnly className="leaf-shape-sm mt-1 w-full border border-dark/10 bg-white/80 px-4 py-3 text-sm outline-none" />
          </div>
        </div>
        <Button className="mt-6">Save changes</Button>
      </Card>
    </>
  );
}
