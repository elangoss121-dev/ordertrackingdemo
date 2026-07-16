import React from "react";
import { OrderTable } from "@/components/dashboard/order-table";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Shipment Management</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Create, edit, delete, and query order status milestones.
        </p>
      </div>

      <OrderTable isAdmin={true} />
    </div>
  );
}
