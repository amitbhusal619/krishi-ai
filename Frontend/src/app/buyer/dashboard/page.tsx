"use client";

import { useEffect, useState } from "react";
import { Package, Heart, ShoppingCart, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ProductCard } from "@/components/shared/product-card";
import { getBuyerAnalytics, getOrders, getProducts, BuyerAnalytics, ApiOrder, ApiProduct } from "@/lib/api";

export default function BuyerDashboardPage() {
  const [userName, setUserName] = useState("Buyer");
  const [analytics, setAnalytics] = useState<BuyerAnalytics | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [recommended, setRecommended] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userStr = window.localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "Buyer";
        setUserName(name);
      } catch (e) {
        console.error("Failed to parse user state", e);
      }
    }

    async function loadBuyerData() {
      try {
        const [anData, ordData, prodData] = await Promise.all([
          getBuyerAnalytics().catch(() => null),
          getOrders().catch(() => []),
          getProducts().catch(() => []),
        ]);

        const safeOrders = Array.isArray(ordData) ? ordData : [];
        const safeProducts = Array.isArray(prodData) ? prodData : [];

        setAnalytics(anData);
        setOrders(safeOrders);
        setRecommended(safeProducts.slice(0, 3));
      } catch (err) {
        console.error("Error loading buyer dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBuyerData();
  }, []);

  const stats = [
    {
      label: "Active orders",
      value: `${analytics?.active_orders ?? 0}`,
      icon: Clock,
      iconClass: "bg-slate-100 text-slate-700",
    },
    {
      label: "Wishlist items",
      value: `${analytics?.wishlist_items ?? 0}`,
      icon: Heart,
      iconClass: "bg-pink-100 text-pink-600",
    },
    {
      label: "Cart items",
      value: `${analytics?.cart_items ?? 0}`,
      icon: ShoppingCart,
      iconClass: "bg-cyan-100 text-cyan-600",
    },
    {
      label: "Orders completed",
      value: `${analytics?.completed_orders ?? 0}`,
      icon: Package,
      iconClass: "bg-lime-100 text-lime-700",
    },
  ];

  const tableRows = orders.slice(0, 5).map((o) => {
    const firstItem = o.items?.[0];
    const cropName = firstItem ? firstItem.product_name : "N/A";
    const totalQty = o.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

    return {
      id: `#ORD-${o.id}`,
      crop: cropName,
      qty: `${totalQty}`,
      amount: `Rs ${Number(o.total_amount).toLocaleString()}`,
      status: o.status.toUpperCase(),
    };
  });

  return (
    <>
      <PageHeader title={`Welcome back, ${userName}`} description="Here's a snapshot of your buying activity." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <span className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl ${s.iconClass}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-mono text-2xl text-dark">{loading ? "..." : s.value}</p>
            <p className="mt-1 text-xs text-dark/50">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs text-dark/40 uppercase tracking-wider font-mono">RECOMMENDED FOR YOU</p>
        {recommended.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => {
              const farmerName = typeof p.farmer === "object" ? (p.farmer.first_name || p.farmer.username) : "Farmer";
              return (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    farmer: farmerName,
                    location: p.location || "Nepal",
                    price: Number(p.price),
                    unit: p.unit,
                    rating: 5.0,
                    image: p.image || "🌾",
                  }}
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center text-sm text-dark/50">
            No products available in marketplace yet. Check back soon for fresh farm harvests!
          </Card>
        )}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs text-dark/40 uppercase tracking-wider font-mono">RECENT ORDERS</p>
        {tableRows.length > 0 ? (
          <DataTable
            columns={[
              { key: "id", label: "Order" },
              { key: "crop", label: "Crop" },
              { key: "qty", label: "Qty" },
              { key: "amount", label: "Amount" },
              { key: "status", label: "Status" },
            ]}
            rows={tableRows}
          />
        ) : (
          <Card className="p-8 text-center text-sm text-dark/50">
            You haven't placed any orders yet. Browse the marketplace to buy fresh produce directly from farmers!
          </Card>
        )}
      </div>
    </>
  );
}
