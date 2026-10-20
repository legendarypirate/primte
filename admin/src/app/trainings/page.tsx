"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUpload } from "@/components/file-upload";
import { api, tugrik } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FormDrawer } from "@/components/form-drawer";

type Training = { id: string; title: string; subtitle?: string; eventDate?: string; timeLabel?: string; capacity: number; fee: number; imageUrl?: string };
const empty = { title: "", subtitle: "", eventDate: "", timeLabel: "", capacity: 24, fee: 0, imageUrl: "" };

export default function TrainingsPage() {
  const [items, setItems] = useState<Training[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems((await api<{ trainings: Training[] }>("/api/admin/trainings")).trainings);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  const filtered = useMemo(
    () => items.filter((t) => matchesQuery(query, [t.title, t.subtitle, t.eventDate, t.timeLabel])),
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

  function openEdit(t: Training) {
    setEditing(t.id);
    setForm({
      title: t.title,
      subtitle: t.subtitle || "",
      eventDate: String(t.eventDate || "").slice(0, 10),
      timeLabel: t.timeLabel || "",
      capacity: t.capacity,
      fee: t.fee,
      imageUrl: t.imageUrl || "",
    });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim()) return toast.error("Нэр оруулна уу.");
    setSaving(true);
    try {
      if (editing) await api(`/api/admin/trainings/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      else await api("/api/admin/trainings", { method: "POST", body: JSON.stringify(form) });
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
        <h1 className="font-heading text-3xl text-primary">Сургалт</h1>
        <Button onClick={openCreate}><Plus className="size-4" /> Шинэ сургалт</Button>
      </div>
      <DataTable
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Сургалт хайх..."
        unit="сургалт"
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
              <TableHead>Огноо</TableHead>
              <TableHead>Хураамж</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.visible.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.eventDate} {t.timeLabel}</TableCell>
                <TableCell>{tugrik(t.fee)}</TableCell>
                <TableCell>
                  <ActionCell>
                    <IconActionButton action="edit" onClick={() => openEdit(t)} />
                    <IconActionButton action="delete" onClick={async () => { await api(`/api/admin/trainings/${t.id}`, { method: "DELETE" }); load(); }} />
                  </ActionCell>
                </TableCell>
              </TableRow>
            ))}
            {table.visible.length === 0 && <TableEmpty colSpan={4}>Сургалт алга.</TableEmpty>}
          </TableBody>
        </Table>
      </DataTable>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}
        title={editing ? "Сургалт засах" : "Шинэ сургалт"}
        className="sm:max-w-lg"
        footer={
          <>
            <Button variant="outline" onClick={close}>Болих</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
          </>
        }
      >
        <div className="space-y-1"><Label>Нэр</Label><Input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-1"><Label>Тайлбар</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
        <div className="space-y-1"><Label>Огноо</Label><Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></div>
        <div className="space-y-1"><Label>Цаг</Label><Input value={form.timeLabel} onChange={(e) => setForm({ ...form, timeLabel: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1"><Label>Хүчин чадал</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
          <div className="space-y-1"><Label>Хураамж</Label><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></div>
        </div>
        <FileUpload
          label="Зураг"
          folder="prime/trainings"
          value={form.imageUrl}
          onChange={(imageUrl) => setForm({ ...form, imageUrl })}
        />
      </FormDrawer>
    </Shell>
  );
}
