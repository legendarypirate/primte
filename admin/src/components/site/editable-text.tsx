"use client";

import { cn } from "@/lib/utils";
import { usePageContent } from "./page-content-context";

const editChrome =
  "rounded-md border border-dashed border-[#e31e24]/50 bg-[#e31e24]/8 px-2 py-1 outline-none transition-colors hover:border-[#e31e24] focus:border-[#e31e24] focus:bg-[#e31e24]/12 focus:ring-2 focus:ring-[#e31e24]/30";

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
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "li" | "blockquote" | "label" | "div";
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

  const onChange = (v: string) => ctx.setField(field, v);

  if (multiline) {
    return (
      <textarea
        value={value}
        placeholder={placeholder}
        rows={Math.max(2, value.split("\n").length + 1)}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onChange(e.target.value)}
        className={cn(editChrome, "block w-full resize-y min-h-[2.5rem]", className)}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
      onChange={(e) => onChange(e.target.value)}
      className={cn(editChrome, "block w-full min-w-[3rem]", className)}
    />
  );
}
