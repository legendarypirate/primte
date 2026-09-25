"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Activity, Crown, RefreshCw, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldSelect } from "@/components/field-select";
import { api } from "@/lib/api";
import {
  MATCH_STATUS_LABEL,
  formatDateTime,
  formatHf,
  formatPoints,
  type MatchStatus,
  type ScoringOverview,
} from "@/lib/scoring";
import { ProgressBar, StatCard } from "./ui";

export function OverviewTab({
  overview,
  canManage,
  onChanged,
  onOpenScores,
}: {
  overview: ScoringOverview;
  canManage: boolean;
  onChanged: () => void;
  onOpenScores: (filter: { stageId?: string; squadId?: string; status?: string }) => void;
}) {
  const [busy, setBusy] = useState<string | null>(null);
  const { match, stats, registrations } = overview;
  if (!match || !stats) return null;

  async function run(key: string, fn: () => Promise<unknown>, success: string) {
    setBusy(key);
    try {
      await fn();
      toast.success(success);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Явц"
          value={`${stats.progress}%`}
          hint={<ProgressBar value={stats.progress} className="mt-2" />}
          tone={stats.progress >= 100 ? "success" : "default"}
        />
        <StatCard label="Баталгаажсан оноо" value={stats.signed} hint={`${stats.expected} хүлээгдэж буйгаас`} tone="success" />
        <StatCard label="Баталгаажаагүй" value={stats.pending} hint="Тамирчин гарын үсэг зураагүй" tone={stats.pending ? "warning" : "default"} />
        <StatCard label="Хүчингүй" value={stats.scores.INVALIDATED || 0} hint="Нийт хүчингүй бичлэг" tone={stats.scores.INVALIDATED ? "danger" : "default"} />
        <StatCard
          label="Оролцогч"
          value={stats.competitors.active}
          hint={`Нийт ${stats.competitors.total} · DQ ${stats.competitors.dq} · Гарсан ${stats.competitors.withdrawn}`}
        />
      </div>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Тэмцээний төлөв</span>
            <FieldSelect
              className="h-9 w-48"
              value={match.status}
              onChange={(status) =>
                canManage
                  ? run(
                      "status",
                      () => api(`/api/admin/scoring/matches/${match.id}`, { method: "PUT", body: JSON.stringify({ status }) }),
                      "Төлөв шинэчлэгдлээ"
                    )
                  : toast.error("Эрх хүрэхгүй")
              }
            >
              {(Object.keys(MATCH_STATUS_LABEL) as MatchStatus[]).map((s) => (
                <option key={s} value={s}>{MATCH_STATUS_LABEL[s]}</option>
              ))}
            </FieldSelect>
          </div>
          <div className="text-sm text-muted-foreground">
            Бүртгэл: <b className="text-foreground">{registrations.eligible}</b> төлсөн/баталгаажсан ·{" "}
            <b className="text-foreground">{registrations.imported}</b> оролцогч болсон
            {registrations.pending > 0 && <span className="text-amber-500"> · {registrations.pending} оруулаагүй</span>}
          </div>
          {canManage && (
            <div className="ml-auto flex flex-wrap gap-2">
              <Button
                variant="outline"
                disabled={busy === "import"}
                onClick={() =>
                  run(
                    "import",
                    async () => {
                      const r = await api<{ imported: number }>(`/api/admin/competitions/${overview.competition.id}/scoring/import`, { method: "POST" });
                      toast.message(`${r.imported} шинэ оролцогч нэмэгдлээ`);
                    },
                    "Бүртгэл шинэчлэгдлээ"
                  )
                }
              >
                <UserPlus className="size-4" /> Бүртгэлээс татах
              </Button>
              <Button
                variant="outline"
                disabled={busy === "recalc"}
                onClick={() =>
                  run(
                    "recalc",
                    () => api(`/api/admin/competitions/${overview.competition.id}/scoring/recalculate`, { method: "POST" }),
                    "Үр дүн дахин тооцогдлоо"
                  )
                }
              >
                <RefreshCw className={`size-4 ${busy === "recalc" ? "animate-spin" : ""}`} /> Дахин тооцох
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Стейжийн явц</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(overview.stages || []).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onOpenScores({ stageId: st.id, status: "SIGNED" })}
                  className="grid w-full grid-cols-[48px_1fr_auto] items-center gap-3 rounded-lg p-2 text-left hover:bg-muted/50"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg text-primary">
                    {st.number}
                  </span>
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="truncate font-medium">{st.name}</span>
                      <span className="text-muted-foreground">
                        {st.signed}/{st.expected}
                        {st.pending > 0 && <span className="text-amber-500"> · {st.pending} хүлээгдэж</span>}
                        {st.invalidated > 0 && <span className="text-destructive"> · {st.invalidated} хүчингүй</span>}
                      </span>
                    </div>
                    <ProgressBar value={st.progress} />
                  </div>
                  <div className="w-24 text-right text-xs text-muted-foreground">
                    <div>{st.courseType} · {st.maximumPoints}pt</div>
                    <div>Top HF {formatHf(st.topHitFactor)}</div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Скуад</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {(overview.squads || []).length === 0 && <div className="text-sm text-muted-foreground">Скуад алга.</div>}
                {(overview.squads || []).map((sq) => (
                  <button
                    key={sq.id}
                    type="button"
                    onClick={() => onOpenScores({ squadId: sq.id, status: "ALL" })}
                    className="w-full space-y-1.5 rounded-lg p-2 text-left hover:bg-muted/50"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{sq.name}</span>
                      <span className="text-muted-foreground">{sq.competitors} хүн · {sq.signed}/{sq.expected}</span>
                    </div>
                    <ProgressBar value={sq.progress} />
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Ангилалын тэргүүлэгч</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {(overview.divisions || []).length === 0 && <div className="text-sm text-muted-foreground">Ангилал алга.</div>}
                {(overview.divisions || []).map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                    <div>
                      <div className="font-medium">{d.code} <span className="text-xs text-muted-foreground">{d.name}</span></div>
                      <div className="text-xs text-muted-foreground">{d.active}/{d.competitors} идэвхтэй</div>
                    </div>
                    {d.leader ? (
                      <div className="flex items-center gap-2 text-right">
                        <Crown className="size-4 text-amber-500" />
                        <div>
                          <div className="font-medium">{d.leader.name}</div>
                          <div className="text-xs text-muted-foreground">{formatPoints(d.leader.matchPoints)} pt</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Дүн алга</span>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="size-4" /> Сүүлийн үйлдэл</CardTitle></CardHeader>
          <CardContent>
            {(overview.activity || []).length === 0 && <div className="text-sm text-muted-foreground">Үйлдэл бүртгэгдээгүй.</div>}
            <ol className="max-h-[640px] space-y-3 overflow-y-auto border-l border-border pl-4">
              {(overview.activity || []).map((a) => (
                <li key={a.id} className="relative text-sm">
                  <span
                    className={`absolute top-1.5 -left-[21px] size-2.5 rounded-full ${
                      a.action.includes("invalidated") ? "bg-destructive" : a.action.includes("signed") ? "bg-emerald-500" : "bg-primary"
                    }`}
                  />
                  <div className="font-medium">{a.label}</div>
                  {a.subject && <div className="text-muted-foreground">{a.subject}</div>}
                  {a.reason && <div className="text-xs italic">“{a.reason}”</div>}
                  <div className="text-xs text-muted-foreground">{a.actor?.name || "Тамирчин / төхөөрөмж"} · {formatDateTime(a.createdAt)}</div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
