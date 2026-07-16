import React from "react";
import { Timeline } from "@/components/orders/timeline";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/orders/status-badge";
import { ProgressBar } from "@/components/tracking/progress-bar";
import type { TimelineEntry } from "@/types";

export function TimelinePreview() {
  const dummyTimeline: TimelineEntry[] = [
    {
      id: "1",
      orderId: "demo",
      title: "Out for Delivery",
      description: "Package is with local courier partner and heading your way.",
      date: new Date(),
      time: "09:45 AM",
      location: "San Francisco, CA HUB",
      icon: "compass",
      completed: true,
      createdAt: new Date(),
    },
    {
      id: "2",
      orderId: "demo",
      title: "In Transit",
      description: "Shipment departed from facility and is transit to destination hub.",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      time: "02:15 PM",
      location: "Chicago, IL Fulfillment Center",
      icon: "truck",
      completed: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      orderId: "demo",
      title: "Order Processed",
      description: "Seller has packed item. Shipping manifest ready.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      time: "10:00 AM",
      location: "System Warehouse",
      icon: "package",
      completed: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
              Interactive Dashboard
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Visually Interactive Timeline
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
              Get detailed updates about your order at each step of the way. From payment verification, dispatch, transit to final delivery check-ins, the visual timeline keeps you in complete loop.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs mt-1">
                  1
                </div>
                <p className="ml-3 text-sm text-muted-foreground">
                  <strong className="text-foreground">Real-time coordinates:</strong> Check coordinates and city-wise stops logged by regional drivers.
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-bold text-xs mt-1">
                  2
                </div>
                <p className="ml-3 text-sm text-muted-foreground">
                  <strong className="text-foreground">Courier Integrations:</strong> Dynamic external tracking links pointing to respective carrier platforms.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl transform rotate-2 pointer-events-none" />
            <Card className="glass-panel border-border/40 relative shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="border-b pb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-bold">Demo Order ID: J260101</CardTitle>
                    <CardDescription className="text-xs">Product: iPhone 17 Pro Max</CardDescription>
                  </div>
                  <StatusBadge status="IN_TRANSIT" />
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <ProgressBar status="IN_TRANSIT" />
                <Timeline timeline={dummyTimeline} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
