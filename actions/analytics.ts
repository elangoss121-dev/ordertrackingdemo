"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import type { DashboardStats, MonthlyData, StatusDistribution } from "@/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return {
      totalOrders: 0,
      todayOrders: 0,
      pendingOrders: 0,
      inTransitOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
      totalUsers: 0,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todayOrders,
    pendingOrders,
    inTransitOrders,
    deliveredOrders,
    cancelledOrders,
    totalUsers,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({
      where: { status: { in: ["PROCESSING", "PACKED"] } },
    }),
    prisma.order.count({
      where: { status: { in: ["SHIPPED", "IN_TRANSIT", "OUT_FOR_DELIVERY"] } },
    }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.user.count({ where: { role: "USER" } }),
  ]);

  return {
    totalOrders,
    todayOrders,
    pendingOrders,
    inTransitOrders,
    deliveredOrders,
    cancelledOrders,
    totalUsers,
  };
}

export async function getMonthlyAnalytics(): Promise<MonthlyData[]> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return [];
  }

  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const monthName = date.toLocaleString("en-US", { month: "short" });

    const [orders, delivered, cancelled] = await Promise.all([
      prisma.order.count({
        where: { createdAt: { gte: date, lt: nextMonth } },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: date, lt: nextMonth },
          status: "DELIVERED",
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: date, lt: nextMonth },
          status: "CANCELLED",
        },
      }),
    ]);

    months.push({ month: monthName, orders, delivered, cancelled });
  }

  return months;
}

export async function getStatusDistribution(): Promise<StatusDistribution[]> {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return [];
  }

  const statuses = [
    { name: "Processing", status: "PROCESSING" as const, color: "#f59e0b" },
    { name: "Packed", status: "PACKED" as const, color: "#3b82f6" },
    { name: "Shipped", status: "SHIPPED" as const, color: "#6366f1" },
    { name: "In Transit", status: "IN_TRANSIT" as const, color: "#8b5cf6" },
    { name: "Out for Delivery", status: "OUT_FOR_DELIVERY" as const, color: "#f97316" },
    { name: "Delivered", status: "DELIVERED" as const, color: "#22c55e" },
    { name: "Cancelled", status: "CANCELLED" as const, color: "#ef4444" },
  ];

  const distribution = await Promise.all(
    statuses.map(async (s) => ({
      name: s.name,
      value: await prisma.order.count({ where: { status: s.status } }),
      color: s.color,
    }))
  );

  return distribution.filter((d) => d.value > 0);
}
