"use client";

import { cn } from "@/lib/utils";

export function InlineEdit({
  value,
  onChange,
  className,
  as: Tag = "span",
  multiline = false,
  placeholder = "Дарж засна",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
  multiline?: boolean;
  placeholder?: string;
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={Math.max(2, value.split("\n").length)}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full resize-none bg-[#e31e24]/10 outline-none ring-2 ring-transparent focus:ring-[#e31e24]/50 rounded-md px-2 py-1",
          className
        )}
      />
    );
  }

  const El = Tag;
  return (
    <El
      contentEditable
      suppressContentEditableWarning
      onClick={(e) => e.stopPropagation()}
      onBlur={(e) => onChange(e.currentTarget.textContent?.trim() || "")}
      className={cn(
        "outline-none focus:ring-2 focus:ring-[#e31e24]/50 rounded px-1 -mx-1 cursor-text empty:before:text-[#ffffff35]",
        !value && "before:content-[attr(data-placeholder)]",
        className
      )}
      data-placeholder={placeholder}
    >
      {value || "\u00A0"}
    </El>
  );
}
