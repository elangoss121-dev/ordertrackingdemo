import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Operations Manager at TechCorp",
      content:
        "The automated Order ID suffix generation is an absolute lifesaver. Conflict-free logistics scheduling has never been easier.",
      avatar: "",
    },
    {
      name: "Michael Chen",
      role: "E-commerce Founder",
      content:
        "Our clients love the simplicity of search tracking. Public tracking without logging in has reduced support tickets by 45%.",
      avatar: "",
    },
    {
      name: "Elena Rostova",
      role: "Logistics Specialist",
      content:
        "Admin control allows unlimited logs. We record packed stages, ready checkpoints, and local hub dispatches perfectly.",
      avatar: "",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            Customer Success
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Trusted by Modern E-commerce
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <Card
              key={idx}
              className="glass-panel border-border/40 hover:scale-[1.02] transition-transform duration-300 rounded-2xl"
            >
              <CardContent className="p-6 space-y-6">
                <div className="flex space-x-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
                <div className="flex items-center space-x-3 pt-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {rev.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{rev.name}</h4>
                    <p className="text-xs text-muted-foreground">{rev.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
