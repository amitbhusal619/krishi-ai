import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { products } from "@/data/mock";

export default function AdminProductsPage() {
  return (
    <>
      <PageHeader title="Products" description="All active listings across the marketplace." />
      <DataTable
        columns={[
          { key: "name", label: "Product" },
          { key: "farmer", label: "Farmer" },
          { key: "location", label: "Location" },
          { key: "price", label: "Price (Rs)" },
        ]}
        rows={products}
      />
    </>
  );
}
