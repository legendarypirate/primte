"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileUpload } from "@/components/file-upload";
import { api, tugrik } from "@/lib/api";

type Competition = {
  id: string;
  title: string;
  subtitle?: string;
  eventDate?: string;
  location?: string;
  capacity: number;
  fee: number;
  about?: string;
  status: string;
  joined?: number;
  imageUrl?: string;
};

const empty = { title: "", subtitle: "", eventDate: "", location: "", capacity: 50, fee: 0, about: "", status: "upcoming", imageUrl: "" };

export default function CompetitionsPage() {
  const [items, setItems] = useState<Competition[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    const data = await api<{ competitions: Competition[] }>("/api/admin/competitions");
    setItems(data.competitions);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  async function save() {
    try {
      if (editing) await api(`/api/admin/competitions/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      else await api("/api/admin/competitions", { method: "POST", body: JSON.stringify(form) });
      setForm(empty);
      setEditing(null);
      await load();
      toast.success("Хадгаллаа");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Тэмцээн</h1>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader><CardTitle>{editing ? "Засах" : "Шинэ тэмцээн"}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Нэр</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-1"><Label>Дэд гарчиг</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
            <div className="space-y-1"><Label>Огноо</Label><Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></div>
            <div className="space-y-1"><Label>Байршил</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Хүчин чадал</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Хураамж</Label><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-1"><Label>Төлөв (upcoming/open/past)</Label><Input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} /></div>
            <div className="space-y-1"><Label>Тайлбар</Label><Textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} /></div>
            <FileUpload
              label="Зураг"
              folder="prime/competitions"
              value={form.imageUrl}
              onChange={(imageUrl) => setForm({ ...form, imageUrl })}
            />
            <Button onClick={save}>{editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Жагсаалт</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Огноо</TableHead>
                  <TableHead>Хураамж</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{c.eventDate}</TableCell>
                    <TableCell>{tugrik(c.fee)}</TableCell>
                    <TableCell>{c.status} · {c.joined || 0}/{c.capacity}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(c.id); setForm({ title: c.title, subtitle: c.subtitle || "", eventDate: String(c.eventDate || "").slice(0, 10), location: c.location || "", capacity: c.capacity, fee: c.fee, about: c.about || "", status: c.status, imageUrl: c.imageUrl || "" }); }}>Засах</Button>
                      <Button size="sm" variant="destructive" onClick={async () => { await api(`/api/admin/competitions/${c.id}`, { method: "DELETE" }); load(); }}>Устгах</Button>
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
