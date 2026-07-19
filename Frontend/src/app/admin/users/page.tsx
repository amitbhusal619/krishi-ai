import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { adminUsers } from "@/data/mock";

export default function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Users" description="All accounts registered on the platform." />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "status", label: "Status" },
          { key: "joined", label: "Joined" },
        ]}
        rows={adminUsers}
      />
    </>
  );
}
