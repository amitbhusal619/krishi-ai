import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { farmerOrders } from "@/data/mock";

export default function FarmerOrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Track and fulfill orders from buyers." />
      <DataTable
        columns={[
          { key: "id", label: "Order" },
          { key: "buyer", label: "Buyer" },
          { key: "crop", label: "Crop" },
          { key: "qty", label: "Qty" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status" },
        ]}
        rows={farmerOrders.map((o) => ({ ...o, amount: `Rs ${o.amount}` }))}
      />
    </>
  );
}
