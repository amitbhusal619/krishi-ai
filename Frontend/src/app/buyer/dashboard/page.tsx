import { Package, Heart, ShoppingCart, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/shared/data-table";
import { ProductCard } from "@/components/shared/product-card";
import { products, farmerOrders } from "@/data/mock";

const stats = [
  { label: "Active orders", value: "3", icon: Clock },
  { label: "Wishlist items", value: "8", icon: Heart },
  { label: "Cart items", value: "2", icon: ShoppingCart },
  { label: "Orders completed", value: "27", icon: Package },
];

export default function BuyerDashboardPage() {
  return (
    <>
      <PageHeader title="Welcome back, Anish" description="Here's a snapshot of your buying activity." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <s.icon className="h-5 w-5 text-primary" />
            <p className="mt-4 font-mono text-2xl text-dark">{s.value}</p>
            <p className="mt-1 text-xs text-dark/50">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs text-dark/40">RECOMMENDED FOR YOU</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 3).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs text-dark/40">RECENT ORDERS</p>
        <DataTable
          columns={[
            { key: "id", label: "Order" },
            { key: "crop", label: "Crop" },
            { key: "qty", label: "Qty" },
            { key: "amount", label: "Amount" },
            { key: "status", label: "Status" },
          ]}
          rows={farmerOrders.map((o) => ({ id: o.id, crop: o.crop, qty: o.qty, amount: `Rs ${o.amount}`, status: o.status }))}
        />
      </div>
    </>
  );
}
