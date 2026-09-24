"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Flag,
  GraduationCap,
  Heart,
  Mail,
  Phone,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentSection, LionIcon, OutlineButton, PageHero, RedButton, SectionTag, Stepper } from "../primitives";

const highlights = [
  { icon: Shield, title: "Аюулгүй орчин", body: "Тусгайлсан инструктороор, аюулгүй ажиллагааны стандартын дагуу" },
  { icon: BookOpen, title: "Бүрэлдэхүүн", body: "Онол, баримтлал, ёс зүйг хослуулан, түрүүлэн бэлтгэл" },
  { icon: Award, title: "Ур чадвар & Дисциплин", body: "Тэвчээр, хариуцлага, давтуу, баяны ажиллагаа" },
  { icon: Trophy, title: "Тэмцээний бэлтгэл боломж", body: "Клубынх, улсын, тэмцээнд оролцолцоо" },
];

const features = [
  { icon: Shield, title: "Аюулгүй, хариуцлагтай орчин", body: "Тусгайлсан инструктороор, аюулгүй ажиллагааны стандартын дагуу" },
  { icon: Target, title: "Алхмаарч ур чадвар", body: "Тэвчээр, хариуцлага, давтуу, баяны ажиллагаа" },
  { icon: Flag, title: "Тэмцээний оролцох боломж", body: "Клубынх, улсын, тэмцээнд оролцолцоо" },
  { icon: Star, title: "Мөрөөдлөө болгожих", body: "Практик буудлагын спортыг нь бүрэн суралцаж богоосохийг хөхүүлэн дэмжинэ" },
];

const levels = [
  {
    level: "Level 1",
    name: "(Анхан)",
    duration: "3 сарын 100,000",
    tuition: "Суралт зардал 220,000",
    equipment: "—",
    l1: "1 тэмцээн",
    l2: "—",
    l34: "—",
    additional: "—",
    parent: "шаардлагатай",
  },
  {
    level: "Level 2",
    name: "(Дунд)",
    duration: "3 сарын 100,000",
    tuition: "Хөнөлт нор 200,000",
    equipment: "—",
    l1: "2 тэмцээн",
    l2: "1 тэмцээн (ТАULL)",
    l34: "—",
    additional: "—",
    parent: "хөнөлгүй",
  },
  {
    level: "Level 3",
    name: "(Ахисан)",
    duration: "Клубтай хэлэлцэн Практик буудлагын 50% хөнгөлөлт",
    tuition: "",
    equipment: "(19 цаг ашиглагч)",
    l1: "Хязгааргүй бүх тэмцээн",
    l2: "",
    l34: "",
    additional: "Хийн хадгалах/ТОК оролцох",
    parent: "Гаргаар хадгалах хяналттай",
  },
];

const documents = [
  { title: "Хүндэтгэлгүй бүртгэл", body: "" },
  { title: "Тэрэгний гэрчлэгнэлүүд", body: "" },
  { title: "Хүмүүнлэг цахим хорио", body: "" },
  { title: "Тэмцээнийн хүртэл цахиллүүлэлт", body: "" },
];

export function JuniorPage() {
  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        eyebrow="JUNIOR PROGRAM"
        title={
          <>
            ЖУНИОР
            <br />
            ХӨТӨЛБӨР
          </>
        }
        description="Өөрийн хийгий дав. Илүү их боломжийг бүтээ. Тэвчээр, хариуцлага, дисциплин. Мөрөөдөж буулгах асар нас нэг хүртэл зоригоот."
        aside={
          <div className="hidden text-right lg:block">
            <p className="font-serif text-xl italic text-muted-foreground">
              A Safer<br />
              <span className="text-[#e31e24]">Brighter</span><br />
              Stronger<br />
              Generation
            </p>
          </div>
        }
      >
        <RedButton href="#register">
          ХӨТӨЛБӨРТ БҮРТГҮҮЛЭХ →
        </RedButton>
        <OutlineButton href="#video">Хөтөлбөрийн тухай видео үзэх</OutlineButton>
      </PageHero>

      {/* ── Quick Stats ── */}
      <ContentSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "12 – 15 нас", value: "Насны ангилал" },
            { icon: Shield, label: "Аюулгүй орчин", value: "IPSC стандарт" },
            { icon: Clock, label: "Ур чадвар & Дисциплин", value: "Бэлтгэл" },
            { icon: Trophy, label: "Тэмцээний бэлтгэл", value: "Оролцох боломж" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
              <div className="flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/30 bg-[#e31e24]/10">
                <stat.icon className="size-5 text-[#e31e24]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.value}</p>
                <p className="font-semibold">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* ── Program Description + Registration ── */}
      <ContentSection dark>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: Description */}
          <div>
            <SectionTag n="01" label="PRIME JUNIOR" />
            <h2 className="font-heading text-3xl font-bold">
              ЖУНИОР ХӨТӨЛБӨР
            </h2>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              Жуниор хөтөлбөр нь 12-18 насны хүүхэд, залуус, ирээдүйн хариуцлагтай
              практик буудлагыг нэгтгэх хийн бүтээн тэмцээнд циар хөтөлбөр юм.
              Бид хүүхдийг баталгүйтсэй спорт, сонирхолтой байрнаас аюулгүй
              ажиллагаа, тусгай хөтлүүн, дадлага тэмчээнийг гүйцэтгэлийг хөхүүлнэ,
              аюулгүй загварж зохоосоол бий болгон байрлуулж, нөрний итгэлтэй залуу
              хоодонд практик, хариуцлагатай, вөртөг итгэтэй залуу IPSC
              буудлагчийг бэлтгэнэ.
            </p>

            {/* Features grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-3 rounded-xl border border-border bg-[#101012] p-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e31e24]/10">
                    <Icon className="size-4 text-[#e31e24]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Registration Form */}
          <div>
            <div className="rounded-2xl border border-border bg-card p-6" id="register">
              <h3 className="font-heading text-lg font-bold">
                ЖУНИОР ХӨТӨЛБӨРТ УРЬДЧИЛСАН БҮРТГЭЛ
              </h3>

              {/* Stepper */}
              <div className="mt-4 mb-6 flex items-center gap-2 text-xs">
                <span className="flex size-6 items-center justify-center rounded-full bg-[#e31e24] text-white text-[10px] font-bold">1</span>
                <span className="text-[#e31e24] font-semibold">Мэдээлэл</span>
                <span className="h-px flex-1 bg-[#ffffff20]" />
                <span className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground text-[10px] font-bold">2</span>
                <span className="text-muted-foreground">Action/ Мэргэж</span>
                <span className="h-px flex-1 bg-[#ffffff20]" />
                <span className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground text-[10px] font-bold">3</span>
                <span className="text-muted-foreground">Баталгаажуулалт</span>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label className="text-xs">Суралцагчийн овог, нэр *</Label>
                  <Input placeholder="Овог, нэр" className="border-border bg-[#101012]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Төрсөн огноо *</Label>
                  <Input placeholder="he: 2010/01/01" className="border-border bg-[#101012]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Хүйс</Label>
                    <Select>
                      <SelectTrigger className="border-border bg-[#101012]">
                        <SelectValue placeholder="Сонгох" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Эрэгтэй</SelectItem>
                        <SelectItem value="female">Эмэгтэй</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Бэртэл гарын</Label>
                    <Select>
                      <SelectTrigger className="border-border bg-[#101012]">
                        <SelectValue placeholder="Баруун" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="right">Баруун</SelectItem>
                        <SelectItem value="left">Зүүн</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Хөтөлбөрт урьдчилсан алхам хэрэглэнэ *</Label>
                  <Input placeholder="2025/01/01" className="border-border bg-[#101012]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Эр нэмэлт *</Label>
                  <Input placeholder="+976 ..." className="border-border bg-[#101012]" />
                </div>

                <div className="border-t border-border pt-4">
                  <p className="mb-3 text-xs font-semibold">ТЭВЭЛЭЭГҮҮРИЙН МЭДЭЭЛЭЛ</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Тэвэлээгүүрийн овог, нэр *</Label>
                  <Input placeholder="Тэвэлээгүүрийн нэр" className="border-border bg-[#101012]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Тэвэлээгүүрийн утас *</Label>
                  <Input placeholder="+976 ..." className="border-border bg-[#101012]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Тэвэлээгүүрийн & мэйл *</Label>
                  <Input type="email" placeholder="email@example.com" className="border-border bg-[#101012]" />
                </div>

                <RedButton className="w-full">
                  БҮРТГҮҮЛЭХ →
                </RedButton>
              </form>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* ── Features ── */}
      <ContentSection>
        <SectionTag n="02" label="ХӨТӨЛБӨРИЙН ОНЦЛОГ" />
        <div className="grid gap-6 md:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-xl border border-border bg-card p-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e31e24]/10">
                <Icon className="size-5 text-[#e31e24]" />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-8 flex items-center gap-6 rounded-2xl border border-border bg-[#101012] p-6">
          <LionIcon className="size-12 shrink-0 text-[#e31e24]/30" />
          <div>
            <p className="text-sm italic leading-7 text-muted-foreground">
              &ldquo;Хүүхдийн зөв чиглэл зөв цаг нь илүү сайн ирээдүйг,
              илүү боломжтой бүтээгээсж.&rdquo;
            </p>
            <p className="mt-2 text-xs font-bold tracking-[0.15em] text-[#e31e24]">PRIME</p>
            <p className="text-[9px] tracking-[0.1em] text-muted-foreground">PRACTICAL SHOOTING CLUB</p>
          </div>
        </div>
      </ContentSection>

      {/* ── Training Levels ── */}
      <ContentSection dark>
        <SectionTag n="03" label="СУРГАЛТЫН ТҮВШИН, БОЛОМЖ" />
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border bg-[#101012] text-xs text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Нас хязгаарлалт</th>
                <th className="p-4 font-medium">Level 1 (Анхан)</th>
                <th className="p-4 font-medium">Level 2 (Дунд)</th>
                <th className="p-4 font-medium">Level 3 (Ахисан)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { label: "Сургалтын төлбөр", v1: "3 сарын 100,000", v2: "3 сарын 100,000", v3: "Клубтай хэлэлцсэнээр Практик буудлагын 50% хөнгөлөлт" },
                { label: "Фраг гүйцэтгэх баатна", v1: "—", v2: "—", v3: "(19 цаг ашиглагч)" },
                { label: "Боттр тэмцээн", v1: "—", v2: "Хязгааргүй бүх тэмцээн", v3: "Хязгааргүй бүх тэмцээн" },
                { label: "Level 1 тэмцээн", v1: "1 тэмцээн", v2: "2 тэмцээн", v3: "" },
                { label: "Level 2 тэмцээн (ТАULL)", v1: "—", v2: "1 тэмцээн", v3: "" },
                { label: "Level 3,4,5 тэмцээн", v1: "—", v2: "—", v3: "" },
                { label: "Хийн хадгалах/ТОК оролцох", v1: "—", v2: "—", v3: "✓" },
                { label: "Гарт хадгалах хяналттай", v1: "шаардлагатай", v2: "хөнөлгүй", v3: "Гаргаар хадгалах хяналттай" },
              ].map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <td className="p-4 font-medium text-muted-foreground">{row.label}</td>
                  <td className="p-4">{row.v1}</td>
                  <td className="p-4">{row.v2}</td>
                  <td className="p-4">{row.v3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      {/* ── Required Documents ── */}
      <ContentSection>
        <SectionTag n="04" label="БҮРДҮҮЛЭХ МАТЕРИАЛ" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FileText, title: "Урьдчилсан бүртгэл" },
            { icon: CheckCircle, title: "Тэрэгний гэрчилгээнүүд" },
            { icon: Heart, title: "Хүмүүнлэг цахим хорио" },
            { icon: GraduationCap, title: "Тэмцээнд хүртэл цахиллүүлэлт" },
          ].map(({ icon: Icon, title }) => (
            <div key={title} className="flex items-center gap-3 rounded-xl border border-border bg-card p-5">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#e31e24]/10">
                <Icon className="size-4 text-[#e31e24]" />
              </div>
              <p className="text-sm font-semibold">{title}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* ── CTA ── */}
      <ContentSection dark>
        <div className="relative overflow-hidden rounded-2xl border border-[#e31e24]/30 bg-gradient-to-r from-[#14080a] via-[#0d0d0f] to-[#14080a] p-10 md:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#e31e2410,transparent_50%)]" />
          <div className="relative">
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-[#e31e24]">START THEIR JOURNEY</p>
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              ЗӨВ ЧИГЛЭЛ,<br />ЗӨВ ХАМТ ОЛОН
            </h2>
            <p className="mt-4 max-w-lg text-sm text-muted-foreground">
              Хүүхдийн ирээдүйд итгэх аюулгүй, илүү боломжтойгоор бүтээгээсэд.
            </p>
            <div className="mt-6">
              <RedButton href="#register">ОДОО БҮРТГҮҮЛЭХ →</RedButton>
            </div>
          </div>
          <div className="absolute right-8 bottom-8 hidden text-right lg:block">
            <p className="font-serif text-lg italic text-muted-foreground">A SAFER</p>
            <p className="font-serif text-lg italic text-[#e31e24]">BRIGHTER</p>
            <p className="font-serif text-lg italic text-muted-foreground">STRONGER</p>
            <p className="font-serif text-lg font-bold italic text-white">GENERATION</p>
          </div>
        </div>
      </ContentSection>

      {/* ── FAQ ── */}
      <ContentSection>
        <SectionTag n="05" label="ТҮГЭЭМЭЛ АСУУЛТ" />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
          <div className="space-y-4">
            {[
              "Жуниор хөтөлбөр хэдэн насны хүүхэд хамрагдаж болох вэ?",
              "Анх дэлхийн шагтгуур нар нь хэн вэ?",
              "Хэн-хэнийтэй чөлөөтэй хоосон эрэглэлтэй вэ?",
              "Сургалтын \"хөтөлбөр\" сэргээн тэтгэг вэ?",
              "Өсөхийн хариуцлагатай байж школхиддэлтгүй үү?",
            ].map((q, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-[#ffffff30]">
                <span className="mt-0.5 text-sm font-bold text-muted-foreground">{idx + 1}.</span>
                <p className="text-sm">{q}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-semibold">НЭМЭЛТ АСУУЛТ БАЙНА УУ?</p>
              <p className="mt-2 text-xs text-muted-foreground">Бидэнтэй холбогдоорой</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-[#e31e24]" />
                  <span>9088-0200</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-[#e31e24]" />
                  <span>info@prime.mn</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
