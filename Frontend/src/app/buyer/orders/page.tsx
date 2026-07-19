import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { farmerOrders } from "@/data/mock";

export default function BuyerOrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Track everything you've bought." />
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
    </>
  );
}
