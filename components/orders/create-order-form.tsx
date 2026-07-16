"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, Plus } from "lucide-react";
import { createOrderSchema, type CreateOrderInput } from "@/lib/validations";
import { createOrder } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export function CreateOrderForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerEmail: "",
      orderNumber: 1,
    },
  });

  const onSubmit = async (data: CreateOrderInput) => {
    try {
      setLoading(true);
      const res = await createOrder(data);
      if (res.success && res.data) {
        toast.success(res.message);
        router.push(`/admin/orders/${res.data.orderId}`);
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-panel border-border/40 max-w-xl mx-auto shadow-xl rounded-3xl">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/admin/orders">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Create Order Tracking</CardTitle>
            <CardDescription className="text-xs">
              Generate conflict-free Order IDs based on date codes instantly.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Customer Email
            </label>
            <Input
              type="email"
              placeholder="customer@example.com"
              {...register("customerEmail")}
              className={errors.customerEmail ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.customerEmail && (
              <p className="text-xs text-destructive mt-1">{errors.customerEmail.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Order Number (1 - 99)
            </label>
            <Input
              type="number"
              placeholder="1"
              min={1}
              max={99}
              {...register("orderNumber", { valueAsNumber: true })}
              className={errors.orderNumber ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Order ID will be dynamically generated based on today&apos;s date and order number suffix.
            </p>
            {errors.orderNumber && (
              <p className="text-xs text-destructive mt-1">{errors.orderNumber.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-11 rounded-xl shadow-sm" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Shipment...
              </>
            ) : (
              <>
                <Plus className="mr-1.5 h-4.5 w-4.5" />
                Create & Generate Order ID
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
