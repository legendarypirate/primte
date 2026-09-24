"use client";

import { X } from "lucide-react";
import type { SiteFooterData, SiteHeaderData } from "@/lib/site-layout";
import { FOOTER_FIELDS, HEADER_FIELDS } from "@/lib/site-layout";
import { BlockFieldEditor } from "@/components/site-editor/field-editor";
import { Button } from "@/components/ui/button";

type Section = "header" | "footer";

export function LayoutInspector({
  section,
  header,
  footer,
  onHeaderChange,
  onFooterChange,
  onClose,
}: {
  section: Section;
  header: SiteHeaderData;
  footer: SiteFooterData;
  onHeaderChange: (data: SiteHeaderData) => void;
  onFooterChange: (data: SiteFooterData) => void;
  onClose: () => void;
}) {
  const isHeader = section === "header";

  return (
    <div className="fixed inset-y-0 right-0 z-[110] flex w-full max-w-md flex-col border-l border-[#ffffff15] bg-[#0e0e10] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#ffffff10] px-4 py-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#e31e24]">
            {isHeader ? "Header / Navbar" : "Footer"}
          </p>
          <p className="text-[11px] text-[#a0a0a5]">Бүх хуудсанд харагдана</p>
        </div>
        <Button type="button" size="icon" variant="ghost" className="size-8 text-[#a0a0a5]" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isHeader ? (
          <BlockFieldEditor
            fields={HEADER_FIELDS}
            data={header as unknown as Record<string, unknown>}
            onChange={(data) => onHeaderChange(data as unknown as SiteHeaderData)}
          />
        ) : (
          <BlockFieldEditor
            fields={FOOTER_FIELDS}
            data={{
              ...footer,
              mottoLines: footer.mottoLines.join("\n"),
              badges: footer.badges.join("\n"),
            }}
            onChange={(data) => {
              const mottoLines = String(data.mottoLines || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              const badges = String(data.badges || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);
              onFooterChange({ ...(data as unknown as SiteFooterData), mottoLines, badges });
            }}
          />
        )}
      </div>
    </div>
  );
}
