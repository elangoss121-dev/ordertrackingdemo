import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/30 py-8 mt-auto backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              TrackSaaS
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Order Tracking System. All rights reserved.
          </p>

          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
