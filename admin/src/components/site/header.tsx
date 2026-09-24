"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteNav } from "@/lib/site-nav";
import { PrimeLogo, RedButton } from "./primitives";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-[#ffffff15] bg-[#070707]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="shrink-0 transition-transform hover:scale-105">
          <PrimeLogo compact />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {siteNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 text-xs font-bold uppercase tracking-[0.15em] transition-colors",
                  active ? "text-[#e31e24]" : "text-[#a0a0a5] hover:text-white"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#e31e24]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Хайх..."
                className="h-9 w-40 rounded-lg border border-[#e31e24]/40 bg-[#141416] px-3 py-1 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24] sm:w-56"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-1 p-1 text-muted-foreground hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5] transition-colors hover:border-[#e31e24]/40 hover:text-white"
              aria-label="Search"
            >
              <Search className="size-4" />
            </button>
          )}

          <RedButton href="/training" className="hidden h-9 px-4 text-[11px] sm:inline-flex">
            БҮРТГҮҮЛЭХ
          </RedButton>

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-muted-foreground lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="size-5 text-white" /> : <Menu className="size-5 text-white" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#ffffff15] bg-[#0c0c0e] px-4 py-5 lg:hidden">
          <nav className="flex flex-col gap-3">
            {siteNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-2 text-sm font-bold uppercase tracking-wider",
                  pathname === item.href ? "text-[#e31e24]" : "text-[#a0a0a5] hover:text-white"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <RedButton href="/training" className="w-full justify-center">
                БҮРТГҮҮЛЭХ
              </RedButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
