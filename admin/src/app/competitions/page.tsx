"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, tugrik } from "@/lib/api";

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
  const [form, setForm] = useState(empty);

  async function load() {
    const data = await api<{ competitions: Competition[] }>("/api/admin/competitions");
    setItems(data.competitions);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  async function create() {
    try {
      const data = await api<{ competition: Competition }>("/api/admin/competitions", {
        method: "POST",
        body: JSON.stringify(form),
      });
      toast.success("Үүсгэлээ");
      router.push(`/competitions/${data.competition.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Тэмцээн</h1>
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader><CardTitle>Шинэ тэмцээн</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Нэр</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-1"><Label>Дэд гарчиг</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="IPSC Action Air" /></div>
            <div className="space-y-1"><Label>Эхлэх огноо</Label><Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></div>
            <div className="space-y-1"><Label>Байршил</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Хүчин чадал</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Хураамж</Label><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-1">
              <Label>Төлөв</Label>
              <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="upcoming">upcoming</option>
                <option value="open">open</option>
                <option value="past">past</option>
              </select>
            </div>
            <Button onClick={create} disabled={!form.title.trim()}>Үүсгэх → дэлгэрэнгүй</Button>
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
                  <TableHead>Оролцогч</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="font-medium">{c.title}</div>
                      {c.subtitle && <div className="text-xs text-muted-foreground">{c.subtitle}</div>}
                    </TableCell>
                    <TableCell>{String(c.eventDate || "").slice(0, 10)}</TableCell>
                    <TableCell>{tugrik(c.fee)}</TableCell>
                    <TableCell>{c.joined || 0}/{c.capacity}</TableCell>
                    <TableCell>{c.status}</TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" asChild><Link href={`/competitions/${c.id}`}>Засах</Link></Button>
                      <Button size="sm" variant="destructive" onClick={async () => {
                        if (!confirm("Устгах уу?")) return;
                        await api(`/api/admin/competitions/${c.id}`, { method: "DELETE" });
                        load();
                      }}>Устгах</Button>
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
