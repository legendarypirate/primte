"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BarChart3,
  Calendar,
  ChevronDown,
  Crown,
  Layers,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { getPodiumOrder, getRankingSummaries } from "@/lib/athletes";
import { ContentSection, LionIcon, PageHero, RedButton, SectionTag } from "../primitives";

const podium = getPodiumOrder();
const tableData = [
  ...getRankingSummaries(),
  { rank: 5, name: "Г.Мөнх-Оргил", slug: "", division: "Production", category: "Overall", comps: 4, best10: "1,064", total: "1,064", change: -1 },
  { rank: 6, name: "Э.Баттулга", slug: "", division: "Production", category: "Overall", comps: 5, best10: "1,028", total: "1,028", change: 0 },
  { rank: 7, name: "Н.Тэмүүлэн", slug: "", division: "Carry Optics", category: "Overall", comps: 5, best10: "986", total: "986", change: 4 },
  { rank: 8, name: "Б.Учрал", slug: "", division: "Production", category: "Overall", comps: 5, best10: "962", total: "962", change: -2 },
];

const stats = [
  { icon: Users, label: "Нийт тамирчин", value: "78", change: "+12%", up: true, sub: "Өмнөх улирлаас" },
  { icon: Trophy, label: "Идэвхтэй тэмцээн", value: "6", change: "↑ +2", up: true, sub: "Энэ улиралд" },
  { icon: Calendar, label: "Шинэчлэгдсэн огноо", value: "2025.04.20", sub: "● 18:32", highlight: true },
  { icon: BarChart3, label: "Дундаж performance", value: "78.4", change: "↑ +6.3", up: true, sub: "Өмнөх улирлаас" },
];

const recentUpdates = [
  { date: "2025.04.20", time: "18:32", text: "Тайшир-6 тэмцээний оноо нэмэгдлээ" },
  { date: "2025.04.13", time: "21:10", text: "Club Match #5 чансаа шинэчлэгдлээ" },
  { date: "2025.03.30", time: "17:45", text: "IPSC Level II Тэмцээний оноо нэмэгдлээ" },
  { date: "2025.03.16", time: "19:20", text: "Club Match #4 чансаа шинэчлэгдлээ" },
];

const topMovers = [
  { rank: 1, name: "Н.Тэмүүлэн", change: "+4", points: "+86 оноо" },
  { rank: 2, name: "Д.Чинзориг", change: "+3", points: "+72 оноо" },
  { rank: 3, name: "О.Анхбаяр", change: "+2", points: "+64 оноо" },
  { rank: 4, name: "Б.Эрдэнэбат", change: "+1", points: "+28 оноо" },
  { rank: 5, name: "Г.Жавхлан", change: "+1", points: "+24 оноо" },
];

export function RankingPage() {
  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        eyebrow="PRIME PRACTICAL SHOOTING CLUB"
        title="ТАМИРЧДЫН ЧАНСАА"
        description="Тэмцээн бүрийн гүйцэтгэл. Нэгтгэсэн чансаа. Бодит ахиц."
        aside={
          <div className="hidden text-right lg:block">
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase">DISCIPLINE</p>
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase">SKILL</p>
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-[#e31e24]/80 uppercase">COMMUNITY</p>
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-muted-foreground uppercase">A HIGHER STANDARD.</p>
          </div>
        }
      >
        <RedButton href="/login">Гишүүн нэвтрэх</RedButton>
      </PageHero>

      {/* ── Filters ── */}
      <ContentSection>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { icon: Calendar, label: "Улирал", value: "2024 – 2025" },
            { icon: Layers, label: "Division", value: "Бүх Division" },
            { icon: Crown, label: "Category", value: "Бүх ангилал" },
            { icon: Trophy, label: "Тэмцээний түвшин", value: "Бүх түвшин" },
          ].map((filter) => (
            <button
              key={filter.label}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left transition-all hover:border-[#ffffff30]"
            >
              <filter.icon className="size-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">{filter.label}</p>
                <p className="text-sm">{filter.value}</p>
              </div>
              <ChevronDown className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-muted-foreground">
                <stat.icon className="size-4" />
                <p className="text-xs">{stat.label}</p>
              </div>
              <p className="mt-2 text-3xl font-bold">
                {stat.value}
                {stat.change && (
                  <span className={`ml-2 text-sm ${stat.up ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                )}
              </p>
              {stat.sub && (
                <p className={`mt-1 text-xs ${stat.highlight ? "text-[#e31e24]" : "text-muted-foreground"}`}>
                  {stat.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </ContentSection>

      {/* ── Top 3 Podium ── */}
      <ContentSection dark>
        <div className="grid w-full grid-cols-1 items-end gap-4 sm:grid-cols-3 md:gap-6">
          {podium.map((athlete) => {
            const Card = (
            <div
              className={`flex w-full flex-col items-center rounded-2xl border px-6 py-8 text-center transition-all hover:border-[#e31e24]/50 ${
                athlete.featured
                  ? "border-[#e31e24]/60 bg-gradient-to-b from-[#1a0e10] to-[#101012] shadow-[0_0_40px_#e31e2418] sm:-mt-8 sm:py-10"
                  : "border-border bg-card sm:mt-4"
              }`}
            >
              <div
                className={`mb-4 flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                  athlete.rank === 1
                    ? "bg-[#e31e24] text-white"
                    : athlete.rank === 2
                      ? "bg-[#c0c0c0] text-black"
                      : "bg-[#b91419] text-white"
                }`}
              >
                {athlete.rank}
              </div>

              <div
                className={`mb-4 size-24 overflow-hidden rounded-full border-2 bg-[#101012] md:size-28 ${
                  athlete.featured ? "border-[#e31e24] ring-2 ring-[#e31e24]/30" : "border-border"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={athlete.avatar}
                  alt={athlete.name}
                  className="size-full object-cover"
                />
              </div>

              <p className="text-lg font-semibold">{athlete.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{athlete.divisionLabel}</p>
              <p className={`mt-4 text-3xl font-bold ${athlete.featured ? "text-[#e31e24]" : "text-white"}`}>
                {athlete.score}
              </p>
              <p
                className={`mt-2 flex items-center justify-center gap-1 text-sm font-medium ${
                  athlete.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {athlete.change >= 0 ? <ArrowUp className="size-4" /> : <ArrowDown className="size-4" />}
                {athlete.change >= 0 ? `+${athlete.change}` : athlete.change}
              </p>
            </div>
            );
            return athlete.slug ? (
              <Link key={athlete.slug} href={`/ranking/${athlete.slug}`} className="block w-full">
                {Card}
              </Link>
            ) : (
              <div key={athlete.name} className="w-full">{Card}</div>
            );
          })}
        </div>
      </ContentSection>

      {/* ── Ranking Table ── */}
      <ContentSection>
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 rounded bg-[#e31e24]" />
          <h2 className="font-heading text-xl font-bold">Ерөнхий чансаа</h2>
        </div>
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-b border-border bg-[#101012] text-xs text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Байр</th>
                <th className="p-4 font-medium">Тамирчин</th>
                <th className="p-4 font-medium">Division</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Тэмцээн</th>
                <th className="p-4 font-medium">Best 10</th>
                <th className="p-4 font-medium">Нийт оноо</th>
                <th className="p-4 font-medium">Өөрчлөлт</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.name} className="border-t border-border transition-colors hover:bg-[#ffffff05]">
                  <td className="p-4 font-semibold">
                    {row.rank <= 3 ? (
                      <span className={`inline-flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                        row.rank === 1 ? "bg-[#e31e24] text-white" : row.rank === 2 ? "bg-[#c0c0c0] text-black" : "bg-[#b91419] text-white"
                      }`}>
                        {row.rank}
                      </span>
                    ) : (
                      <span className="pl-1.5">{row.rank}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {"slug" in row && row.slug && "avatar" in row ? (
                      <Link href={`/ranking/${row.slug}`} className="flex items-center gap-3 group">
                        <div className="size-8 overflow-hidden rounded-full border border-border bg-[#101012]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={row.avatar} alt="" className="size-full object-cover" />
                        </div>
                        <span className="font-medium group-hover:text-[#e31e24]">{row.name}</span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full border border-border bg-[#101012]">
                          <LionIcon className="size-4 text-[#e31e24]/40" />
                        </div>
                        <span className="font-medium">{row.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-muted-foreground">{row.division}</td>
                  <td className="p-4 text-muted-foreground">{row.category}</td>
                  <td className="p-4">{row.comps}</td>
                  <td className="p-4">{row.best10}</td>
                  <td className="p-4 font-bold text-[#e31e24]">{row.total}</td>
                  <td className="p-4">
                    {row.change > 0 && (
                      <span className="inline-flex items-center gap-1 text-green-500">
                        <ArrowUp className="size-3" /> +{row.change}
                      </span>
                    )}
                    {row.change < 0 && (
                      <span className="inline-flex items-center gap-1 text-red-500">
                        <ArrowDown className="size-3" /> {row.change}
                      </span>
                    )}
                    {row.change === 0 && <span className="text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      {/* ── Bottom 3-col: Updates, Top Movers, Chart ── */}
      <ContentSection dark>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Updates */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-5 w-1 rounded bg-[#e31e24]" />
                <p className="font-semibold">Сүүлийн шинэчлэлт</p>
              </div>
              <Link href="#" className="text-xs text-[#e31e24] hover:underline">Бүгдийг харах →</Link>
            </div>
            <div className="mt-4 space-y-4">
              {recentUpdates.map((update, idx) => (
                <div key={idx} className="flex items-start gap-3 border-l-2 border-[#ffffff15] pl-4">
                  <div className={`mt-0.5 size-2 shrink-0 rounded-full ${idx === 0 ? "bg-[#e31e24]" : "bg-[#ffffff30]"}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      <span className={idx === 0 ? "text-[#e31e24]" : ""}>{update.date}</span> {update.time}
                    </p>
                    <p className="mt-0.5 text-sm">{update.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Movers */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="h-5 w-1 rounded bg-[#e31e24]" />
              <p className="font-semibold">Top movers</p>
            </div>
            <p className="mb-4 mt-1 text-xs text-muted-foreground">Энэ сарын өсөлт</p>
            <div className="space-y-3">
              {topMovers.map((m) => (
                <div key={m.name} className="flex items-center gap-3 text-sm">
                  <span className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                    m.rank <= 3 ? "bg-[#e31e24]/20 text-[#e31e24]" : "bg-[#ffffff10] text-muted-foreground"
                  }`}>
                    {m.rank}
                  </span>
                  <span className="flex-1 font-medium">{m.name}</span>
                  <span className="text-green-500">
                    ↑ {m.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{m.points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-5 w-1 rounded bg-[#e31e24]" />
                <p className="font-semibold">Өсөлтийн хандлага</p>
              </div>
              <div className="flex items-center gap-2 rounded border border-border px-2 py-1 text-xs text-muted-foreground">
                Шилдэг 5
                <ChevronDown className="size-3" />
              </div>
            </div>

            {/* Simplified bar chart */}
            <div className="mt-6 flex h-40 items-end gap-1.5">
              {[
                { label: "12 сар", values: [60, 55, 52] },
                { label: "1 сар", values: [65, 60, 58] },
                { label: "2 сар", values: [72, 68, 62] },
                { label: "3 сар", values: [78, 75, 70] },
                { label: "4 сар", values: [85, 80, 76] },
              ].map((month) => (
                <div key={month.label} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full items-end justify-center gap-0.5">
                    <div className="w-2 rounded-t bg-[#e31e24]/80" style={{ height: `${month.values[0]}%` }} />
                    <div className="w-2 rounded-t bg-[#e31e24]/60" style={{ height: `${month.values[1]}%` }} />
                    <div className="w-2 rounded-t bg-[#4ade80]/50" style={{ height: `${month.values[2]}%` }} />
                  </div>
                  <p className="text-[9px] text-muted-foreground">{month.label}</p>
                </div>
              ))}
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-[10px]">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#e31e24]" /> О.Анхбаяр
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#e31e24]" /> Б.Эрдэнэбат
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#4ade80]" /> С.Золбоо
              </span>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
