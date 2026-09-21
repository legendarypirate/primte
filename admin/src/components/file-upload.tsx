"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api, assetUrl } from "@/lib/api";

export function FileUpload({
  label = "Файл / зураг",
  value,
  onChange,
  folder = "prime",
  accept = "image/*,application/pdf",
}: {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const preview = assetUrl(value);
  const isImage = Boolean(preview) && !/\.pdf(\?|$)/i.test(preview);

  async function upload(file: File) {
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const data = await api<{ url: string }>("/api/upload", { method: "POST", body });
      onChange(data.url);
      toast.success("Файл хууллаа");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload амжилтгүй");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="file"
        accept={accept}
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
      {busy && <p className="text-xs text-muted-foreground">Cloudinary руу хуулж байна...</p>}
      {preview && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="h-24 w-24 rounded-lg border border-border object-cover" />
      )}
      {preview && !isImage && (
        <a href={preview} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
          Файл харах
        </a>
      )}
    </div>
  );
}
