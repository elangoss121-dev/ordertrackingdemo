import React from "react";
import { SearchBar } from "@/components/tracking/search-bar";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background blobs / lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-fade-in shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Apple Inspired Design & Performance</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-foreground">
            Track Your Shipments
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mt-1">
              Instantly & Securely
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Experience lightning-fast package tracking. Access full dashboards, live timelines, and estimated delivery windows in one secure platform.
          </p>

          {/* Search Bar wrapper */}
          <div className="pt-4 max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* Quick Metrics */}
          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm font-semibold text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-primary" />
              <span>Real-Time Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Enterprise Grade Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-5 w-5 text-primary" />
              <span>Multiple Couriers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
