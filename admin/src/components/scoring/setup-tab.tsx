"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FieldSelect } from "@/components/field-select";
import { api } from "@/lib/api";
import { COMPETITOR_STATUS_LABEL, type MatrixResponse, type ScoringStage } from "@/lib/scoring";

type StageDraft = Pick<ScoringStage, "name" | "courseType" | "maximumPoints" | "minimumRounds" | "status">;

function StageRow({ stage, canManage, onChanged }: { stage: ScoringStage; canManage: boolean; onChanged: () => void }) {
  const initial: StageDraft = {
    name: stage.name,
    courseType: stage.courseType,
    maximumPoints: stage.maximumPoints,
    minimumRounds: stage.minimumRounds,
    status: stage.status,
  };
  const [draft, setDraft] = useState<StageDraft>(initial);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);

  async function save() {
    try {
      await api(`/api/admin/scoring/stages/${stage.id}`, { method: "PUT", body: JSON.stringify(draft) });
      toast.success(`Стейж ${stage.number} хадгалагдлаа`);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  async function remove() {
    if (!confirm(`Стейж ${stage.number}-г устгах уу?`)) return;
    try {
      await api(`/api/admin/scoring/stages/${stage.id}`, { method: "DELETE" });
      toast.success("Устгалаа");
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <TableRow>
      <TableCell className="font-heading text-lg text-primary">{stage.number}</TableCell>
      <TableCell><Input disabled={!canManage} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></TableCell>
      <TableCell>
        <FieldSelect className="h-9" value={draft.courseType} onChange={(v) => setDraft({ ...draft, courseType: v as StageDraft["courseType"] })}>
          <option value="SHORT">Short</option>
          <option value="MEDIUM">Medium</option>
          <option value="LONG">Long</option>
          <option value="CUSTOM">Custom</option>
        </FieldSelect>
      </TableCell>
      <TableCell><Input disabled={!canManage} type="number" className="w-24" value={draft.maximumPoints} onChange={(e) => setDraft({ ...draft, maximumPoints: Number(e.target.value) })} /></TableCell>
      <TableCell><Input disabled={!canManage} type="number" className="w-20" value={draft.minimumRounds} onChange={(e) => setDraft({ ...draft, minimumRounds: Number(e.target.value) })} /></TableCell>
      <TableCell>
        <FieldSelect className="h-9" value={draft.status} onChange={(v) => setDraft({ ...draft, status: v as StageDraft["status"] })}>
          <option value="WAITING">Хүлээгдэж</option>
          <option value="ACTIVE">Идэвхтэй</option>
          <option value="COMPLETED">Дууссан</option>
        </FieldSelect>
      </TableCell>
      <TableCell>
        {canManage && (
          <div className="flex justify-end gap-1">
            <Button size="icon" variant={dirty ? "default" : "ghost"} disabled={!dirty} onClick={save} title="Хадгалах"><Save className="size-4" /></Button>
            <Button size="icon" variant="ghost" onClick={remove} title="Устгах"><Trash2 className="size-4 text-destructive" /></Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}

export function SetupTab({
  competitionId,
  matchId,
  stages,
  canManage,
  onChanged,
  refreshKey,
}: {
  competitionId: string;
  matchId: string;
  stages: ScoringStage[];
  canManage: boolean;
  onChanged: () => void;
  refreshKey: number;
}) {
  const [data, setData] = useState<MatrixResponse | null>(null);
  const [squadName, setSquadName] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    api<MatrixResponse>(`/api/admin/competitions/${competitionId}/scoring/matrix`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, [competitionId, refreshKey]);

  const competitors = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data?.rows || [])
      .map((r) => r.competitor)
      .filter((c) => !q || [c.name, c.memberCode, c.bibNumber].some((v) => String(v || "").toLowerCase().includes(q)));
  }, [data, query]);

  async function call(path: string, method: string, body?: unknown, success?: string) {
    try {
      await api(path, { method, body: body ? JSON.stringify(body) : undefined });
      if (success) toast.success(success);
      onChanged();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  function updateCompetitor(id: string, patch: Record<string, string>) {
    if (patch.status === "DQ" && !confirm("Тамирчныг DQ болгох уу? Үр дүнгээс хасагдана.")) return;
    return call(`/api/admin/scoring/competitors/${id}`, "PUT", patch, "Оролцогч шинэчлэгдлээ");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Стейжүүд</CardTitle>
          {canManage && (
            <Button variant="outline" onClick={() => call(`/api/admin/scoring/matches/${matchId}/stages`, "POST", {}, "Стейж нэмэгдлээ")}>
              <Plus className="size-4" /> Стейж нэмэх
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Нэр</TableHead>
                <TableHead className="w-32">Төрөл</TableHead>
                <TableHead className="w-28">Дээд оноо</TableHead>
                <TableHead className="w-24">Мин. сум</TableHead>
                <TableHead className="w-36">Төлөв</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {stages.map((s) => (
                <StageRow key={`${s.id}:${refreshKey}`} stage={s} canManage={canManage} onChanged={onChanged} />
              ))}
            </TableBody>
          </Table>
          <p className="mt-2 text-xs text-muted-foreground">Дээд оноог өөрчилбөл бүх үр дүн автоматаар дахин тооцогдоно. Оноотой стейжийг устгах боломжгүй.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle>Оролцогчид ({data?.rows.length ?? 0})</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="w-56 pl-8" placeholder="Хайх…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            {canManage && (
              <div className="flex gap-2">
                <Input className="w-40" placeholder="Шинэ скуад" value={squadName} onChange={(e) => setSquadName(e.target.value)} />
                <Button
                  variant="outline"
                  disabled={!squadName.trim()}
                  onClick={async () => {
                    await call(`/api/admin/scoring/matches/${matchId}/squads`, "POST", { name: squadName.trim() }, "Скуад нэмэгдлээ");
                    setSquadName("");
                  }}
                >
                  <Plus className="size-4" /> Скуад
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Тамирчин</TableHead>
                <TableHead className="w-28">Bib</TableHead>
                <TableHead className="w-36">Ангилал</TableHead>
                <TableHead className="w-36">Скуад</TableHead>
                <TableHead className="w-28">Power factor</TableHead>
                <TableHead className="w-32">Төлөв</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.memberCode}</div>
                  </TableCell>
                  <TableCell>
                    <Input
                      key={`${c.id}:${c.bibNumber}`}
                      disabled={!canManage}
                      defaultValue={c.bibNumber || ""}
                      onBlur={(e) => e.target.value !== (c.bibNumber || "") && updateCompetitor(c.id, { bibNumber: e.target.value })}
                    />
                  </TableCell>
                  <TableCell>
                    <FieldSelect className="h-9" value={c.divisionId || ""} onChange={(v) => canManage && updateCompetitor(c.id, { matchDivisionId: v })}>
                      <option value="">—</option>
                      {data?.divisions.map((d) => <option key={d.id} value={d.id}>{d.code || d.name}</option>)}
                    </FieldSelect>
                  </TableCell>
                  <TableCell>
                    <FieldSelect className="h-9" value={c.squadId || ""} onChange={(v) => canManage && updateCompetitor(c.id, { squadId: v })}>
                      <option value="">—</option>
                      {data?.squads.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </FieldSelect>
                  </TableCell>
                  <TableCell>
                    <FieldSelect className="h-9" value={c.powerFactor} onChange={(v) => canManage && updateCompetitor(c.id, { powerFactor: v })}>
                      <option value="MINOR">Minor</option>
                      <option value="MAJOR">Major</option>
                      <option value="NONE">None</option>
                    </FieldSelect>
                  </TableCell>
                  <TableCell>
                    <FieldSelect
                      className={`h-9 ${c.status === "DQ" ? "text-destructive" : c.status === "WITHDRAWN" ? "text-muted-foreground" : ""}`}
                      value={c.status}
                      onChange={(v) => canManage && updateCompetitor(c.id, { status: v })}
                    >
                      {(Object.keys(COMPETITOR_STATUS_LABEL) as (keyof typeof COMPETITOR_STATUS_LABEL)[]).map((s) => (
                        <option key={s} value={s}>{COMPETITOR_STATUS_LABEL[s]}</option>
                      ))}
                    </FieldSelect>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
