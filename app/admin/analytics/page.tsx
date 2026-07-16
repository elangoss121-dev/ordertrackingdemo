import React from "react";
import { getMonthlyAnalytics, getStatusDistribution } from "@/actions/analytics";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const monthlyData = await getMonthlyAnalytics();
  const statusDistribution = await getStatusDistribution();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">Interactive Analytics</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Review volume trends, courier deliveries, and order status counts.
        </p>
      </div>

      <AnalyticsCharts monthlyData={monthlyData} statusDistribution={statusDistribution} />
    </div>
  );
}
