import React from "react";
import { UserTable } from "@/components/dashboard/user-table";

export const dynamic = "force-dynamic";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Customer Management</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Review details and registration logs for all registered platform clients.
        </p>
      </div>

      <UserTable />
    </div>
  );
}
