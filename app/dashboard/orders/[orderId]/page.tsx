import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getOrderByOrderId } from "@/actions/orders";
import { TrackingResult } from "@/components/tracking/tracking-result";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function UserOrderDetailsPage({ params }: PageProps) {
  const { orderId } = await params;
  const decodedOrderId = decodeURIComponent(orderId);

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const res = await getOrderByOrderId(decodedOrderId);

  if (!res.success || !res.data) {
    return (
      <div className="glass-panel border-border/40 p-12 text-center rounded-3xl space-y-6 max-w-xl mx-auto shadow-xl">
        <div className="h-16 w-16 bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight">Order Not Found</h2>
          <p className="text-muted-foreground text-sm font-semibold max-w-xs mx-auto">
            We couldn&apos;t find an order with code {decodedOrderId} in your account records.
          </p>
        </div>
        <Button asChild className="rounded-xl">
          <Link href="/dashboard/orders">Back to Shipments</Link>
        </Button>
      </div>
    );
  }

  const order = res.data as unknown as Order;

  // Security: Check if order email matches current logged-in user email
  if (order.customerEmail.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
    redirect("/unauthorized");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild className="rounded-xl">
          <Link href="/dashboard/orders">
            <ArrowLeft className="mr-2 h-4.5 w-4.5" />
            Back to Shipments
          </Link>
        </Button>
      </div>

      <TrackingResult order={order} showDownloadReceipt={true} />
    </div>
  );
}
