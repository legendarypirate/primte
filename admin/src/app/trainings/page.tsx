"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUpload } from "@/components/file-upload";
import { api, tugrik } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";

type Training = { id: string; title: string; subtitle?: string; eventDate?: string; timeLabel?: string; capacity: number; fee: number; imageUrl?: string };
const empty = { title: "", subtitle: "", eventDate: "", timeLabel: "", capacity: 24, fee: 0, imageUrl: "" };

export default function TrainingsPage() {
  const [items, setItems] = useState<Training[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    setItems((await api<{ trainings: Training[] }>("/api/admin/trainings")).trainings);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  async function save() {
    try {
      if (editing) await api(`/api/admin/trainings/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      else await api("/api/admin/trainings", { method: "POST", body: JSON.stringify(form) });
      setForm(empty); setEditing(null); await load(); toast.success("Хадгаллаа");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Алдаа"); }
  }

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Сургалт</h1>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>{editing ? "Засах" : "Шинэ сургалт"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Нэр</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
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
            <Button onClick={save}>Хадгалах</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Жагсаалт</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Нэр</TableHead><TableHead>Огноо</TableHead><TableHead>Хураамж</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {items.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.title}</TableCell>
                    <TableCell>{t.eventDate} {t.timeLabel}</TableCell>
                    <TableCell>{tugrik(t.fee)}</TableCell>
                    <TableCell>
                      <ActionCell>
                        <IconActionButton action="edit" onClick={() => { setEditing(t.id); setForm({ title: t.title, subtitle: t.subtitle || "", eventDate: String(t.eventDate || "").slice(0, 10), timeLabel: t.timeLabel || "", capacity: t.capacity, fee: t.fee, imageUrl: t.imageUrl || "" }); }} />
                        <IconActionButton action="delete" onClick={async () => { await api(`/api/admin/trainings/${t.id}`, { method: "DELETE" }); load(); }} />
                      </ActionCell>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
