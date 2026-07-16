"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type { MonthlyData, StatusDistribution } from "@/types";

interface AnalyticsChartsProps {
  monthlyData: MonthlyData[];
  statusDistribution: StatusDistribution[];
}

export function AnalyticsCharts({ monthlyData, statusDistribution }: AnalyticsChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-panel h-[400px] flex items-center justify-center text-muted-foreground text-sm font-semibold">
          Loading monthly trends...
        </Card>
        <Card className="glass-panel h-[400px] flex items-center justify-center text-muted-foreground text-sm font-semibold">
          Loading status breakdown...
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly orders bar chart */}
      <Card className="lg:col-span-2 glass-panel border-border/40 rounded-3xl overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight">Monthly Trends</CardTitle>
          <CardDescription className="text-xs">
            Overview of total orders, delivered shipments, and cancellations.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[320px] pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="month" tickLine={false} style={{ fontSize: "12px", fontWeight: 600 }} />
              <YAxis tickLine={false} style={{ fontSize: "12px", fontWeight: 600 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 600 }} />
              <Bar dataKey="orders" name="Total Orders" fill="#0071e3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delivered" name="Delivered" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status distribution pie chart */}
      <Card className="glass-panel border-border/40 rounded-3xl overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold tracking-tight">Status Distribution</CardTitle>
          <CardDescription className="text-xs">
            Shipments breakdown by current tracking status.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[320px] flex flex-col justify-between pb-6">
          <div className="h-[220px] w-full">
            {statusDistribution.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-semibold">
                No status data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Custom legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center text-[10px] sm:text-xs font-semibold text-muted-foreground">
            {statusDistribution.map((entry, index) => (
              <div key={index} className="flex items-center space-x-1">
                <span
                  className="h-2.5 w-2.5 rounded-full inline-block"
                  style={{ backgroundColor: entry.color }}
                />
                <span>
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
