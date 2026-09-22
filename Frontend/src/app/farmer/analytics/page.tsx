"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { StatCounter } from "@/components/shared/stat-counter";
import { getFarmerAnalytics, FarmerAnalytics } from "@/lib/api";

export default function FarmerAnalyticsPage() {
  const [analytics, setAnalytics] = useState<FarmerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getFarmerAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load farmer analytics:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const totalRevFormatted = `Rs ${(analytics?.total_revenue ?? 0).toLocaleString()}`;
  const ordersCompleted = `${analytics?.total_orders ?? 0}`;
  const avgRating = analytics?.average_rating ? `${analytics.average_rating.toFixed(1)}★` : "N/A";
  const chartData = analytics?.monthly_revenue ?? [];

  return (
    <>
      <PageHeader title="Analytics" description="Understand how your farm business is trending." />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <StatCounter value={loading ? "..." : totalRevFormatted} label="Total revenue" />
        </Card>
        <Card>
          <StatCounter value={loading ? "..." : ordersCompleted} label="Orders completed" />
        </Card>
        <Card>
          <StatCounter value={loading ? "..." : avgRating} label="Average buyer rating" />
        </Card>
      </div>

      <Card className="mt-6">
        <p className="text-xs text-dark/40 uppercase tracking-wider font-mono">MONTHLY REVENUE</p>
        <div className="mt-4 h-64 flex items-center justify-center">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#263238a0" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #2632380f", fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#2E7D32" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-sm text-dark/40 py-12">
              No sales activity recorded yet. Analytics will populate once you begin selling.
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
