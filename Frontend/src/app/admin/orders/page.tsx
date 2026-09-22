"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { getOrders, ApiOrder } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const tableRows = orders.map((o) => {
    const firstItem = o.items?.[0];
    const cropName = firstItem ? firstItem.product_name : "N/A";
    const buyerName = typeof o.buyer === "object" ? (o.buyer.first_name || o.buyer.username) : `User #${o.buyer}`;

    return {
      id: `#ORD-${o.id}`,
      buyer: buyerName,
      crop: cropName,
      amount: `Rs ${Number(o.total_amount).toLocaleString()}`,
      status: o.status.toUpperCase(),
    };
  });

  return (
    <>
      <PageHeader title="Orders" description="All orders placed across the platform." />

      {loading ? (
        <Card className="p-8 text-center text-sm text-dark/50">Loading orders...</Card>
      ) : tableRows.length > 0 ? (
        <DataTable
          columns={[
            { key: "id", label: "Order" },
            { key: "buyer", label: "Buyer" },
            { key: "crop", label: "Crop" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
          ]}
          rows={tableRows}
        />
      ) : (
        <Card className="p-12 text-center text-sm text-dark/50">
          No orders recorded on the platform yet.
        </Card>
      )}
    </>
  );
}
