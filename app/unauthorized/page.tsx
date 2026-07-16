import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function UnauthorizedPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-background via-secondary/10 to-background">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-600/5 blur-[120px] pointer-events-none" />

        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-border/40 shadow-2xl relative z-10 bg-card/60 text-center space-y-6">
          <div className="h-16 w-16 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Access Restricted</h1>
            <p className="text-muted-foreground text-sm font-semibold leading-relaxed">
              Your account lacks authorized credentials to view this dashboard workspace.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <Button asChild className="rounded-xl w-full">
              <Link href="/login">Switch Account</Link>
            </Button>
            <Button variant="ghost" asChild className="rounded-xl w-full">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4.5 w-4.5" />
                Return to Homepage
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
