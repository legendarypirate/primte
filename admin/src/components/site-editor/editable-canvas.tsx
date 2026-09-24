"use client";

import {
  ArrowDown,
  ArrowUp,
  Copy,
  GripVertical,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";
import type { SiteBlock } from "@/lib/site-blocks";
import { BLOCK_SCHEMA_MAP } from "@/lib/site-blocks";
import { BlockRenderer } from "@/components/site/block-renderer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  blocks: SiteBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, patch: Partial<SiteBlock>) => void;
  onMoveBlock: (index: number, dir: -1 | 1) => void;
  onDuplicateBlock: (block: SiteBlock) => void;
  onRemoveBlock: (id: string) => void;
  onOpenInspector: (id: string) => void;
  onAddBlockAt: (index: number) => void;
};

export function EditableCanvas({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onMoveBlock,
  onDuplicateBlock,
  onRemoveBlock,
  onOpenInspector,
  onAddBlockAt,
}: Props) {
  return (
    <div className="relative bg-[#070707] text-[#f4f1ea]">
      {blocks.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-[#a0a0a5]">Энэ хуудас хоосон байна</p>
          <Button
            type="button"
            className="bg-[#e31e24] hover:bg-[#c91920]"
            onClick={() => onAddBlockAt(0)}
          >
            <Plus className="size-4" />
            Эхний блок нэмэх
          </Button>
        </div>
      ) : null}

      {blocks.map((block, index) => {
        const selected = block.id === selectedBlockId;
        const schema = BLOCK_SCHEMA_MAP[block.type];

        return (
          <div key={block.id} className="group/block relative">
            {/* Insert gap between blocks */}
            <div className="relative h-0">
              <button
                type="button"
                onClick={() => onAddBlockAt(index)}
                className="absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-full border border-dashed border-[#e31e24]/40 bg-[#0e0e10] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e31e24] opacity-0 transition-opacity hover:border-[#e31e24] group-hover/block:opacity-100"
              >
                <Plus className="size-3" />
                Блок
              </button>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelectBlock(block.id)}
              onKeyDown={(e) => e.key === "Enter" && onSelectBlock(block.id)}
              className={cn(
                "relative transition-all",
                selected
                  ? "ring-2 ring-inset ring-[#e31e24] shadow-[0_0_0_1px_#e31e24]"
                  : "hover:ring-2 hover:ring-inset hover:ring-[#e31e24]/40"
              )}
            >
              {/* Block toolbar */}
              <div
                className={cn(
                  "absolute right-4 top-4 z-30 flex items-center gap-1 rounded-lg border border-[#ffffff20] bg-[#0e0e10]/95 p-1 shadow-xl backdrop-blur transition-opacity",
                  selected ? "opacity-100" : "opacity-0 group-hover/block:opacity-100"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="flex items-center gap-1 px-2 text-[10px] font-bold uppercase tracking-wider text-[#e31e24]">
                  <GripVertical className="size-3" />
                  {schema?.label || block.type}
                </span>
                <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0" disabled={index === 0} onClick={() => onMoveBlock(index, -1)}>
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0" disabled={index === blocks.length - 1} onClick={() => onMoveBlock(index, 1)}>
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onOpenInspector(block.id)}>
                  <Settings2 className="size-3.5" />
                </Button>
                <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => onDuplicateBlock(block)}>
                  <Copy className="size-3.5" />
                </Button>
                <Button type="button" size="sm" variant="ghost" className="h-7 w-7 p-0 text-[#e31e24]" onClick={() => onRemoveBlock(block.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              <BlockRenderer
                block={block}
                edit={{
                  onChange: (data) => onUpdateBlock(block.id, { data }),
                }}
              />
            </div>
          </div>
        );
      })}

      {blocks.length > 0 ? (
        <div className="flex justify-center py-8">
          <Button
            type="button"
            variant="outline"
            className="border-[#e31e24]/40 text-[#e31e24] hover:bg-[#e31e24]/10"
            onClick={() => onAddBlockAt(blocks.length)}
          >
            <Plus className="size-4" />
            Блок нэмэх
          </Button>
        </div>
      ) : null}
    </div>
  );
}
