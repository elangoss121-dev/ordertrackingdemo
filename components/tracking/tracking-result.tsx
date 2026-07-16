import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProgressBar } from "./progress-bar";
import { StatusBadge } from "@/components/orders/status-badge";
import { Timeline } from "@/components/orders/timeline";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Truck, Calendar, MapPin, ExternalLink, ArrowRight, Download, Package } from "lucide-react";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";

interface TrackingResultProps {
  order: Order;
  showDownloadReceipt?: boolean;
  onDownloadReceipt?: () => void;
}

export function TrackingResult({
  order,
  showDownloadReceipt = false,
  onDownloadReceipt,
}: TrackingResultProps) {
  const handleDownload = () => {
    if (onDownloadReceipt) {
      onDownloadReceipt();
      return;
    }

    // Default simple print receipt
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Overview Card */}
      <Card className="glass-panel overflow-hidden border-border/40 shadow-xl rounded-3xl">
        <CardHeader className="bg-gradient-to-br from-primary/5 via-transparent to-transparent border-b pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardDescription className="text-xs font-bold uppercase tracking-wider text-primary">
                Shipment Tracker
              </CardDescription>
              <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                Order #{order.orderId}
              </CardTitle>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />
              {showDownloadReceipt && (
                <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-xl">
                  <Download className="mr-2 h-4 w-4" />
                  Receipt
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Progress bar */}
          <ProgressBar status={order.status} />

          {/* Quick info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start p-4 rounded-2xl bg-secondary/50 border">
              <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Estimated Delivery
                </span>
                <span className="text-sm font-bold mt-0.5 block text-foreground">
                  {order.estimatedDelivery ? formatDate(order.estimatedDelivery) : "TBD"}
                </span>
              </div>
            </div>

            <div className="flex items-start p-4 rounded-2xl bg-secondary/50 border">
              <Truck className="h-5 w-5 text-primary mr-3 mt-0.5" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Courier Partner
                </span>
                {order.courierName ? (
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-sm font-bold text-foreground">{order.courierName}</span>
                    {order.trackingUrl && (
                      <a
                        href={order.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground block mt-0.5">
                    Not Assigned
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-start p-4 rounded-2xl bg-secondary/50 border">
              <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Current Location
                </span>
                <span className="text-sm font-bold mt-0.5 block text-foreground">
                  {order.currentLocation || "Location Pending"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail / Timeline split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Package info */}
        <Card className="lg:col-span-1 glass-panel border-border/40 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">Package Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Product Name
              </span>
              <span className="text-base font-bold text-foreground flex items-center mt-1">
                <Package className="h-4.5 w-4.5 mr-2 text-primary" />
                {order.productName || "Standard Package"}
              </span>
            </div>

            {order.description && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Description
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  {order.description}
                </p>
              </div>
            )}

            <div className="border-t pt-4 space-y-3">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Recipient Name
                </span>
                <span className="text-sm font-semibold text-foreground mt-0.5 block">
                  {order.customerName}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                  Email
                </span>
                <span className="text-sm font-semibold text-muted-foreground mt-0.5 block truncate">
                  {order.customerEmail}
                </span>
              </div>
              {order.phone && (
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Phone
                  </span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">
                    {order.phone}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live updates / Timeline */}
        <Card className="lg:col-span-2 glass-panel border-border/40 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold tracking-tight">Tracking History</CardTitle>
            <CardDescription className="text-xs">
              Chronological log of shipment updates and status checkpoints.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Timeline timeline={order.timeline || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
