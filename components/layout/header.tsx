"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, User, LogOut, LayoutDashboard, Menu, X, ShieldAlert } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function Header() {
  const { user, refreshUser } = useCurrentUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      toast.success(res.message);
      await refreshUser();
      router.push("/");
    } else {
      toast.error(res.error);
    }
  };

  const dashboardLink = user?.role === "ADMIN" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 w-full glass-nav backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md text-white">
                <Package className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                TrackSaaS
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/track"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Track Order
            </Link>
            {user && (
              <Link
                href={dashboardLink}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Action buttons & Avatar */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photo || undefined} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardLink} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`${dashboardLink}/profile`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem className="text-amber-600 dark:text-amber-400">
                      <ShieldAlert className="mr-2 h-4 w-4" />
                      <span>Admin View</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild className="rounded-xl">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="rounded-xl shadow-sm">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t animate-slide-up py-4 px-4 space-y-3">
          <Link
            href="/"
            className="block px-3 py-2 rounded-xl text-base font-medium text-foreground hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/track"
            className="block px-3 py-2 rounded-xl text-base font-medium text-foreground hover:bg-accent"
            onClick={() => setMobileMenuOpen(false)}
          >
            Track Order
          </Link>
          {user && (
            <Link
              href={dashboardLink}
              className="block px-3 py-2 rounded-xl text-base font-medium text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          <div className="border-t pt-3 flex flex-col space-y-2">
            {user ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photo || undefined} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                <Button variant="outline" asChild className="rounded-xl w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href={`${dashboardLink}/profile`}>Profile Settings</Link>
                </Button>
                <Button variant="destructive" className="rounded-xl w-full" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="rounded-xl w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="rounded-xl w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
