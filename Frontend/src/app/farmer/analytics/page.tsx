"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { StatCounter } from "@/components/shared/stat-counter";
import { revenueData } from "@/data/mock";

export default function FarmerAnalyticsPage() {
  return (
    <>
      <PageHeader title="Analytics" description="Understand how your farm business is trending." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><StatCounter value="Rs 1.4L" label="Total revenue (6mo)" /></Card>
        <Card><StatCounter value="312" label="Orders completed" /></Card>
        <Card><StatCounter value="4.7★" label="Average buyer rating" /></Card>
      </div>

      <Card className="mt-6">
        <p className="text-xs text-dark/40">MONTHLY REVENUE</p>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#263238a0" }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #2632380f", fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#2E7D32" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
