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
import { api } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";

type Activity = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isSystem: boolean;
};

const empty = { name: "", description: "" };

export default function ActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    const data = await api<{ activities: Activity[] }>("/api/admin/development-activities");
    setItems(data.activities);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  async function save() {
    try {
      if (editing) {
        await api(`/api/admin/development-activities/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await api("/api/admin/development-activities", { method: "POST", body: JSON.stringify(form) });
      }
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
      <h1 className="mb-2 font-heading text-3xl text-primary">Хөгжлийн хөтөлбөр</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        RODP, YASDP, SMDP, Full-Time / Half-Time Employee зэргийг эндээс нэмж, гишүүнд холбоно.
      </p>
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Хөтөлбөр засах" : "Шинэ хөтөлбөр"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label>Нэр</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Тайлбар</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={save}>{editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
              {editing && <Button variant="outline" onClick={() => { setEditing(null); setForm(empty); }}>Болих</Button>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Жагсаалт</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Тайлбар</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description || "—"}</TableCell>
                    <TableCell>
                      <ActionCell>
                        <IconActionButton
                          action="edit"
                          onClick={() => {
                            setEditing(item.id);
                            setForm({ name: item.name, description: item.description || "" });
                          }}
                        />
                        {!item.isSystem && (
                          <IconActionButton
                            action="delete"
                            onClick={async () => {
                              if (!confirm("Устгах уу?")) return;
                              await api(`/api/admin/development-activities/${item.id}`, { method: "DELETE" });
                              load();
                            }}
                          />
                        )}
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
