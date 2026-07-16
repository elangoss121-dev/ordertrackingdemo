import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/actions/orders";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Inbox, Compass, CheckCircle2, Package } from "lucide-react";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  const user = await getCurrentUser();
  const userEmail = user?.email || "";

  const orderRes = await getUserOrders(userEmail, { page: 1, pageSize: 5 });
  const recentOrders = orderRes.data;

  // Calculate quick stats based on total matching shipments
  const totalRes = await getUserOrders(userEmail, { page: 1, pageSize: 100 });
  const allOrders = totalRes.data;

  const totalCount = totalRes.total;
  const pendingCount = allOrders.filter(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
  ).length;
  const deliveredCount = allOrders.filter((o) => o.status === "DELIVERED").length;

  const stats = [
    { title: "Active Shipments", value: pendingCount, icon: Compass, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { title: "Delivered Items", value: deliveredCount, icon: CheckCircle2, color: "text-green-500 bg-green-500/10 border-green-500/20" },
    { title: "Total Order Logs", value: totalCount, icon: Package, color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Board */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Check status updates, delivery windows, and courier routes instantly.
        </p>
      </div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="glass-panel border-border/40 shadow-md rounded-2xl overflow-hidden relative">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    {stat.title}
                  </span>
                  <span className="text-3xl font-extrabold tracking-tight block text-foreground">
                    {stat.value}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Orders component */}
      <RecentOrders orders={recentOrders} isAdmin={false} />
    </div>
  );
}
