"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, FilterField, StatusBadge, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FormDrawer } from "@/components/form-drawer";

type Named = { id: string; name: string };
type Notice = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  createdAt: string;
  memberTypeIds?: string[];
};

const emptyForm = { title: "", body: "", memberTypeIds: [] as string[] };

function toggleId(ids: string[], id: string, wasAll: boolean) {
  if (ids.includes(id)) return ids.filter((value) => value !== id);
  return wasAll ? [id] : [...ids, id];
}

function MemberTypeChecks({
  types,
  value,
  onChange,
}: {
  types: Named[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const all = value.length === 0;
  return (
    <div className="flex flex-wrap gap-2">
      <label
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm",
          all ? "border-primary bg-primary/10 text-primary" : "border-border"
        )}
      >
        <input type="checkbox" checked={all} onChange={() => onChange([])} />
        Бүгд
      </label>
      {types.map((type) => {
        const checked = value.includes(type.id);
        return (
          <label
            key={type.id}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm",
              checked ? "border-primary bg-primary/10 text-primary" : "border-border"
            )}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onChange(toggleId(value, type.id, all))}
            />
            {type.name}
          </label>
        );
      })}
    </div>
  );
}

function noticeTypeIds(notice: Notice) {
  return (notice.memberTypeIds || []).filter(Boolean);
}

export default function NoticesPage() {
  const [items, setItems] = useState<Notice[]>([]);
  const [memberTypes, setMemberTypes] = useState<Named[]>([]);
  const [query, setQuery] = useState("");
  const [filterTypeIds, setFilterTypeIds] = useState<string[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const [noticesRes, lookups] = await Promise.all([
      api<{ notices: Notice[] }>("/api/admin/notices"),
      api<{ memberTypes: Named[] }>("/api/admin/lookups"),
    ]);
    setItems(noticesRes.notices);
    setMemberTypes(lookups.memberTypes || []);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  const typeName = useMemo(
    () => Object.fromEntries(memberTypes.map((type) => [type.id, type.name])),
    [memberTypes]
  );
  const filterKey = useMemo(
    () => [...filterTypeIds].sort().join(","),
    [filterTypeIds]
  );

  const filtered = useMemo(
    () =>
      items.filter((n) => {
        if (!matchesQuery(query, [n.title, n.body, ...noticeTypeIds(n).map((id) => typeName[id] || "")])) {
          return false;
        }
        if (!filterTypeIds.length) return true;
        const ids = noticeTypeIds(n);
        if (!ids.length) return true;
        return ids.some((id) => filterTypeIds.includes(id));
      }),
    [items, query, filterTypeIds, typeName]
  );
  const table = useClientTable(filtered, { resetKey: `${query}|${filterKey}` });
  const hasFilters = Boolean(query.trim()) || filterTypeIds.length > 0;

  function close() {
    setOpen(false);
    setForm(emptyForm);
  }

  function typeLabels(notice: Notice) {
    const ids = noticeTypeIds(notice);
    if (!ids.length) return ["Бүгд"];
    return ids.map((id) => typeName[id] || "Төрөл");
  }

  async function publish() {
    if (!form.title.trim()) return toast.error("Гарчиг оруулна уу.");
    if (!form.body.trim()) return toast.error("Агуулга оруулна уу.");
    setSaving(true);
    try {
      const result = await api<{
        push?: { skipped?: boolean; successCount?: number; tokenCount?: number };
      }>("/api/admin/notices", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          body: form.body,
          published: true,
          memberTypeIds: form.memberTypeIds,
        }),
      });
      if (result.push?.skipped) {
        toast.success("Нийтэллээ. Push сервер тохируулаагүй байна.");
      } else {
        const sent = result.push?.successCount ?? 0;
        const audience = form.memberTypeIds.length
          ? `${form.memberTypeIds.length} төрлийн гишүүдэд`
          : "бүх хэрэглэгчид";
        toast.success(
          sent > 0
            ? `Нийтэллээ. ${sent} төхөөрөмжид мэдэгдэл илгээлээ.`
            : `Нийтэллээ. ${audience} мэдэгдэл илгээлээ.`
        );
      }
      close();
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-primary">Мэдэгдэл</h1>
        <Button onClick={() => { setForm(emptyForm); setOpen(true); }}>
          <Plus className="size-4" /> Шинэ мэдэгдэл
        </Button>
      </div>
      <DataTable
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Мэдэгдэл хайх..."
        unit="мэдэгдэл"
        total={table.total}
        page={table.page}
        pageCount={table.pageCount}
        onPageChange={table.setPage}
        pageSize={table.pageSize}
        onPageSizeChange={table.setPageSize}
        hasActiveFilters={hasFilters}
        onClear={() => {
          setQuery("");
          setFilterTypeIds([]);
        }}
        filters={
          <FilterField label="Гишүүний төрөл" className="w-full min-w-full">
            <MemberTypeChecks types={memberTypes} value={filterTypeIds} onChange={setFilterTypeIds} />
          </FilterField>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Гарчиг</TableHead>
              <TableHead>Агуулга</TableHead>
              <TableHead>Төрөл</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.visible.map((n) => {
              const labels = typeLabels(n);
              return (
                <TableRow key={n.id}>
                  <TableCell className="font-medium">{n.title}</TableCell>
                  <TableCell className="max-w-sm truncate text-muted-foreground">{n.body}</TableCell>
                  <TableCell>
                    <div className="flex max-w-xs flex-wrap gap-1">
                      {labels.slice(0, 3).map((label) => (
                        <Badge key={label} variant="outline">{label}</Badge>
                      ))}
                      {labels.length > 3 ? (
                        <Badge variant="secondary">+{labels.length - 3}</Badge>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge active={n.published} activeLabel="Нийтэлсэн" inactiveLabel="Ноорог" />
                  </TableCell>
                  <TableCell>
                    <ActionCell>
                      <IconActionButton action="delete" onClick={async () => { await api(`/api/admin/notices/${n.id}`, { method: "DELETE" }); load(); }} />
                    </ActionCell>
                  </TableCell>
                </TableRow>
              );
            })}
            {table.visible.length === 0 && <TableEmpty colSpan={5}>Мэдэгдэл алга.</TableEmpty>}
          </TableBody>
        </Table>
      </DataTable>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}
        title="Шинэ мэдэгдэл"
        className="sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={close}>Болих</Button>
            <Button onClick={publish} disabled={saving}>{saving ? "Нийтэлж байна..." : "Нийтлэх"}</Button>
          </>
        }
      >
        <div className="space-y-1"><Label>Гарчиг</Label><Input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-1"><Label>Агуулга</Label><Textarea rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
        <div className="space-y-2">
          <Label>Гишүүний төрөл</Label>
          <MemberTypeChecks
            types={memberTypes}
            value={form.memberTypeIds}
            onChange={(memberTypeIds) => setForm({ ...form, memberTypeIds })}
          />
          <p className="text-sm text-muted-foreground">
            {form.memberTypeIds.length
              ? "Сонгосон төрлийн гишүүд болон тэдний эцэг эхэд push очно."
              : "Бүгд сонгосон үед гишүүд болон эцэг эх бүрт push мэдэгдэл очно."}
          </p>
        </div>
      </FormDrawer>
    </Shell>
  );
}
