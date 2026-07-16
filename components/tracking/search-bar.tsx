"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
}

export function SearchBar({
  initialValue = "",
  placeholder = "Enter your Order ID (e.g. J260101)...",
  onSearch,
  isLoading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    if (onSearch) {
      onSearch(trimmedQuery);
    } else {
      router.push(`/track/${trimmedQuery}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-muted-foreground">
          <Search className="h-5 w-5" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-32 h-14 text-base md:text-lg rounded-2xl border-border bg-card/80 shadow-md backdrop-blur-md focus-visible:ring-primary focus-visible:border-transparent transition-all"
        />
        <div className="absolute right-2">
          <Button
            type="submit"
            size="lg"
            className="rounded-xl h-10 px-6 font-semibold tracking-tight shadow-sm active:scale-95 transition-all"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tracking...
              </>
            ) : (
              "Track Now"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
