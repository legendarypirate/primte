"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { FieldSelect } from "@/components/field-select";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { COMPETITOR_STATUS_LABEL, SCORE_STATUS_CLASS, SCORE_STATUS_LABEL, formatHf, type MatrixResponse, type ScoreStatus } from "@/lib/scoring";
import { EmptyState, FilterChip } from "./ui";

export function MatrixTab({
  competitionId,
  onOpen,
  refreshKey,
}: {
  competitionId: string;
  onOpen: (scoreId: string) => void;
  refreshKey: number;
}) {
  const [data, setData] = useState<MatrixResponse | null>(null);
  const [squadId, setSquadId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<MatrixResponse>(`/api/admin/competitions/${competitionId}/scoring/matrix`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, [competitionId, refreshKey]);

  const rows = useMemo(
    () =>
      (data?.rows || []).filter(
        (r) =>
          (!squadId || r.competitor.squadId === squadId) &&
          (!divisionId || r.competitor.divisionId === divisionId) &&
          (!onlyIncomplete || (r.competitor.status === "ACTIVE" && r.signed < r.total))
      ),
    [data, squadId, divisionId, onlyIncomplete]
  );

  if (!data) return <div className="text-sm text-muted-foreground">Ачаалж байна…</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <FieldSelect className="h-9 w-44" value={squadId} onChange={setSquadId}>
          <option value="">Бүх скуад</option>
          {data.squads.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </FieldSelect>
        <FieldSelect className="h-9 w-44" value={divisionId} onChange={setDivisionId}>
          <option value="">Бүх ангилал</option>
          {data.divisions.map((d) => <option key={d.id} value={d.id}>{d.code || d.name}</option>)}
        </FieldSelect>
        <FilterChip active={onlyIncomplete} onClick={() => setOnlyIncomplete(!onlyIncomplete)}>Дутуу оноотой</FilterChip>
        <div className="ml-auto flex flex-wrap items-center gap-3 text-xs">
          {(["SIGNED", "ENTERED", "CONFIRMED", "INVALIDATED"] as ScoreStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className={cn("size-3 rounded", SCORE_STATUS_CLASS[s])} /> {SCORE_STATUS_LABEL[s]}
            </span>
          ))}
          <span className="flex items-center gap-1"><span className="size-3 rounded border border-dashed border-border" /> Оноо алга</span>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState>Оролцогч алга.</EmptyState>
      ) : (
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="sticky left-0 z-10 bg-card p-3 font-medium">Тамирчин</th>
                  <th className="p-3 font-medium">Ангилал</th>
                  <th className="p-3 font-medium">Скуад</th>
                  {data.stages.map((s) => (
                    <th key={s.id} className="p-3 text-center font-medium" title={s.name}>S{s.number}</th>
                  ))}
                  <th className="p-3 text-right font-medium">Явц</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.competitor.id} className={cn("border-b border-border last:border-0", r.competitor.status !== "ACTIVE" && "opacity-50")}>
                    <td className="sticky left-0 z-10 bg-card p-3">
                      <div className="font-medium">{r.competitor.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.competitor.memberCode}
                        {r.competitor.status !== "ACTIVE" && ` · ${COMPETITOR_STATUS_LABEL[r.competitor.status]}`}
                      </div>
                    </td>
                    <td className="p-3">{r.competitor.divisionName || "—"}</td>
                    <td className="p-3">{r.competitor.squadName || "—"}</td>
                    {data.stages.map((s) => {
                      const cell = r.cells[s.id];
                      return (
                        <td key={s.id} className="p-1.5 text-center">
                          {cell ? (
                            <button
                              type="button"
                              onClick={() => onOpen(cell.scoreId)}
                              className={cn(
                                "w-20 rounded-md px-1.5 py-1 text-xs font-medium tabular-nums hover:ring-2 hover:ring-primary/40",
                                SCORE_STATUS_CLASS[cell.status]
                              )}
                              title={`${SCORE_STATUS_LABEL[cell.status]} · ${cell.timeSeconds.toFixed(2)}s`}
                            >
                              {formatHf(cell.hitFactor)}
                            </button>
                          ) : (
                            <span className="inline-block h-6 w-20 rounded-md border border-dashed border-border" />
                          )}
                        </td>
                      );
                    })}
                    <td className="p-3 text-right tabular-nums">
                      <span className={r.signed === r.total ? "text-emerald-500" : ""}>{r.signed}/{r.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
