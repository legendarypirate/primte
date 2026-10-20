"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, ListFilter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableHead, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MInput } from "@/components/custom/fields";
import { FieldSelect } from "@/components/field-select";
import { cn } from "@/lib/utils";

export const PAGE_SIZE_OPTIONS = [20, 30, 40, 50, 100];

export const tableCardClass = "rounded-md border bg-card text-card-foreground";

export function matchesQuery(query: string, values: Array<string | number | null | undefined>) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return values.some((value) => String(value ?? "").toLowerCase().includes(q));
}

export function useClientTable<T>(rows: T[], options?: { pageSize?: number; resetKey?: unknown }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(options?.pageSize ?? 30);
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

function paginationItems(currentPage: number, totalPages: number): Array<number | string> {
  const pages: Array<number | string> = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  pages.push(1);
  let startPage: number;
  let endPage: number;
  if (currentPage <= 3) {
    startPage = 2;
    endPage = 5;
  } else if (currentPage >= totalPages - 2) {
    startPage = totalPages - 4;
    endPage = totalPages - 1;
  } else {
    startPage = currentPage - 1;
    endPage = currentPage + 1;
  }
  if (startPage > 2) pages.push("ellipsis-start");
  for (let i = startPage; i <= endPage; i++) {
    if (i > 1 && i < totalPages) pages.push(i);
  }
  if (endPage < totalPages - 1) pages.push("ellipsis-end");
  pages.push(totalPages);
  return pages;
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  isVisible = false,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  isVisible?: boolean;
}) {
  const pageNumbers = useMemo(
    () => paginationItems(currentPage, totalPages),
    [currentPage, totalPages]
  );
  if (!isVisible && totalPages <= 1) return null;

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage <= 1}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage <= 1 ? "opacity-50" : ""}
          />
        </PaginationItem>
        {pageNumbers.map((page) =>
          typeof page === "string" ? (
            <PaginationItem key={page}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink isActive={page === currentPage} onClick={() => onPageChange(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            disabled={currentPage >= totalPages}
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage >= totalPages ? "opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function TableFooterBar({
  total,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
  unit = "мэдээлэл",
  className,
}: {
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  unit?: string;
  className?: string;
}) {
  return (
    <div className={cn("border-t bg-background px-3 py-2", className)}>
      <div className="flex flex-col items-center justify-between gap-y-1 md:flex-row">
        <div className="text-center text-sm text-muted-foreground">
          Бүгд {total} {unit}, {page}-р хуудас / нийт {pageCount} хуудас
        </div>
        <div className="flex items-center justify-between gap-2">
          <FieldSelect className="h-9 w-[70px] cursor-pointer" value={String(pageSize)} onChange={(value) => onPageSizeChange(Number(value))}>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </FieldSelect>
          <TablePagination currentPage={page} totalPages={pageCount} onPageChange={onPageChange} isVisible />
        </div>
      </div>
    </div>
  );
}

export function DataTable({
  search,
  onSearchChange,
  searchPlaceholder = "Хайлт хийх",
  filters,
  extra,
  unit = "мэдээлэл",
  total,
  page,
  pageCount,
  onPageChange,
  pageSize,
  onPageSizeChange,
  onSearch,
  onClear,
  hasActiveFilters,
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
  from?: number;
  to?: number;
  onSearch?: () => void;
  onClear?: () => void;
  hasActiveFilters?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {onSearchChange || filters ? (
        <div className="flex w-full flex-col gap-3 rounded-lg border bg-muted/30 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <ListFilter className="size-4 shrink-0 text-muted-foreground" />
              {onSearchChange ? (
                <MInput
                  className="h-9 min-w-0 flex-1"
                  placeholder={searchPlaceholder}
                  value={search ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch?.();
                  }}
                />
              ) : (
                <span className="text-sm font-medium text-muted-foreground">{searchPlaceholder}</span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                size="sm"
                className="flex cursor-pointer items-center gap-2"
                onClick={() => onSearch?.() ?? onSearchChange?.(search ?? "")}
              >
                <Search className="size-4" />
                Хайх
              </Button>
              {hasActiveFilters && onClear ? (
                <Button type="button" variant="secondary" size="sm" className="flex items-center gap-2 text-muted-foreground" onClick={onClear}>
                  <X className="size-4" />
                  Цэвэрлэх
                </Button>
              ) : null}
            </div>
          </div>
          {filters ? <div className="flex flex-wrap items-end gap-2">{filters}</div> : null}
        </div>
      ) : null}
      {extra}
      <div className={cn("min-h-0 flex-1 overflow-auto", tableCardClass)}>{children}</div>
      <TableFooterBar
        className={cn("shrink-0", tableCardClass)}
        total={total}
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        unit={unit}
      />
    </div>
  );
}

export function FilterField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-36 flex-col gap-1.5", className)}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
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
  const Icon = !active ? ChevronsUpDownIcon : dir === "asc" ? ArrowUpIcon : ArrowDownIcon;
  return (
    <TableHead>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex cursor-pointer items-center gap-1 tracking-wider uppercase transition-colors hover:text-foreground"
      >
        {label}
        <Icon className={cn("size-3", active ? "" : "opacity-50")} />
      </button>
    </TableHead>
  );
}

export function StatusBadge({
  active,
  activeLabel = "Идэвхтэй",
  inactiveLabel = "Идэвхгүй",
}: {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        active ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
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
