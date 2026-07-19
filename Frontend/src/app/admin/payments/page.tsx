import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { farmerOrders } from "@/data/mock";

export default function AdminPaymentsPage() {
  return (
    <>
      <PageHeader title="Payments" description="Transactions processed across eSewa, Khalti, and cards." />
      <DataTable
        columns={[
          { key: "id", label: "Transaction" },
          { key: "buyer", label: "Buyer" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status" },
        ]}
        rows={farmerOrders.map((o) => ({ id: o.id, buyer: o.buyer, amount: `Rs ${o.amount}`, status: o.status }))}
      />
    </>
  );
}
