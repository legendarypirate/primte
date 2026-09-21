"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

type ParentRow = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  childrenCount: number;
  children: { id: string; name: string; memberType?: string }[];
};

export default function ParentsPage() {
  const [rows, setRows] = useState<ParentRow[]>([]);
  const [form, setForm] = useState({ name: "", phone: "", code: "", email: "" });

  async function load() {
    try {
      const data = await api<{ parents: ParentRow[] }>("/api/admin/parents");
      setRows(data.parents);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    try {
      await api("/api/admin/parents", { method: "POST", body: JSON.stringify(form) });
      toast.success("Эцэг эх нэмэгдлээ");
      setForm({ name: "", phone: "", code: "", email: "" });
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Эцэг эх</h1>
          <p className="text-sm text-muted-foreground">Parent App v2 — эцэг эхийн бүртгэл, хүүхдийн холбоос</p>
        </div>

        <Card className="p-4 space-y-3">
          <h2 className="font-semibold">Шинэ эцэг эх</h2>
          <div className="grid gap-3 md:grid-cols-4">
            <div>
              <Label>Нэр</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Утас</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+97699112233" />
            </div>
            <div>
              <Label>Нэвтрэх код</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
            </div>
            <div>
              <Label>Имэйл</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <Button onClick={create}>Нэмэх</Button>
        </Card>

        <div className="space-y-3">
          {rows.map((p) => (
            <Card key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-lg">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.phone}</p>
                  {p.email ? <p className="text-sm text-muted-foreground">{p.email}</p> : null}
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{p.childrenCount} хүүхэд</p>
                </div>
              </div>
              {p.children.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.children.map((c) => (
                    <span key={c.id} className="rounded-full border px-3 py-1 text-xs">
                      {c.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Холбоотой хүүхэд байхгүй — Гишүүд хуудаснаас parentAccountId холбоно.</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
}
