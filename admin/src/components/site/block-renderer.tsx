"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Crosshair,
  Mail,
  MapPin,
  Phone,
  Shield,
  ShieldAlert,
  Star,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { SiteBlock } from "@/lib/site-blocks";
import { assetUrl } from "@/lib/api";
import {
  ContentSection,
  LionIcon,
  OutlineButton,
  PageHero,
  RedButton,
  SectionTag,
  Stepper,
} from "./primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ICONS: Record<string, LucideIcon> = {
  Target,
  Crosshair,
  BarChart3,
  ShieldAlert,
  Shield,
  Users,
  Trophy,
  Star,
  Calendar,
  Clock,
};

function Icon({ name, className }: { name?: string; className?: string }) {
  const Cmp = (name && ICONS[name]) || Target;
  return <Cmp className={className} />;
}

type Cta = { text?: string; href?: string };

function HeroBlock({ data }: { data: Record<string, unknown> }) {
  const primary = data.primaryCta as Cta | undefined;
  const secondary = data.secondaryCta as Cta | undefined;
  const aside = data.asideTitle ? (
    <div className="relative overflow-hidden rounded-2xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 shadow-2xl">
      <div className="absolute top-4 right-4 text-[#e31e24]/15">
        <LionIcon className="size-36" />
      </div>
      {data.asideTag ? (
        <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24]">{String(data.asideTag)}</p>
      ) : null}
      <h3 className="mt-4 font-heading text-3xl font-extrabold uppercase leading-tight text-white">{String(data.asideTitle)}</h3>
      {data.asideBody ? <p className="mt-3 text-xs leading-relaxed text-[#a0a0a5]">{String(data.asideBody)}</p> : null}
    </div>
  ) : undefined;

  return (
    <PageHero eyebrow={data.eyebrow ? String(data.eyebrow) : undefined} title={String(data.title || "")} description={data.description ? String(data.description) : undefined} aside={aside}>
      {primary?.text ? (
        <RedButton href={primary.href || "#"}>
          {primary.text}
          <ArrowRight className="size-4" />
        </RedButton>
      ) : null}
      {secondary?.text ? <OutlineButton href={secondary.href || "#"}>{secondary.text}</OutlineButton> : null}
    </PageHero>
  );
}

function SectionHeaderBlock({ data }: { data: Record<string, unknown> }) {
  return (
    <ContentSection id={data.anchorId ? String(data.anchorId) : undefined} dark={Boolean(data.dark)}>
      <SectionTag n={String(data.number || "01")} label={String(data.label || "")} />
      <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">{String(data.title || "")}</h2>
      {data.description ? <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#a0a0a5]">{String(data.description)}</p> : null}
    </ContentSection>
  );
}

export function BlockRenderer({ block }: { block: SiteBlock }) {
  const d = block.data;

  switch (block.type) {
    case "hero":
      return <HeroBlock data={d} />;

    case "section-header":
      return <SectionHeaderBlock data={d} />;

    case "stats-row": {
      const items = (d.items as { icon?: string; value: string; label: string; highlight?: boolean }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 text-center">
                {item.icon ? <Icon name={item.icon} className="mx-auto mb-3 size-8 text-[#e31e24]" /> : null}
                <p className={`text-2xl font-bold ${item.highlight ? "text-[#e31e24]" : "text-white"}`}>{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </ContentSection>
      );
    }

    case "icon-cards": {
      const items = (d.items as { icon?: string; title: string; body: string; href?: string }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => {
              const inner = (
                <>
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
                    <Icon name={item.icon} className="size-6" />
                  </div>
                  <h3 className="font-heading text-sm font-bold uppercase text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">{item.body}</p>
                </>
              );
              return item.href ? (
                <Link key={i} href={item.href} className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 transition-all hover:border-[#e31e24]/50">
                  {inner}
                </Link>
              ) : (
                <div key={i} className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6">
                  {inner}
                </div>
              );
            })}
          </div>
        </ContentSection>
      );
    }

    case "numbered-list": {
      const items = (d.items as { n: string; title: string; body?: string }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item, i) => (
              <div key={i} className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6">
                <span className="font-mono text-xs font-bold text-[#e31e24]">{item.n}</span>
                <h3 className="mt-2 font-heading text-sm font-bold uppercase text-white">{item.title}</h3>
                {item.body ? <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">{item.body}</p> : null}
              </div>
            ))}
          </div>
        </ContentSection>
      );
    }

    case "stepper": {
      const steps = (d.steps as { n: string; title: string; label?: string }[]) || [];
      return (
        <ContentSection>
          <Stepper
            steps={steps.map((s) => ({ number: s.n, label: s.title, sub: s.label }))}
            currentStep={steps.length}
          />
        </ContentSection>
      );
    }

    case "course-cards": {
      const items = (d.items as { title: string; subtitle: string; duration: string; audience: string; details: string; price: string; href?: string }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((c, i) => (
              <div key={i} className="flex flex-col justify-between rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e31e24]">{c.title}</span>
                  <h3 className="mt-2 font-heading text-lg font-bold text-white">{c.subtitle}</h3>
                  <div className="mt-4 space-y-2 border-t border-[#ffffff10] pt-4 text-xs text-[#a0a0a5]">
                    <p className="flex items-center gap-2"><Clock className="size-4 text-[#e31e24]" />{c.duration}</p>
                    <p className="flex items-center gap-2"><Users className="size-4 text-[#e31e24]" />{c.audience}</p>
                    <p>{c.details}</p>
                  </div>
                </div>
                <div className="mt-6 border-t border-[#ffffff10] pt-4">
                  <p className="font-mono text-2xl font-extrabold text-[#e31e24]">{c.price}</p>
                  {c.href ? (
                    <RedButton href={c.href} className="mt-4 w-full">
                      Дэлгэрэнгүй
                      <ArrowRight className="size-4" />
                    </RedButton>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </ContentSection>
      );
    }

    case "pricing-grid": {
      const items = (d.items as { title: string; price: string; features: string | string[]; ctaText: string; ctaHref: string; highlighted?: boolean }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((tier, i) => {
              const features = Array.isArray(tier.features) ? tier.features : String(tier.features || "").split("\n").filter(Boolean);
              return (
                <div key={i} className={`rounded-2xl border p-6 ${tier.highlighted ? "border-[#e31e24]/60 bg-gradient-to-b from-[#1a0e10] to-[#101012]" : "border-[#ffffff15] bg-[#121215]"}`}>
                  <h3 className="font-heading text-lg font-bold text-white">{tier.title}</h3>
                  <p className="mt-2 font-mono text-2xl font-extrabold text-[#e31e24]">{tier.price}</p>
                  <ul className="mt-4 space-y-2">
                    {features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-[#a0a0a5]">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#e31e24]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <RedButton href={tier.ctaHref || "#"} className="mt-6 w-full">{tier.ctaText}</RedButton>
                </div>
              );
            })}
          </div>
        </ContentSection>
      );
    }

    case "news-list": {
      const items = (d.items as { date: string; title: string; body: string }[]) || [];
      return (
        <ContentSection>
          <div className="space-y-4">
            {items.map((item, i) => (
              <div key={i} className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6">
                <p className="font-mono text-xs text-[#e31e24]">{item.date}</p>
                <h3 className="mt-2 font-heading text-sm font-bold uppercase text-white">{item.title}</h3>
                <p className="mt-2 text-xs text-[#a0a0a5]">{item.body}</p>
              </div>
            ))}
          </div>
        </ContentSection>
      );
    }

    case "timeline": {
      const items = (d.items as { year: string; title: string; body: string }[]) || [];
      return (
        <ContentSection>
          <div className="space-y-6 border-l border-[#ffffff15] pl-6">
            {items.map((item, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[31px] top-1 size-3 rounded-full bg-[#e31e24]" />
                <p className="font-mono text-xs font-bold text-[#e31e24]">{item.year}</p>
                <h3 className="mt-1 font-heading text-sm font-bold uppercase text-white">{item.title}</h3>
                <p className="mt-1 text-xs text-[#a0a0a5]">{item.body}</p>
              </div>
            ))}
          </div>
        </ContentSection>
      );
    }

    case "team-grid": {
      const items = (d.items as { name: string; role: string; sub?: string; imageUrl?: string }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((m, i) => (
              <div key={i} className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 text-center">
                <div className="mx-auto mb-4 flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-[#e31e24]/40 bg-[#101012]">
                  {m.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={assetUrl(m.imageUrl)} alt={m.name} className="size-full object-cover" />
                  ) : (
                    <LionIcon className="size-10 text-[#e31e24]/40" />
                  )}
                </div>
                <h3 className="font-heading text-sm font-bold text-white">{m.name}</h3>
                <p className="mt-1 text-xs text-[#e31e24]">{m.role}</p>
                {m.sub ? <p className="mt-1 text-xs text-[#a0a0a5]">{m.sub}</p> : null}
              </div>
            ))}
          </div>
        </ContentSection>
      );
    }

    case "gallery": {
      const items = (d.items as { tag: string; title: string; imageUrl?: string }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-[#ffffff15] bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707] p-8 min-h-[160px] flex flex-col justify-end">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetUrl(item.imageUrl)} alt={item.title} className="absolute inset-0 size-full object-cover opacity-40" />
                ) : null}
                <p className="relative font-mono text-[10px] font-bold tracking-widest text-[#e31e24]">{item.tag}</p>
                <h3 className="relative font-heading text-xl font-extrabold text-white">{item.title}</h3>
              </div>
            ))}
          </div>
        </ContentSection>
      );
    }

    case "cta-banner":
      return (
        <ContentSection dark>
          <div className="relative overflow-hidden rounded-3xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 md:p-12 text-center">
            <h2 className="font-heading text-3xl font-extrabold uppercase text-white">{String(d.title || "")}</h2>
            {d.description ? <p className="mx-auto mt-4 max-w-2xl text-sm text-[#a0a0a5]">{String(d.description)}</p> : null}
            {d.ctaText ? (
              <div className="mt-8 flex justify-center">
                <RedButton href={String(d.ctaHref || "#")}>{String(d.ctaText)}</RedButton>
              </div>
            ) : null}
          </div>
        </ContentSection>
      );

    case "rich-text":
      return (
        <ContentSection>
          {d.title ? <h2 className="mb-4 font-heading text-2xl font-bold text-white">{String(d.title)}</h2> : null}
          <div className="prose prose-invert max-w-none text-sm leading-relaxed text-[#a0a0a5] whitespace-pre-wrap">{String(d.content || "")}</div>
        </ContentSection>
      );

    case "contact-info":
      return (
        <ContentSection>
          <div className="grid gap-4 md:grid-cols-2">
            {d.address ? (
              <div className="flex items-start gap-3 rounded-2xl border border-[#ffffff15] bg-[#121215] p-6">
                <MapPin className="size-5 shrink-0 text-[#e31e24]" />
                <div><p className="text-xs text-muted-foreground">Хаяг</p><p className="text-sm text-white">{String(d.address)}</p></div>
              </div>
            ) : null}
            {d.phone ? (
              <div className="flex items-start gap-3 rounded-2xl border border-[#ffffff15] bg-[#121215] p-6">
                <Phone className="size-5 shrink-0 text-[#e31e24]" />
                <div><p className="text-xs text-muted-foreground">Утас</p><p className="text-sm text-white">{String(d.phone)}</p></div>
              </div>
            ) : null}
            {d.email ? (
              <div className="flex items-start gap-3 rounded-2xl border border-[#ffffff15] bg-[#121215] p-6">
                <Mail className="size-5 shrink-0 text-[#e31e24]" />
                <div><p className="text-xs text-muted-foreground">И-мэйл</p><p className="text-sm text-white">{String(d.email)}</p></div>
              </div>
            ) : null}
            {d.hours ? (
              <div className="flex items-start gap-3 rounded-2xl border border-[#ffffff15] bg-[#121215] p-6">
                <Clock className="size-5 shrink-0 text-[#e31e24]" />
                <div><p className="text-xs text-muted-foreground">Цаг</p><p className="text-sm text-white">{String(d.hours)}</p></div>
              </div>
            ) : null}
          </div>
        </ContentSection>
      );

    case "contact-form":
      return (
        <ContentSection>
          <div className="mx-auto max-w-lg rounded-2xl border border-[#ffffff15] bg-[#121215] p-6">
            {d.title ? <h3 className="font-heading text-lg font-bold text-white">{String(d.title)}</h3> : null}
            {d.subtitle ? <p className="mt-1 text-xs text-[#a0a0a5]">{String(d.subtitle)}</p> : null}
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Мессеж илгээгдлээ (демо)");
              }}
            >
              <Input placeholder="Нэр" className="bg-[#0a0a0c] border-[#ffffff15]" />
              <Input placeholder="И-мэйл" type="email" className="bg-[#0a0a0c] border-[#ffffff15]" />
              <Textarea placeholder="Мессеж" rows={4} className="bg-[#0a0a0c] border-[#ffffff15]" />
              <Button type="submit" className="w-full bg-[#e31e24] hover:bg-[#c91920]">Илгээх</Button>
            </form>
          </div>
        </ContentSection>
      );

    default:
      return (
        <ContentSection>
          <p className="text-sm text-muted-foreground">Unknown block type: {block.type}</p>
        </ContentSection>
      );
  }
}

export function SitePageRenderer({ blocks }: { blocks: SiteBlock[] }) {
  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </>
  );
}
