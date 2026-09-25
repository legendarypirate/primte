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
import { EditableBackground } from "@/components/site/editable-background";
import { EditableText } from "@/components/site/editable-text";
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
        titleText={"ЖУНИОР\nХӨТӨЛБӨР"}
        description="Өөрийн хийгий дав. Илүү их боломжийг бүтээ. Тэвчээр, хариуцлага, дисциплин. Мөрөөдөж буулгах асар нас нэг хүртэл зоригоот."
        aside={
          <div className="hidden text-right lg:block">
            <p className="font-serif text-xl italic text-muted-foreground">
              <EditableText field="hero.aside.line1" defaultValue="A Safer" />
              <br />
              <EditableText field="hero.aside.line2" defaultValue="Brighter" className="text-[#e31e24]" />
              <br />
              <EditableText field="hero.aside.line3" defaultValue="Stronger" />
              <br />
              <EditableText field="hero.aside.line4" defaultValue="Generation" />
            </p>
          </div>
        }
      >
        <RedButton href="#register">
          <EditableText field="hero.ctaPrimary" defaultValue="ХӨТӨЛБӨРТ БҮРТГҮҮЛЭХ →" />
        </RedButton>
        <OutlineButton href="#video">
          <EditableText field="hero.ctaSecondary" defaultValue="Хөтөлбөрийн тухай видео үзэх" />
        </OutlineButton>
      </PageHero>

      {/* ── Quick Stats ── */}
      <ContentSection>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Users, label: "12 – 15 нас", value: "Насны ангилал" },
            { icon: Shield, label: "Аюулгүй орчин", value: "IPSC стандарт" },
            { icon: Clock, label: "Ур чадвар & Дисциплин", value: "Бэлтгэл" },
            { icon: Trophy, label: "Тэмцээний бэлтгэл", value: "Оролцох боломж" },
          ].map((stat, idx) => (
            <EditableBackground
              key={stat.label}
              field={`stats.${idx}.imageUrl`}
              className="flex items-center gap-4 rounded-xl border border-border p-5"
              fallbackClassName="bg-card"
              placeholder="Stat card background"
              editMode="corner"
            >
              <div className="relative z-10 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/30 bg-[#e31e24]/10">
                <stat.icon className="size-5 text-[#e31e24]" />
              </div>
              <div className="relative z-10">
                <EditableText
                  field={`stats.${idx}.value`}
                  defaultValue={stat.value}
                  as="p"
                  className="text-xs text-muted-foreground block"
                />
                <EditableText
                  field={`stats.${idx}.label`}
                  defaultValue={stat.label}
                  as="p"
                  className="font-semibold block"
                />
              </div>
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* ── Program Description + Registration ── */}
      <ContentSection dark>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: Description */}
          <div>
            <SectionTag n="01" label="PRIME JUNIOR" fieldPrefix="section.01" />
            <EditableText
              field="program.title"
              defaultValue="ЖУНИОР ХӨТӨЛБӨР"
              as="h2"
              className="font-heading text-3xl font-bold block"
            />
            <EditableText
              field="program.body"
              defaultValue="Жуниор хөтөлбөр нь 12-18 насны хүүхэд, залуус, ирээдүйн хариуцлагтай практик буудлагыг нэгтгэх хийн бүтээн тэмцээнд циар хөтөлбөр юм. Бид хүүхдийг баталгүйтсэй спорт, сонирхолтой байрнаас аюулгүй ажиллагаа, тусгай хөтлүүн, дадлага тэмчээнийг гүйцэтгэлийг хөхүүлнэ, аюулгүй загварж зохоосоол бий болгон байрлуулж, нөрний итгэлтэй залуу хоодонд практик, хариуцлагатай, вөртөг итгэтэй залуу IPSC буудлагчийг бэлтгэнэ."
              multiline
              as="p"
              className="mt-6 text-sm leading-7 text-muted-foreground block"
            />

            {/* Features grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, title, body }, idx) => (
                <EditableBackground
                  key={title}
                  field={`highlights.${idx}.imageUrl`}
                  className="flex gap-3 rounded-xl border border-border p-4"
                  fallbackClassName="bg-[#101012]"
                  placeholder="Highlight card background"
                  editMode="corner"
                >
                  <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#e31e24]/10">
                    <Icon className="size-4 text-[#e31e24]" />
                  </div>
                  <div className="relative z-10">
                    <EditableText
                      field={`highlights.${idx}.title`}
                      defaultValue={title}
                      as="p"
                      className="text-sm font-semibold block"
                    />
                    <EditableText
                      field={`highlights.${idx}.body`}
                      defaultValue={body}
                      multiline
                      as="p"
                      className="mt-1 text-xs text-muted-foreground block"
                    />
                  </div>
                </EditableBackground>
              ))}
            </div>
          </div>

          {/* Right: Registration Form */}
          <div id="register">
            <EditableBackground
              field="register.cardImageUrl"
              className="rounded-2xl border border-border p-6"
              fallbackClassName="bg-card"
              placeholder="Registration card background"
              editMode="corner"
            >
              <div className="relative z-10">
                <EditableText
                  field="register.title"
                  defaultValue="ЖУНИОР ХӨТӨЛБӨРТ УРЬДЧИЛСАН БҮРТГЭЛ"
                  multiline
                  as="h3"
                  className="font-heading text-lg font-bold block"
                />

                {/* Stepper */}
                <div className="mt-4 mb-6 flex items-center gap-2 text-xs">
                  <EditableText
                    field="register.steps.0.n"
                    defaultValue="1"
                    className="flex size-6 items-center justify-center rounded-full bg-[#e31e24] text-white text-[10px] font-bold"
                  />
                  <EditableText
                    field="register.steps.0.label"
                    defaultValue="Мэдээлэл"
                    className="text-[#e31e24] font-semibold"
                  />
                  <span className="h-px flex-1 bg-[#ffffff20]" />
                  <EditableText
                    field="register.steps.1.n"
                    defaultValue="2"
                    className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground text-[10px] font-bold"
                  />
                  <EditableText
                    field="register.steps.1.label"
                    defaultValue="Action/ Мэргэж"
                    className="text-muted-foreground"
                  />
                  <span className="h-px flex-1 bg-[#ffffff20]" />
                  <EditableText
                    field="register.steps.2.n"
                    defaultValue="3"
                    className="flex size-6 items-center justify-center rounded-full border border-border text-muted-foreground text-[10px] font-bold"
                  />
                  <EditableText
                    field="register.steps.2.label"
                    defaultValue="Баталгаажуулалт"
                    className="text-muted-foreground"
                  />
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <Label className="text-xs">
                      <EditableText field="register.form.studentName" defaultValue="Суралцагчийн овог, нэр *" />
                    </Label>
                    <Input placeholder="Овог, нэр" className="border-border bg-[#101012]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">
                      <EditableText field="register.form.birthDate" defaultValue="Төрсөн огноо *" />
                    </Label>
                    <Input placeholder="he: 2010/01/01" className="border-border bg-[#101012]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">
                        <EditableText field="register.form.gender" defaultValue="Хүйс" />
                      </Label>
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
                      <Label className="text-xs">
                        <EditableText field="register.form.hand" defaultValue="Бэртэл гарын" />
                      </Label>
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
                    <Label className="text-xs">
                      <EditableText field="register.form.startDate" defaultValue="Хөтөлбөрт урьдчилсан алхам хэрэглэнэ *" />
                    </Label>
                    <Input placeholder="2025/01/01" className="border-border bg-[#101012]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">
                      <EditableText field="register.form.phone" defaultValue="Эр нэмэлт *" />
                    </Label>
                    <Input placeholder="+976 ..." className="border-border bg-[#101012]" />
                  </div>

                  <div className="border-t border-border pt-4">
                    <EditableText
                      field="register.form.guardianHeading"
                      defaultValue="ТЭВЭЛЭЭГҮҮРИЙН МЭДЭЭЛЭЛ"
                      as="p"
                      className="mb-3 text-xs font-semibold block"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">
                      <EditableText field="register.form.guardianName" defaultValue="Тэвэлээгүүрийн овог, нэр *" />
                    </Label>
                    <Input placeholder="Тэвэлээгүүрийн нэр" className="border-border bg-[#101012]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">
                      <EditableText field="register.form.guardianPhone" defaultValue="Тэвэлээгүүрийн утас *" />
                    </Label>
                    <Input placeholder="+976 ..." className="border-border bg-[#101012]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">
                      <EditableText field="register.form.guardianEmail" defaultValue="Тэвэлээгүүрийн & мэйл *" />
                    </Label>
                    <Input type="email" placeholder="email@example.com" className="border-border bg-[#101012]" />
                  </div>

                  <RedButton className="w-full">
                    <EditableText field="register.form.submit" defaultValue="БҮРТГҮҮЛЭХ →" />
                  </RedButton>
                </form>
              </div>
            </EditableBackground>
          </div>
        </div>
      </ContentSection>

      {/* ── Features ── */}
      <ContentSection>
        <SectionTag n="02" label="ХӨТӨЛБӨРИЙН ОНЦЛОГ" fieldPrefix="section.02" />
        <div className="grid gap-6 md:grid-cols-2">
          {features.map(({ icon: Icon, title, body }, idx) => (
            <EditableBackground
              key={title}
              field={`features.${idx}.imageUrl`}
              className="flex gap-4 rounded-xl border border-border p-6"
              fallbackClassName="bg-card"
              placeholder="Feature card background"
              editMode="corner"
            >
              <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e31e24]/10">
                <Icon className="size-5 text-[#e31e24]" />
              </div>
              <div className="relative z-10">
                <EditableText
                  field={`features.${idx}.title`}
                  defaultValue={title}
                  as="p"
                  className="font-semibold block"
                />
                <EditableText
                  field={`features.${idx}.body`}
                  defaultValue={body}
                  multiline
                  as="p"
                  className="mt-2 text-sm text-muted-foreground block"
                />
              </div>
            </EditableBackground>
          ))}
        </div>

        {/* Quote */}
        <EditableBackground
          field="features.quoteImageUrl"
          className="mt-8 flex items-center gap-6 rounded-2xl border border-border p-6"
          fallbackClassName="bg-[#101012]"
          placeholder="Quote background"
          editMode="corner"
        >
          <LionIcon className="relative z-10 size-12 shrink-0 text-[#e31e24]/30" />
          <div className="relative z-10">
            <EditableText
              field="features.quote"
              defaultValue="“Хүүхдийн зөв чиглэл зөв цаг нь илүү сайн ирээдүйг, илүү боломжтой бүтээгээсж.”"
              multiline
              as="p"
              className="text-sm italic leading-7 text-muted-foreground block"
            />
            <EditableText
              field="features.quoteBrand"
              defaultValue="PRIME"
              as="p"
              className="mt-2 text-xs font-bold tracking-[0.15em] text-[#e31e24] block"
            />
            <EditableText
              field="features.quoteSubtitle"
              defaultValue="PRACTICAL SHOOTING CLUB"
              as="p"
              className="text-[9px] tracking-[0.1em] text-muted-foreground block"
            />
          </div>
        </EditableBackground>
      </ContentSection>

      {/* ── Training Levels ── */}
      <ContentSection dark>
        <SectionTag n="03" label="СУРГАЛТЫН ТҮВШИН, БОЛОМЖ" fieldPrefix="section.03" />
        <EditableBackground
          field="levels.tableImageUrl"
          className="mt-6 overflow-x-auto rounded-xl border border-border"
          fallbackClassName=""
          placeholder="Table background"
          editMode="corner"
        >
          <table className="relative z-10 w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-border bg-[#101012] text-xs text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">
                  <EditableText field="levels.header.0" defaultValue="Нас хязгаарлалт" />
                </th>
                <th className="p-4 font-medium">
                  <EditableText field="levels.header.1" defaultValue="Level 1 (Анхан)" />
                </th>
                <th className="p-4 font-medium">
                  <EditableText field="levels.header.2" defaultValue="Level 2 (Дунд)" />
                </th>
                <th className="p-4 font-medium">
                  <EditableText field="levels.header.3" defaultValue="Level 3 (Ахисан)" />
                </th>
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
              ].map((row, idx) => (
                <tr key={row.label} className="border-t border-border">
                  <td className="p-4 font-medium text-muted-foreground">
                    <EditableText field={`levels.rows.${idx}.label`} defaultValue={row.label} />
                  </td>
                  <td className="p-4">
                    <EditableText field={`levels.rows.${idx}.v1`} defaultValue={row.v1} />
                  </td>
                  <td className="p-4">
                    <EditableText field={`levels.rows.${idx}.v2`} defaultValue={row.v2} />
                  </td>
                  <td className="p-4">
                    <EditableText field={`levels.rows.${idx}.v3`} defaultValue={row.v3} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </EditableBackground>
      </ContentSection>

      {/* ── Required Documents ── */}
      <ContentSection>
        <SectionTag n="04" label="БҮРДҮҮЛЭХ МАТЕРИАЛ" fieldPrefix="section.04" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FileText, title: "Урьдчилсан бүртгэл" },
            { icon: CheckCircle, title: "Тэрэгний гэрчилгээнүүд" },
            { icon: Heart, title: "Хүмүүнлэг цахим хорио" },
            { icon: GraduationCap, title: "Тэмцээнд хүртэл цахиллүүлэлт" },
          ].map(({ icon: Icon, title }, idx) => (
            <EditableBackground
              key={title}
              field={`documents.${idx}.imageUrl`}
              className="flex items-center gap-3 rounded-xl border border-border p-5"
              fallbackClassName="bg-card"
              placeholder="Document card background"
              editMode="corner"
            >
              <div className="relative z-10 flex size-9 items-center justify-center rounded-lg bg-[#e31e24]/10">
                <Icon className="size-4 text-[#e31e24]" />
              </div>
              <EditableText
                field={`documents.${idx}.title`}
                defaultValue={title}
                as="p"
                className="relative z-10 text-sm font-semibold block"
              />
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* ── CTA ── */}
      <ContentSection dark>
        <EditableBackground
          field="cta.bannerImageUrl"
          className="relative overflow-hidden rounded-2xl border border-[#e31e24]/30 p-10 md:p-14"
          fallbackClassName="bg-gradient-to-r from-[#14080a] via-[#0d0d0f] to-[#14080a]"
          placeholder="CTA banner background"
          editMode="corner"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#e31e2410,transparent_50%)]" />
          <div className="relative z-10">
            <EditableText
              field="cta.eyebrow"
              defaultValue="START THEIR JOURNEY"
              as="p"
              className="mb-2 text-xs font-bold tracking-[0.2em] text-[#e31e24] block"
            />
            <EditableText
              field="cta.title"
              defaultValue={"ЗӨВ ЧИГЛЭЛ,\nЗӨВ ХАМТ ОЛОН"}
              multiline
              as="h2"
              className="font-heading text-3xl font-bold md:text-4xl block whitespace-pre-line"
            />
            <EditableText
              field="cta.body"
              defaultValue="Хүүхдийн ирээдүйд итгэх аюулгүй, илүү боломжтойгоор бүтээгээсэд."
              multiline
              as="p"
              className="mt-4 max-w-lg text-sm text-muted-foreground block"
            />
            <div className="mt-6">
              <RedButton href="#register">
                <EditableText field="cta.button" defaultValue="ОДОО БҮРТГҮҮЛЭХ →" />
              </RedButton>
            </div>
          </div>
          <div className="absolute right-8 bottom-8 z-10 hidden text-right lg:block">
            <EditableText
              field="cta.aside.line1"
              defaultValue="A SAFER"
              as="p"
              className="font-serif text-lg italic text-muted-foreground block"
            />
            <EditableText
              field="cta.aside.line2"
              defaultValue="BRIGHTER"
              as="p"
              className="font-serif text-lg italic text-[#e31e24] block"
            />
            <EditableText
              field="cta.aside.line3"
              defaultValue="STRONGER"
              as="p"
              className="font-serif text-lg italic text-muted-foreground block"
            />
            <EditableText
              field="cta.aside.line4"
              defaultValue="GENERATION"
              as="p"
              className="font-serif text-lg font-bold italic text-white block"
            />
          </div>
        </EditableBackground>
      </ContentSection>

      {/* ── FAQ ── */}
      <ContentSection>
        <SectionTag n="05" label="ТҮГЭЭМЭЛ АСУУЛТ" fieldPrefix="section.05" />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.4fr]">
          <div className="space-y-4">
            {[
              "Жуниор хөтөлбөр хэдэн насны хүүхэд хамрагдаж болох вэ?",
              "Анх дэлхийн шагтгуур нар нь хэн вэ?",
              "Хэн-хэнийтэй чөлөөтэй хоосон эрэглэлтэй вэ?",
              "Сургалтын \"хөтөлбөр\" сэргээн тэтгэг вэ?",
              "Өсөхийн хариуцлагатай байж школхиддэлтгүй үү?",
            ].map((q, idx) => (
              <EditableBackground
                key={idx}
                field={`faq.${idx}.imageUrl`}
                className="flex items-start gap-3 rounded-xl border border-border p-5 transition-all hover:border-[#ffffff30]"
                fallbackClassName="bg-card"
                placeholder="FAQ card background"
                editMode="corner"
              >
                <EditableText
                  field={`faq.${idx}.number`}
                  defaultValue={`${idx + 1}.`}
                  className="relative z-10 mt-0.5 text-sm font-bold text-muted-foreground"
                />
                <EditableText
                  field={`faq.${idx}.question`}
                  defaultValue={q}
                  multiline
                  as="p"
                  className="relative z-10 text-sm block"
                />
              </EditableBackground>
            ))}
          </div>
          <div className="space-y-4">
            <EditableBackground
              field="faq.contactImageUrl"
              className="rounded-xl border border-border p-5"
              fallbackClassName="bg-card"
              placeholder="Contact card background"
              editMode="corner"
            >
              <div className="relative z-10">
                <EditableText
                  field="faq.contact.title"
                  defaultValue="НЭМЭЛТ АСУУЛТ БАЙНА УУ?"
                  as="p"
                  className="text-sm font-semibold block"
                />
                <EditableText
                  field="faq.contact.subtitle"
                  defaultValue="Бидэнтэй холбогдоорой"
                  as="p"
                  className="mt-2 text-xs text-muted-foreground block"
                />
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-4 text-[#e31e24]" />
                    <EditableText field="faq.contact.phone" defaultValue="9088-0200" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 text-[#e31e24]" />
                    <EditableText field="faq.contact.email" defaultValue="info@prime.mn" />
                  </div>
                </div>
              </div>
            </EditableBackground>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
