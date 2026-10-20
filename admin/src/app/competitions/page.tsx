"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trophy } from "lucide-react";
import Link from "next/link";
import { Shell } from "@/components/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, tugrik } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, FilterField, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FieldSelect } from "@/components/field-select";
import { FormDrawer } from "@/components/form-drawer";

type Competition = {
  id: string;
  title: string;
  subtitle?: string;
  eventDate?: string;
  location?: string;
  capacity: number;
  fee: number;
  status: string;
  joined?: number;
  level?: string;
  stageCount?: number;
};

const empty = { title: "", subtitle: "", eventDate: "", location: "", capacity: 50, fee: 250000, status: "upcoming" };

export default function CompetitionsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Competition[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await api<{ competitions: Competition[] }>("/api/admin/competitions");
    setItems(data.competitions);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (c) =>
          (!status || c.status === status) &&
          matchesQuery(query, [c.title, c.subtitle, c.location, c.status, c.eventDate])
      ),
    [items, query, status]
  );
  const table = useClientTable(filtered, { resetKey: `${query}|${status}` });

  function close() {
    setOpen(false);
    setForm(empty);
  }

  async function create() {
    if (!form.title.trim()) return toast.error("Нэр оруулна уу.");
    setSaving(true);
    try {
      const data = await api<{ competition: Competition }>("/api/admin/competitions", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Үүсгэлээ");
      close();
      router.push(`/competitions/${data.competition.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-primary">Тэмцээн</h1>
        <Button onClick={() => { setForm(empty); setOpen(true); }}>
          <Plus className="size-4" /> Шинэ тэмцээн
        </Button>
      </div>
      <DataTable
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Нэр, байршил..."
        unit="тэмцээн"
        total={table.total}
        page={table.page}
        pageCount={table.pageCount}
        onPageChange={table.setPage}
        pageSize={table.pageSize}
        onPageSizeChange={table.setPageSize}
        hasActiveFilters={Boolean(status || query.trim())}
        onClear={() => {
          setStatus("");
          setQuery("");
        }}
        filters={
          <FilterField label="Төлөв" className="w-36">
            <FieldSelect value={status} onChange={setStatus}>
              <option value="">Бүх төлөв</option>
              <option value="upcoming">upcoming</option>
              <option value="open">open</option>
              <option value="past">past</option>
            </FieldSelect>
          </FilterField>
        }
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Нэр</TableHead>
              <TableHead>Огноо</TableHead>
              <TableHead>Хураамж</TableHead>
              <TableHead>Оролцогч</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.visible.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="font-medium">{c.title}</div>
                  {c.subtitle && <div className="text-xs text-muted-foreground">{c.subtitle}</div>}
                </TableCell>
                <TableCell>{String(c.eventDate || "").slice(0, 10)}</TableCell>
                <TableCell>{tugrik(c.fee)}</TableCell>
                <TableCell>{c.joined || 0}/{c.capacity}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>
                  <ActionCell>
                    <Link
                      href={`/competitions/${c.id}/scoring`}
                      title="Оноо & үр дүн"
                      className={buttonVariants({ variant: "ghost", size: "icon" })}
                    >
                      <Trophy className="size-4 text-amber-500" />
                    </Link>
                    <IconActionButton action="edit" onClick={() => router.push(`/competitions/${c.id}`)} />
                    <IconActionButton
                      action="delete"
                      onClick={async () => {
                        if (!confirm("Устгах уу?")) return;
                        await api(`/api/admin/competitions/${c.id}`, { method: "DELETE" });
                        load();
                      }}
                    />
                  </ActionCell>
                </TableCell>
              </TableRow>
            ))}
            {table.visible.length === 0 && <TableEmpty colSpan={6}>Тэмцээн алга.</TableEmpty>}
          </TableBody>
        </Table>
      </DataTable>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}
        title="Шинэ тэмцээн"
        description="Үүсгэсний дараа дэлгэрэнгүй тохиргоо нээгдэнэ."
        footer={
          <>
            <Button variant="outline" onClick={close}>Болих</Button>
            <Button onClick={create} disabled={saving || !form.title.trim()}>
              {saving ? "Үүсгэж байна..." : "Үүсгэх"}
            </Button>
          </>
        }
      >
        <div className="space-y-1"><Label>Нэр</Label><Input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-1"><Label>Дэд гарчиг</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="IPSC Action Air" /></div>
        <div className="space-y-1"><Label>Эхлэх огноо</Label><Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></div>
        <div className="space-y-1"><Label>Байршил</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1"><Label>Хүчин чадал</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
          <div className="space-y-1"><Label>Хураамж</Label><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></div>
        </div>
        <div className="space-y-1">
          <Label>Төлөв</Label>
          <FieldSelect value={form.status} onChange={(status) => setForm({ ...form, status })}>
            <option value="upcoming">upcoming</option>
            <option value="open">open</option>
            <option value="past">past</option>
          </FieldSelect>
        </div>
      </FormDrawer>
    </Shell>
  );
}
