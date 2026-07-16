"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, Loader2, Users, Eye } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { getUsers } from "@/actions/users";
import type { User } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

export function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers({
        query: debouncedQuery,
        page,
        pageSize,
      });
      setUsers(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [debouncedQuery, page]);

  return (
    <div className="space-y-6">
      {/* Top filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel border-border/40 rounded-3xl overflow-hidden shadow-lg bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="font-semibold text-sm">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground space-y-4">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/60" />
            <div>
              <p className="font-bold text-lg text-foreground">No users found.</p>
              <p className="text-sm">Try tweaking your search query.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/40 border-b border-border/40">
                  <TableHead className="font-bold text-foreground">Customer</TableHead>
                  <TableHead className="font-bold text-foreground">Email</TableHead>
                  <TableHead className="font-bold text-foreground">Role</TableHead>
                  <TableHead className="font-bold text-foreground">Registered Date</TableHead>
                  <TableHead className="w-[100px] text-right font-bold text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-accent/40 border-b border-border/40">
                    <TableCell className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photo || undefined} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-bold text-foreground">{user.name}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          user.role === "ADMIN"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href={`/admin/users/${user.id}`}>
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <p className="text-sm text-muted-foreground font-semibold">
            Showing <strong className="text-foreground">{(page - 1) * pageSize + 1}</strong> to{" "}
            <strong className="text-foreground">
              {Math.min(page * pageSize, total)}
            </strong>{" "}
            of <strong className="text-foreground">{total}</strong> users
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
