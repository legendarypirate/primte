"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Crosshair,
  Shield,
  ShieldAlert,
  Star,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { SiteBlock } from "@/lib/site-blocks";
import { assetUrl } from "@/lib/api";
import { InlineEdit } from "@/components/site-editor/inline-edit";
import { EditableImage } from "@/components/site-editor/editable-image";
import {
  ContentSection,
  LionIcon,
  OutlineButton,
  RedButton,
  SectionTag,
  Stepper,
} from "./primitives";
import {
  ContactCardsSection,
  ContactCategoriesSection,
  ContactFormMapSection,
  ContactHeroSection,
  ContactSocialCtaSection,
} from "./contact-sections";

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

type EditCtx = { onChange: (data: Record<string, unknown>) => void };

function patch(d: Record<string, unknown>, key: string, value: unknown) {
  return { ...d, [key]: value };
}

function patchItem(d: Record<string, unknown>, key: string, index: number, itemPatch: Record<string, unknown>) {
  const items = [...((d[key] as Record<string, unknown>[]) || [])];
  items[index] = { ...items[index], ...itemPatch };
  return { ...d, [key]: items };
}

type Cta = { text?: string; href?: string };

function HeroBlock({ data, edit }: { data: Record<string, unknown>; edit?: EditCtx }) {
  const primary = data.primaryCta as Cta | undefined;
  const secondary = data.secondaryCta as Cta | undefined;
  const aside = data.asideTitle || edit ? (
    <div className="relative overflow-hidden rounded-2xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 shadow-2xl">
      <div className="absolute top-4 right-4 h-36 w-36 text-[#e31e24]/15">
        {edit ? (
          <EditableImage
            value={String(data.asideImageUrl || "")}
            onChange={(v) => edit.onChange(patch(data, "asideImageUrl", v))}
            edit
            imgClassName="size-36 object-contain opacity-30"
            placeholder="Aside зураг"
          />
        ) : data.asideImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={assetUrl(String(data.asideImageUrl))} alt="" className="size-36 object-contain opacity-20" />
        ) : (
          <LionIcon className="size-36" />
        )}
      </div>
      {edit ? (
        <>
          <InlineEdit
            value={String(data.asideTag || "")}
            onChange={(v) => edit.onChange(patch(data, "asideTag", v))}
            className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24] block"
            placeholder="Aside tag"
          />
          <InlineEdit
            value={String(data.asideTitle || "")}
            onChange={(v) => edit.onChange(patch(data, "asideTitle", v))}
            as="h3"
            className="mt-4 font-heading text-3xl font-extrabold uppercase leading-tight text-white block"
            placeholder="Aside title"
          />
          <InlineEdit
            value={String(data.asideBody || "")}
            onChange={(v) => edit.onChange(patch(data, "asideBody", v))}
            multiline
            className="mt-3 text-xs leading-relaxed text-[#a0a0a5]"
            placeholder="Aside body"
          />
        </>
      ) : (
        <>
          {data.asideTag ? (
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24]">{String(data.asideTag)}</p>
          ) : null}
          {data.asideTitle ? (
            <h3 className="mt-4 font-heading text-3xl font-extrabold uppercase leading-tight text-white">{String(data.asideTitle)}</h3>
          ) : null}
          {data.asideBody ? <p className="mt-3 text-xs leading-relaxed text-[#a0a0a5]">{String(data.asideBody)}</p> : null}
        </>
      )}
    </div>
  ) : undefined;

  const titleNode = edit ? (
    <InlineEdit
      value={String(data.title || "")}
      onChange={(v) => edit.onChange(patch(data, "title", v))}
      as="h1"
      className="font-heading text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl block"
    />
  ) : (
    String(data.title || "")
  );

  const bg = data.backgroundImageUrl ? assetUrl(String(data.backgroundImageUrl)) : "";

  return (
    <section className="relative overflow-hidden border-b border-[#ffffff10] bg-[#070707]">
      {bg ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bg} alt="" className="absolute inset-0 size-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/90 to-[#070707]/70" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#e31e2415,transparent_50%),radial-gradient(circle_at_20%_80%,#e31e2410,transparent_40%)]" />
        </>
      )}
      {edit ? (
        <div className="absolute left-4 top-4 z-20 h-24 w-40">
          <EditableImage
            value={String(data.backgroundImageUrl || "")}
            onChange={(v) => edit.onChange(patch(data, "backgroundImageUrl", v))}
            edit
            placeholder="Background"
            imgClassName="rounded-lg"
          />
        </div>
      ) : null}
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="z-10">
          {edit || data.eyebrow ? (
            <div className="mb-4 flex items-center gap-2">
              {edit ? (
                <InlineEdit
                  value={String(data.eyebrow || "")}
                  onChange={(v) => edit.onChange(patch(data, "eyebrow", v))}
                  className="font-mono text-xs font-bold tracking-[0.25em] text-[#e31e24]"
                  placeholder="Eyebrow"
                />
              ) : (
                <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#e31e24]">{String(data.eyebrow)}</span>
              )}
              <span className="h-px w-8 bg-[#e31e24]" />
            </div>
          ) : null}
          {edit ? (
            titleNode
          ) : (
            <h1 className="font-heading text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              {titleNode}
            </h1>
          )}
          {edit ? (
            <InlineEdit
              value={String(data.description || "")}
              onChange={(v) => edit.onChange(patch(data, "description", v))}
              multiline
              className="mt-6 max-w-2xl text-sm leading-relaxed text-[#a0a0a5] md:text-base"
            />
          ) : data.description ? (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#a0a0a5] md:text-base">{String(data.description)}</p>
          ) : null}
          {(primary?.text || edit) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {edit ? (
                <>
                  <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#e31e24] px-6 text-xs font-bold uppercase text-white">
                    <InlineEdit
                      value={primary?.text || ""}
                      onChange={(v) => edit.onChange(patch(data, "primaryCta", { ...primary, text: v }))}
                      placeholder="CTA"
                    />
                  </span>
                  <span className="inline-flex h-11 items-center rounded-lg border border-[#e31e24]/50 px-6 text-xs font-bold uppercase text-[#e31e24]">
                    <InlineEdit
                      value={secondary?.text || ""}
                      onChange={(v) => edit.onChange(patch(data, "secondaryCta", { ...secondary, text: v }))}
                      placeholder="Secondary CTA"
                    />
                  </span>
                </>
              ) : (
                <>
                  {primary?.text ? (
                    <RedButton href={primary.href || "#"}>
                      {primary.text}
                      <ArrowRight className="size-4" />
                    </RedButton>
                  ) : null}
                  {secondary?.text ? <OutlineButton href={secondary.href || "#"}>{secondary.text}</OutlineButton> : null}
                </>
              )}
            </div>
          )}
        </div>
        {aside}
      </div>
    </section>
  );
}

function SectionHeaderBlock({ data, edit }: { data: Record<string, unknown>; edit?: EditCtx }) {
  return (
    <ContentSection id={data.anchorId ? String(data.anchorId) : undefined} dark={Boolean(data.dark)}>
      <div className="mb-4 flex items-center gap-3">
        {edit ? (
          <>
            <InlineEdit
              value={String(data.number || "01")}
              onChange={(v) => edit.onChange(patch(data, "number", v))}
              className="font-mono text-xs font-bold tracking-[0.2em] text-[#e31e24]"
            />
            <span className="h-px w-10 bg-gradient-to-r from-[#e31e24] to-transparent" />
            <InlineEdit
              value={String(data.label || "")}
              onChange={(v) => edit.onChange(patch(data, "label", v))}
              className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground"
            />
          </>
        ) : (
          <SectionTag n={String(data.number || "01")} label={String(data.label || "")} />
        )}
      </div>
      {edit ? (
        <>
          <InlineEdit
            value={String(data.title || "")}
            onChange={(v) => edit.onChange(patch(data, "title", v))}
            as="h2"
            className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
          />
          <InlineEdit
            value={String(data.description || "")}
            onChange={(v) => edit.onChange(patch(data, "description", v))}
            multiline
            className="mt-4 max-w-3xl text-sm leading-relaxed text-[#a0a0a5]"
          />
        </>
      ) : (
        <>
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">{String(data.title || "")}</h2>
          {data.description ? <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#a0a0a5]">{String(data.description)}</p> : null}
        </>
      )}
    </ContentSection>
  );
}

export function BlockRenderer({ block, edit }: { block: SiteBlock; edit?: EditCtx }) {
  const d = block.data;
  const onChange = edit?.onChange;

  switch (block.type) {
    case "hero":
      return <HeroBlock data={d} edit={edit} />;

    case "section-header":
      return <SectionHeaderBlock data={d} edit={edit} />;

    case "stats-row": {
      const items = (d.items as { icon?: string; value: string; label: string; highlight?: boolean }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 text-center">
                {item.icon ? <Icon name={item.icon} className="mx-auto mb-3 size-8 text-[#e31e24]" /> : null}
                {edit && onChange ? (
                  <>
                    <InlineEdit
                      value={item.value}
                      onChange={(v) => onChange(patchItem(d, "items", i, { value: v }))}
                      className={`text-2xl font-bold block ${item.highlight ? "text-[#e31e24]" : "text-white"}`}
                    />
                    <InlineEdit
                      value={item.label}
                      onChange={(v) => onChange(patchItem(d, "items", i, { label: v }))}
                      className="mt-1 text-xs text-muted-foreground block"
                    />
                  </>
                ) : (
                  <>
                    <p className={`text-2xl font-bold ${item.highlight ? "text-[#e31e24]" : "text-white"}`}>{item.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </ContentSection>
      );
    }

    case "icon-cards": {
      const items = (d.items as { icon?: string; title: string; body: string; href?: string; imageUrl?: string }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, i) => (
              <div key={i} className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6">
                <div className="relative mb-4 h-28 overflow-hidden rounded-xl border border-[#e31e24]/40 bg-[#e31e24]/10">
                  {edit && onChange ? (
                    <EditableImage
                      value={item.imageUrl || ""}
                      onChange={(v) => onChange(patchItem(d, "items", i, { imageUrl: v }))}
                      edit
                      fill
                      imgClassName="object-cover"
                      placeholder="Зураг"
                    />
                  ) : item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={assetUrl(item.imageUrl)} alt="" className="absolute inset-0 size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-[#e31e24]">
                      <Icon name={item.icon} className="size-6" />
                    </div>
                  )}
                </div>
                {edit && onChange ? (
                  <>
                    <InlineEdit
                      value={item.title}
                      onChange={(v) => onChange(patchItem(d, "items", i, { title: v }))}
                      as="h3"
                      className="font-heading text-sm font-bold uppercase text-white block"
                    />
                    <InlineEdit
                      value={item.body}
                      onChange={(v) => onChange(patchItem(d, "items", i, { body: v }))}
                      multiline
                      className="mt-2 text-xs leading-relaxed text-[#a0a0a5]"
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-heading text-sm font-bold uppercase text-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">{item.body}</p>
                  </>
                )}
              </div>
            ))}
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
                {edit && onChange ? (
                  <>
                    <InlineEdit
                      value={item.n}
                      onChange={(v) => onChange(patchItem(d, "items", i, { n: v }))}
                      className="font-mono text-xs font-bold text-[#e31e24] block"
                    />
                    <InlineEdit
                      value={item.title}
                      onChange={(v) => onChange(patchItem(d, "items", i, { title: v }))}
                      as="h3"
                      className="mt-2 font-heading text-sm font-bold uppercase text-white block"
                    />
                    <InlineEdit
                      value={item.body || ""}
                      onChange={(v) => onChange(patchItem(d, "items", i, { body: v }))}
                      multiline
                      className="mt-2 text-xs leading-relaxed text-[#a0a0a5]"
                    />
                  </>
                ) : (
                  <>
                    <span className="font-mono text-xs font-bold text-[#e31e24]">{item.n}</span>
                    <h3 className="mt-2 font-heading text-sm font-bold uppercase text-white">{item.title}</h3>
                    {item.body ? <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">{item.body}</p> : null}
                  </>
                )}
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
      const items = (d.items as { title: string; subtitle: string; duration: string; audience: string; details: string; price: string; href?: string; imageUrl?: string }[]) || [];
      return (
        <ContentSection>
          <div className="grid gap-4 lg:grid-cols-3">
            {items.map((c, i) => (
              <div key={i} className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#ffffff15] bg-[#121215] shadow-xl">
                <div className="relative h-36 border-b border-[#ffffff10] bg-[#101012]">
                  {edit && onChange ? (
                    <EditableImage
                      value={c.imageUrl || ""}
                      onChange={(v) => onChange(patchItem(d, "items", i, { imageUrl: v }))}
                      edit
                      fill
                      imgClassName="object-cover"
                      placeholder="Зураг"
                    />
                  ) : c.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={assetUrl(c.imageUrl)} alt="" className="absolute inset-0 size-full object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  {edit && onChange ? (
                    <>
                      <InlineEdit value={c.title} onChange={(v) => onChange(patchItem(d, "items", i, { title: v }))} className="font-mono text-xs font-bold uppercase tracking-widest text-[#e31e24] block" />
                      <InlineEdit value={c.subtitle} onChange={(v) => onChange(patchItem(d, "items", i, { subtitle: v }))} as="h3" className="mt-2 font-heading text-lg font-bold text-white block" />
                      <div className="mt-4 space-y-2 border-t border-[#ffffff10] pt-4 text-xs text-[#a0a0a5]">
                        <p className="flex items-center gap-2"><Clock className="size-4 text-[#e31e24]" /><InlineEdit value={c.duration} onChange={(v) => onChange(patchItem(d, "items", i, { duration: v }))} className="flex-1" /></p>
                        <p className="flex items-center gap-2"><Users className="size-4 text-[#e31e24]" /><InlineEdit value={c.audience} onChange={(v) => onChange(patchItem(d, "items", i, { audience: v }))} className="flex-1" /></p>
                        <InlineEdit value={c.details} onChange={(v) => onChange(patchItem(d, "items", i, { details: v }))} multiline />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e31e24]">{c.title}</span>
                      <h3 className="mt-2 font-heading text-lg font-bold text-white">{c.subtitle}</h3>
                      <div className="mt-4 space-y-2 border-t border-[#ffffff10] pt-4 text-xs text-[#a0a0a5]">
                        <p className="flex items-center gap-2"><Clock className="size-4 text-[#e31e24]" />{c.duration}</p>
                        <p className="flex items-center gap-2"><Users className="size-4 text-[#e31e24]" />{c.audience}</p>
                        <p>{c.details}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-6 border-t border-[#ffffff10] pt-4">
                  {edit && onChange ? (
                    <InlineEdit value={c.price} onChange={(v) => onChange(patchItem(d, "items", i, { price: v }))} className="font-mono text-2xl font-extrabold text-[#e31e24] block" />
                  ) : (
                    <>
                      <p className="font-mono text-2xl font-extrabold text-[#e31e24]">{c.price}</p>
                      {c.href ? (
                        <RedButton href={c.href} className="mt-4 w-full">
                          Дэлгэрэнгүй
                          <ArrowRight className="size-4" />
                        </RedButton>
                      ) : null}
                    </>
                  )}
                </div>
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
                  {edit && onChange ? (
                    <>
                      <InlineEdit value={tier.title} onChange={(v) => onChange(patchItem(d, "items", i, { title: v }))} as="h3" className="font-heading text-lg font-bold text-white block" />
                      <InlineEdit value={tier.price} onChange={(v) => onChange(patchItem(d, "items", i, { price: v }))} className="mt-2 font-mono text-2xl font-extrabold text-[#e31e24] block" />
                      <InlineEdit
                        value={Array.isArray(tier.features) ? tier.features.join("\n") : String(tier.features || "")}
                        onChange={(v) => onChange(patchItem(d, "items", i, { features: v }))}
                        multiline
                        className="mt-4 text-xs text-[#a0a0a5]"
                        placeholder="Feature (one per line)"
                      />
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
                {edit && onChange ? (
                  <>
                    <InlineEdit value={item.date} onChange={(v) => onChange(patchItem(d, "items", i, { date: v }))} className="font-mono text-xs text-[#e31e24] block" />
                    <InlineEdit value={item.title} onChange={(v) => onChange(patchItem(d, "items", i, { title: v }))} as="h3" className="mt-2 font-heading text-sm font-bold uppercase text-white block" />
                    <InlineEdit value={item.body} onChange={(v) => onChange(patchItem(d, "items", i, { body: v }))} multiline className="mt-2 text-xs text-[#a0a0a5]" />
                  </>
                ) : (
                  <>
                    <p className="font-mono text-xs text-[#e31e24]">{item.date}</p>
                    <h3 className="mt-2 font-heading text-sm font-bold uppercase text-white">{item.title}</h3>
                    <p className="mt-2 text-xs text-[#a0a0a5]">{item.body}</p>
                  </>
                )}
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
                {edit && onChange ? (
                  <>
                    <InlineEdit value={item.year} onChange={(v) => onChange(patchItem(d, "items", i, { year: v }))} className="font-mono text-xs font-bold text-[#e31e24] block" />
                    <InlineEdit value={item.title} onChange={(v) => onChange(patchItem(d, "items", i, { title: v }))} as="h3" className="mt-1 font-heading text-sm font-bold uppercase text-white block" />
                    <InlineEdit value={item.body} onChange={(v) => onChange(patchItem(d, "items", i, { body: v }))} multiline className="mt-1 text-xs text-[#a0a0a5]" />
                  </>
                ) : (
                  <>
                    <p className="font-mono text-xs font-bold text-[#e31e24]">{item.year}</p>
                    <h3 className="mt-1 font-heading text-sm font-bold uppercase text-white">{item.title}</h3>
                    <p className="mt-1 text-xs text-[#a0a0a5]">{item.body}</p>
                  </>
                )}
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
                <div className="relative mx-auto mb-4 size-20 overflow-hidden rounded-full border-2 border-[#e31e24]/40 bg-[#101012]">
                  {edit && onChange ? (
                    <EditableImage
                      value={m.imageUrl || ""}
                      onChange={(v) => onChange(patchItem(d, "items", i, { imageUrl: v }))}
                      edit
                      fill
                      imgClassName="rounded-full object-cover"
                      placeholder="Зураг"
                    />
                  ) : m.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={assetUrl(m.imageUrl)} alt={m.name} className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <LionIcon className="size-10 text-[#e31e24]/40" />
                    </div>
                  )}
                </div>
                {edit && onChange ? (
                  <>
                    <InlineEdit value={m.name} onChange={(v) => onChange(patchItem(d, "items", i, { name: v }))} as="h3" className="font-heading text-sm font-bold text-white block" />
                    <InlineEdit value={m.role} onChange={(v) => onChange(patchItem(d, "items", i, { role: v }))} className="mt-1 text-xs text-[#e31e24] block" />
                    <InlineEdit value={m.sub || ""} onChange={(v) => onChange(patchItem(d, "items", i, { sub: v }))} className="mt-1 text-xs text-[#a0a0a5] block" />
                  </>
                ) : (
                  <>
                    <h3 className="font-heading text-sm font-bold text-white">{m.name}</h3>
                    <p className="mt-1 text-xs text-[#e31e24]">{m.role}</p>
                    {m.sub ? <p className="mt-1 text-xs text-[#a0a0a5]">{m.sub}</p> : null}
                  </>
                )}
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
              <div key={i} className="relative flex min-h-[160px] flex-col justify-end overflow-hidden rounded-2xl border border-[#ffffff15] bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707] p-8">
                {edit && onChange ? (
                  <EditableImage
                    value={item.imageUrl || ""}
                    onChange={(v) => onChange(patchItem(d, "items", i, { imageUrl: v }))}
                    edit
                    fill
                    imgClassName="object-cover opacity-50"
                    placeholder="Gallery"
                  />
                ) : item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetUrl(item.imageUrl)} alt={item.title} className="absolute inset-0 size-full object-cover opacity-40" />
                ) : null}
                {edit && onChange ? (
                  <>
                    <InlineEdit value={item.tag} onChange={(v) => onChange(patchItem(d, "items", i, { tag: v }))} className="relative font-mono text-[10px] font-bold tracking-widest text-[#e31e24] block" />
                    <InlineEdit value={item.title} onChange={(v) => onChange(patchItem(d, "items", i, { title: v }))} as="h3" className="relative font-heading text-xl font-extrabold text-white block" />
                  </>
                ) : (
                  <>
                    <p className="relative font-mono text-[10px] font-bold tracking-widest text-[#e31e24]">{item.tag}</p>
                    <h3 className="relative font-heading text-xl font-extrabold text-white">{item.title}</h3>
                  </>
                )}
              </div>
            ))}
          </div>
        </ContentSection>
      );
    }

    case "cta-banner": {
      const ctaBg = d.backgroundImageUrl ? assetUrl(String(d.backgroundImageUrl)) : "";
      return (
        <ContentSection dark>
          <div className="relative overflow-hidden rounded-3xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 text-center md:p-12">
            {ctaBg ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ctaBg} alt="" className="absolute inset-0 size-full object-cover opacity-25" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#070707]/80 via-[#070707]/70 to-[#070707]/80" />
              </>
            ) : null}
            {edit && onChange ? (
              <div className="absolute left-4 top-4 z-10 h-20 w-32">
                <EditableImage
                  value={String(d.backgroundImageUrl || "")}
                  onChange={(v) => onChange(patch(d, "backgroundImageUrl", v))}
                  edit
                  placeholder="Background"
                  imgClassName="rounded-lg"
                />
              </div>
            ) : null}
            <div className="relative z-[1]">
            {edit && onChange ? (
              <>
                <InlineEdit value={String(d.title || "")} onChange={(v) => onChange(patch(d, "title", v))} as="h2" className="font-heading text-3xl font-extrabold uppercase text-white block" />
                <InlineEdit value={String(d.description || "")} onChange={(v) => onChange(patch(d, "description", v))} multiline className="mx-auto mt-4 max-w-2xl text-sm text-[#a0a0a5]" />
                <div className="mt-8 flex justify-center">
                  <span className="inline-flex h-11 items-center rounded-lg bg-[#e31e24] px-6 text-xs font-bold uppercase text-white">
                    <InlineEdit value={String(d.ctaText || "")} onChange={(v) => onChange(patch(d, "ctaText", v))} placeholder="Button" />
                  </span>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-heading text-3xl font-extrabold uppercase text-white">{String(d.title || "")}</h2>
                {d.description ? <p className="mx-auto mt-4 max-w-2xl text-sm text-[#a0a0a5]">{String(d.description)}</p> : null}
                {d.ctaText ? (
                  <div className="mt-8 flex justify-center">
                    <RedButton href={String(d.ctaHref || "#")}>{String(d.ctaText)}</RedButton>
                  </div>
                ) : null}
              </>
            )}
            </div>
          </div>
        </ContentSection>
      );
    }

    case "rich-text":
      return (
        <ContentSection>
          {edit && onChange ? (
            <>
              <InlineEdit value={String(d.title || "")} onChange={(v) => onChange(patch(d, "title", v))} as="h2" className="mb-4 font-heading text-2xl font-bold text-white block" />
              <div className="relative mb-6 h-48 overflow-hidden rounded-xl border border-[#ffffff15] bg-[#101012]">
                <EditableImage
                  value={String(d.imageUrl || "")}
                  onChange={(v) => onChange(patch(d, "imageUrl", v))}
                  edit
                  fill
                  imgClassName="object-cover"
                  placeholder="Inline зураг"
                />
              </div>
              <InlineEdit value={String(d.content || "")} onChange={(v) => onChange(patch(d, "content", v))} multiline className="text-sm leading-relaxed text-[#a0a0a5]" />
            </>
          ) : (
            <>
              {d.title ? <h2 className="mb-4 font-heading text-2xl font-bold text-white">{String(d.title)}</h2> : null}
              {d.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={assetUrl(String(d.imageUrl))} alt="" className="mb-6 max-h-80 w-full rounded-xl object-cover" />
              ) : null}
              <div className="prose prose-invert max-w-none whitespace-pre-wrap text-sm leading-relaxed text-[#a0a0a5]">{String(d.content || "")}</div>
            </>
          )}
        </ContentSection>
      );

    case "contact-hero":
      return <ContactHeroSection data={d} edit={edit} />;

    case "contact-cards":
      return <ContactCardsSection data={d} edit={edit} />;

    case "contact-info":
      return (
        <ContactCardsSection
          data={
            d.cards
              ? d
              : {
                  sectionNumber: "01",
                  sectionLabel: "ХОЛБОО БАРИХ МЭДЭЭЛЭЛ",
                  cards: [
                    d.phone && { icon: "Phone", title: "Утас", lines: String(d.phone) },
                    d.email && { icon: "Mail", title: "И-мэйл", lines: String(d.email) },
                    d.address && { icon: "MapPin", title: "Байршил", lines: String(d.address) },
                    d.hours && { icon: "Clock", title: "Ажлын цаг", lines: String(d.hours) },
                  ].filter(Boolean),
                }
          }
          edit={edit}
        />
      );

    case "contact-form-map":
    case "contact-form":
      return <ContactFormMapSection data={d} edit={edit} />;

    case "contact-categories":
      return <ContactCategoriesSection data={d} edit={edit} />;

    case "contact-social-cta":
      return <ContactSocialCtaSection data={d} edit={edit} />;

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
