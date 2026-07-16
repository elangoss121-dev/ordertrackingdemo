import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TrackingResult } from "@/components/tracking/tracking-result";
import { SearchBar } from "@/components/tracking/search-bar";
import { getOrderByOrderId } from "@/actions/orders";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderTrackingPage({ params }: PageProps) {
  const { orderId } = await params;
  const decodedOrderId = decodeURIComponent(orderId);

  const res = await getOrderByOrderId(decodedOrderId);

  return (
    <>
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-background via-secondary/10 to-background">
        <div className="mx-auto max-w-5xl space-y-8 relative z-10">
          {/* Back button & top search box */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
            <Button variant="ghost" asChild className="rounded-xl w-fit">
              <Link href="/track">
                <ArrowLeft className="mr-2 h-4.5 w-4.5" />
                Back to Track
              </Link>
            </Button>
            <div className="w-full sm:max-w-md">
              <SearchBar initialValue={decodedOrderId} placeholder="Track another ID..." />
            </div>
          </div>

          {res.success && res.data ? (
            <TrackingResult order={res.data as unknown as Order} />
          ) : (
            <div className="glass-panel border-border/40 p-12 text-center rounded-3xl space-y-6 max-w-xl mx-auto shadow-xl">
              <div className="h-16 w-16 bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight">Order Not Found</h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto font-medium">
                  We couldn&apos;t find any order with code <strong className="text-foreground">{decodedOrderId}</strong>. Please confirm spelling or contact the merchant.
                </p>
              </div>
              <Button asChild className="rounded-xl px-6">
                <Link href="/track">Try Again</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
