"use client";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Users, ShoppingBag, Wallet, Sprout } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { revenueData, adminUsers } from "@/data/mock";

const stats = [
  { label: "Total users", value: "12,400", icon: Users },
  { label: "Active farmers", value: "5,120", icon: Sprout },
  { label: "Orders this month", value: "3,842", icon: ShoppingBag },
  { label: "Platform revenue", value: "Rs 4.2Cr", icon: Wallet },
];

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Admin overview" description="Platform-wide performance at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 font-mono text-2xl text-dark">{s.value}</p>
            <p className="mt-1 text-xs text-dark/50">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <p className="text-xs text-dark/40">PLATFORM REVENUE — LAST 6 MONTHS</p>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#263238a0" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #2632380f", fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="mt-6">
        <p className="mb-3 text-xs text-dark/40">RECENT USERS</p>
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "role", label: "Role" },
            { key: "status", label: "Status" },
            { key: "joined", label: "Joined" },
          ]}
          rows={adminUsers}
        />
      </div>
    </>
  );
}
