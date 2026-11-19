"use client";

import { useEffect, useMemo, useState, type ButtonHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"];
const MONTHS = ["1-р сар", "2-р сар", "3-р сар", "4-р сар", "5-р сар", "6-р сар", "7-р сар", "8-р сар", "9-р сар", "10-р сар", "11-р сар", "12-р сар"];

export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function parseDateKey(value?: string | null) {
  const match = String(value || "").trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateKey(value?: string | null) {
  const date = parseDateKey(value);
  if (!date) return "";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

type Cell = { date: Date; key: string; outside: boolean };

function monthCells(year: number, month: number): Cell[] {
  const startPad = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const cells: Cell[] = [];
  for (let i = startPad - 1; i >= 0; i -= 1) {
    const date = new Date(year, month - 1, prevMonthDays - i);
    cells.push({ date, key: toDateKey(date), outside: true });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    cells.push({ date, key: toDateKey(date), outside: false });
  }
  let next = 1;
  while (cells.length < 42) {
    const date = new Date(year, month + 1, next);
    cells.push({ date, key: toDateKey(date), outside: true });
    next += 1;
  }
  return cells;
}

export function DatePickerPanel({
  selected,
  onSelect,
  onCancel,
  markers = [],
  minDate,
  maxDate,
  className,
}: {
  selected?: string;
  onSelect: (value: string) => void;
  onCancel?: () => void;
  markers?: string[];
  minDate?: string;
  maxDate?: string;
  className?: string;
}) {
  const selectedDate = parseDateKey(selected) || new Date();
  const [view, setView] = useState({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() });
  const years = useMemo(() => Array.from({ length: 71 }, (_, i) => 1970 + i), []);
  const cells = useMemo(() => monthCells(view.year, view.month), [view.year, view.month]);
  const markerSet = useMemo(() => new Set(markers), [markers]);

  useEffect(() => {
    const next = parseDateKey(selected);
    if (next) setView({ year: next.getFullYear(), month: next.getMonth() });
  }, [selected]);

  function shiftMonth(delta: number) {
    const date = new Date(view.year, view.month + delta, 1);
    setView({ year: date.getFullYear(), month: date.getMonth() });
  }

  function isDisabled(key: string) {
    if (minDate && key < minDate) return true;
    if (maxDate && key > maxDate) return true;
    return false;
  }

  return (
    <div className={cn("w-[320px] rounded-[28px] bg-[#171c24] p-4 text-white shadow-2xl ring-1 ring-white/10", className)}>
      <div className="mb-4 flex items-center gap-2">
        <NavButton onClick={() => shiftMonth(-1)} aria-label="Өмнөх сар">
          <ChevronLeft className="size-4" />
        </NavButton>
        <label className="relative min-w-0 flex-1">
          <select
            value={view.month}
            onChange={(e) => setView((prev) => ({ ...prev, month: Number(e.target.value) }))}
            className="h-9 w-full appearance-none rounded-full bg-[#10151d] px-3 pr-8 text-sm font-medium outline-none ring-1 ring-white/10"
          >
            {MONTHS.map((label, index) => (
              <option key={label} value={index} className="bg-[#171c24] text-white">
                {label}
              </option>
            ))}
          </select>
          <ChevronDown />
        </label>
        <label className="relative w-[5.5rem] shrink-0">
          <select
            value={view.year}
            onChange={(e) => setView((prev) => ({ ...prev, year: Number(e.target.value) }))}
            className="h-9 w-full appearance-none rounded-full bg-[#10151d] px-3 pr-8 text-sm font-medium outline-none ring-1 ring-white/10"
          >
            {years.map((year) => (
              <option key={year} value={year} className="bg-[#171c24] text-white">
                {year}
              </option>
            ))}
          </select>
          <ChevronDown />
        </label>
        <NavButton onClick={() => shiftMonth(1)} aria-label="Дараагийн сар">
          <ChevronRight className="size-4" />
        </NavButton>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-white/35">
        {WEEKDAYS.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell) => {
          const selectedDay = cell.key === selected;
          const disabled = isDisabled(cell.key);
          const marked = markerSet.has(cell.key);
          return (
            <button
              key={cell.key + String(cell.outside)}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(cell.key)}
              className={cn(
                "relative mx-auto flex size-10 items-center justify-center rounded-xl text-sm font-medium transition-colors",
                cell.outside && "text-white/30",
                !cell.outside && "text-white",
                disabled && "cursor-not-allowed opacity-30",
                !disabled && !selectedDay && "hover:bg-white/8",
                selectedDay && "bg-[#7ee0c8] text-[#102018] hover:bg-[#7ee0c8]"
              )}
            >
              {cell.date.getDate()}
              {marked && !selectedDay && (
                <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[#7ee0c8]" />
              )}
            </button>
          );
        })}
      </div>
      {onCancel ? (
        <>
          <div className="mx-1 mt-3 h-px bg-white/10" />
          <button
            type="button"
            onClick={onCancel}
            className="mt-3 h-11 w-full rounded-2xl border border-white/15 text-sm font-medium text-white/90 hover:bg-white/5"
          >
            Болих
          </button>
        </>
      ) : null}
    </div>
  );
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Огноо сонгох",
  disabled,
  required,
  minDate,
  maxDate,
  markers,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  markers?: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background/80 px-2.5 text-sm shadow-xs transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-muted-foreground",
          className
        )}
      >
        <span className="truncate">{formatDateKey(value) || placeholder}</span>
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
      </button>
      {required ? <input type="hidden" value={value} required readOnly /> : null}
      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
              <button type="button" className="absolute inset-0 bg-black/55" onClick={() => setOpen(false)} aria-label="Хаах" />
              <div className="relative z-10">
                <DatePickerPanel
                  selected={value}
                  minDate={minDate}
                  maxDate={maxDate}
                  markers={markers}
                  onCancel={() => setOpen(false)}
                  onSelect={(next) => {
                    onChange(next);
                    setOpen(false);
                  }}
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

function NavButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-transparent text-white hover:bg-white/8"
      {...props}
    >
      {children}
    </button>
  );
}

function ChevronDown() {
  return (
    <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-white/50">
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden>
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
