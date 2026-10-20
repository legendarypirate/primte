"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import { FieldSelect } from "@/components/field-select";
import { cn } from "@/lib/utils";

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function matchesQuery(query: string, values: Array<string | number | null | undefined>) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return values.some((value) => String(value ?? "").toLowerCase().includes(q));
}

export function useClientTable<T>(rows: T[], options?: { pageSize?: number; resetKey?: unknown }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(options?.pageSize ?? 20);
  const [seenKey, setSeenKey] = useState(options?.resetKey);

  if (seenKey !== options?.resetKey) {
    setSeenKey(options?.resetKey);
    setPage(1);
  }

  function setPageSize(size: number) {
    setPageSizeState(size);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * pageSize;
  const visible = useMemo(() => rows.slice(start, start + pageSize), [rows, start, pageSize]);

  return {
    page: currentPage,
    setPage,
    pageSize,
    setPageSize,
    pageCount,
    total: rows.length,
    from: rows.length ? start + 1 : 0,
    to: Math.min(start + pageSize, rows.length),
    visible,
  };
}

export function DataTable({
  search,
  onSearchChange,
  searchPlaceholder = "Хайх...",
  filters,
  extra,
  unit = "мөр",
  total,
  page,
  pageCount,
  onPageChange,
  pageSize,
  onPageSizeChange,
  from,
  to,
  children,
}: {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  extra?: ReactNode;
  unit?: string;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  from: number;
  to: number;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {onSearchChange ? (
          <div className="relative min-w-50 max-w-sm flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder={searchPlaceholder}
              value={search ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        ) : null}
        {filters}
        <div className="ml-auto text-sm text-muted-foreground">
          {total} {unit} · хуудас {page}/{pageCount}
        </div>
      </div>
      {extra}
      {children}
      {total > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {from}–{to} / {total}
          </p>
          <div className="flex items-center gap-2">
            <FieldSelect className="w-[4.5rem]" value={String(pageSize)} onChange={(value) => onPageSizeChange(Number(value))}>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </FieldSelect>
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              Өмнөх
            </Button>
            <Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
              Дараах
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SortHead({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  const Icon = !active ? ChevronsUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead>
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:text-foreground">
        {label}
        <Icon className={cn("size-3.5", active ? "text-foreground" : "text-muted-foreground")} />
      </button>
    </TableHead>
  );
}

export function TableEmpty({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-10 text-center text-muted-foreground">
        {children}
      </TableCell>
    </TableRow>
  );
}
