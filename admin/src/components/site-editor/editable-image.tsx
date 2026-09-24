"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { api, assetUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

export function EditableImage({
  value,
  onChange,
  edit,
  alt = "",
  className,
  imgClassName,
  placeholder = "Зураг солих",
  folder = "prime/site",
  fill = false,
}: {
  value?: string | null;
  onChange?: (url: string) => void;
  edit?: boolean;
  alt?: string;
  className?: string;
  imgClassName?: string;
  placeholder?: string;
  folder?: string;
  fill?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const src = assetUrl(value);

  async function upload(file: File) {
    if (!onChange) return;
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const data = await api<{ url: string }>("/api/upload", { method: "POST", body });
      onChange(data.url);
      toast.success("Зураг хууллаа");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload амжилтгүй");
    } finally {
      setBusy(false);
    }
  }

  if (!edit) {
    if (!src) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fill ? "absolute inset-0 size-full object-cover" : "", imgClassName, className)}
      />
    );
  }

  return (
    <div
      className={cn("group/img relative", fill && "absolute inset-0", className)}
      onClick={(e) => e.stopPropagation()}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={cn("size-full object-cover", imgClassName)} />
      ) : (
        <div
          className={cn(
            "flex size-full min-h-[80px] items-center justify-center border-2 border-dashed border-[#e31e24]/50 bg-[#e31e24]/5",
            imgClassName
          )}
        >
          <ImagePlus className="size-6 text-[#e31e24]/60" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover/img:opacity-100">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#e31e24] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white"
        >
          <ImagePlus className="size-3.5" />
          {busy ? "Хуулж байна..." : placeholder}
        </button>
        {src && onChange ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-white"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
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
