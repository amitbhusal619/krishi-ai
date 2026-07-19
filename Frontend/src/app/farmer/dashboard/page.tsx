"use client";

import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { revenueData, farmerOrders } from "@/data/mock";

const stats = [
  { label: "Revenue this month", value: "Rs 28,500", icon: Wallet },
  { label: "Active listings", value: "14", icon: Package },
  { label: "Orders in progress", value: "6", icon: ShoppingCart },
  { label: "Avg. price vs market", value: "+6.2%", icon: TrendingUp },
];

export default function FarmerDashboardPage() {
  return (
    <>
      <PageHeader title="Welcome back, Ram" description="Here's how your farm is doing this month." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 font-mono text-2xl text-dark">{s.value}</p>
            <p className="mt-1 text-xs text-dark/50">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <p className="text-xs text-dark/40">REVENUE — LAST 6 MONTHS</p>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
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
          </div>
        </Card>

        <Card>
          <p className="text-xs text-dark/40">AI RECOMMENDATION</p>
          <p className="mt-3 font-display text-lg text-dark">Sell tomatoes today</p>
          <p className="mt-2 text-sm text-dark/60">
            Prices are up 4.2% and predicted to rise further. Selling this
            week could earn more than waiting.
          </p>
        </Card>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs text-dark/40">RECENT ORDERS</p>
        <DataTable
          columns={[
            { key: "id", label: "Order" },
            { key: "buyer", label: "Buyer" },
            { key: "crop", label: "Crop" },
            { key: "qty", label: "Qty" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
          ]}
          rows={farmerOrders.map((o) => ({ ...o, amount: `Rs ${o.amount}` }))}
        />
      </div>
    </>
  );
}
