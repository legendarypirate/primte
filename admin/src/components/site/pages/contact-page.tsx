"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileText, HelpCircle, Mail, MapPin, MessageSquare, Phone, Send, ShoppingBag, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentSection, LionIcon, PageHero, RedButton, SectionTag } from "../primitives";

const contactCards = [
  {
    icon: Phone,
    title: "Утасны дугаар",
    lines: ["8611-0200", "9088-0200"],
    note: "Даваа – Баасан 09:00 – 18:00 цагийн хооронд холбогдоно уу.",
  },
  {
    icon: Mail,
    title: "И-мэйл",
    lines: ["info@prime.mn", "registration@prime.mn"],
    note: "Ерөнхий мэдээлэл болон бүртгэлтэй холбоотой асуултаа и-мэйлээр илгээнэ үү.",
  },
  {
    icon: MapPin,
    title: "Байршил",
    lines: ["Улаанбаатар, Монгол Улс", "Хан-Уул дүүрэг, Яармаг"],
    note: "",
    noteLink: { label: "Google Map дээр нээх →", href: "#" },
  },
  {
    icon: Clock,
    title: "Ажлын цаг",
    lines: ["Даваа – Баасан 09:00 – 18:00", "Бямба – Ням 10:00 – 17:00"],
    note: "Тэмцээн, зохион байгуулалтын арга хэмжээний үед цагийн хуваарь өөрчлөгдөж болно.",
  },
];

const faqCategories = [
  {
    icon: FileText,
    title: "Сургалтын талаар",
    body: "Сургалтын хөтөлбөр, хуваарь, бүртгэлтэй холбоотой асуулт",
  },
  {
    icon: Users,
    title: "Гишүүнчлэлийн талаар",
    body: "Гишүүн болох, гишүүний эрх болон хөнгөлөлт",
  },
  {
    icon: Trophy,
    title: "Тэмцээний талаар",
    body: "Тэмцээний бүртгэл, хуваарь, дүрэм журам",
  },
  {
    icon: HelpCircle,
    title: "Ерөнхий мэдээлэл",
    body: "Хаяг, ажиллагаа, клубын мэдээлэл, бусад санал хүсэлт",
  },
];

export function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        eyebrow="PRIME PRACTICAL SHOOTING CLUB"
        title="ХОЛБОО БАРИХ"
        description="Сургалт, гишүүнчлэл, тэмцээн болон бусад бүх төрлийн асуулт, санал хүсэлтээ бидэнтэй холбогдон аваарай."
        aside={
          <p className="hidden text-right text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:block">
            Discipline · Skill · Community · A Higher Standard.
          </p>
        }
      />

      {/* ── 01 Contact Info ── */}
      <ContentSection>
        <SectionTag n="01" label="ХОЛБОО БАРИХ МЭДЭЭЛЭЛ" />
        <p className="mb-8 text-sm text-muted-foreground">
          Бидэнтэй дараах сувгаар холбогдож, шаардлагатай мэдээллээ аваарай.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map(({ icon: Icon, title, lines, note, noteLink }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/30 bg-[#e31e24]/10">
                <Icon className="size-5 text-[#e31e24]" />
              </div>
              <p className="font-semibold">{title}</p>
              {lines.map((line) => (
                <p key={line} className="mt-2 text-sm font-medium">
                  {line}
                </p>
              ))}
              {note && <p className="mt-3 text-xs text-muted-foreground">{note}</p>}
              {noteLink && (
                <Link href={noteLink.href} className="mt-3 inline-flex text-xs text-[#e31e24] hover:underline">
                  {noteLink.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </ContentSection>

      {/* ── 02 Contact Form + Map ── */}
      <ContentSection dark>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <div>
            <SectionTag n="02" label="БИДЭНД ЗУРВАС ИЛГЭЭХ" />
            <p className="mb-6 text-sm text-muted-foreground">
              Доорх form-ыг бөглөж, бид тантай хамгийн хурдан хугацаанд холбогдох болно.
            </p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label>Овог, нэр *</Label>
                <Input placeholder="Таны нэр" className="border-border bg-[#101012]" />
              </div>
              <div className="space-y-2">
                <Label>И-мэйл *</Label>
                <Input type="email" placeholder="name@email.com" className="border-border bg-[#101012]" />
              </div>
              <div className="space-y-2">
                <Label>Утасны дугаар *</Label>
                <Input placeholder="+976 ..." className="border-border bg-[#101012]" />
              </div>
              <div className="space-y-2">
                <Label>Сэдэв *</Label>
                <Select>
                  <SelectTrigger className="border-border bg-[#101012]">
                    <SelectValue placeholder="Сэдэв сонгоно уу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">Сургалтын талаар</SelectItem>
                    <SelectItem value="membership">Гишүүнчлэлийн талаар</SelectItem>
                    <SelectItem value="competition">Тэмцээний талаар</SelectItem>
                    <SelectItem value="general">Ерөнхий мэдээлэл</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Мессеж *</Label>
                <Textarea rows={5} placeholder="Асуултаа бичнэ үү..." className="border-border bg-[#101012]" />
                <p className="text-right text-xs text-muted-foreground">0/1000</p>
              </div>
              <RedButton className="w-full">
                <Send className="size-4" />
                Илгээх
              </RedButton>
            </form>
          </div>

          {/* Map */}
          <div>
            <SectionTag n="03" label="МАНАЙ БАЙРШИЛ" />
            <p className="mb-6 text-sm text-muted-foreground">
              Клубын байршил, чиглэлийн гарын авлагыг дороос харна уу.
            </p>
            <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl border border-border bg-[#101012]">
              {/* Map placeholder with styled grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-[#e31e24]/40 bg-[#e31e24]/10">
                    <MapPin className="size-6 text-[#e31e24]" />
                  </div>
                  <p className="text-xs font-semibold">Prime Practical Shooting Club</p>
                  <p className="mt-1 text-xs text-muted-foreground">Яармаг, Хан-Уул дүүрэг</p>
                  <p className="text-xs text-muted-foreground">Улаанбаатар, Монгол Улс</p>
                </div>
              </div>
              {/* Khan-Uul label */}
              <div className="absolute top-3 right-3 rounded bg-[#1a1a1f] px-2 py-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                KHAN-UUL DISTRICT
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-[#e31e24]" />
                <p className="text-xs text-muted-foreground">Хан-Уул дүүрэг, Яармаг, Спорт цогцолборын бус, Улаанбаатар, Монгол Улс</p>
              </div>
              <Link href="#" className="whitespace-nowrap text-xs font-semibold text-[#e31e24] hover:underline">
                Google Map дээр нээх →
              </Link>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* ── 04 FAQ ── */}
      <ContentSection>
        <SectionTag n="04" label="ТҮГЭЭМЭЛ ЛАВЛАГАА" />
        <p className="mb-8 text-sm text-muted-foreground">
          Түгээмэл асуултуудыг дагуу хурдан холбогдох сувгаа сонгоно уу.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {faqCategories.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5 transition-all hover:border-[#e31e24]/40">
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/20 bg-[#e31e24]/10">
                <Icon className="size-5 text-[#e31e24]" />
              </div>
              <p className="font-semibold">{title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* ── 05 CTA Banner ── */}
      <ContentSection dark>
        <div className="relative overflow-hidden rounded-2xl border border-[#ffffff15] bg-gradient-to-r from-[#12080a] via-[#0d0d0f] to-[#12080a] p-10 md:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#e31e2408,transparent_50%)]" />
          <div className="relative flex flex-wrap items-center justify-between gap-8">
            <div>
              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#e31e24]">PRIME PRACTICAL SHOOTING CLUB</p>
              <h2 className="font-heading text-3xl font-bold md:text-4xl">ХАМТДАА ӨСӨН ХӨГЖЬЕ</h2>
              <p className="mt-3 max-w-lg text-sm text-muted-foreground">
                Асуулт, санал эсвэл хамтын ажиллагааны санаатай бол бидэнтэй холбогдоно уу. Бид ургатаг нээлттэй.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xs text-muted-foreground">Бидний дагаарай</p>
              <div className="flex gap-2 text-[10px] font-bold">
                <a href="#" className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5] transition-all hover:border-[#e31e24] hover:bg-[#e31e24] hover:text-white">
                  FB
                </a>
                <a href="#" className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5] transition-all hover:border-[#e31e24] hover:bg-[#e31e24] hover:text-white">
                  IG
                </a>
                <a href="#" className="flex size-9 items-center justify-center rounded-lg border border-[#ffffff15] bg-[#121215] text-[#a0a0a5] transition-all hover:border-[#e31e24] hover:bg-[#e31e24] hover:text-white">
                  YT
                </a>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
