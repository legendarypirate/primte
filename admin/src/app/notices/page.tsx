"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { IconActionButton } from "@/components/icon-action-button";

type Notice = { id: string; title: string; body: string; published: boolean; createdAt: string };

export default function NoticesPage() {
  const [items, setItems] = useState<Notice[]>([]);
  const [form, setForm] = useState({ title: "", body: "" });

  async function load() {
    setItems((await api<{ notices: Notice[] }>("/api/admin/notices")).notices);
  }
  useEffect(() => { load().catch((e) => toast.error(e.message)); }, []);

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Мэдэгдэл</h1>
      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader><CardTitle>Шинэ мэдэгдэл</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Гарчиг</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-1"><Label>Агуулга</Label><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
            <Button onClick={async () => {
              await api("/api/admin/notices", { method: "POST", body: JSON.stringify({ ...form, published: true }) });
              setForm({ title: "", body: "" });
              load();
              toast.success("Нийтэллээ");
            }}>Нийтлэх</Button>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {items.map((n) => (
            <Card key={n.id}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base">{n.title}</CardTitle>
                <IconActionButton action="delete" onClick={async () => { await api(`/api/admin/notices/${n.id}`, { method: "DELETE" }); load(); }} />
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{n.body}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
