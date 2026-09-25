"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { api, assetUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

export function MultiImageUpload({
  label = "Зургууд",
  value,
  onChange,
  folder = "prime",
}: {
  label?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}) {
  const [busy, setBusy] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(files: FileList) {
    const list = Array.from(files);
    const uploaded: string[] = [];
    setBusy((n) => n + list.length);
    for (const file of list) {
      try {
        const body = new FormData();
        body.append("file", file);
        body.append("folder", folder);
        const data = await api<{ url: string }>("/api/upload", { method: "POST", body });
        uploaded.push(data.url);
        onChange([...value, ...uploaded]);
      } catch (e) {
        toast.error(`${file.name}: ${e instanceof Error ? e.message : "Upload амжилтгүй"}`);
      } finally {
        setBusy((n) => n - 1);
      }
    }
  }

  function move(from: number, to: number) {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <Label>{label}</Label>
        <span className="text-xs text-muted-foreground">Эхний зураг нүүр зураг болно</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {value.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg border",
              i === 0 ? "border-primary" : "border-border"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={assetUrl(url)} alt="" className="size-full object-cover" />
            {i === 0 && (
              <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded bg-primary px-1 py-0.5 text-[10px] font-medium text-primary-foreground">
                <Star className="size-2.5" />
                Нүүр
              </span>
            )}
            <button
              type="button"
              aria-label="Устгах"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 rounded bg-black/70 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
            <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                aria-label="Зүүн тийш"
                disabled={i === 0}
                onClick={() => move(i, i - 1)}
                className="rounded bg-black/70 p-0.5 text-white disabled:invisible"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label="Баруун тийш"
                disabled={i === value.length - 1}
                onClick={() => move(i, i + 1)}
                className="rounded bg-black/70 p-0.5 text-white disabled:invisible"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
        {Array.from({ length: busy }).map((_, i) => (
          <div key={`busy-${i}`} className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <ImagePlus className="size-5" />
          Нэмэх
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) upload(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
