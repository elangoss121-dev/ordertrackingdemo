import React from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { LayoutDashboard, Package, User, Settings } from "lucide-react";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarLinks = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Shipments", href: "/dashboard/orders", icon: Package },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      <Header />
      <div className="flex-1 bg-gradient-to-b from-background via-secondary/15 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1 space-y-2">
              <div className="glass-panel border-border/40 p-4 rounded-3xl space-y-1 bg-card/60 shadow-md">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 block mb-3">
                  Account Console
                </span>
                <nav className="space-y-1">
                  {sidebarLinks.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={idx}
                        href={link.href}
                        className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all hover:bg-accent/50 text-muted-foreground hover:text-foreground active:scale-[0.98]"
                      >
                        <Icon className="h-4.5 w-4.5 text-primary" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Dashboard Workspace */}
            <main className="lg:col-span-3 space-y-8">{children}</main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
