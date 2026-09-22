"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { getAdminAnalytics, AdminAnalytics } from "@/lib/api";

export default function AdminReportsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await getAdminAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load admin analytics:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const chartData = analytics?.monthly_orders ?? [];

  return (
    <>
      <PageHeader title="Reports" description="Download and review platform performance reports." />
      <Card>
        <p className="text-xs text-dark/40 uppercase tracking-wider font-mono">GROWTH — MONTHLY ORDERS & REVENUE</p>
        <div className="mt-4 h-64 flex items-center justify-center">
          {loading ? (
            <p className="text-sm text-dark/50">Loading report data...</p>
          ) : chartData.length > 0 ? (
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
              No platform order data available to generate reports yet.
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
