"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Inbox, Truck, CheckCircle2, XCircle, Users, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: TrendingUp,
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Pending Processing",
      value: stats.pendingOrders,
      icon: Inbox,
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "In Transit",
      value: stats.inTransitOrders,
      icon: Truck,
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Delivered",
      value: stats.deliveredOrders,
      icon: CheckCircle2,
      color: "text-green-500 bg-green-500/10 border-green-500/20",
    },
    {
      title: "Cancelled",
      value: stats.cancelledOrders,
      icon: XCircle,
      color: "text-red-500 bg-red-500/10 border-red-500/20",
    },
    {
      title: "Total Customers",
      value: stats.totalUsers,
      icon: Users,
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="glass-panel border-border/40 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden relative group">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                    {card.title}
                  </span>
                  <span className="text-3xl font-extrabold tracking-tight block text-foreground">
                    {card.value}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
