"use client";

import { X } from "lucide-react";
import type { SiteBlock } from "@/lib/site-blocks";
import { BLOCK_SCHEMA_MAP } from "@/lib/site-blocks";
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
      <div className="flex-1 overflow-y-auto p-4">
        {schema ? (
          <BlockFieldEditor fields={schema.fields} data={block.data} onChange={onChange} />
        ) : (
          <p className="text-sm text-[#a0a0a5]">Энэ блокийн schema олдсонгүй</p>
        )}
      </div>
    </aside>
  );
}
