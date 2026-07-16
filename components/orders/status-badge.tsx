import React from "react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusLabel } from "@/lib/utils";
import type { OrderStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`${getStatusColor(status)} border-transparent px-3 py-1 font-semibold text-xs rounded-full uppercase tracking-wider ${className}`}
    >
      {getStatusLabel(status)}
    </Badge>
  );
}
