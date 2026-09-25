import { cn } from "@/lib/utils";
import { SCORE_STATUS_CLASS, SCORE_STATUS_LABEL, type ScoreStatus } from "@/lib/scoring";

export function ScoreStatusBadge({ status, className }: { status: ScoreStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-xs font-medium whitespace-nowrap",
        SCORE_STATUS_CLASS[status],
        className
      )}
    >
      {SCORE_STATUS_LABEL[status]}
    </span>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value || 0));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all",
          clamped >= 100 ? "bg-emerald-500" : clamped > 0 ? "bg-primary" : "bg-transparent"
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</div>
      <div
        className={cn(
          "mt-1 font-heading text-3xl",
          tone === "success" && "text-emerald-500",
          tone === "warning" && "text-amber-500",
          tone === "danger" && "text-destructive",
          tone === "default" && "text-foreground"
        )}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-full border px-3 text-sm transition-colors",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">{children}</div>;
}
