import React from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-background via-secondary/10 to-background">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-border/40 shadow-2xl relative z-10 bg-card/60">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
