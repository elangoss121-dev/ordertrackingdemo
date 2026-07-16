import React from "react";
import { getOrderByOrderId } from "@/actions/orders";
import { AdminOrderDetailWrapper } from "@/components/orders/admin-order-detail-wrapper";
import { redirect } from "next/navigation";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  const decoded = decodeURIComponent(orderId);

  const res = await getOrderByOrderId(decoded);

  if (!res.success || !res.data) {
    redirect("/admin/orders");
  }

  return (
    <div className="py-2">
      <AdminOrderDetailWrapper initialOrder={res.data as unknown as Order} />
    </div>
  );
}
