"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { InlineEdit } from "@/components/site-editor/inline-edit";
import { EditableImage } from "@/components/site-editor/editable-image";
import { ContentSection, RedButton, SectionTag } from "./primitives";
import { assetUrl } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ICONS: Record<string, LucideIcon> = {
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  Users,
  Trophy,
  HelpCircle,
  GraduationCap,
  MessageSquare,
};

function Icon({ name, className }: { name?: string; className?: string }) {
  const Cmp = (name && ICONS[name]) || HelpCircle;
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

function linesFrom(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) return value;
  return String(value || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export type ContactCard = {
  icon?: string;
  title: string;
  lines?: string | string[];
  note?: string;
  linkText?: string;
  linkHref?: string;
};

export function ContactCardsSection({
  data,
  edit,
}: {
  data: Record<string, unknown>;
  edit?: EditCtx;
}) {
  const cards = (data.cards as ContactCard[]) || [];

  return (
    <ContentSection>
      {edit ? (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <InlineEdit
            value={String(data.sectionNumber || "01")}
            onChange={(v) => edit.onChange(patch(data, "sectionNumber", v))}
            className="font-mono text-xs font-bold tracking-[0.2em] text-[#e31e24]"
          />
          <span className="h-px w-10 bg-gradient-to-r from-[#e31e24] to-transparent" />
          <InlineEdit
            value={String(data.sectionLabel || "")}
            onChange={(v) => edit.onChange(patch(data, "sectionLabel", v))}
            className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground"
          />
        </div>
      ) : (
        <SectionTag n={String(data.sectionNumber || "01")} label={String(data.sectionLabel || "")} />
      )}
      {edit ? (
        <InlineEdit
          value={String(data.intro || "")}
          onChange={(v) => edit.onChange(patch(data, "intro", v))}
          multiline
          className="mb-8 text-sm text-muted-foreground"
        />
      ) : data.intro ? (
        <p className="mb-8 text-sm text-muted-foreground">{String(data.intro)}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/30 bg-[#e31e24]/10">
              <Icon name={card.icon} className="size-5 text-[#e31e24]" />
            </div>
            {edit ? (
              <>
                <InlineEdit
                  value={card.title}
                  onChange={(v) => edit.onChange(patchItem(data, "cards", i, { title: v }))}
                  className="font-semibold block"
                />
                <InlineEdit
                  value={linesFrom(card.lines).join("\n")}
                  onChange={(v) => edit.onChange(patchItem(data, "cards", i, { lines: v }))}
                  multiline
                  className="mt-2 text-sm font-medium"
                  placeholder="Line per row"
                />
                <InlineEdit
                  value={card.note || ""}
                  onChange={(v) => edit.onChange(patchItem(data, "cards", i, { note: v }))}
                  multiline
                  className="mt-3 text-xs text-muted-foreground"
                />
                <InlineEdit
                  value={card.linkText || ""}
                  onChange={(v) => edit.onChange(patchItem(data, "cards", i, { linkText: v }))}
                  className="mt-3 text-xs text-[#e31e24] block"
                  placeholder="Link text"
                />
              </>
            ) : (
              <>
                <p className="font-semibold">{card.title}</p>
                {linesFrom(card.lines).map((line) => (
                  <p key={line} className="mt-2 text-sm font-medium">
                    {line}
                  </p>
                ))}
                {card.note ? <p className="mt-3 text-xs text-muted-foreground">{card.note}</p> : null}
                {card.linkText ? (
                  <Link href={card.linkHref || "#"} className="mt-3 inline-flex text-xs text-[#e31e24] hover:underline">
                    {card.linkText}
                  </Link>
                ) : null}
              </>
            )}
          </div>
        ))}
      </div>
    </ContentSection>
  );
}

export function ContactFormMapSection({
  data,
  edit,
}: {
  data: Record<string, unknown>;
  edit?: EditCtx;
}) {
  const subjects = linesFrom(data.subjects as string | string[]);
  const pinLines = linesFrom(data.pinLines as string | string[]);
  const [message, setMessage] = useState("");

  return (
    <ContentSection dark>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {edit ? (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <InlineEdit
                value={String(data.formTag || "02")}
                onChange={(v) => edit.onChange(patch(data, "formTag", v))}
                className="font-mono text-xs font-bold tracking-[0.2em] text-[#e31e24]"
              />
              <span className="h-px w-10 bg-gradient-to-r from-[#e31e24] to-transparent" />
              <InlineEdit
                value={String(data.formLabel || "")}
                onChange={(v) => edit.onChange(patch(data, "formLabel", v))}
                className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground"
              />
            </div>
          ) : (
            <SectionTag n={String(data.formTag || "02")} label={String(data.formLabel || "")} />
          )}
          {edit ? (
            <InlineEdit
              value={String(data.formIntro || "")}
              onChange={(v) => edit.onChange(patch(data, "formIntro", v))}
              multiline
              className="mb-6 text-sm text-muted-foreground"
            />
          ) : data.formIntro ? (
            <p className="mb-6 text-sm text-muted-foreground">{String(data.formIntro)}</p>
          ) : null}
          {edit ? (
            <p className="rounded-lg border border-dashed border-[#ffffff20] p-6 text-center text-xs text-[#a0a0a5]">
              Форм — нийтлэхэд идэвхжинэ. Subject сонголтуудыг ⚙ panel-аас засна.
            </p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Мессеж илгээгдлээ. Бид удахгүй холбогдоно.");
              }}
            >
              <div className="space-y-2">
                <Label>Овог, нэр *</Label>
                <Input placeholder="Таны нэр" className="border-border bg-[#101012]" required />
              </div>
              <div className="space-y-2">
                <Label>И-мэйл *</Label>
                <Input type="email" placeholder="name@email.com" className="border-border bg-[#101012]" required />
              </div>
              <div className="space-y-2">
                <Label>Утасны дугаар *</Label>
                <Input placeholder="+976 ..." className="border-border bg-[#101012]" required />
              </div>
              <div className="space-y-2">
                <Label>Сэдэв *</Label>
                <Select required>
                  <SelectTrigger className="border-border bg-[#101012]">
                    <SelectValue placeholder="Сэдэв сонгоно уу" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Мессеж *</Label>
                <Textarea
                  rows={5}
                  placeholder="Асуултаа бичнэ үү..."
                  className="border-border bg-[#101012]"
                  maxLength={1000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <p className="text-right text-xs text-muted-foreground">{message.length}/1000</p>
              </div>
              <RedButton className="w-full">
                <Send className="size-4" />
                {String(data.submitText || "Илгээх")}
              </RedButton>
            </form>
          )}
        </div>

        <div>
          {edit ? (
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <InlineEdit
                value={String(data.mapTag || "03")}
                onChange={(v) => edit.onChange(patch(data, "mapTag", v))}
                className="font-mono text-xs font-bold tracking-[0.2em] text-[#e31e24]"
              />
              <span className="h-px w-10 bg-gradient-to-r from-[#e31e24] to-transparent" />
              <InlineEdit
                value={String(data.mapLabel || "")}
                onChange={(v) => edit.onChange(patch(data, "mapLabel", v))}
                className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground"
              />
            </div>
          ) : (
            <SectionTag n={String(data.mapTag || "03")} label={String(data.mapLabel || "")} />
          )}
          {edit ? (
            <InlineEdit
              value={String(data.mapIntro || "")}
              onChange={(v) => edit.onChange(patch(data, "mapIntro", v))}
              multiline
              className="mb-6 text-sm text-muted-foreground"
            />
          ) : data.mapIntro ? (
            <p className="mb-6 text-sm text-muted-foreground">{String(data.mapIntro)}</p>
          ) : null}
          <div className="relative h-80 overflow-hidden rounded-2xl border border-border bg-[#101012]">
            {data.mapEmbedUrl ? (
              <iframe
                title="Map"
                src={String(data.mapEmbedUrl)}
                className="absolute inset-0 size-full border-0 grayscale contrast-125"
                loading="lazy"
              />
            ) : data.mapImageUrl ? (
              <>
                {edit ? (
                  <EditableImage
                    value={String(data.mapImageUrl || "")}
                    onChange={(v) => edit.onChange(patch(data, "mapImageUrl", v))}
                    edit
                    fill
                    imgClassName="object-cover"
                    placeholder="Map зураг"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={assetUrl(String(data.mapImageUrl))} alt="Map" className="absolute inset-0 size-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-[#e31e24]/40 bg-[#e31e24]/10">
                      <MapPin className="size-6 text-[#e31e24]" />
                    </div>
                    {edit ? (
                      <>
                        <InlineEdit
                          value={String(data.pinTitle || "")}
                          onChange={(v) => edit.onChange(patch(data, "pinTitle", v))}
                          className="text-xs font-semibold block"
                        />
                        <InlineEdit
                          value={pinLines.join("\n")}
                          onChange={(v) => edit.onChange(patch(data, "pinLines", v))}
                          multiline
                          className="mt-1 text-xs text-muted-foreground"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold">{String(data.pinTitle || "")}</p>
                        {pinLines.map((line) => (
                          <p key={line} className="mt-1 text-xs text-muted-foreground">
                            {line}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {edit ? (
                  <EditableImage
                    value={String(data.mapImageUrl || "")}
                    onChange={(v) => edit.onChange(patch(data, "mapImageUrl", v))}
                    edit
                    fill
                    imgClassName="object-cover opacity-40"
                    placeholder="Map зураг"
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-[#e31e24]/40 bg-[#e31e24]/10">
                      <MapPin className="size-6 text-[#e31e24]" />
                    </div>
                    {edit ? (
                      <>
                        <InlineEdit
                          value={String(data.pinTitle || "")}
                          onChange={(v) => edit.onChange(patch(data, "pinTitle", v))}
                          className="text-xs font-semibold block"
                        />
                        <InlineEdit
                          value={pinLines.join("\n")}
                          onChange={(v) => edit.onChange(patch(data, "pinLines", v))}
                          multiline
                          className="mt-1 text-xs text-muted-foreground"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold">{String(data.pinTitle || "")}</p>
                        {pinLines.map((line) => (
                          <p key={line} className="mt-1 text-xs text-muted-foreground">
                            {line}
                          </p>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="absolute top-3 right-3 rounded bg-[#1a1a1f] px-2 py-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  {edit ? (
                    <InlineEdit
                      value={String(data.mapBadge || "")}
                      onChange={(v) => edit.onChange(patch(data, "mapBadge", v))}
                      className="text-[10px]"
                    />
                  ) : (
                    String(data.mapBadge || "")
                  )}
                </div>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex min-w-0 items-center gap-3">
              <MapPin className="size-4 shrink-0 text-[#e31e24]" />
              {edit ? (
                <InlineEdit
                  value={String(data.mapAddressBar || "")}
                  onChange={(v) => edit.onChange(patch(data, "mapAddressBar", v))}
                  multiline
                  className="text-xs text-muted-foreground"
                />
              ) : (
                <p className="text-xs text-muted-foreground">{String(data.mapAddressBar || "")}</p>
              )}
            </div>
            {edit ? (
              <InlineEdit
                value={String(data.mapLinkText || "")}
                onChange={(v) => edit.onChange(patch(data, "mapLinkText", v))}
                className="whitespace-nowrap text-xs font-semibold text-[#e31e24]"
              />
            ) : data.mapLinkText ? (
              <Link href={String(data.mapLinkHref || "#")} target="_blank" className="whitespace-nowrap text-xs font-semibold text-[#e31e24] hover:underline">
                {String(data.mapLinkText)}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </ContentSection>
  );
}

export function ContactCategoriesSection({
  data,
  edit,
}: {
  data: Record<string, unknown>;
  edit?: EditCtx;
}) {
  const items = (data.items as { icon?: string; title: string; body: string; href?: string }[]) || [];

  return (
    <ContentSection>
      {edit ? (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <InlineEdit
            value={String(data.sectionNumber || "04")}
            onChange={(v) => edit.onChange(patch(data, "sectionNumber", v))}
            className="font-mono text-xs font-bold tracking-[0.2em] text-[#e31e24]"
          />
          <span className="h-px w-10 bg-gradient-to-r from-[#e31e24] to-transparent" />
          <InlineEdit
            value={String(data.sectionLabel || "")}
            onChange={(v) => edit.onChange(patch(data, "sectionLabel", v))}
            className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground"
          />
        </div>
      ) : (
        <SectionTag n={String(data.sectionNumber || "04")} label={String(data.sectionLabel || "")} />
      )}
      {edit ? (
        <InlineEdit
          value={String(data.intro || "")}
          onChange={(v) => edit.onChange(patch(data, "intro", v))}
          multiline
          className="mb-8 text-sm text-muted-foreground"
        />
      ) : data.intro ? (
        <p className="mb-8 text-sm text-muted-foreground">{String(data.intro)}</p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const inner = (
            <>
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/20 bg-[#e31e24]/10">
                <Icon name={item.icon} className="size-5 text-[#e31e24]" />
              </div>
              {edit ? (
                <>
                  <InlineEdit
                    value={item.title}
                    onChange={(v) => edit.onChange(patchItem(data, "items", i, { title: v }))}
                    className="font-semibold block"
                  />
                  <InlineEdit
                    value={item.body}
                    onChange={(v) => edit.onChange(patchItem(data, "items", i, { body: v }))}
                    multiline
                    className="mt-2 text-sm text-muted-foreground"
                  />
                </>
              ) : (
                <>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </>
              )}
              {!edit ? <ChevronRight className="mt-4 size-4 text-[#e31e24]/60" /> : null}
            </>
          );
          const cls = "rounded-xl border border-border bg-card p-5 transition-all hover:border-[#e31e24]/40";
          return edit ? (
            <div key={i} className={cls}>
              {inner}
            </div>
          ) : item.href ? (
            <Link key={i} href={item.href} className={cls}>
              {inner}
            </Link>
          ) : (
            <div key={i} className={cls}>
              {inner}
            </div>
          );
        })}
      </div>
    </ContentSection>
  );
}

export function ContactSocialCtaSection({
  data,
  edit,
}: {
  data: Record<string, unknown>;
  edit?: EditCtx;
}) {
  const socials = (data.socials as { label: string; href: string }[]) || [];
  const bg = data.backgroundImageUrl ? assetUrl(String(data.backgroundImageUrl)) : "";

  return (
    <ContentSection dark>
      <div className="relative overflow-hidden rounded-2xl border border-[#ffffff15] bg-gradient-to-r from-[#12080a] via-[#0d0d0f] to-[#12080a] p-10 md:p-14">
        {bg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bg} alt="" className="absolute inset-0 size-full object-cover opacity-25" />
        ) : null}
        {edit ? (
          <div className="absolute left-4 top-4 z-10 h-20 w-32">
            <EditableImage
              value={String(data.backgroundImageUrl || "")}
              onChange={(v) => edit.onChange(patch(data, "backgroundImageUrl", v))}
              edit
              placeholder="Background"
              imgClassName="rounded-lg"
            />
          </div>
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#e31e2408,transparent_50%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div>
            {edit ? (
              <>
                <InlineEdit
                  value={String(data.eyebrow || "")}
                  onChange={(v) => edit.onChange(patch(data, "eyebrow", v))}
                  className="mb-2 text-xs font-bold tracking-[0.2em] text-[#e31e24] block"
                />
                <InlineEdit
                  value={String(data.title || "")}
                  onChange={(v) => edit.onChange(patch(data, "title", v))}
                  as="h2"
                  className="font-heading text-3xl font-bold md:text-4xl block"
                />
                <InlineEdit
                  value={String(data.description || "")}
                  onChange={(v) => edit.onChange(patch(data, "description", v))}
                  multiline
                  className="mt-3 max-w-lg text-sm text-muted-foreground"
                />
              </>
            ) : (
              <>
                {data.eyebrow ? (
                  <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#e31e24]">{String(data.eyebrow)}</p>
                ) : null}
                <h2 className="font-heading text-3xl font-bold md:text-4xl">{String(data.title || "")}</h2>
                {data.description ? (
                  <p className="mt-3 max-w-lg text-sm text-muted-foreground">{String(data.description)}</p>
                ) : null}
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            {edit ? (
              <InlineEdit
                value={String(data.followLabel || "")}
                onChange={(v) => edit.onChange(patch(data, "followLabel", v))}
                className="text-xs text-muted-foreground"
              />
            ) : (
              <p className="text-xs text-muted-foreground">{String(data.followLabel || "Бидний дагаарай")}</p>
            )}
            <div className="flex gap-2 text-[10px] font-bold">
              {socials.map((s, i) =>
                edit ? (
                  <span
                    key={i}
                    className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5]"
                  >
                    <InlineEdit
                      value={s.label}
                      onChange={(v) => edit.onChange(patchItem(data, "socials", i, { label: v }))}
                      className="text-[10px]"
                    />
                  </span>
                ) : (
                  <a
                    key={i}
                    href={s.href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5] transition-all hover:border-[#e31e24] hover:bg-[#e31e24] hover:text-white"
                  >
                    {s.label}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </ContentSection>
  );
}

export function ContactHeroSection({
  data,
  edit,
}: {
  data: Record<string, unknown>;
  edit?: EditCtx;
}) {
  const bg = data.backgroundImageUrl ? assetUrl(String(data.backgroundImageUrl)) : "";

  return (
    <section className="relative overflow-hidden border-b border-[#ffffff10] bg-[#070707]">
      {bg ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bg} alt="" className="absolute inset-0 size-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070707] via-[#070707]/85 to-[#070707]/60" />
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
          {edit ? (
            <div className="mb-4 flex items-center gap-2">
              <InlineEdit
                value={String(data.eyebrow || "")}
                onChange={(v) => edit.onChange(patch(data, "eyebrow", v))}
                className="font-mono text-xs font-bold tracking-[0.25em] text-[#e31e24]"
                placeholder="Eyebrow"
              />
              <span className="h-px w-8 bg-[#e31e24]" />
            </div>
          ) : data.eyebrow ? (
            <div className="mb-4 flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-[0.25em] text-[#e31e24]">{String(data.eyebrow)}</span>
              <span className="h-px w-8 bg-[#e31e24]" />
            </div>
          ) : null}
          {edit ? (
            <InlineEdit
              value={String(data.title || "")}
              onChange={(v) => edit.onChange(patch(data, "title", v))}
              as="h1"
              className="font-heading text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl block"
            />
          ) : (
            <h1 className="font-heading text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              {String(data.title || "")}
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
        </div>
        <div className="hidden lg:flex lg:justify-end">
          {edit ? (
            <InlineEdit
              value={String(data.sidebarText || "")}
              onChange={(v) => edit.onChange(patch(data, "sidebarText", v))}
              multiline
              className="max-w-[140px] text-right text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground"
              placeholder="Sidebar text"
            />
          ) : data.sidebarText ? (
            <p className="max-w-[140px] text-right text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
              {String(data.sidebarText)}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Static fallback content matching CMS defaults */
export const CONTACT_PAGE_DEFAULTS = {
  hero: {
    eyebrow: "PRIME PRACTICAL SHOOTING CLUB",
    title: "ХОЛБОО БАРИХ",
    description: "Сургалт, гишүүнчлэл, тэмцээн болон бусад бүх төрлийн асуулт, санал хүсэлтээ бидэнтэй холбогдон аваарай.",
    sidebarText: "Discipline · Skill · Community · A Higher Standard.",
  },
  cards: {
    sectionNumber: "01",
    sectionLabel: "ХОЛБОО БАРИХ МЭДЭЭЛЭЛ",
    intro: "Бидэнтэй дараах сувгаар холбогдож, шаардлагатай мэдээллээ аваарай.",
    cards: [
      { icon: "Phone", title: "Утасны дугаар", lines: "8611-0200\n9088-0200", note: "Даваа – Баасан 09:00 – 18:00 цагийн хооронд холбогдоно уу." },
      { icon: "Mail", title: "И-мэйл", lines: "info@prime.mn\nregistration@prime.mn", note: "Ерөнхий мэдээлэл болон бүртгэлтэй холбоотой асуултаа и-мэйлээр илгээнэ үү." },
      { icon: "MapPin", title: "Байршил", lines: "Улаанбаатар, Монгол Улс\nХан-Уул дүүрэг, Яармаг", linkText: "Google Map дээр нээх →", linkHref: "https://maps.google.com" },
      { icon: "Clock", title: "Ажлын цаг", lines: "Даваа – Баасан 09:00 – 18:00\nБямба – Ням 10:00 – 17:00", note: "Тэмцээн, зохион байгуулалтын арга хэмжээний үед цагийн хуваарь өөрчлөгдөж болно." },
    ],
  },
  formMap: {
    formTag: "02",
    formLabel: "БИДЭНД ЗУРВАС ИЛГЭЭХ",
    formIntro: "Доорх form-ыг бөглөж, бид тантай хамгийн хурдан хугацаанд холбогдох болно.",
    submitText: "Илгээх",
    subjects: "Сургалтын талаар\nГишүүнчлэлийн талаар\nТэмцээний талаар\nЕрөнхий мэдээлэл",
    mapTag: "03",
    mapLabel: "МАНАЙ БАЙРШИЛ",
    mapIntro: "Клубын байршил, чиглэлийн гарын авлагыг дороос харна уу.",
    pinTitle: "Prime Practical Shooting Club",
    pinLines: "Яармаг, Хан-Уул дүүрэг\nУлаанбаатар, Монгол Улс",
    mapBadge: "KHAN-UUL DISTRICT",
    mapAddressBar: "Хан-Уул дүүрэг, Яармаг, Спорт цогцолборын баруун, Улаанбаатар, Монгол Улс",
    mapLinkText: "Google Map дээр нээх →",
    mapLinkHref: "https://maps.google.com",
  },
  categories: {
    sectionNumber: "04",
    sectionLabel: "ТҮГЭЭМЭЛ ЛАВЛАГАА",
    intro: "Түгээмэл асуултуудыг дагуу хурдан холбогдох сувгаа сонгоно уу.",
    items: [
      { icon: "GraduationCap", title: "Сургалтын талаар", body: "Сургалтын хөтөлбөр, хуваарь, бүртгэлтэй холбоотой асуулт", href: "/training" },
      { icon: "Users", title: "Гишүүнчлэлийн талаар", body: "Гишүүн болох, гишүүний эрх болон хөнгөлөлт", href: "/membership" },
      { icon: "Trophy", title: "Тэмцээний талаар", body: "Тэмцээний бүртгэл, хуваарь, дүрэм журам", href: "/ranking" },
      { icon: "HelpCircle", title: "Ерөнхий мэдээлэл", body: "Хаяг, ажиллагаа, клубын мэдээлэл, бусад санал хүсэлт", href: "/about" },
    ],
  },
  socialCta: {
    eyebrow: "PRIME PRACTICAL SHOOTING CLUB",
    title: "ХАМТДАА ӨСӨН ХӨГЖЬЕ",
    description: "Асуулт, санал эсвэл хамтын ажиллагааны санаатай бол бидэнтэй холбогдоно уу. Бид ургатаг нээлттэй.",
    followLabel: "Бидний дагаарай",
    socials: [
      { label: "FB", href: "https://facebook.com" },
      { label: "IG", href: "https://instagram.com" },
      { label: "YT", href: "https://youtube.com" },
    ],
  },
};
