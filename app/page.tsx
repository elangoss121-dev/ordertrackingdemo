import React from "react";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { TimelinePreview } from "@/components/home/timeline-preview";
import { Testimonials } from "@/components/home/testimonials";
import { FAQ } from "@/components/home/faq";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background">
        <Hero />
        <Features />
        <TimelinePreview />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
