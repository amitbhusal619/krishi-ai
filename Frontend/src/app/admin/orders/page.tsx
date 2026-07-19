import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { farmerOrders } from "@/data/mock";

export default function AdminOrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="All orders placed across the platform." />
      <DataTable
        columns={[
          { key: "id", label: "Order" },
          { key: "buyer", label: "Buyer" },
          { key: "crop", label: "Crop" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status" },
        ]}
        rows={farmerOrders.map((o) => ({ id: o.id, buyer: o.buyer, crop: o.crop, amount: `Rs ${o.amount}`, status: o.status }))}
      />
    </>
  );
}
