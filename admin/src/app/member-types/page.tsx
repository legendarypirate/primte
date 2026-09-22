"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FieldSelect } from "@/components/field-select";
import { api } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";

type MemberType = {
  id: string;
  name: string;
  slug: string;
  category: string;
  level?: number | null;
  isInactive: boolean;
  requiresParent: boolean;
  hasAppAccess: boolean;
  isSystem: boolean;
};

const empty = {
  name: "",
  category: "official",
  level: "",
  isInactive: false,
  requiresParent: false,
  hasAppAccess: true,
};

export default function MemberTypesPage() {
  const [items, setItems] = useState<MemberType[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    const data = await api<{ memberTypes: MemberType[] }>("/api/admin/member-types");
    setItems(data.memberTypes);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  function payload() {
    return {
      ...form,
      level: form.level === "" ? null : Number(form.level),
      hasAppAccess: form.isInactive ? false : form.hasAppAccess,
    };
  }

  async function save() {
    try {
      if (editing) {
        await api(`/api/admin/member-types/${editing}`, { method: "PUT", body: JSON.stringify(payload()) });
      } else {
        await api("/api/admin/member-types", { method: "POST", body: JSON.stringify(payload()) });
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
      <h1 className="mb-2 font-heading text-3xl text-primary">Гишүүний төрөл</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Student / Official / Junior төрлүүд динамик. Junior төрөлд эцэг/эх шаардана. Inactive төрөл апп нэвтрэлтийг хаана.
      </p>
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Төрөл засах" : "Шинэ төрөл"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label>Нэр</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Ангилал</Label>
              <FieldSelect value={form.category} onChange={(category) => setForm({ ...form, category })}>
                <option value="student">Student</option>
                <option value="official">Official</option>
                <option value="junior">Junior</option>
              </FieldSelect>
            </div>
            <div className="space-y-1">
              <Label>Түвшин (L1–L3, хоосон байж болно)</Label>
              <Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.requiresParent} onChange={(e) => setForm({ ...form, requiresParent: e.target.checked })} />
              Эцэг/эх шаардлагатай
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isInactive} onChange={(e) => setForm({ ...form, isInactive: e.target.checked, hasAppAccess: e.target.checked ? false : form.hasAppAccess })} />
              Inactive төрөл
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.hasAppAccess} disabled={form.isInactive} onChange={(e) => setForm({ ...form, hasAppAccess: e.target.checked })} />
              Апп нэвтрэх эрх
            </label>
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
                  <TableHead>Ангилал</TableHead>
                  <TableHead>Түвшин</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.level ?? "—"}</TableCell>
                    <TableCell className="space-x-1">
                      {item.requiresParent && <Badge variant="secondary">parent</Badge>}
                      {item.isInactive ? <Badge variant="secondary">inactive</Badge> : <Badge>app</Badge>}
                    </TableCell>
                    <TableCell>
                      <ActionCell>
                        <IconActionButton
                          action="edit"
                          onClick={() => {
                            setEditing(item.id);
                            setForm({
                              name: item.name,
                              category: item.category,
                              level: item.level == null ? "" : String(item.level),
                              isInactive: item.isInactive,
                              requiresParent: item.requiresParent,
                              hasAppAccess: item.hasAppAccess,
                            });
                          }}
                        />
                        {!item.isSystem && (
                          <IconActionButton
                            action="delete"
                            onClick={async () => {
                              if (!confirm("Устгах уу?")) return;
                              await api(`/api/admin/member-types/${item.id}`, { method: "DELETE" });
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
