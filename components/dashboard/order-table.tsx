"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  ArrowUpDown,
  Filter,
  Eye,
  Trash2,
  PackagePlus,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/orders/status-badge";
import { formatDate } from "@/lib/utils";
import { getOrders, deleteOrder } from "@/actions/orders";
import type { Order, OrderStatus } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

interface OrderTableProps {
  isAdmin?: boolean;
}

export function OrderTable({ isAdmin = false }: OrderTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter / Query / Pagination States
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const loadOrders = async () => {
    try {
      setLoading(true);
      const activeStatus = statusFilter === "ALL" ? undefined : (statusFilter as OrderStatus);
      const res = await getOrders({
        query: debouncedQuery,
        page,
        pageSize,
        sortBy,
        sortOrder,
        status: activeStatus,
      });
      setOrders(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [debouncedQuery, statusFilter, sortBy, sortOrder, page]);

  const handleDelete = async (id: string, orderId: string) => {
    if (!confirm(`Are you sure you want to delete order ${orderId}?`)) return;

    try {
      const res = await deleteOrder(id);
      if (res.success) {
        toast.success(res.message);
        loadOrders();
      } else {
        toast.error(res.error);
      }
    } catch {
      toast.error("Failed to delete order.");
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const handleCsvExport = () => {
    window.open("/api/orders/export", "_blank");
    toast.success("CSV export initiated!");
  };

  return (
    <div className="space-y-6">
      {/* Top filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            placeholder="Search by ID, name or email..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="pl-10 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap w-full md:w-auto items-center gap-3 justify-end">
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] rounded-xl bg-card">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="PACKED">Packed</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
              <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {isAdmin && (
            <>
              <Button variant="outline" onClick={handleCsvExport} className="rounded-xl">
                <Download className="mr-2 h-4.5 w-4.5" />
                Export CSV
              </Button>
              <Button asChild className="rounded-xl shadow-sm">
                <Link href="/admin/orders/new">
                  <Plus className="mr-1.5 h-4.5 w-4.5" />
                  Create Order
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-panel border-border/40 rounded-3xl overflow-hidden shadow-lg bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="font-semibold text-sm">Loading shipments...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground space-y-4">
            <PackagePlus className="h-12 w-12 mx-auto text-muted-foreground/60" />
            <div>
              <p className="font-bold text-lg text-foreground">No orders matching criteria.</p>
              <p className="text-sm">Try clearing filters or queries to view all listings.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40 border-b border-border/40">
                  <TableHead
                    onClick={() => handleSort("orderId")}
                    className="cursor-pointer font-bold text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    Order ID <ArrowUpDown className="inline ml-1 h-3.5 w-3.5" />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("customerName")}
                    className="cursor-pointer font-bold text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    Customer <ArrowUpDown className="inline ml-1 h-3.5 w-3.5" />
                  </TableHead>
                  <TableHead className="font-bold text-foreground">Product</TableHead>
                  <TableHead
                    onClick={() => handleSort("status")}
                    className="cursor-pointer font-bold text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    Status <ArrowUpDown className="inline ml-1 h-3.5 w-3.5" />
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort("createdAt")}
                    className="cursor-pointer font-bold text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    Date <ArrowUpDown className="inline ml-1 h-3.5 w-3.5" />
                  </TableHead>
                  <TableHead className="w-[120px] text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-accent/40 border-b border-border/40">
                    <TableCell className="font-bold text-foreground">{order.orderId}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground max-w-[180px] truncate">
                        {order.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-muted-foreground">{order.productName}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right flex items-center justify-end space-x-1">
                      <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href={isAdmin ? `/admin/orders/${order.orderId}` : `/dashboard/orders/${order.orderId}`}>
                          <Eye className="h-4.5 w-4.5 text-primary" />
                        </Link>
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(order.id, order.orderId)}
                          className="rounded-full text-red-500 hover:text-red-700 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination controls */}
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
