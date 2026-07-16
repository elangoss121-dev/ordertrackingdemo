import React from "react";
import { Compass, ShieldCheck, BarChart3, Download, History, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  const list = [
    {
      title: "Live Search & Tracking",
      description:
        "Public tracking allows anyone to search packages by ID instantly with visual status indicators.",
      icon: Compass,
    },
    {
      title: "Firebase Auth",
      description:
        "Seamlessly authenticate with email/password or Google Single Sign-On powered securely by Firebase.",
      icon: ShieldCheck,
    },
    {
      title: "Timeline Management",
      description:
        "Admin can add unlimited tracking updates with custom descriptions, dates, locations, and icons.",
      icon: History,
    },
    {
      title: "Interactive Analytics",
      description:
        "Visualize shipment trends with dynamic bar and pie charts in the admin analytics view.",
      icon: BarChart3,
    },
    {
      title: "Export & CSV Reports",
      description:
        "Instantly compile and download all order records into standardized CSV format in one click.",
      icon: Download,
    },
    {
      title: "Toast Notifications",
      description:
        "Instant responsive toaster logs for successful events, validation errors, and loading states.",
      icon: Bell,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            Platform Capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Features Tailored for Logistics
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            TrackSaaS provides all the tools you need to manage, monitor, and deliver orders efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card
                key={idx}
                className="glass-panel border-border/40 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 rounded-2xl"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
