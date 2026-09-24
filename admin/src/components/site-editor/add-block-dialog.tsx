"use client";

import { BLOCK_SCHEMAS, newBlock, type SiteBlock } from "@/lib/site-blocks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AddBlockDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (block: SiteBlock) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Блок нэмэх</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          {BLOCK_SCHEMAS.map((schema) => (
            <button
              key={schema.type}
              type="button"
              className="rounded-lg border border-border p-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
              onClick={() => {
                onAdd(newBlock(schema.type));
                onOpenChange(false);
              }}
            >
              <p className="font-medium">{schema.label}</p>
              <p className="text-xs text-muted-foreground">{schema.description}</p>
            </button>
          ))}
        </div>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Болих</Button>
      </DialogContent>
    </Dialog>
  );
}
