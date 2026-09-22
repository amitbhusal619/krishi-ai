"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { getUsers, ApiUser } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const tableRows = users.map((u) => {
    const fullName = [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username;
    return {
      name: fullName,
      role: u.role.toUpperCase(),
      status: u.is_verified ? "VERIFIED" : "UNVERIFIED",
      joined: u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "Recently",
    };
  });

  return (
    <>
      <PageHeader title="Users" description="All accounts registered on the platform." />

      {loading ? (
        <Card className="p-8 text-center text-sm text-dark/50">Loading users...</Card>
      ) : tableRows.length > 0 ? (
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "role", label: "Role" },
            { key: "status", label: "Status" },
            { key: "joined", label: "Joined" },
          ]}
          rows={tableRows}
        />
      ) : (
        <Card className="p-12 text-center text-sm text-dark/50">
          No registered users on the platform yet.
        </Card>
      )}
    </>
  );
}
