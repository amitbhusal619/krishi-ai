"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { getFarmerAnalytics, getOrders, FarmerAnalytics, ApiOrder } from "@/lib/api";

export default function FarmerDashboardPage() {
  const [userName, setUserName] = useState("Farmer");
  const [analytics, setAnalytics] = useState<FarmerAnalytics | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const userStr = window.localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "Farmer";
        setUserName(name);
      } catch (e) {
        console.error("Failed to parse user state", e);
      }
    }

    async function loadData() {
      try {
        const [anData, ordData] = await Promise.all([
          getFarmerAnalytics().catch(() => null),
          getOrders().catch(() => []),
        ]);
        setAnalytics(anData);
        setOrders(ordData);
      } catch (err) {
        console.error("Error loading farmer dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const stats = [
    {
      label: "Total revenue",
      value: `Rs ${(analytics?.total_revenue ?? 0).toLocaleString()}`,
      icon: Wallet,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Active listings",
      value: `${analytics?.active_products ?? 0}`,
      icon: Package,
      iconClass: "bg-amber-100 text-amber-600",
    },
    {
      label: "Orders in progress",
      value: `${analytics?.orders_in_progress ?? 0}`,
      icon: ShoppingCart,
      iconClass: "bg-sky-100 text-sky-600",
    },
    {
      label: "Average rating",
      value: analytics?.average_rating ? `${analytics.average_rating.toFixed(1)} ★` : "N/A",
      icon: TrendingUp,
      iconClass: "bg-violet-100 text-violet-600",
    },
  ];

  const chartData = analytics?.monthly_revenue ?? [];

  const tableRows = orders.slice(0, 5).map((o) => {
    const firstItem = o.items?.[0];
    const cropName = firstItem ? firstItem.product_name : "N/A";
    const totalQty = o.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;
    const buyerName = typeof o.buyer === "object" ? (o.buyer.first_name || o.buyer.username) : `Buyer #${o.buyer}`;

    return {
      id: `#ORD-${o.id}`,
      buyer: buyerName,
      crop: cropName,
      qty: `${totalQty}`,
      amount: `Rs ${Number(o.total_amount).toLocaleString()}`,
      status: o.status.toUpperCase(),
    };
  });

  return (
    <>
      <PageHeader title={`Welcome back, ${userName}`} description="Here's how your farm is doing this month." />

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

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <p className="text-xs text-dark/40 uppercase tracking-wider font-mono">REVENUE — MONTHLY BREAKDOWN</p>
          <div className="mt-4 h-56 flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E7D32" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2E7D32" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#263238a0" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #2632380f", fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={2.5} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-sm text-dark/40 py-8">
                No revenue history recorded yet. When buyers purchase your produce, sales will appear here.
              </div>
            )}
          </div>
        </Card>

        <Card>
          <p className="text-xs text-dark/40 uppercase tracking-wider font-mono">AI ADVISORY</p>
          {analytics?.total_products && analytics.total_products > 0 ? (
            <>
              <p className="mt-3 font-display text-lg text-dark">Market Opportunity</p>
              <p className="mt-2 text-sm text-dark/60">
                Keep your product stock updated and respond promptly to buyer inquiries to maximize your sales.
              </p>
            </>
          ) : (
            <>
              <p className="mt-3 font-display text-lg text-dark">Start Selling Today</p>
              <p className="mt-2 text-sm text-dark/60">
                You haven't listed any crops yet. Add your agricultural products to reach thousands of prospective buyers.
              </p>
            </>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs text-dark/40 uppercase tracking-wider font-mono">RECENT ORDERS</p>
        {tableRows.length > 0 ? (
          <DataTable
            columns={[
              { key: "id", label: "Order" },
              { key: "buyer", label: "Buyer" },
              { key: "crop", label: "Crop" },
              { key: "qty", label: "Qty" },
              { key: "amount", label: "Amount" },
              { key: "status", label: "Status" },
            ]}
            rows={tableRows}
          />
        ) : (
          <Card className="p-8 text-center text-sm text-dark/50">
            No orders received yet. When buyers place orders for your products, they will show up here.
          </Card>
        )}
      </div>
    </>
  );
}
