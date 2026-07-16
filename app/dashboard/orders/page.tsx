"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Inbox, Eye, Loader2, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getUserOrders } from "@/actions/orders";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { Order } from "@/types";
import { toast } from "sonner";

export default function UserOrdersPage() {
  const { user } = useCurrentUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const loadUserOrders = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const res = await getUserOrders(user.email, { page, pageSize });
      setOrders(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to load your shipments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadUserOrders();
    }
  }, [user?.email, page]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight">My Shipments</h1>
        <p className="text-muted-foreground text-sm font-semibold">
          Access full history, courier logs, and invoices for all your purchases.
        </p>
      </div>

      <div className="glass-panel border-border/40 rounded-3xl overflow-hidden shadow-lg bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="font-semibold text-sm">Loading shipments...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground space-y-4">
            <PackageOpen className="h-12 w-12 mx-auto text-muted-foreground/60" />
            <div>
              <p className="font-bold text-lg text-foreground">No shipments recorded.</p>
              <p className="text-sm">When merchants create orders for your email, they will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40 border-b border-border/40">
                  <TableHead className="font-bold text-foreground">Order ID</TableHead>
                  <TableHead className="font-bold text-foreground">Product</TableHead>
                  <TableHead className="font-bold text-foreground">Courier</TableHead>
                  <TableHead className="font-bold text-foreground">Status</TableHead>
                  <TableHead className="font-bold text-foreground">Estimated Delivery</TableHead>
                  <TableHead className="w-[80px] text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-accent/40 border-b border-border/40">
                    <TableCell className="font-bold text-foreground">{order.orderId}</TableCell>
                    <TableCell className="font-semibold text-muted-foreground">{order.productName}</TableCell>
                    <TableCell className="font-medium text-foreground">
                      {order.courierName || "TBD"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "TBD"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href={`/dashboard/orders/${order.orderId}`}>
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
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground font-semibold">
            Showing <strong className="text-foreground">{(page - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-foreground">
              {Math.min(page * pageSize, total)}
            </strong>{" "}
            of <strong className="text-foreground">{total}</strong> orders
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl h-9 w-9 p-0"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </Button>
            <span className="text-sm font-semibold text-foreground px-2">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-xl h-9 w-9 p-0"
            >
              <ChevronRight className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
