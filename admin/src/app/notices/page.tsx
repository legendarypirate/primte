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
import { DataTable, StatusBadge, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FormDrawer } from "@/components/form-drawer";

type Notice = { id: string; title: string; body: string; published: boolean; createdAt: string };

export default function NoticesPage() {
  const [items, setItems] = useState<Notice[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ title: "", body: "" });
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems((await api<{ notices: Notice[] }>("/api/admin/notices")).notices);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);
  const filtered = useMemo(
    () => items.filter((n) => matchesQuery(query, [n.title, n.body])),
    [items, query]
  );
  const table = useClientTable(filtered, { resetKey: query });

  function close() {
    setOpen(false);
    setForm({ title: "", body: "" });
  }

  async function publish() {
    if (!form.title.trim()) return toast.error("Гарчиг оруулна уу.");
    setSaving(true);
    try {
      await api("/api/admin/notices", { method: "POST", body: JSON.stringify({ ...form, published: true }) });
      toast.success("Нийтэллээ");
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
        <Button onClick={() => { setForm({ title: "", body: "" }); setOpen(true); }}>
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
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Гарчиг</TableHead>
              <TableHead>Агуулга</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.visible.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.title}</TableCell>
                <TableCell className="max-w-sm truncate text-muted-foreground">{n.body}</TableCell>
                <TableCell>
                  <StatusBadge active={n.published} activeLabel="Нийтэлсэн" inactiveLabel="Ноорог" />
                </TableCell>
                <TableCell>
                  <ActionCell>
                    <IconActionButton action="delete" onClick={async () => { await api(`/api/admin/notices/${n.id}`, { method: "DELETE" }); load(); }} />
                  </ActionCell>
                </TableCell>
              </TableRow>
            ))}
            {table.visible.length === 0 && <TableEmpty colSpan={4}>Мэдэгдэл алга.</TableEmpty>}
          </TableBody>
        </Table>
      </DataTable>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}
        title="Шинэ мэдэгдэл"
        footer={
          <>
            <Button variant="outline" onClick={close}>Болих</Button>
            <Button onClick={publish} disabled={saving}>{saving ? "Нийтэлж байна..." : "Нийтлэх"}</Button>
          </>
        }
      >
        <div className="space-y-1"><Label>Гарчиг</Label><Input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-1"><Label>Агуулга</Label><Textarea rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
      </FormDrawer>
    </Shell>
  );
}
