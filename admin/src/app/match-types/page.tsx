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

type MatchType = {
  id: string;
  name: string;
  comment?: string;
};

const empty = { name: "", comment: "" };

export default function MatchTypesPage() {
  const [items, setItems] = useState<MatchType[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    const data = await api<{ matchTypes: MatchType[] }>("/api/admin/match-types");
    setItems(data.matchTypes);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  async function save() {
    try {
      if (editing) {
        await api(`/api/admin/match-types/${editing}`, { method: "PUT", body: JSON.stringify(form) });
      } else {
        await api("/api/admin/match-types", { method: "POST", body: JSON.stringify(form) });
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
      <h1 className="mb-2 font-heading text-3xl text-primary">Match type</h1>
      <p className="mb-6 text-sm text-muted-foreground">Тэмцээний төрлийг эндээс нэмж, засварлана.</p>
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Засах" : "Шинэ төрөл"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label>Нэр</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Comment</Label>
              <Textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button onClick={save}>{editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
              {editing && (
                <Button variant="outline" onClick={() => { setEditing(null); setForm(empty); }}>
                  Болих
                </Button>
              )}
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
                  <TableHead>Comment</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.comment || "—"}</TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(item.id);
                          setForm({ name: item.name, comment: item.comment || "" });
                        }}
                      >
                        Засах
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                          if (!confirm("Устгах уу?")) return;
                          await api(`/api/admin/match-types/${item.id}`, { method: "DELETE" });
                          load();
                        }}
                      >
                        Устгах
                      </Button>
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
