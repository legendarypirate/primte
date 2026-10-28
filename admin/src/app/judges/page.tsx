"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FieldSelect } from "@/components/field-select";
import { api } from "@/lib/api";
import { can } from "@/lib/auth";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, StatusBadge, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";

type JudgeRow = {
  id: string;
  name: string;
  username: string;
  role: string;
  active: boolean;
  memberId?: string | null;
  memberCode?: string | null;
  phone?: string | null;
};

type Candidate = {
  id: string;
  name: string;
  username: string;
  memberCode: string;
  hasPassword: boolean;
  status: string;
};

const JUDGE_ROLES = [
  { value: "RO", label: "RO" },
  { value: "SCOREKEEPER", label: "Scorekeeper" },
  { value: "RANGE_MASTER", label: "Range Master" },
  { value: "MATCH_DIRECTOR", label: "Match Director" },
];

const canManage = () => can("scoring.manage") || can("competitions.manage") || can("members.update");

export default function JudgesPage() {
  const [judges, setJudges] = useState<JudgeRow[]>([]);
  const [query, setQuery] = useState("");
  const [memberQuery, setMemberQuery] = useState("");
  const [hits, setHits] = useState<Candidate[]>([]);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [role, setRole] = useState("RO");
  const [password, setPassword] = useState("");
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await api<{ judges: JudgeRow[] }>("/api/admin/judges");
    setJudges(data.judges || []);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  useEffect(() => {
    const q = memberQuery.trim();
    if (selected || q.length < 2) return;
    const handle = window.setTimeout(() => {
      setSearching(true);
      api<{ members: Candidate[] }>(`/api/admin/scoring/judge-candidates?q=${encodeURIComponent(q)}`)
        .then((d) => setHits(d.members || []))
        .catch(() => setHits([]))
        .finally(() => setSearching(false));
    }, 250);
    return () => window.clearTimeout(handle);
  }, [memberQuery, selected]);

  const filtered = useMemo(
    () => judges.filter((j) => matchesQuery(query, [j.name, j.username, j.memberCode, j.phone, j.role])),
    [judges, query]
  );
  const table = useClientTable(filtered, { resetKey: query });
  const manage = canManage();
  const alreadyIds = useMemo(() => new Set(judges.map((j) => j.memberId).filter(Boolean)), [judges]);
  const canAdd = Boolean(selected && (selected.hasPassword || password) && selected.username);

  async function addJudge() {
    if (!selected) return;
    setSaving(true);
    try {
      await api("/api/admin/judges", {
        method: "POST",
        body: JSON.stringify({
          memberId: selected.id,
          role,
          password: password || undefined,
        }),
      });
      toast.success(`${selected.name} шүүгч боллоо`);
      setSelected(null);
      setMemberQuery("");
      setHits([]);
      setPassword("");
      setRole("RO");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="font-heading text-3xl text-primary">Шүүгчид</h1>
        <p className="text-sm text-muted-foreground">
          Зөвхөн гишүүнээс шүүгч нэмнэ. Тэд гишүүний нэвтрэх нэр, нууц үгээр PRIME Judge апп-д нэвтэрнэ.
        </p>
      </div>

      {manage && (
        <div className="mb-6 space-y-3 rounded-lg border bg-muted/30 p-3">
          <div className="relative">
            <Input
              placeholder="Гишүүн хайх (нэр, username, код)"
              value={selected ? `${selected.name} · ${selected.username || selected.memberCode}` : memberQuery}
              onChange={(e) => {
                setSelected(null);
                setMemberQuery(e.target.value);
              }}
            />
            {!selected && memberQuery.trim().length >= 2 && (hits.length > 0 || searching) && (
              <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border bg-popover shadow-md">
                {searching && hits.length === 0 && (
                  <div className="px-3 py-2 text-xs text-muted-foreground">Хайж байна…</div>
                )}
                {hits.map((m) => {
                  const taken = alreadyIds.has(m.id);
                  return (
                    <button
                      key={m.id}
                      type="button"
                      disabled={taken}
                      className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-accent disabled:opacity-50"
                      onClick={() => {
                        setSelected(m);
                        setHits([]);
                      }}
                    >
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.username || "username байхгүй"}
                        {m.memberCode ? ` · ${m.memberCode}` : ""}
                        {taken ? " · аль хэдийн шүүгч" : m.hasPassword ? "" : " · нууц үг байхгүй"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            <FieldSelect value={role} onChange={setRole}>
              {JUDGE_ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </FieldSelect>
            <Input
              type="password"
              placeholder={selected?.hasPassword ? "Нууц үг (хоосон = гишүүнийх)" : "Нууц үг"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button disabled={!canAdd || saving} onClick={addJudge}>
              <Plus className="size-4" /> Гишүүнээс нэмэх
            </Button>
          </div>
        </div>
      )}

      <DataTable
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Нэр, username..."
        unit="шүүгч"
        total={table.total}
        page={table.page}
        pageCount={table.pageCount}
        onPageChange={table.setPage}
        pageSize={table.pageSize}
        onPageSizeChange={table.setPageSize}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Гишүүн</TableHead>
              <TableHead>Нэвтрэх нэр</TableHead>
              <TableHead>Эрх</TableHead>
              <TableHead>Төлөв</TableHead>
              {manage && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.visible.map((j) => (
              <TableRow key={j.id}>
                <TableCell>
                  <div className="font-medium">{j.name}</div>
                  <div className="text-xs text-muted-foreground">{j.memberCode || j.phone || "—"}</div>
                </TableCell>
                <TableCell className="font-mono text-sm">{j.username}</TableCell>
                <TableCell className="w-44">
                  {manage ? (
                    <FieldSelect
                      value={j.role}
                      onChange={async (role) => {
                        try {
                          await api(`/api/admin/judges/${j.id}`, { method: "PATCH", body: JSON.stringify({ role }) });
                          setJudges((prev) => prev.map((row) => (row.id === j.id ? { ...row, role } : row)));
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Алдаа");
                        }
                      }}
                    >
                      {JUDGE_ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </FieldSelect>
                  ) : (
                    j.role
                  )}
                </TableCell>
                <TableCell>
                  <button
                    type="button"
                    disabled={!manage}
                    onClick={async () => {
                      if (!manage) return;
                      try {
                        await api(`/api/admin/judges/${j.id}`, {
                          method: "PATCH",
                          body: JSON.stringify({ active: !j.active }),
                        });
                        setJudges((prev) => prev.map((row) => (row.id === j.id ? { ...row, active: !j.active } : row)));
                      } catch (e) {
                        toast.error(e instanceof Error ? e.message : "Алдаа");
                      }
                    }}
                  >
                    <StatusBadge active={j.active} activeLabel="Идэвхтэй" inactiveLabel="Идэвхгүй" />
                  </button>
                </TableCell>
                {manage && (
                  <TableCell>
                    <ActionCell>
                      <IconActionButton
                        action="delete"
                        onClick={async () => {
                          if (!confirm(`${j.name}-г шүүгчээс хасах уу?`)) return;
                          await api(`/api/admin/judges/${j.id}`, { method: "DELETE" });
                          toast.success("Устгалаа");
                          setJudges((prev) => prev.filter((row) => row.id !== j.id));
                        }}
                      />
                    </ActionCell>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {table.visible.length === 0 && <TableEmpty colSpan={manage ? 5 : 4}>Шүүгч алга. Гишүүнээс нэмнэ үү.</TableEmpty>}
          </TableBody>
        </Table>
      </DataTable>
    </Shell>
  );
}
