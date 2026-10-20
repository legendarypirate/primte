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
import { api } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FormDrawer } from "@/components/form-drawer";

type MatchType = {
  id: string;
  name: string;
  comment?: string;
};

const empty = { name: "", comment: "" };

export default function MatchTypesPage() {
  const [items, setItems] = useState<MatchType[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await api<{ matchTypes: MatchType[] }>("/api/admin/match-types");
    setItems(data.matchTypes);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  const filtered = useMemo(
    () => items.filter((item) => matchesQuery(query, [item.name, item.comment])),
    [items, query]
  );
  const table = useClientTable(filtered, { resetKey: query });

  function close() {
    setOpen(false);
    setEditing(null);
    setForm(empty);
  }

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(item: MatchType) {
    setEditing(item.id);
    setForm({ name: item.name, comment: item.comment || "" });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Нэр оруулна уу.");
    setSaving(true);
    try {
      if (editing) {
        await api(`/api/admin/match-types/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await api("/api/admin/match-types", { method: "POST", body: JSON.stringify(form) });
      }
      toast.success("Хадгаллаа");
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
        <div>
          <h1 className="font-heading text-3xl text-primary">Match type</h1>
          <p className="text-sm text-muted-foreground">Тэмцээний төрлийг эндээс нэмж, засварлана.</p>
        </div>
        <Button onClick={openCreate}><Plus className="size-4" /> Шинэ төрөл</Button>
      </div>
      <DataTable
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Төрөл хайх..."
        unit="төрөл"
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
              <TableHead>Нэр</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.visible.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.comment || "—"}</TableCell>
                <TableCell>
                  <ActionCell>
                    <IconActionButton action="edit" onClick={() => openEdit(item)} />
                    <IconActionButton
                      action="delete"
                      onClick={async () => {
                        if (!confirm("Устгах уу?")) return;
                        await api(`/api/admin/match-types/${item.id}`, { method: "DELETE" });
                        load();
                      }}
                    />
                  </ActionCell>
                </TableCell>
              </TableRow>
            ))}
            {table.visible.length === 0 && <TableEmpty colSpan={3}>Match type алга.</TableEmpty>}
          </TableBody>
        </Table>
      </DataTable>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}
        title={editing ? "Засах" : "Шинэ төрөл"}
        footer={
          <>
            <Button variant="outline" onClick={close}>Болих</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
          </>
        }
      >
        <div className="space-y-1">
          <Label>Нэр</Label>
          <Input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Comment</Label>
          <Textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
        </div>
      </FormDrawer>
    </Shell>
  );
}
