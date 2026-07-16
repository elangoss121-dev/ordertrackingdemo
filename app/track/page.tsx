import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SearchBar } from "@/components/tracking/search-bar";
import { PackageSearch } from "lucide-react";

export default function TrackSearchPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-background via-secondary/10 to-background flex flex-col items-center justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-2xl text-center space-y-6 z-10 relative">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-sm mx-auto">
            <PackageSearch className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Track Your Shipment</h1>
            <p className="text-muted-foreground text-sm sm:text-base font-semibold max-w-md mx-auto">
              Enter your unique Order ID code to trace coordinates, timelines, and carrier assignments instantly.
            </p>
          </div>
          <div className="pt-2">
            <SearchBar />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
