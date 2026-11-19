"use client";

import { forwardRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { mn } from "date-fns/locale";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("mn", mn);

function parseTime(value: string) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})/);
  const date = new Date();
  date.setSeconds(0, 0);
  if (!match) {
    date.setHours(10, 0);
    return date;
  }
  date.setHours(Number(match[1]), Number(match[2]));
  return date;
}

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

const Trigger = forwardRef<
  HTMLButtonElement,
  { value?: string; onClick?: () => void; disabled?: boolean; className?: string }
>(function TimePickerTrigger({ value, onClick, disabled, className }, ref) {
  return (
    <button
      type="button"
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 min-w-28 items-center gap-2 rounded-md border border-input bg-background px-2.5 text-sm shadow-xs transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    >
      <Clock className="size-3.5 text-muted-foreground" />
      <span className="font-medium tabular-nums">{value || "—"}</span>
    </button>
  );
});

export function TimePicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <DatePicker
      locale="mn"
      selected={parseTime(value)}
      onChange={(date: Date | null) => {
        if (date) onChange(formatTime(date));
      }}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Цаг"
      dateFormat="HH:mm"
      timeFormat="HH:mm"
      disabled={disabled}
      customInput={<Trigger disabled={disabled} />}
      calendarClassName="club-time-picker"
      popperClassName="club-time-popper z-[80]"
      portalId="club-picker-portal"
      showPopperArrow={false}
    />
  );
}

export function TimeRangePicker({
  start,
  end,
  onStart,
  onEnd,
  disabled,
}: {
  start: string;
  end: string;
  onStart: (value: string) => void;
  onEnd: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <TimePicker value={start} onChange={onStart} disabled={disabled} />
      <span className="text-muted-foreground">–</span>
      <TimePicker value={end} onChange={onEnd} disabled={disabled} />
    </div>
  );
}
