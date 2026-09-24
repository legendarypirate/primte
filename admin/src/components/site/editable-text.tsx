"use client";

import { InlineEdit } from "@/components/site-editor/inline-edit";
import { cn } from "@/lib/utils";
import { usePageContent } from "./page-content-context";

export function EditableText({
  field,
  defaultValue,
  as = "span",
  multiline = false,
  className,
  placeholder = "Дарж засна",
}: {
  field: string;
  defaultValue: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  multiline?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const ctx = usePageContent();
  const value = ctx ? ctx.getField(field, defaultValue) : defaultValue;

  if (!ctx?.editing) {
    const El = as;
    if (multiline && as === "span") {
      return <p className={cn("whitespace-pre-line", className)}>{value}</p>;
    }
    return <El className={className}>{value}</El>;
  }

  return (
    <span className={cn("group/edit relative inline-block max-w-full", multiline && "block w-full")}>
      <InlineEdit
        value={value}
        onChange={(v) => ctx.setField(field, v)}
        as={as}
        multiline={multiline}
        className={cn(
          "ring-1 ring-[#e31e24]/30 group-hover/edit:ring-[#e31e24]/60",
          multiline && "block w-full",
          className
        )}
        placeholder={placeholder}
      />
    </span>
  );
}
