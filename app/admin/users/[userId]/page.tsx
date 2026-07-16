import React from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Calendar, Eye, Inbox, PackageOpen } from "lucide-react";
import { getUserById } from "@/actions/users";
import { getUserOrders } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const dynamic = "force-dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/orders/status-badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Order } from "@/types";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { userId } = await params;
  const res = await getUserById(userId);

  if (!res.success || !res.data) {
    redirect("/admin/users");
  }

  const customer = res.data;

  // Load orders associated with the user's email
  const ordersRes = await getUserOrders(customer.email, { page: 1, pageSize: 50 });
  const customerOrders = ordersRes.data;

  return (
    <div className="space-y-6">
      {/* Top action block */}
      <div className="flex items-center space-x-2 border-b pb-6">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/admin/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{customer.name}</h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">
            Registered: <strong className="text-foreground">{formatDate(customer.createdAt)}</strong>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Details */}
        <Card className="lg:col-span-1 glass-panel border-border/40 rounded-3xl h-fit shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Client Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Full Name
                </span>
                <span className="text-sm font-bold mt-0.5 block text-foreground">{customer.name}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 border-t pt-4">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Email Address
                </span>
                <span className="text-sm font-bold mt-0.5 block text-foreground truncate max-w-[180px]">
                  {customer.email}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 border-t pt-4">
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Last Login
                </span>
                <span className="text-sm font-bold mt-0.5 block text-foreground">
                  {customer.lastLogin ? formatDateTime(customer.lastLogin) : "Never Logged In"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Orders */}
        <Card className="lg:col-span-2 glass-panel border-border/40 rounded-3xl overflow-hidden shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Associated Shipments</CardTitle>
            <CardDescription className="text-xs">
              Orders generated matching registered email <strong className="text-foreground">{customer.email}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {customerOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground space-y-3">
                <PackageOpen className="h-10 w-10 text-muted-foreground/60" />
                <p className="text-sm font-semibold">No associated orders found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/40 border-b border-border/40">
                      <TableHead className="font-bold text-foreground">Order ID</TableHead>
                      <TableHead className="font-bold text-foreground">Product</TableHead>
                      <TableHead className="font-bold text-foreground">Status</TableHead>
                      <TableHead className="font-bold text-foreground">Date</TableHead>
                      <TableHead className="w-[80px] text-right font-bold text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-accent/40 border-b border-border/40">
                        <TableCell className="font-bold text-foreground">{order.orderId}</TableCell>
                        <TableCell className="font-semibold text-muted-foreground truncate max-w-[150px]">
                          {order.productName}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={order.status} />
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild className="rounded-full">
                            <Link href={`/admin/orders/${order.orderId}`}>
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
      </div>
    </div>
  );
}
