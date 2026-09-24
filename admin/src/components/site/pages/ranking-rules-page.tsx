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

export function RankingRulesPage() {
  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        eyebrow="PRIME PRACTICAL SHOOTING CLUB"
        title={
          <>
            ЧАНСАА ТОДОРХОЙЛОХ
            <br />
            ЖУРАМ
          </>
        }
        description="PRIME клубын гишүүдийн чансаа нь IPSC Action Air тэмцээний гүйцэтгэлд үндэслэн тодорхойлогдоно."
        aside={
          <div className="hidden text-right lg:block">
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase">DISCIPLINE</p>
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase">SKILL</p>
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase">COMMUNITY</p>
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase">A HIGHER STANDARD.</p>
          </div>
        }
      />

      {/* ── Principles ── */}
      <ContentSection>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 rounded bg-[#e31e24]" />
          <h2 className="font-heading text-xl font-bold">Үндсэн зарчим</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
            <div key={p.n} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#e31e24] text-sm font-bold text-white">
                  {p.n}
                </span>
              </div>
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[#ffffff08]">
                <p.icon className="size-5 text-muted-foreground" />
              </div>
              <p className="font-semibold">{p.title}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* ── Formula ── */}
      <ContentSection dark>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.5fr]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded bg-[#e31e24]" />
              <h2 className="font-heading text-xl font-bold">Чансааны тооцооллын томьёо</h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-[#101012] p-8">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
                <Percent className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Гүйцэтгэлийн хувь</p>
                  <p className="font-semibold">(Performance %)</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-muted-foreground">×</span>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
                <BarChart3 className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Түвшний үржүүлэгч</p>
                  <p className="font-semibold">(Level multiplier)</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-muted-foreground">=</span>
              <div className="flex items-center gap-3 rounded-xl border border-[#e31e24]/40 bg-[#e31e24]/10 px-5 py-4">
                <Star className="size-5 text-[#e31e24]" />
                <div>
                  <p className="text-xs text-muted-foreground">Чансааны оноо</p>
                  <p className="font-semibold text-[#e31e24]">(Ranking point)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side notes */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 rounded bg-[#e31e24]" />
              <h2 className="font-heading text-xl font-bold">Гол нөхцөл ба тэмдэглэл</h2>
            </div>
            <div className="space-y-4 text-sm">
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-muted-foreground">
                  Чансаа нь зөвхөн PRIME клубын идэвхтэй гишүүдэд хамаарна.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-muted-foreground">
                  Зөвхөн IPSC Action Air тэмцээний үр дүн тодорхойлогдоно.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-muted-foreground">
                  Хамгийн өндөр 10 үр дүнгийн ономын нийлбээрээр чансаа тодорхойлогдоно.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-muted-foreground">
                  Шинэ тэмцээний үр дүн баталгаажсанаас хойш 48 цагийн дотор чансаа шинэчлэгдэнэ.
                </p>
              </div>
              <div className="rounded-xl border border-[#e31e24]/30 bg-[#e31e24]/5 p-4">
                <div className="flex items-center gap-2 text-[#e31e24]">
                  <Mail className="size-4" />
                  <p className="text-xs font-semibold">Асуулт, нэмэлт мэдээлэл</p>
                </div>
                <p className="mt-2 font-semibold">registration@prime.mn</p>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* ── Competition Levels Table ── */}
      <ContentSection>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 rounded bg-[#e31e24]" />
          <h2 className="font-heading text-xl font-bold">Тэмцээний түвшин ба үржүүлэгч</h2>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-border bg-[#101012] text-xs text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Түвшин</th>
                <th className="p-4 font-medium">Нэр</th>
                <th className="p-4 font-medium">Үржүүлэгч</th>
                <th className="p-4 font-medium">Тайлбар</th>
              </tr>
            </thead>
            <tbody>
              {levelTable.map((row) => (
                <tr key={row.level} className="border-t border-border">
                  <td className="p-4 font-bold text-[#e31e24]">{row.level}</td>
                  <td className="p-4 font-medium">{row.name}</td>
                  <td className="p-4 font-bold">{row.multiplier}</td>
                  <td className="p-4 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      {/* ── How Ranking Points Are Calculated ── */}
      <ContentSection dark>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 rounded bg-[#e31e24]" />
          <h2 className="font-heading text-xl font-bold">Тэмцээний үр дүн хэрхэн чансааны оноо болох вэ?</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {calculationSteps.map((step) => (
            <div key={step.n} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-[#e31e24] text-sm font-bold text-white">
                  {step.n}
                </span>
                <span className="h-px flex-1 bg-[#ffffff15]" />
              </div>
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[#ffffff08]">
                <step.icon className="size-5 text-muted-foreground" />
              </div>
              <p className="font-semibold">{step.title}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* ── FAQ ── */}
      <ContentSection>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-6 w-1 rounded bg-[#e31e24]" />
          <h2 className="font-heading text-xl font-bold">Түгээмэл асуулт</h2>
        </div>
        <div className="space-y-3">
          {[
            "Чансаанд тооцогдохын тулд хэдэн тэмцээнд оролцох шаардлагатай вэ?",
            "Аль тэмцээний үр дүнг тооцоод вэ?",
            "Хамгийн өндөр 10 үр дүн хэрхэн сонгогддог вэ?",
            "Чансаа хэзээ шинэчлэгддэг вэ?",
            "Журамд өөрчлөлт оролгж хэрхэн мэдэгдэх вэ?",
          ].map((q, idx) => (
            <div key={idx} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-[#ffffff30]">
              <span className="mt-0.5 text-sm font-bold text-[#e31e24]">{idx + 1}.</span>
              <p className="text-sm">{q}</p>
            </div>
          ))}
        </div>
      </ContentSection>
    </>
  );
}
