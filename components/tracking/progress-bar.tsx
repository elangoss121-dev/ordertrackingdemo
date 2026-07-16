import React from "react";
import { getStatusProgress } from "@/lib/utils";
import type { OrderStatus } from "@/types";
import { Package, Inbox, Truck, Compass, MapPin, CheckCircle2 } from "lucide-react";

interface ProgressBarProps {
  status: OrderStatus;
}

export function ProgressBar({ status }: ProgressBarProps) {
  const progress = getStatusProgress(status);

  const steps = [
    { label: "Processing", icon: Inbox, minVal: 10 },
    { label: "Packed", icon: Package, minVal: 25 },
    { label: "Shipped", icon: Truck, minVal: 40 },
    { label: "In Transit", icon: Compass, minVal: 60 },
    { label: "Out for Delivery", icon: MapPin, minVal: 80 },
    { label: "Delivered", icon: CheckCircle2, minVal: 100 },
  ];

  if (status === "CANCELLED") {
    return (
      <div className="w-full bg-red-500/10 dark:bg-red-500/5 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center text-sm font-semibold">
        This order has been cancelled.
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      {/* Visual track line */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-muted/40 rounded-full" />
        <div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />

        {/* Steps container */}
        <div className="relative flex justify-between">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = progress >= step.minVal;
            const isActive =
              status === "PROCESSING" && step.minVal === 10 ||
              status === "PACKED" && step.minVal === 25 ||
              status === "SHIPPED" && step.minVal === 40 ||
              status === "IN_TRANSIT" && step.minVal === 60 ||
              status === "OUT_FOR_DELIVERY" && step.minVal === 80 ||
              status === "DELIVERED" && step.minVal === 100;

            return (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                    isCompleted
                      ? "bg-primary border-primary text-white scale-110 shadow-md"
                      : "bg-card border-muted/50 text-muted-foreground"
                  } ${isActive ? "ring-4 ring-primary/20 dark:ring-primary/40 animate-pulse" : ""}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`mt-2 hidden sm:block text-xs font-semibold tracking-tight transition-colors duration-300 ${
                    isCompleted ? "text-foreground font-bold" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
