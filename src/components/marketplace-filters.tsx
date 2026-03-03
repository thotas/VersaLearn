"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketplaceFiltersProps {
  categories: string[];
  levels: string[];
  currentCategory?: string;
  currentLevel?: string;
  currentQuery?: string;
}

export function MarketplaceFilters({
  categories,
  levels,
  currentCategory,
  currentLevel,
  currentQuery,
}: MarketplaceFiltersProps) {
  const router = useRouter();
  const [query, setQuery] = useState(currentQuery || "");

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams();
      const cat = key === "category" ? value : currentCategory;
      const lvl = key === "level" ? value : currentLevel;
      const q = key === "q" ? value : query;

      if (cat && cat !== "All") params.set("category", cat);
      if (lvl && lvl !== "All") params.set("level", lvl);
      if (q) params.set("q", q);

      router.push(`/marketplace?${params.toString()}`);
    },
    [router, currentCategory, currentLevel, query]
  );

  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateFilters("q", query);
          }}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              updateFilters("q", "");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateFilters("category", cat)}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
              (currentCategory === cat || (!currentCategory && cat === "All"))
                ? "bg-indigo-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Level filters */}
      <div className="flex flex-wrap gap-2">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => updateFilters("level", lvl)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
              (currentLevel === lvl || (!currentLevel && lvl === "All"))
                ? "bg-zinc-600 text-white"
                : "bg-zinc-800/50 text-zinc-500 hover:bg-zinc-700/50 hover:text-zinc-300"
            )}
          >
            {lvl === "All" ? "All Levels" : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
