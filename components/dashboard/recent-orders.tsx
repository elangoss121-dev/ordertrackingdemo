import React from "react";
import Link from "next/link";
import { ArrowRight, Inbox, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/orders/status-badge";
import { formatDate } from "@/lib/utils";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";

interface RecentOrdersProps {
  orders: Order[];
  isAdmin?: boolean;
}

export function RecentOrders({ orders, isAdmin = false }: RecentOrdersProps) {
  const detailPrefix = isAdmin ? "/admin/orders" : "/dashboard/orders";

  return (
    <Card className="glass-panel border-border/40 rounded-3xl overflow-hidden shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight">Recent Shipments</CardTitle>
          <CardDescription className="text-xs">
            Review status updates and destinations for latest shipments.
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="rounded-xl">
          <Link href={isAdmin ? "/admin/orders" : "/dashboard/orders"}>
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-3">
            <Inbox className="h-10 w-10 text-muted-foreground/60" />
            <p className="text-sm font-semibold">No recent orders found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40 border-b border-border/40">
                  <TableHead className="font-bold text-foreground">Order ID</TableHead>
                  <TableHead className="font-bold text-foreground">Customer</TableHead>
                  <TableHead className="font-bold text-foreground">Product</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="font-bold text-foreground">Delivery</TableHead>
                  <TableHead className="w-[100px] text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-accent/40 border-b border-border/40">
                    <TableCell className="font-bold text-foreground">{order.orderId}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {order.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-muted-foreground">{order.productName}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "TBD"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href={`${detailPrefix}/${order.orderId}`}>
                          <Eye className="h-4.5 w-4.5 text-primary" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
