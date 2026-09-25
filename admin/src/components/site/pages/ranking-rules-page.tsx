"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  HelpCircle,
  Mail,
  Percent,
  Phone,
  Shield,
  Star,
  Trophy,
} from "lucide-react";
import { EditableBackground } from "@/components/site/editable-background";
import { EditableText } from "@/components/site/editable-text";
import { ContentSection, LionIcon, PageHero, RedButton, SectionTag } from "../primitives";

const principles = [
  {
    n: "1",
    icon: Shield,
    title: "Хамгийн бага 10 тэмцээн",
    body: "Чансаанд тооцогдохын тулд дор хаяж 10 тэмцээнд оролцсон байх шаардлагатай.",
  },
  {
    n: "2",
    icon: Trophy,
    title: "Шилдэг 10 үр дүн",
    body: "Нийт оролцсон тэмцээнүүдээс хамгийн өндөр 10 үр дүнийн онооог суммлана.",
  },
  {
    n: "3",
    icon: BarChart3,
    title: "Түвшний үржүүлэгч",
    body: "Тэмцээний түвшингээс хамаарч дараах үржүүлэгчийг ашиглана. Level I ×1, II ×2, III ×3, IV ×4, V ×5.",
  },
  {
    n: "4",
    icon: Clock,
    title: "Шинэчлэлтийн хугацаа",
    body: "Шинэ тэмцээний үр дүн баталгаажснаас хойш 48 цагийн дотор чансаа шинэчлэгдэнэ.",
  },
];

const levelTable = [
  { level: "Level I", name: "Клубын тэмцээн", multiplier: "× 1", note: "Клуб дотоодын энгийн тэмцээн" },
  { level: "Level II", name: "Нээлттэй тэмцээн", multiplier: "× 2", note: "Бусад клуб оролцсон нээлттэй тэмцээн" },
  { level: "Level III", name: "Бүсийн аварга", multiplier: "× 3", note: "Бүсийн хэмжээний тэмцээн" },
  { level: "Level IV", name: "Үндэсний аварга", multiplier: "× 4", note: "Монгол улсын аварга шалгаруулах тэмцээн" },
  { level: "Level V", name: "Олон улсын тэмцээн", multiplier: "× 5", note: "Олон улсын түвшний тэмцээн" },
];

const calculationSteps = [
  {
    n: "1",
    icon: Trophy,
    title: "Тэмцээнд оролцох",
    body: "IPSC Action Air тэмцээнд оролцож, албан ёсны үр дүн баталгаажина.",
  },
  {
    n: "2",
    icon: Percent,
    title: "Гүйцэтгэлийн хувь",
    body: "Тухайн дасгалын гүйцэтгэлийн хувь тооцогдоно. (жишээ нь: 85.6%)",
  },
  {
    n: "3",
    icon: BarChart3,
    title: "Түвшний үржүүлэгч",
    body: "Тэмцээний түвшингэд хэрэглэх үржүүлэгчээр үржүүлнэ. (жишээ нь: Level III = ×3)",
  },
  {
    n: "4",
    icon: Star,
    title: "Чансааны оноо",
    body: "Гүйцэтгэлийн хувь x түвшний үржүүлэгч = чансааны оноо. (жишээ нь: 85.6 × 3 = 256.8)",
  },
];

const notes = [
  "Чансаа нь зөвхөн PRIME клубын идэвхтэй гишүүдэд хамаарна.",
  "Зөвхөн IPSC Action Air тэмцээний үр дүн тодорхойлогдоно.",
  "Хамгийн өндөр 10 үр дүнгийн ономын нийлбээрээр чансаа тодорхойлогдоно.",
  "Шинэ тэмцээний үр дүн баталгаажсанаас хойш 48 цагийн дотор чансаа шинэчлэгдэнэ.",
];

export function RankingRulesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        eyebrow="PRIME PRACTICAL SHOOTING CLUB"
        titleText={"ЧАНСАА ТОДОРХОЙЛОХ\nЖУРАМ"}
        description="PRIME клубын гишүүдийн чансаа нь IPSC Action Air тэмцээний гүйцэтгэлд үндэслэн тодорхойлогдоно."
        aside={
          <div className="hidden text-right lg:block">
            <EditableText
              field="hero.aside.line1"
              defaultValue="DISCIPLINE"
              as="p"
              className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase block"
            />
            <EditableText
              field="hero.aside.line2"
              defaultValue="SKILL"
              as="p"
              className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase block"
            />
            <EditableText
              field="hero.aside.line3"
              defaultValue="COMMUNITY"
              as="p"
              className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase block"
            />
            <EditableText
              field="hero.aside.line4"
              defaultValue="A HIGHER STANDARD."
              as="p"
              className="font-mono text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase block"
            />
          </div>
        }
      />

      {/* ── Principles ── */}
      <ContentSection>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 rounded bg-[#e31e24]" />
          <EditableText
            field="principles.title"
            defaultValue="Үндсэн зарчим"
            as="h2"
            className="font-heading text-xl font-bold block"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, idx) => (
            <EditableBackground
              key={p.n}
              field={`principles.${idx}.imageUrl`}
              className="rounded-xl border border-border p-6"
              fallbackClassName="bg-card"
              placeholder="Principle card background"
              editMode="corner"
            >
              <div className="relative z-10 mb-4 flex items-center gap-3">
                <EditableText
                  field={`principles.${idx}.n`}
                  defaultValue={p.n}
                  className="flex size-8 items-center justify-center rounded-full bg-[#e31e24] text-sm font-bold text-white"
                />
              </div>
              <div className="relative z-10 mb-3 flex size-10 items-center justify-center rounded-lg bg-[#ffffff08]">
                <p.icon className="size-5 text-muted-foreground" />
              </div>
              <EditableText
                field={`principles.${idx}.title`}
                defaultValue={p.title}
                as="p"
                className="relative z-10 font-semibold block"
              />
              <EditableText
                field={`principles.${idx}.body`}
                defaultValue={p.body}
                multiline
                as="p"
                className="relative z-10 mt-2 text-xs leading-5 text-muted-foreground block"
              />
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* ── Formula ── */}
      <ContentSection dark>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.5fr]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded bg-[#e31e24]" />
              <EditableText
                field="formula.title"
                defaultValue="Чансааны тооцооллын томьёо"
                as="h2"
                className="font-heading text-xl font-bold block"
              />
            </div>
            <EditableBackground
              field="formula.panelImageUrl"
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border p-8"
              fallbackClassName="bg-[#101012]"
              placeholder="Formula panel background"
              editMode="corner"
            >
              <EditableBackground
                field="formula.performance.imageUrl"
                className="relative z-10 flex items-center gap-3 rounded-xl border border-border px-5 py-4"
                fallbackClassName="bg-card"
                placeholder="Formula tile background"
                editMode="corner"
              >
                <Percent className="relative z-10 size-5 text-muted-foreground" />
                <div className="relative z-10">
                  <EditableText
                    field="formula.performance.label"
                    defaultValue="Гүйцэтгэлийн хувь"
                    as="p"
                    className="text-xs text-muted-foreground block"
                  />
                  <EditableText
                    field="formula.performance.sub"
                    defaultValue="(Performance %)"
                    as="p"
                    className="font-semibold block"
                  />
                </div>
              </EditableBackground>
              <EditableText
                field="formula.times"
                defaultValue="×"
                className="relative z-10 text-2xl font-bold text-muted-foreground"
              />
              <EditableBackground
                field="formula.multiplier.imageUrl"
                className="relative z-10 flex items-center gap-3 rounded-xl border border-border px-5 py-4"
                fallbackClassName="bg-card"
                placeholder="Formula tile background"
                editMode="corner"
              >
                <BarChart3 className="relative z-10 size-5 text-muted-foreground" />
                <div className="relative z-10">
                  <EditableText
                    field="formula.multiplier.label"
                    defaultValue="Түвшний үржүүлэгч"
                    as="p"
                    className="text-xs text-muted-foreground block"
                  />
                  <EditableText
                    field="formula.multiplier.sub"
                    defaultValue="(Level multiplier)"
                    as="p"
                    className="font-semibold block"
                  />
                </div>
              </EditableBackground>
              <EditableText
                field="formula.equals"
                defaultValue="="
                className="relative z-10 text-2xl font-bold text-muted-foreground"
              />
              <EditableBackground
                field="formula.result.imageUrl"
                className="relative z-10 flex items-center gap-3 rounded-xl border border-[#e31e24]/40 px-5 py-4"
                fallbackClassName="bg-[#e31e24]/10"
                placeholder="Formula tile background"
                editMode="corner"
              >
                <Star className="relative z-10 size-5 text-[#e31e24]" />
                <div className="relative z-10">
                  <EditableText
                    field="formula.result.label"
                    defaultValue="Чансааны оноо"
                    as="p"
                    className="text-xs text-muted-foreground block"
                  />
                  <EditableText
                    field="formula.result.sub"
                    defaultValue="(Ranking point)"
                    as="p"
                    className="font-semibold text-[#e31e24] block"
                  />
                </div>
              </EditableBackground>
            </EditableBackground>
          </div>

          {/* Side notes */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded bg-[#e31e24]" />
              <EditableText
                field="notes.title"
                defaultValue="Гол нөхцөл ба тэмдэглэл"
                as="h2"
                className="font-heading text-xl font-bold block"
              />
            </div>
            <div className="space-y-4 text-sm">
              {notes.map((note, idx) => (
                <EditableBackground
                  key={idx}
                  field={`notes.${idx}.imageUrl`}
                  className="rounded-xl border border-border p-4"
                  fallbackClassName="bg-card"
                  placeholder="Note card background"
                  editMode="corner"
                >
                  <EditableText
                    field={`notes.${idx}.text`}
                    defaultValue={note}
                    multiline
                    as="p"
                    className="relative z-10 text-muted-foreground block"
                  />
                </EditableBackground>
              ))}
              <EditableBackground
                field="notes.contactImageUrl"
                className="rounded-xl border border-[#e31e24]/30 p-4"
                fallbackClassName="bg-[#e31e24]/5"
                placeholder="Contact box background"
                editMode="corner"
              >
                <div className="relative z-10 flex items-center gap-2 text-[#e31e24]">
                  <Mail className="size-4" />
                  <EditableText
                    field="notes.contact.label"
                    defaultValue="Асуулт, нэмэлт мэдээлэл"
                    as="p"
                    className="text-xs font-semibold block"
                  />
                </div>
                <EditableText
                  field="notes.contact.email"
                  defaultValue="registration@prime.mn"
                  as="p"
                  className="relative z-10 mt-2 font-semibold block"
                />
              </EditableBackground>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* ── Competition Levels Table ── */}
      <ContentSection>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 rounded bg-[#e31e24]" />
          <EditableText
            field="levels.title"
            defaultValue="Тэмцээний түвшин ба үржүүлэгч"
            as="h2"
            className="font-heading text-xl font-bold block"
          />
        </div>
        <EditableBackground
          field="levels.tableImageUrl"
          className="overflow-x-auto rounded-xl border border-border"
          fallbackClassName=""
          placeholder="Table background"
          editMode="corner"
        >
          <table className="relative z-10 w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-border bg-[#101012] text-xs text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">
                  <EditableText field="levels.header.level" defaultValue="Түвшин" />
                </th>
                <th className="p-4 font-medium">
                  <EditableText field="levels.header.name" defaultValue="Нэр" />
                </th>
                <th className="p-4 font-medium">
                  <EditableText field="levels.header.multiplier" defaultValue="Үржүүлэгч" />
                </th>
                <th className="p-4 font-medium">
                  <EditableText field="levels.header.note" defaultValue="Тайлбар" />
                </th>
              </tr>
            </thead>
            <tbody>
              {levelTable.map((row, idx) => (
                <tr key={row.level} className="border-t border-border">
                  <td className="p-4 font-bold text-[#e31e24]">
                    <EditableText field={`levels.rows.${idx}.level`} defaultValue={row.level} />
                  </td>
                  <td className="p-4 font-medium">
                    <EditableText field={`levels.rows.${idx}.name`} defaultValue={row.name} />
                  </td>
                  <td className="p-4 font-bold">
                    <EditableText field={`levels.rows.${idx}.multiplier`} defaultValue={row.multiplier} />
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <EditableText field={`levels.rows.${idx}.note`} defaultValue={row.note} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </EditableBackground>
      </ContentSection>

      {/* ── How Ranking Points Are Calculated ── */}
      <ContentSection dark>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 rounded bg-[#e31e24]" />
          <EditableText
            field="steps.title"
            defaultValue="Тэмцээний үр дүн хэрхэн чансааны оноо болох вэ?"
            as="h2"
            className="font-heading text-xl font-bold block"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {calculationSteps.map((step, idx) => (
            <EditableBackground
              key={step.n}
              field={`steps.${idx}.imageUrl`}
              className="rounded-xl border border-border p-6"
              fallbackClassName="bg-card"
              placeholder="Step card background"
              editMode="corner"
            >
              <div className="relative z-10 mb-4 flex items-center gap-2">
                <EditableText
                  field={`steps.${idx}.n`}
                  defaultValue={step.n}
                  className="flex size-8 items-center justify-center rounded-full bg-[#e31e24] text-sm font-bold text-white"
                />
                <span className="h-px flex-1 bg-[#ffffff15]" />
              </div>
              <div className="relative z-10 mb-3 flex size-10 items-center justify-center rounded-lg bg-[#ffffff08]">
                <step.icon className="size-5 text-muted-foreground" />
              </div>
              <EditableText
                field={`steps.${idx}.title`}
                defaultValue={step.title}
                as="p"
                className="relative z-10 font-semibold block"
              />
              <EditableText
                field={`steps.${idx}.body`}
                defaultValue={step.body}
                multiline
                as="p"
                className="relative z-10 mt-2 text-xs leading-5 text-muted-foreground block"
              />
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* ── FAQ ── */}
      <ContentSection>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 rounded bg-[#e31e24]" />
          <EditableText
            field="faq.title"
            defaultValue="Түгээмэл асуулт"
            as="h2"
            className="font-heading text-xl font-bold block"
          />
        </div>
        <div className="space-y-3">
          {[
            "Чансаанд тооцогдохын тулд хэдэн тэмцээнд оролцох шаардлагатай вэ?",
            "Аль тэмцээний үр дүнг тооцоод вэ?",
            "Хамгийн өндөр 10 үр дүн хэрхэн сонгогддог вэ?",
            "Чансаа хэзээ шинэчлэгддэг вэ?",
            "Журамд өөрчлөлт оролгж хэрхэн мэдэгдэх вэ?",
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
                className="relative z-10 mt-0.5 text-sm font-bold text-[#e31e24]"
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
      </ContentSection>
    </>
  );
}
