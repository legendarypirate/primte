"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FieldSelect } from "@/components/field-select";
import { api } from "@/lib/api";
import { SCORE_STATUS_LABEL, downloadCsv, formatDateTime, formatHf, type Option, type ScoreRow } from "@/lib/scoring";
import { EmptyState, FilterChip, ScoreStatusBadge } from "./ui";

export type ScoreFilters = { status: string; stageId: string; divisionId: string; squadId: string; q: string };

export const DEFAULT_SCORE_FILTERS: ScoreFilters = { status: "SIGNED", stageId: "", divisionId: "", squadId: "", q: "" };

const STATUS_CHIPS: { value: string; label: string }[] = [
  { value: "SIGNED", label: "Баталгаажсан" },
  { value: "ENTERED,CONFIRMED,DRAFT", label: "Баталгаажаагүй" },
  { value: "INVALIDATED", label: "Хүчингүй" },
  { value: "ALL", label: "Бүгд" },
];

type Response = { scores: ScoreRow[]; filters: { stages: Option[]; divisions: Option[]; squads: Option[] } };

export function ScoresTab({
  competitionId,
  competitionTitle,
  filters,
  setFilters,
  onOpen,
  refreshKey,
}: {
  competitionId: string;
  competitionTitle: string;
  filters: ScoreFilters;
  setFilters: (f: ScoreFilters) => void;
  onOpen: (scoreId: string) => void;
  refreshKey: number;
}) {
  const [data, setData] = useState<Response | null>(null);
  const [search, setSearch] = useState(filters.q);
  const [sort, setSort] = useState<"recent" | "hf" | "stage" | "name">("recent");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.stageId) params.set("stageId", filters.stageId);
    if (filters.divisionId) params.set("divisionId", filters.divisionId);
    if (filters.squadId) params.set("squadId", filters.squadId);
    if (filters.q) params.set("q", filters.q);
    let cancelled = false;
    api<Response>(`/api/admin/competitions/${competitionId}/scoring/scores?${params}`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, [competitionId, filters, refreshKey]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (search !== filters.q) setFilters({ ...filters, q: search });
    }, 300);
    return () => clearTimeout(t);
  }, [search, filters, setFilters]);

  const rows = useMemo(() => {
    const list = [...(data?.scores || [])];
    if (sort === "hf") list.sort((a, b) => b.hitFactor - a.hitFactor);
    if (sort === "stage") list.sort((a, b) => (a.stageNumber ?? 0) - (b.stageNumber ?? 0) || b.hitFactor - a.hitFactor);
    if (sort === "name") list.sort((a, b) => (a.competitor?.name || "").localeCompare(b.competitor?.name || ""));
    return list;
  }, [data, sort]);

  const totals = useMemo(() => {
    const signed = rows.filter((r) => r.status === "SIGNED");
    const avgHf = signed.length ? signed.reduce((s, r) => s + r.hitFactor, 0) / signed.length : 0;
    return { count: rows.length, signed: signed.length, avgHf };
  }, [rows]);

  function exportCsv() {
    downloadCsv(`${competitionTitle || "scores"}-оноо.csv`, [
      ["Стейж", "Тамирчин", "Гишүүний код", "Bib", "Ангилал", "Скуад", "A", "C", "D", "M", "NS", "Proc", "Хугацаа", "Оноо", "HF", "Төлөв", "Оруулсан", "Баталгаажсан", "Баталгаажсан огноо"],
      ...rows.map((r) => [
        r.stageNumber,
        r.competitor?.name,
        r.competitor?.memberCode,
        r.competitor?.bibNumber,
        r.competitor?.divisionName,
        r.competitor?.squadName,
        r.alphaHits,
        r.charlieHits,
        r.deltaHits,
        r.missCount,
        r.noShootCount,
        r.proceduralCount,
        r.timeSeconds.toFixed(2),
        r.effectivePoints,
        formatHf(r.hitFactor),
        SCORE_STATUS_LABEL[r.status],
        r.enteredBy?.name,
        r.signedBy?.name,
        r.signedAt ? new Date(r.signedAt).toISOString() : "",
      ]),
    ]);
  }

  const f = data?.filters;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_CHIPS.map((chip) => (
          <FilterChip key={chip.value} active={filters.status === chip.value} onClick={() => setFilters({ ...filters, status: chip.value })}>
            {chip.label}
          </FilterChip>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={!rows.length}>
            <Download className="size-4" /> CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-6 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-8" placeholder="Нэр, гишүүний код, bib…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <FieldSelect value={filters.stageId} onChange={(stageId) => setFilters({ ...filters, stageId })}>
            <option value="">Бүх стейж</option>
            {f?.stages.map((s) => <option key={s.id} value={s.id}>Стейж {s.number} · {s.name}</option>)}
          </FieldSelect>
          <FieldSelect value={filters.divisionId} onChange={(divisionId) => setFilters({ ...filters, divisionId })}>
            <option value="">Бүх ангилал</option>
            {f?.divisions.map((d) => <option key={d.id} value={d.id}>{d.code || d.name}</option>)}
          </FieldSelect>
          <FieldSelect value={filters.squadId} onChange={(squadId) => setFilters({ ...filters, squadId })}>
            <option value="">Бүх скуад</option>
            {f?.squads.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </FieldSelect>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          {totals.count} бичлэг · {totals.signed} баталгаажсан · дундаж HF {formatHf(totals.avgHf)}
        </span>
        <div className="flex items-center gap-2">
          <span>Эрэмбэ</span>
          <FieldSelect className="w-40" value={sort} onChange={(v) => setSort(v as typeof sort)}>
            <option value="recent">Сүүлд шинэчилсэн</option>
            <option value="hf">HF өндөр</option>
            <option value="stage">Стейжээр</option>
            <option value="name">Нэрээр</option>
          </FieldSelect>
        </div>
      </div>

      {data && rows.length === 0 ? (
        <EmptyState>Шүүлтүүрт тохирох оноо алга.</EmptyState>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">Стейж</TableHead>
                  <TableHead>Тамирчин</TableHead>
                  <TableHead>Ангилал</TableHead>
                  <TableHead className="text-center">A</TableHead>
                  <TableHead className="text-center">C</TableHead>
                  <TableHead className="text-center">D</TableHead>
                  <TableHead className="text-center">M</TableHead>
                  <TableHead className="text-center">NS</TableHead>
                  <TableHead className="text-center">Proc</TableHead>
                  <TableHead className="text-right">Хугацаа</TableHead>
                  <TableHead className="text-right">Оноо</TableHead>
                  <TableHead className="text-right">HF</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead>Баталгаажсан</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => onOpen(r.id)}>
                    <TableCell>
                      <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 font-heading text-primary">{r.stageNumber}</span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{r.competitor?.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.competitor?.memberCode}
                        {r.competitor?.squadName ? ` · ${r.competitor.squadName}` : ""}
                      </div>
                    </TableCell>
                    <TableCell>{r.competitor?.divisionName || "—"}</TableCell>
                    <TableCell className="text-center">{r.alphaHits}</TableCell>
                    <TableCell className="text-center">{r.charlieHits}</TableCell>
                    <TableCell className="text-center">{r.deltaHits}</TableCell>
                    <TableCell className={`text-center ${r.missCount ? "text-destructive" : ""}`}>{r.missCount}</TableCell>
                    <TableCell className={`text-center ${r.noShootCount ? "text-destructive" : ""}`}>{r.noShootCount}</TableCell>
                    <TableCell className={`text-center ${r.proceduralCount ? "text-destructive" : ""}`}>{r.proceduralCount}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.timeSeconds.toFixed(2)}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.effectivePoints}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums text-primary">{formatHf(r.hitFactor)}</TableCell>
                    <TableCell><ScoreStatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.signedAt ? (
                        <>
                          <div>{formatDateTime(r.signedAt)}</div>
                          <div>{r.signedBy?.name || "Тамирчин"}</div>
                        </>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
