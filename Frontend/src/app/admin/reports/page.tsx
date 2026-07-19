"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { revenueData } from "@/data/mock";

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Download and review platform performance reports." />
      <Card>
        <p className="text-xs text-dark/40">GROWTH — LAST 6 MONTHS</p>
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
