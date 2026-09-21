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

type Role = { id: string; name: string; slug: string };
type Staff = {
  id: string;
  name: string;
  email: string;
  roleId: string;
  role?: { name: string; slug: string; isSuper?: boolean } | null;
};

const empty = { name: "", email: "", password: "", roleId: "" };

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);

  async function load() {
    const [staffData, lookup] = await Promise.all([
      api<{ staff: Staff[] }>("/api/admin/staff"),
      api<{ roles: Role[] }>("/api/admin/lookups"),
    ]);
    setStaff(staffData.staff);
    setRoles(lookup.roles);
    setForm((f) => ({ ...f, roleId: f.roleId || lookup.roles[0]?.id || "" }));
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  async function save() {
    try {
      if (editing) {
        await api(`/api/admin/staff/${editing}`, {
          method: "PUT",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            roleId: form.roleId,
            password: form.password || undefined,
          }),
        });
      } else {
        await api("/api/admin/staff", { method: "POST", body: JSON.stringify(form) });
      }
      setForm({ ...empty, roleId: roles[0]?.id || "" });
      setEditing(null);
      await load();
      toast.success("Хадгаллаа");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <Shell>
      <h1 className="mb-2 font-heading text-3xl text-primary">Админ хэрэглэгч</h1>
      <p className="mb-6 text-sm text-muted-foreground">Админд Head / Senior / Admin / Assistant role онооно.</p>
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Админ засах" : "Шинэ админ"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Нэр</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1"><Label>Имэйл</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-1">
              <Label>{editing ? "Шинэ нууц үг (хоосон бол хэвээр)" : "Нууц үг"}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <FieldSelect value={form.roleId} onChange={(roleId) => setForm({ ...form, roleId })}>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </FieldSelect>
            </div>
            <div className="flex gap-2">
              <Button onClick={save}>{editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
              {editing && <Button variant="outline" onClick={() => { setEditing(null); setForm({ ...empty, roleId: roles[0]?.id || "" }); }}>Болих</Button>}
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
                  <TableHead>Имэйл</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell><Badge>{item.role?.name || "—"}</Badge></TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditing(item.id);
                        setForm({ name: item.name, email: item.email, password: "", roleId: item.roleId });
                      }}>Засах</Button>
                      <Button size="sm" variant="destructive" onClick={async () => {
                        if (!confirm("Устгах уу?")) return;
                        try {
                          await api(`/api/admin/staff/${item.id}`, { method: "DELETE" });
                          load();
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Алдаа");
                        }
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
