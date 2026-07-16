"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { updateOrderSchema, type UpdateOrderInput } from "@/lib/validations";
import { updateOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Order, OrderStatus } from "@/types";
import { toast } from "sonner";

interface UpdateOrderFormProps {
  order: Order;
  onUpdateSuccess?: (updatedOrder: Order) => void;
}

export function UpdateOrderForm({ order, onUpdateSuccess }: UpdateOrderFormProps) {
  const [loading, setLoading] = useState(false);

  // Parse ISO date string to YYYY-MM-DD for input field
  const initialDeliveryDate = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toISOString().substring(0, 10)
    : "";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateOrderInput>({
    resolver: zodResolver(updateOrderSchema),
    defaultValues: {
      customerName: order.customerName || "",
      phone: order.phone || "",
      productName: order.productName || "",
      description: order.description || "",
      courierName: order.courierName || "",
      trackingUrl: order.trackingUrl || "",
      status: order.status,
      estimatedDelivery: initialDeliveryDate,
      currentLocation: order.currentLocation || "",
    },
  });

  const activeStatus = watch("status");

  const onSubmit = async (data: UpdateOrderInput) => {
    try {
      setLoading(true);
      const res = await updateOrder(order.id, data);
      if (res.success && res.data) {
        toast.success(res.message);
        if (onUpdateSuccess) {
          onUpdateSuccess(res.data as unknown as Order);
        }
      } else {
        toast.error(res.error || "Update failed.");
      }
    } catch {
      toast.error("Failed to update order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-panel border-border/40 shadow-lg rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg font-bold tracking-tight">Shipment Details</CardTitle>
        <CardDescription className="text-xs">
          Edit courier names, delivery dates, and status fields below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer Name
              </label>
              <Input {...register("customerName")} />
              {errors.customerName && (
                <p className="text-xs text-destructive mt-1">{errors.customerName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recipient Phone
              </label>
              <Input {...register("phone")} />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Product Name
              </label>
              <Input {...register("productName")} />
              {errors.productName && (
                <p className="text-xs text-destructive mt-1">{errors.productName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Courier Name
              </label>
              <Input {...register("courierName")} />
              {errors.courierName && (
                <p className="text-xs text-destructive mt-1">{errors.courierName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                External Tracking Link
              </label>
              <Input {...register("trackingUrl")} placeholder="https://..." />
              {errors.trackingUrl && (
                <p className="text-xs text-destructive mt-1">{errors.trackingUrl.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Estimated Delivery
              </label>
              <Input type="date" {...register("estimatedDelivery")} />
              {errors.estimatedDelivery && (
                <p className="text-xs text-destructive mt-1">{errors.estimatedDelivery.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Location
              </label>
              <Input {...register("currentLocation")} />
              {errors.currentLocation && (
                <p className="text-xs text-destructive mt-1">{errors.currentLocation.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Order Status
              </label>
              <Select
                value={activeStatus}
                onValueChange={(val: OrderStatus) => setValue("status", val)}
              >
                <SelectTrigger className="w-full rounded-xl bg-card">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="PACKED">Packed</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Description / Notes
            </label>
            <Input {...register("description")} />
            {errors.description && (
              <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl shadow-sm mt-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4.5 w-4.5" />
                Save Shipment Details
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
