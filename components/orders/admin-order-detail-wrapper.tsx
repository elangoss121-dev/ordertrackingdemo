"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Trash2, Calendar, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UpdateOrderForm } from "./update-order-form";
import { TimelineForm } from "./timeline-form";
import { Timeline } from "./timeline";
import { StatusBadge } from "./status-badge";
import { formatDate } from "@/lib/utils";
import { deleteTimelineEntry } from "@/actions/timeline";
import { getOrderById } from "@/actions/orders";
import type { Order } from "@/types";
import { toast } from "sonner";

interface AdminOrderDetailWrapperProps {
  initialOrder: Order;
}

export function AdminOrderDetailWrapper({ initialOrder }: AdminOrderDetailWrapperProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [loading, setLoading] = useState(false);

  const refreshOrderData = async () => {
    try {
      setLoading(true);
      const res = await getOrderById(order.id);
      if (res.success && res.data) {
        setOrder(res.data as unknown as Order);
      } else {
        toast.error("Failed to sync latest order data.");
      }
    } catch {
      toast.error("Sync error.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTimelineEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this checkpoint?")) return;

    try {
      const res = await deleteTimelineEntry(entryId);
      if (res.success) {
        toast.success(res.message);
        refreshOrderData();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete log entry.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Order #{order.orderId}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-muted-foreground font-semibold mt-1">
              Registered Recipient: <strong className="text-foreground">{order.customerEmail}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 justify-end">
          <Button variant="outline" size="icon" onClick={refreshOrderData} disabled={loading} className="rounded-full">
            <RefreshCw className={`h-4.5 w-4.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" asChild className="rounded-xl">
            <Link href={`/track/${order.orderId}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              Public Tracking View
            </Link>
          </Button>
        </div>
      </div>

      {/* Main dashboard splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl mb-4 bg-secondary/50">
              <TabsTrigger value="details">Shipment Details</TabsTrigger>
              <TabsTrigger value="timeline">Manage Checkpoints</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <UpdateOrderForm order={order} onUpdateSuccess={(updated) => setOrder(updated)} />
            </TabsContent>

            <TabsContent value="timeline">
              <TimelineForm orderId={order.id} onSuccess={refreshOrderData} />
            </TabsContent>
          </Tabs>

          {/* Quick status preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start p-4 rounded-2xl bg-secondary/50 border">
              <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Delivery Commitment
                </span>
                <span className="text-sm font-bold mt-0.5 block text-foreground">
                  {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "TBD"}
                </span>
              </div>
            </div>

            <div className="flex items-start p-4 rounded-2xl bg-secondary/50 border">
              <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Current Coordinates
                </span>
                <span className="text-sm font-bold mt-0.5 block text-foreground">
                  {order.currentLocation || "Pending Checkin"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live checklist / deletes */}
        <div className="lg:col-span-1">
          <Card className="glass-panel border-border/40 rounded-3xl h-full shadow-lg">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-base font-bold tracking-tight">Active Checkpoints</CardTitle>
              <CardDescription className="text-xs">
                Review and delete historical tracking logs.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
              {order.timeline && order.timeline.length > 0 ? (
                <div className="space-y-4">
                  {[...order.timeline]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item) => (
                      <div key={item.id} className="flex items-start justify-between border-b pb-3 border-border/40">
                        <div>
                          <p className="text-sm font-bold text-foreground">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.location || "System"}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                            {formatDate(item.date)} - {item.time}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTimelineEntry(item.id)}
                          className="rounded-full text-red-500 hover:text-red-700 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-4 text-center">
                  No checkpoints logged.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
export default AdminOrderDetailWrapper;
