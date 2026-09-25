"use client";

import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Download, Medal, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { COMPETITOR_STATUS_LABEL, MATCH_STATUS_LABEL, downloadCsv, formatHf, formatPoints, type ResultsResponse } from "@/lib/scoring";
import { EmptyState, FilterChip } from "./ui";

const MEDAL = ["text-amber-400", "text-slate-400", "text-orange-500"];

export function ResultsTab({
  competitionId,
  competitionTitle,
  refreshKey,
}: {
  competitionId: string;
  competitionTitle: string;
  refreshKey: number;
}) {
  const [data, setData] = useState<ResultsResponse | null>(null);
  const [divisionId, setDivisionId] = useState("");
  const [showStages, setShowStages] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<ResultsResponse>(`/api/admin/competitions/${competitionId}/scoring/results`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, [competitionId, refreshKey]);

  if (!data) return <div className="text-sm text-muted-foreground">Ачаалж байна…</div>;
  if (!data.divisions.length) return <EmptyState>Ангилал алга. Бүртгэлээс оролцогч татна уу.</EmptyState>;

  const division = data.divisions.find((d) => d.id === divisionId) || data.divisions[0];
  const stages = data.stages;

  function exportCsv() {
    const rows: (string | number | null | undefined)[][] = [];
    for (const d of data!.divisions) {
      rows.push([`${d.code} — ${d.name}`]);
      rows.push(["Байр", "Тамирчин", "Гишүүний код", "Скуад", "Оноо", "%", ...stages.flatMap((s) => [`S${s.number} HF`, `S${s.number} оноо`])]);
      for (const r of d.rows) {
        rows.push([
          r.rank,
          r.competitor.name,
          r.competitor.memberCode,
          r.competitor.squadName,
          formatPoints(r.matchPoints),
          formatPoints(r.matchPercentage),
          ...stages.flatMap((s) => [r.stages[s.id] ? formatHf(r.stages[s.id].hitFactor) : "", r.stages[s.id] ? formatPoints(r.stages[s.id].stagePoints) : ""]),
        ]);
      }
      for (const u of d.unranked) rows.push(["—", u.competitor.name, u.competitor.memberCode, u.competitor.squadName, u.reason]);
      rows.push([]);
    }
    downloadCsv(`${competitionTitle || "results"}-үр-дүн.csv`, rows);
  }

  return (
    <div className="space-y-4 print:space-y-2">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        {data.divisions.map((d) => (
          <FilterChip key={d.id} active={division.id === d.id} onClick={() => setDivisionId(d.id)}>
            {d.code} <span className="opacity-70">({d.rows.length})</span>
          </FilterChip>
        ))}
        <div className="ml-auto flex gap-2">
          <FilterChip active={showStages} onClick={() => setShowStages(!showStages)}>Стейж харуулах</FilterChip>
          <Button variant="outline" onClick={exportCsv}><Download className="size-4" /> CSV</Button>
          <Button variant="outline" onClick={() => window.print()}><Printer className="size-4" /> Хэвлэх</Button>
        </div>
      </div>

      {data.match && (
        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-2 text-sm">
          <span>
            <b>{division.code}</b> · {division.name}
          </span>
          <span className={cn(data.match.status === "FINAL" ? "text-emerald-500" : "text-amber-500")}>
            {MATCH_STATUS_LABEL[data.match.status]}
            {data.match.status !== "FINAL" && " — дүн өөрчлөгдөж болно"}
          </span>
        </div>
      )}

      {division.rows.length === 0 ? (
        <EmptyState>Энэ ангилалд баталгаажсан оноо алга.</EmptyState>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Байр</TableHead>
                  <TableHead>Тамирчин</TableHead>
                  <TableHead className="text-right">Оноо</TableHead>
                  <TableHead className="w-40">Хувь</TableHead>
                  {showStages && stages.map((s) => <TableHead key={s.id} className="text-right">S{s.number}</TableHead>)}
                  <TableHead className="w-8 print:hidden" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {division.rows.map((r) => (
                  <Fragment key={r.competitor.id}>
                    <TableRow className="cursor-pointer" onClick={() => setExpanded(expanded === r.competitor.id ? null : r.competitor.id)}>
                      <TableCell>
                        <span className="flex items-center gap-1 font-heading text-lg">
                          {r.rank <= 3 && <Medal className={cn("size-4", MEDAL[r.rank - 1])} />}
                          {r.rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{r.competitor.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.competitor.memberCode} · {r.competitor.squadName || "—"} · {r.stagesCompleted}/{stages.length} стейж
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatPoints(r.matchPoints)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, r.matchPercentage)}%` }} />
                          </div>
                          <span className="w-14 text-right text-xs tabular-nums">{formatPoints(r.matchPercentage)}%</span>
                        </div>
                      </TableCell>
                      {showStages &&
                        stages.map((s) => {
                          const cell = r.stages[s.id];
                          return (
                            <TableCell key={s.id} className="text-right text-xs tabular-nums">
                              {cell ? (
                                <>
                                  <div className={cn(cell.rank === 1 && "font-semibold text-emerald-500")}>{formatPoints(cell.stagePoints)}</div>
                                  <div className="text-muted-foreground">#{cell.rank}</div>
                                </>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          );
                        })}
                      <TableCell className="print:hidden">
                        {expanded === r.competitor.id ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </TableCell>
                    </TableRow>
                    {expanded === r.competitor.id && (
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableCell colSpan={5 + (showStages ? stages.length : 0)}>
                          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
                            {stages.map((s) => {
                              const cell = r.stages[s.id];
                              return (
                                <div key={s.id} className="rounded-lg border border-border bg-card p-2 text-xs">
                                  <div className="font-medium">S{s.number} · {s.name}</div>
                                  {cell ? (
                                    <div className="mt-1 space-y-0.5 text-muted-foreground">
                                      <div>HF <b className="text-foreground">{formatHf(cell.hitFactor)}</b></div>
                                      <div>Оноо {formatPoints(cell.stagePoints)} / {s.maximumPoints}</div>
                                      <div>{formatPoints(cell.stagePercentage)}% · #{cell.rank}</div>
                                    </div>
                                  ) : (
                                    <div className="mt-1 text-muted-foreground">Баталгаажсан оноо алга</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {division.unranked.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 text-sm font-medium">Эрэмбэд ороогүй</div>
            <div className="flex flex-wrap gap-2">
              {division.unranked.map((u) => (
                <span key={u.competitor.id} className="rounded-full border border-border px-3 py-1 text-xs">
                  {u.competitor.name} ·{" "}
                  <span className={u.reason === "DQ" ? "text-destructive" : "text-muted-foreground"}>
                    {u.reason === "NO_SCORES" ? "Оноо алга" : COMPETITOR_STATUS_LABEL[u.reason as keyof typeof COMPETITOR_STATUS_LABEL] || u.reason}
                  </span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
