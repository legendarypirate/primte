"use client";

import { ImageIcon, X } from "lucide-react";
import type { SiteBlock } from "@/lib/site-blocks";
import { BLOCK_SCHEMA_MAP } from "@/lib/site-blocks";
import { schemaHasImages } from "@/lib/block-images";
import { BlockFieldEditor } from "@/components/site-editor/field-editor";
import { Button } from "@/components/ui/button";

export function BlockInspector({
  block,
  onClose,
  onChange,
}: {
  block: SiteBlock;
  onClose: () => void;
  onChange: (data: Record<string, unknown>) => void;
}) {
  const schema = BLOCK_SCHEMA_MAP[block.type];
  const hasImages = schemaHasImages(schema);

  return (
    <aside className="fixed bottom-0 right-0 top-14 z-[90] flex w-full max-w-md flex-col border-l border-[#ffffff15] bg-[#0e0e10]/98 shadow-2xl backdrop-blur-md sm:top-[57px]">
      <div className="flex items-center justify-between border-b border-[#ffffff15] px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">{schema?.label || block.type}</p>
          <p className="text-xs text-[#a0a0a5]">Дэлгэрэнгүй тохиргоо</p>
        </div>
        <Button type="button" size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {schema ? (
          <>
            {hasImages ? (
              <div className="rounded-lg border border-[#e31e24]/30 bg-[#e31e24]/5 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#e31e24]">
                  <ImageIcon className="size-4" />
                  Зураг
                </div>
                <BlockFieldEditor fields={schema.fields} data={block.data} onChange={onChange} imageOnly />
              </div>
            ) : null}
            <div>
              {hasImages ? <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Бусад</p> : null}
              <BlockFieldEditor fields={schema.fields} data={block.data} onChange={onChange} excludeImages={hasImages} />
            </div>
          </>
        ) : (
          <p className="text-sm text-[#a0a0a5]">Энэ блокийн schema олдсонгүй</p>
        )}
      </div>
    </aside>
  );
}
