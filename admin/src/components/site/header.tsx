"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, Settings2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/api";
import type { SiteHeaderData } from "@/lib/site-layout";
import { DEFAULT_HEADER } from "@/lib/site-layout";
import { InlineEdit } from "@/components/site-editor/inline-edit";
import { EditableImage } from "@/components/site-editor/editable-image";
import { PrimeLogo, RedButton } from "./primitives";

type EditCtx = {
  onChange: (header: SiteHeaderData) => void;
  onOpenSettings?: () => void;
};

function patchHeader(h: SiteHeaderData, key: keyof SiteHeaderData, value: unknown): SiteHeaderData {
  return { ...h, [key]: value };
}

export function SiteHeader({
  header = DEFAULT_HEADER,
  edit,
}: {
  header?: SiteHeaderData;
  edit?: EditCtx;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navItems = header.navItems?.length ? header.navItems : DEFAULT_HEADER.navItems;
  const logoSrc = header.logoUrl ? assetUrl(header.logoUrl) : "";

  return (
    <header className={cn("sticky top-0 z-50 border-b border-[#1B7F4E22] bg-white/95 backdrop-blur-md", edit && "ring-1 ring-inset ring-[#1B7F4E]/20")}>
      {edit ? (
        <div className="flex items-center justify-between border-b border-[#1B7F4E14] bg-[#E8F4EC] px-4 py-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B7F4E]">Header / Navbar</span>
          {edit.onOpenSettings ? (
            <button
              type="button"
              onClick={edit.onOpenSettings}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] text-[#4A6558] hover:bg-[#1B7F4E10] hover:text-[#143326]"
            >
              <Settings2 className="size-3" />
              Тохиргоо
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/" className="relative shrink-0 transition-transform hover:scale-105">
          {edit ? (
            <div className="flex items-center gap-2">
              <div className="relative size-10 overflow-hidden rounded-xl border border-[#1B7F4E]/40">
                <EditableImage
                  value={header.logoUrl || ""}
                  onChange={(v) => edit.onChange(patchHeader(header, "logoUrl", v))}
                  edit
                  fill
                  imgClassName="object-cover"
                  placeholder="Logo"
                />
              </div>
              <div className="flex flex-col">
                <InlineEdit
                  value={header.brandName || ""}
                  onChange={(v) => edit.onChange(patchHeader(header, "brandName", v))}
                  className="font-heading text-base font-black tracking-[0.18em] text-[#143326]"
                />
                <InlineEdit
                  value={header.brandSubtitle || ""}
                  onChange={(v) => edit.onChange(patchHeader(header, "brandSubtitle", v))}
                  className="text-[8px] tracking-[0.2em] text-[#1B7F4E]"
                />
              </div>
            </div>
          ) : (
            <PrimeLogo
              compact
              logoUrl={logoSrc}
              brandName={header.brandName}
              brandBadge={header.brandBadge}
              brandSubtitle={header.brandSubtitle}
            />
          )}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => {
            const baseHref = item.href.split("#")[0] || "/";
            const active =
              baseHref === "/"
                ? pathname === "/"
                : pathname === baseHref || pathname.startsWith(`${baseHref}/`);
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "relative py-1 text-xs font-bold uppercase tracking-[0.15em] transition-colors",
                  active ? "text-[#1B7F4E]" : "text-[#4A6558] hover:text-[#143326]"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1B7F4E]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {(header.showSearch !== false || edit) && (
            searchOpen ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Хайх..."
                  className="h-9 w-40 rounded-lg border border-[#1B7F4E]/40 bg-white px-3 py-1 text-xs text-[#143326] placeholder-muted-foreground outline-none focus:border-[#1B7F4E] sm:w-56"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-1 p-1 text-muted-foreground hover:text-[#143326]"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex size-9 items-center justify-center rounded-lg border border-[#1B7F4E22] bg-white text-[#4A6558] transition-colors hover:border-[#1B7F4E]/40 hover:text-[#143326]"
                aria-label="Search"
              >
                <Search className="size-4" />
              </button>
            )
          )}

          {edit ? (
            <span className="hidden h-9 items-center rounded-lg bg-[#1B7F4E] px-4 text-[11px] font-bold uppercase text-white sm:inline-flex">
              <InlineEdit
                value={header.ctaText || ""}
                onChange={(v) => edit.onChange(patchHeader(header, "ctaText", v))}
                placeholder="CTA"
              />
            </span>
          ) : (
            <RedButton href={header.ctaHref || "/training"} className="hidden h-9 px-4 text-[11px] sm:inline-flex">
              {header.ctaText || "БҮРТГҮҮЛЭХ"}
            </RedButton>
          )}

          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-lg border border-[#1B7F4E22] bg-white text-muted-foreground lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="size-5 text-[#143326]" /> : <Menu className="size-5 text-[#143326]" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#1B7F4E22] bg-white px-4 py-5 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "py-2 text-sm font-bold uppercase tracking-wider",
                  pathname === item.href ? "text-[#1B7F4E]" : "text-[#4A6558] hover:text-[#143326]"
                )}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <RedButton href={header.ctaHref || "/training"} className="w-full justify-center">
                {header.ctaText || "БҮРТГҮҮЛЭХ"}
              </RedButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
