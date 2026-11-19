"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { GripVertical, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { TableEmpty } from "@/components/data-table";
import { categoryDescendantIds, type ProductCategory } from "@/lib/products";
import { cn } from "@/lib/utils";

export function CategoryTable({
  rows,
  canDrag,
  onReorder,
  onEdit,
  onDelete,
  onAddChild,
}: {
  rows: ProductCategory[];
  canDrag: boolean;
  onReorder: (activeId: string, overId: string) => void;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
  onAddChild: (parentId: string) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const ids = useMemo(() => rows.map((row) => row.id), [rows]);
  const hiddenIds = useMemo(() => {
    if (!activeId) return new Set<string>();
    return new Set(categoryDescendantIds(rows, activeId));
  }, [activeId, rows]);
  const active = rows.find((row) => row.id === activeId) || null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const overId = event.over?.id ? String(event.over.id) : null;
    const draggedId = String(event.active.id);
    setActiveId(null);
    if (!overId || overId === draggedId || hiddenIds.has(overId)) return;
    onReorder(draggedId, overId);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-20">Эрэмбэ</TableHead>
            <TableHead>Нэр</TableHead>
            <TableHead>Эцэг</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Бараа</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <TableBody>
            {rows.map((category) => (
              <SortableCategoryRow
                key={category.id}
                category={category}
                canDrag={canDrag}
                hidden={hiddenIds.has(category.id)}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddChild={onAddChild}
              />
            ))}
            {rows.length === 0 && <TableEmpty colSpan={7}>Ангилал алга.</TableEmpty>}
          </TableBody>
        </SortableContext>
      </Table>
      <DragOverlay>
        {active ? (
          <div className="rounded-md border bg-card px-3 py-2 text-sm font-medium shadow-md">
            {active.name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function SortableCategoryRow({
  category,
  canDrag,
  hidden,
  onEdit,
  onDelete,
  onAddChild,
}: {
  category: ProductCategory;
  canDrag: boolean;
  hidden: boolean;
  onEdit: (category: ProductCategory) => void;
  onDelete: (category: ProductCategory) => void;
  onAddChild: (parentId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
    disabled: !canDrag,
  });

  return (
    <TableRow
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "cursor-pointer",
        (isDragging || hidden) && "opacity-40",
        isDragging && "bg-muted/80"
      )}
      onClick={() => onEdit(category)}
    >
      <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={cn(
            "flex size-8 items-center justify-center rounded-md text-muted-foreground",
            canDrag ? "cursor-grab hover:bg-muted active:cursor-grabbing" : "cursor-not-allowed opacity-40"
          )}
          aria-label="Чирж эрэмбэлэх"
          title={canDrag ? "Чирж эрэмбэлэх" : "Хайлт идэвхтэй үед чирэх боломжгүй"}
          disabled={!canDrag}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </TableCell>
      <TableCell className="text-muted-foreground">#{category.sortOrder}</TableCell>
      <TableCell className="font-medium">
        <span className="inline-flex items-center gap-2" style={{ paddingLeft: `${(category.depth ?? 0) * 1.25}rem` }}>
          {(category.depth ?? 0) > 0 && <span className="text-muted-foreground">└</span>}
          {category.name}
          {(category.childCount ?? 0) > 0 && (
            <Badge variant="secondary" className="font-normal">
              {category.childCount} дэд
            </Badge>
          )}
        </span>
      </TableCell>
      <TableCell className="text-muted-foreground">{category.parentName || "—"}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{category.slug}</TableCell>
      <TableCell>{category.totalProductCount ?? category.productCount}</TableCell>
      <TableCell onClick={(e) => e.stopPropagation()}>
        <ActionCell>
          <Button
            type="button"
            size="icon-sm"
            variant="outline"
            title="Дэд ангилал"
            aria-label="Дэд ангилал"
            className="size-8 shrink-0 rounded-md text-muted-foreground shadow-sm"
            onClick={() => onAddChild(category.id)}
          >
            <Plus />
          </Button>
          <IconActionButton action="edit" onClick={() => onEdit(category)} />
          <IconActionButton action="delete" onClick={() => onDelete(category)} />
        </ActionCell>
      </TableCell>
    </TableRow>
  );
}
