"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function LionIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="currentColor" className={cn("size-6", className)}>
      <path d="M50 5 L85 20 V50 C85 72 50 95 50 95 C50 95 15 72 15 50 V20 Z" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M50 18 L75 30 V50 C75 67 50 83 50 83 C50 83 25 67 25 50 V30 Z" fill="currentColor" opacity="0.15" />
      <path d="M50 25 L58 35 L68 32 L62 42 L72 48 L60 52 L64 64 L50 58 L36 64 L40 52 L28 48 L38 42 L32 32 L42 35 Z" fill="currentColor" />
      <circle cx="43" cy="42" r="2.5" fill="#070707" />
      <circle cx="57" cy="42" r="2.5" fill="#070707" />
      <path d="M46 50 Q50 54 54 50" fill="none" stroke="#070707" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PrimeLogo({
  compact = false,
  logoUrl,
  brandName = "PRIME",
  brandBadge = "IPSC",
  brandSubtitle = "PRACTICAL SHOOTING CLUB",
}: {
  compact?: boolean;
  logoUrl?: string;
  brandName?: string;
  brandBadge?: string;
  brandSubtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707] shadow-lg shadow-black/60",
          compact ? "size-10" : "size-12"
        )}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="" className="size-full object-cover" />
        ) : (
          <LionIcon className={cn("text-[#e31e24]", compact ? "size-6" : "size-7")} />
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={cn("font-heading font-black tracking-[0.18em] text-white", compact ? "text-base" : "text-xl")}>
            {brandName}
          </span>
          {brandBadge ? (
            <span className="rounded bg-[#e31e24] px-1 py-0.5 text-[8px] font-bold tracking-widest text-white uppercase">
              {brandBadge}
            </span>
          ) : null}
        </div>
        {brandSubtitle ? (
          <span className={cn("tracking-[0.2em] font-medium text-[#e31e24]", compact ? "text-[8px]" : "text-[9px]")}>
            {brandSubtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function SectionTag({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="font-mono text-xs font-bold tracking-[0.2em] text-[#e31e24]">{n}</span>
      <span className="h-px w-10 bg-gradient-to-r from-[#e31e24] to-transparent" />
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  aside,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[#ffffff10] bg-[#070707]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#e31e2415,transparent_50%),radial-gradient(circle_at_20%_80%,#e31e2410,transparent_40%)]" />
      
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="z-10">
          {eyebrow && (
            <div className="mb-4 flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#e31e24]">{eyebrow}</span>
              <span className="h-px w-8 bg-[#e31e24]" />
            </div>
          )}
          <h1 className="font-heading text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#a0a0a5] md:text-base">
              {description}
            </p>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function RedButton({
  href,
  children,
  className,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span>{children}</span>
    </>
  );

  const baseStyle = cn(
    "relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#e31e24] px-6 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-[#e31e24]/25 transition-all duration-300 hover:bg-[#c91920] hover:shadow-[#e31e24]/40 hover:scale-[1.02] active:scale-[0.98]",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseStyle}>
      {content}
    </button>
  );
}

export function OutlineButton({
  href,
  children,
  className,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const baseStyle = cn(
    "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#e31e24]/50 bg-[#121215]/80 px-6 text-xs font-bold uppercase tracking-wider text-[#e31e24] transition-all duration-300 hover:border-[#e31e24] hover:bg-[#e31e24]/10 hover:text-white hover:scale-[1.02] active:scale-[0.98]",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseStyle}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseStyle}>
      {children}
    </button>
  );
}

export function ContentSection({
  id,
  className,
  children,
  dark = false,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative border-b border-[#ffffff0f] py-16 md:py-24",
        dark ? "bg-[#09090b]" : "bg-[#070707]",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">{children}</div>
    </section>
  );
}

export function Stepper({
  steps,
  currentStep = 1,
}: {
  steps: { number: number | string; label: string; sub?: string }[];
  currentStep?: number;
}) {
  return (
    <div className="relative flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="absolute top-1/2 left-4 right-4 hidden h-0.5 -translate-y-1/2 bg-gradient-to-r from-[#e31e24] via-[#e31e24]/50 to-[#ffffff20] md:block" />
      
      {steps.map((step, idx) => {
        const active = idx + 1 <= currentStep;
        return (
          <div key={idx} className="relative z-10 flex flex-1 flex-col items-center text-center min-w-[120px]">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-full border-2 text-xs font-bold shadow-md transition-all",
                active
                  ? "border-[#e31e24] bg-[#e31e24] text-white shadow-[#e31e24]/40"
                  : "border-[#ffffff20] bg-[#141416] text-muted-foreground"
              )}
            >
              {step.number}
            </div>
            <p className={cn("mt-3 text-xs font-semibold uppercase tracking-wider", active ? "text-white" : "text-muted-foreground")}>
              {step.label}
            </p>
            {step.sub && <p className="mt-1 text-[10px] text-muted-foreground">{step.sub}</p>}
          </div>
        );
      })}
    </div>
  );
}
