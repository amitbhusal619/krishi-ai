"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { getOrders, ApiOrder } from "@/lib/api";

export default function FarmerOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch farmer orders:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  const tableRows = orders.map((o) => {
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
      <PageHeader title="Orders" description="Track and fulfill orders from buyers." />

      {loading ? (
        <Card className="p-8 text-center text-sm text-dark/50">Loading orders...</Card>
      ) : tableRows.length > 0 ? (
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
        <Card className="p-12 text-center flex flex-col items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg text-dark font-semibold">No orders received yet</h3>
          <p className="mt-1 text-sm text-dark/50 max-w-sm">
            When buyers order your listed farm produce, customer orders and fulfillment details will show up here.
          </p>
        </Card>
      )}
    </>
  );
}
