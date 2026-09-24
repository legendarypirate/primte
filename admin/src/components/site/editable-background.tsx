"use client";

import { EditableImage } from "@/components/site-editor/editable-image";
import { assetUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { usePageContent } from "./page-content-context";

export function EditableBackground({
  field,
  className,
  fallbackClassName = "bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707]",
  imageClassName = "object-cover opacity-50",
  overlayClassName = "bg-gradient-to-t from-[#0d0d0f]/95 via-[#0d0d0f]/50 to-[#0d0d0f]/20",
  placeholder = "Background зураг",
  editMode = "cover",
  children,
}: {
  field: string;
  className?: string;
  fallbackClassName?: string;
  imageClassName?: string;
  overlayClassName?: string;
  placeholder?: string;
  /** cover = full-area upload; corner = small control so text stays clickable */
  editMode?: "cover" | "corner";
  children?: React.ReactNode;
}) {
  const ctx = usePageContent();
  const url = ctx?.getField(field, "") ?? "";
  const src = assetUrl(url);
  const editing = ctx?.editing;

  return (
    <div className={cn("relative overflow-hidden", className, !src && fallbackClassName)}>
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className={cn("absolute inset-0 size-full", imageClassName)} />
          <div className={cn("pointer-events-none absolute inset-0", overlayClassName)} />
        </>
      ) : null}

      {editing && editMode === "cover" ? (
        <EditableImage
          value={url}
          onChange={(v) => ctx!.setField(field, v)}
          edit
          fill
          placeholder={placeholder}
          imgClassName={cn("object-cover", url ? "opacity-40" : "opacity-20")}
          className="z-[2]"
        />
      ) : null}
      {editing && editMode === "corner" ? (
        <div className="absolute right-2 top-2 z-[5]">
          <EditableImage
            value={url}
            onChange={(v) => ctx!.setField(field, v)}
            edit
            placeholder={placeholder}
            className="h-16 w-24 overflow-hidden rounded-lg border border-[#e31e24]/50 shadow-lg"
            imgClassName="object-cover"
          />
        </div>
      ) : null}

      {children}
    </div>
  );
}
