import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      q: "How does the Order ID naming scheme work?",
      a: "Our system generates order identifiers based on date matrices: Month Code (January = A, July = J, etc.) + Year (2-digit) + Day (2-digit) + Order Number (2-digit). If duplicate Order IDs exist for different customers, suffixes like -1 or -2 are automatically appended so logs are never mixed.",
    },
    {
      q: "Can I search my orders without creating an account?",
      a: "Yes! Public order tracking is open to everyone. Just input your Order ID on the Home or Track page to view its status, estimated delivery window, location logs, and progress checkpoints.",
    },
    {
      q: "What role divisions are configured in the dashboard?",
      a: "We have two core roles: Admin and User. Admins can create/edit/delete shipments, append timeline updates, view global stats, search user logs, and export CSVs. Users can view their personalized shipment dashboard, search their order history, and download PDF/print receipts.",
    },
    {
      q: "Is Google Sign-In supported?",
      a: "Yes! TrackSaaS integrates Firebase Client Auth for social authentication. Simply click 'Continue with Google' to create an account or sign in securely.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary">
            Support Center
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="glass-panel border-border/40 px-6 rounded-2xl border"
            >
              <AccordionTrigger className="text-base font-bold text-foreground hover:no-underline tracking-tight text-left py-4">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
