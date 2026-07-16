import React from "react";
import { getDashboardStats } from "@/actions/analytics";
import { getOrders } from "@/actions/orders";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentOrders } from "@/components/dashboard/recent-orders";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const ordersRes = await getOrders({
    page: 1,
    pageSize: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const recentOrders = ordersRes.data;

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Access logistics stats, package creations, customer lists, and shipment CSV downloads.
        </p>
      </div>

      {/* Stats Cards components */}
      <StatsCards stats={stats} />

      {/* Recent Orders table */}
      <RecentOrders orders={recentOrders} isAdmin={true} />
    </div>
  );
}
