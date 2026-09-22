"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Users, ShoppingBag, Wallet, Sprout } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { getAdminAnalytics, getOrders, AdminAnalytics, ApiOrder } from "@/lib/api";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [anData, ordData] = await Promise.all([
          getAdminAnalytics().catch(() => null),
          getOrders().catch(() => []),
        ]);
        setAnalytics(anData);
        setOrders(ordData);
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const stats = [
    {
      label: "Total users",
      value: `${analytics?.total_users ?? 0}`,
      icon: Users,
      iconClass: "bg-cyan-100 text-cyan-600",
    },
    {
      label: "Active farmers",
      value: `${analytics?.total_farmers ?? 0}`,
      icon: Sprout,
      iconClass: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Total orders",
      value: `${analytics?.total_orders ?? 0}`,
      icon: ShoppingBag,
      iconClass: "bg-orange-100 text-orange-600",
    },
    {
      label: "Platform revenue",
      value: `Rs ${(analytics?.total_revenue ?? 0).toLocaleString()}`,
      icon: Wallet,
      iconClass: "bg-violet-100 text-violet-600",
    },
  ];

  const chartData = analytics?.monthly_orders ?? [];

  const tableRows = orders.slice(0, 5).map((o) => {
    const buyerName = typeof o.buyer === "object" ? (o.buyer.first_name || o.buyer.username) : `User #${o.buyer}`;
    return {
      id: `#ORD-${o.id}`,
      buyer: buyerName,
      amount: `Rs ${Number(o.total_amount).toLocaleString()}`,
      status: o.status.toUpperCase(),
      date: new Date(o.created_at).toLocaleDateString(),
    };
  });

  return (
    <>
      <PageHeader title="Admin overview" description="Platform-wide performance at a glance." />

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

      <Card className="mt-6">
        <p className="text-xs text-dark/40 uppercase tracking-wider font-mono">PLATFORM ORDERS — MONTHLY BREAKDOWN</p>
        <div className="mt-4 h-56 flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#263238a0" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #2632380f", fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-sm text-dark/40 py-8">
              No platform transaction history recorded yet.
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6">
        <p className="mb-3 text-xs text-dark/40 uppercase tracking-wider font-mono">RECENT ORDERS</p>
        {tableRows.length > 0 ? (
          <DataTable
            columns={[
              { key: "id", label: "Order" },
              { key: "buyer", label: "Buyer" },
              { key: "amount", label: "Amount" },
              { key: "status", label: "Status" },
              { key: "date", label: "Date" },
            ]}
            rows={tableRows}
          />
        ) : (
          <Card className="p-8 text-center text-sm text-dark/50">
            No orders placed on the platform yet.
          </Card>
        )}
      </div>
    </>
  );
}
