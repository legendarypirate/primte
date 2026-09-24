"use client";

import { X } from "lucide-react";
import { FileUpload } from "@/components/file-upload";
import { assetUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageFieldEditor({
  label,
  value,
  onChange,
  folder = "prime/site",
}: {
  label: string;
  value: unknown;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const url = String(value ?? "");
  const preview = assetUrl(url);

  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/10 p-3">
      <Label>{label}</Label>
      <FileUpload label="Upload зураг" value={url || undefined} onChange={onChange} folder={folder} accept="image/*" />
      <div className="flex gap-2">
        <Input
          value={url}
          placeholder="Эсвэл URL оруулна"
          className="h-8 text-xs"
          onChange={(e) => onChange(e.target.value)}
        />
        {url ? (
          <Button type="button" size="sm" variant="ghost" className="h-8 shrink-0 px-2" onClick={() => onChange("")}>
            <X className="size-3.5" />
          </Button>
        ) : null}
      </div>
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="max-h-32 w-full rounded-lg border border-border object-cover" />
      ) : null}
    </div>
  );
}
