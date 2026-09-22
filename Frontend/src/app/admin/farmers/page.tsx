"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Card } from "@/components/ui/card";
import { getUsers, ApiUser } from "@/lib/api";

export default function AdminFarmersPage() {
  const [farmers, setFarmers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarmers() {
      try {
        const data = await getUsers("farmer");
        setFarmers(data || []);
      } catch (err) {
        console.error("Failed to load farmers:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFarmers();
  }, []);

  const tableRows = farmers.map((f) => {
    const fullName = [f.first_name, f.last_name].filter(Boolean).join(" ") || f.username;
    return {
      name: fullName,
      status: f.is_verified ? "VERIFIED" : "UNVERIFIED",
      joined: f.date_joined ? new Date(f.date_joined).toLocaleDateString() : "Recently",
    };
  });

  return (
    <>
      <PageHeader title="Farmers" description="Verified farmers selling on HAMRO KRISHI SEWA." />

      {loading ? (
        <Card className="p-8 text-center text-sm text-dark/50">Loading farmers...</Card>
      ) : tableRows.length > 0 ? (
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "status", label: "Status" },
            { key: "joined", label: "Joined" },
          ]}
          rows={tableRows}
        />
      ) : (
        <Card className="p-12 text-center text-sm text-dark/50">
          No farmer accounts registered on the platform yet.
        </Card>
      )}
    </>
  );
}
