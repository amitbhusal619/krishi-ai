"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { getOrders, ApiOrder } from "@/lib/api";

export default function AdminPaymentsPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to load transactions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const tableRows = orders.map((o) => {
    const buyerName = typeof o.buyer === "object" ? (o.buyer.first_name || o.buyer.username) : `User #${o.buyer}`;

    return {
      id: `TXN-${o.id}`,
      buyer: buyerName,
      amount: `Rs ${Number(o.total_amount).toLocaleString()}`,
      status: o.payment_status.toUpperCase(),
    };
  });

  return (
    <>
      <PageHeader title="Payments" description="Transactions processed across payment gateways." />

      {loading ? (
        <Card className="p-8 text-center text-sm text-dark/50">Loading transactions...</Card>
      ) : tableRows.length > 0 ? (
        <DataTable
          columns={[
            { key: "id", label: "Transaction" },
            { key: "buyer", label: "Buyer" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
          ]}
          rows={tableRows}
        />
      ) : (
        <Card className="p-12 text-center text-sm text-dark/50">
          No payment transactions processed yet.
        </Card>
      )}
    </>
  );
}
