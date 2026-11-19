"use client";

import { Children, isValidElement, type ReactNode } from "react";
import { MSelect } from "@/components/custom/fields";

function optionLabel(children: ReactNode): string {
  if (children == null || children === false) return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(optionLabel).join("");
  if (isValidElement<{ children?: ReactNode }>(children)) return optionLabel(children.props.children);
  return "";
}

function optionsFromChildren(children: ReactNode) {
  const options: Array<{ label: string; value: string; disabled?: boolean; searchText?: string }> = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<{ value?: string | number; disabled?: boolean; children?: ReactNode; "data-search"?: string }>(child)) return;
    if (child.type !== "option") return;
    const label = optionLabel(child.props.children);
    options.push({
      value: String(child.props.value ?? ""),
      label,
      disabled: child.props.disabled,
      searchText: child.props["data-search"] || label,
    });
  });
  return options;
}

export function FieldSelect({
  value,
  onChange,
  children,
  className,
  searchable = false,
  searchPlaceholder,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}) {
  const options = optionsFromChildren(children);
  const empty = options.find((option) => option.value === "");
  return (
    <MSelect
      options={options}
      value={value}
      onValueChange={(next) => onChange(next ?? "")}
      placeholder={empty?.label || "Сонгоно уу"}
      className={className}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
    />
  );
}
