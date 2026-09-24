"use client";

import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Crown,
  Info,
  Layers,
  Medal,
  Target,
  Trophy,
} from "lucide-react";
import type { AthleteProfile, ChartPoint } from "@/lib/athletes";
import { ContentSection, RedButton, SectionTag } from "../primitives";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STAT_ICONS = {
  target: Target,
  chart: BarChart3,
  trophy: Trophy,
  calendar: Calendar,
  season: Calendar,
};

function RankingChart({ points }: { points: ChartPoint[] }) {
  const w = 640;
  const h = 220;
  const pad = { t: 20, r: 20, b: 30, l: 40 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const min = Math.min(...points.map((p) => p.value)) - 40;
  const max = Math.max(...points.map((p) => p.value)) + 20;

  const coords = points.map((p, i) => {
    const x = pad.l + (i / (points.length - 1)) * innerW;
    const y = pad.t + innerH - ((p.value - min) / (max - min)) * innerH;
    return { x, y, ...p };
  });

  const line = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const area = `${coords[0].x},${pad.t + innerH} ${line} ${coords[coords.length - 1].x},${pad.t + innerH}`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[320px]" aria-hidden>
        <defs>
          <linearGradient id="rankLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e31e24" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#e31e24" />
          </linearGradient>
          <linearGradient id="rankFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e31e24" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e31e24" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.t + innerH * t;
          return <line key={t} x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke="#ffffff10" strokeWidth="1" />;
        })}
        <polygon points={area} fill="url(#rankFill)" />
        <polyline points={line} fill="none" stroke="url(#rankLine)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c) => (
          <g key={c.label}>
            <circle cx={c.x} cy={c.y} r="5" fill="#e31e24" stroke="#070707" strokeWidth="2" />
            <text x={c.x} y={h - 8} textAnchor="middle" fill="#9a958a" fontSize="10">
              {c.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MedalIcon({ place }: { place: number }) {
  if (place === 1) return <Medal className="size-4 text-yellow-400" />;
  if (place === 2) return <Medal className="size-4 text-[#c0c0c0]" />;
  if (place === 3) return <Medal className="size-4 text-[#b91419]" />;
  return <span className="text-xs font-bold text-muted-foreground">{place}</span>;
}

export function AthleteDetailPage({ athlete }: { athlete: AthleteProfile }) {
  return (
    <>
      {/* Breadcrumbs + title */}
      <section className="border-b border-[#ffffff10] bg-[#070707] px-4 py-8 md:px-6">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-white">
              Нүүр
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/ranking" className="hover:text-white">
              Чансаа
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-[#e31e24]">{athlete.name}</span>
          </nav>
          <SectionTag n="01" label="ATHLETE PROFILE" />
          <h1 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
            ТАМИРЧНЫ ЧАНСАА
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#a0a0a5]">
            Тэмцээний гүйцэтгэл, нэгтгэсэн оноо, ахицын түүх — бодит өгөгдөл дээр суурилсан дэлгэрэнгүй профайл.
          </p>
        </div>
      </section>

      {/* Profile card */}
      <ContentSection>
        <div
          className={`grid gap-6 rounded-2xl border p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8 ${
            athlete.rank === 1
              ? "border-[#e31e24]/60 bg-gradient-to-r from-[#1a0e10] via-[#101012] to-[#101012] shadow-[0_0_50px_#e31e2415]"
              : "border-border bg-card"
          }`}
        >
          <div className="relative mx-auto md:mx-0">
            {athlete.rank === 1 ? (
              <Crown className="absolute -top-3 left-1/2 size-6 -translate-x-1/2 text-yellow-400" />
            ) : null}
            <div
              className={`size-28 overflow-hidden rounded-full border-2 md:size-32 ${
                athlete.rank === 1 ? "border-[#e31e24] ring-2 ring-[#e31e24]/30" : "border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={athlete.avatar} alt={athlete.name} className="size-full object-cover" />
            </div>
          </div>

          <div className="text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">{athlete.name}</h2>
              {athlete.rankChange !== 0 ? (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                    athlete.rankChange > 0 ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"
                  }`}
                >
                  {athlete.rankChange > 0 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                  {athlete.rankChange > 0 ? `+${athlete.rankChange}` : athlete.rankChange}
                </span>
              ) : null}
            </div>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Клуб: </span>
                <span>{athlete.club}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Division: </span>
                <span>{athlete.division}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Category: </span>
                <span>{athlete.category}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Нийт оноо: </span>
                <span className="font-bold text-[#e31e24]">{athlete.totalPoints}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Тэмцээн: </span>
                <span>{athlete.competitions}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#ffffff15] bg-[#0a0a0c] px-8 py-6 text-center">
            <div
              className={`flex size-20 items-center justify-center rounded-full text-3xl font-black ${
                athlete.rank === 1
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-black"
                  : athlete.rank === 2
                    ? "bg-[#c0c0c0] text-black"
                    : "bg-[#b91419] text-white"
              }`}
            >
              {athlete.rank}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Ерөнхий чансаа</p>
            <p className="mt-1 text-lg font-bold text-white">
              {athlete.rank} / {athlete.totalAthletes}
            </p>
            <p className="text-xs text-[#e31e24]">{athlete.category}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {athlete.stats.map((stat) => {
            const Icon = STAT_ICONS[stat.icon];
            return (
              <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-4 text-[#e31e24]" />
                  <p className="text-[10px] uppercase tracking-wider">{stat.label}</p>
                </div>
                <p className="mt-2 text-2xl font-bold">
                  {stat.value}
                  {stat.trend ? (
                    <span className={`ml-2 text-sm ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>{stat.trend}</span>
                  ) : null}
                </p>
                {stat.sub ? (
                  <p className={`mt-1 text-xs ${stat.highlight ? "text-[#e31e24]" : "text-muted-foreground"}`}>{stat.sub}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </ContentSection>

      {/* Main two-column */}
      <ContentSection dark>
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            {/* Chart */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded bg-[#e31e24]" />
                  <h3 className="font-semibold">Чансааны өсөлт</h3>
                </div>
                <Select defaultValue="2024-2025">
                  <SelectTrigger className="h-8 w-[140px] border-border bg-[#101012] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024 – 2025</SelectItem>
                    <SelectItem value="2023-2024">2023 – 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <RankingChart points={athlete.chartPoints} />
            </div>

            {/* Competitions table */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-1 rounded bg-[#e31e24]" />
                  <h3 className="font-semibold">Сүүлийн 10 тэмцээн</h3>
                </div>
                <Link href="/ranking" className="text-xs text-[#e31e24] hover:underline">
                  Бүгдийг харах →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-border text-xs text-muted-foreground">
                    <tr>
                      <th className="pb-3 pr-4 font-medium">#</th>
                      <th className="pb-3 pr-4 font-medium">Огноо</th>
                      <th className="pb-3 pr-4 font-medium">Тэмцээн</th>
                      <th className="pb-3 pr-4 font-medium">Түвшин</th>
                      <th className="pb-3 pr-4 font-medium">Division</th>
                      <th className="pb-3 pr-4 font-medium">Үр дүн</th>
                      <th className="pb-3 pr-4 font-medium">Оноо</th>
                      <th className="pb-3 font-medium">Өөрчлөлт</th>
                    </tr>
                  </thead>
                  <tbody>
                    {athlete.recentCompetitions.map((row, i) => (
                      <tr key={`${row.date}-${row.name}`} className="border-t border-border">
                        <td className="py-3 pr-4 text-muted-foreground">{i + 1}</td>
                        <td className="py-3 pr-4 whitespace-nowrap">{row.date}</td>
                        <td className="py-3 pr-4 font-medium">{row.name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{row.level}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{row.division}</td>
                        <td className="py-3 pr-4">{row.result}</td>
                        <td className="py-3 pr-4 font-bold text-[#e31e24]">{row.points}</td>
                        <td className="py-3">
                          {row.change > 0 ? (
                            <span className="inline-flex items-center gap-1 text-green-500">
                              <ArrowUp className="size-3" />+{row.change}
                            </span>
                          ) : row.change < 0 ? (
                            <span className="inline-flex items-center gap-1 text-red-500">
                              <ArrowDown className="size-3" />
                              {row.change}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Шүүлтүүр</p>
              <div className="space-y-3">
                {[
                  { icon: Calendar, label: "Улирал", value: "2024 – 2025" },
                  { icon: Layers, label: "Division", value: athlete.division },
                  { icon: Trophy, label: "Category", value: athlete.category },
                ].map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-lg border border-border bg-[#101012] px-3 py-2.5 text-left text-sm"
                  >
                    <f.icon className="size-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground">{f.label}</p>
                      <p>{f.value}</p>
                    </div>
                    <ChevronDown className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <RedButton href="/ranking/rules" className="mt-4 w-full">
                Дүрэм унших
              </RedButton>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-5 w-1 rounded bg-[#e31e24]" />
                <p className="font-semibold">Top 5 үр дүн</p>
              </div>
              <div className="space-y-3">
                {athlete.topResults.map((r) => (
                  <div key={r.name + r.date} className="flex items-start gap-3 rounded-lg border border-[#ffffff08] bg-[#101012] p-3">
                    <MedalIcon place={r.place} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                    <p className="text-sm font-bold text-[#e31e24]">{r.points}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-[#e31e24]/30 bg-[#e31e24]/5 p-5">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 size-4 shrink-0 text-[#e31e24]" />
                <div>
                  <p className="text-sm font-semibold">Чансаа тооцох дүрэм</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    Сүүлийн 10 тэмцээний онооны дундаж, тэмцээний түвшин, division-оор нэгтгэн ерөнхий чансааг тооцно.
                  </p>
                  <Link href="/ranking/rules" className="mt-3 inline-flex text-xs font-semibold text-[#e31e24] hover:underline">
                    Дэлгэрэнгүй →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
