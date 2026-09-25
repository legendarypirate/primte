"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { EditableImage } from "@/components/site-editor/editable-image";
import { api, assetUrl } from "@/lib/api";
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
    <div
      className={cn(
        "relative overflow-hidden",
        className,
        !src && fallbackClassName,
        editing && editMode === "corner" && "group/bg outline-1 outline-dashed outline-transparent hover:outline-[#e31e24]/40"
      )}
    >
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className={cn("pointer-events-none absolute inset-0 size-full", imageClassName)} />
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
        <CornerImageControl value={url} placeholder={placeholder} onChange={(v) => ctx!.setField(field, v)} />
      ) : null}

      {children}
    </div>
  );
}

function CornerImageControl({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "prime/site");
      const data = await api<{ url: string }>("/api/upload", { method: "POST", body });
      onChange(data.url);
      toast.success("Зураг хууллаа");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload амжилтгүй");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="absolute right-1.5 top-1.5 z-[20] flex gap-1 opacity-60 transition-opacity group-hover/bg:opacity-100"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        title={value ? "Background солих" : placeholder}
        aria-label={placeholder}
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="flex size-7 items-center justify-center rounded-md border border-[#e31e24]/60 bg-black/70 text-[#e31e24] shadow-md backdrop-blur hover:bg-[#e31e24] hover:text-white"
      >
        {busy ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
      </button>
      {value ? (
        <button
          type="button"
          title="Background устгах"
          aria-label="Background устгах"
          onClick={() => onChange("")}
          className="flex size-7 items-center justify-center rounded-md border border-white/20 bg-black/70 text-white shadow-md backdrop-blur hover:bg-black"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
