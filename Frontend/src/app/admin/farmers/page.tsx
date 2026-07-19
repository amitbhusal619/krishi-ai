import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { adminUsers } from "@/data/mock";

export default function AdminFarmersPage() {
  return (
    <>
      <PageHeader title="Farmers" description="Verified farmers selling on Krishi AI." />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
          { key: "joined", label: "Joined" },
        ]}
        rows={adminUsers.filter((u) => u.role === "Farmer")}
      />
    </>
  );
}
