"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/file-upload";
import { api } from "@/lib/api";
import { can } from "@/lib/auth";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";

type ChildRow = { id: string; name: string; memberType?: string };
type ParentRow = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  avatarUrl?: string | null;
  hasPassword?: boolean;
  childrenCount: number;
  children: ChildRow[];
};

type ParentForm = {
  name: string;
  phone: string;
  email: string;
  password: string;
  avatarUrl: string;
};

const empty: ParentForm = {
  name: "",
  phone: "",
  email: "",
  password: "",
  avatarUrl: "",
};

export default function ParentsPage() {
  const [parents, setParents] = useState<ParentRow[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ParentRow | null>(null);

  async function load() {
    const data = await api<{ parents: ParentRow[] }>("/api/admin/parents");
    setParents(data.parents);
  }

  useEffect(() => {
    let cancelled = false;
    api<{ parents: ParentRow[] }>("/api/admin/parents")
      .then((data) => {
        if (!cancelled) setParents(data.parents);
      })
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const q = query.trim().toLowerCase();
  const visible = parents.filter(
    (p) =>
      !q ||
      [p.name, p.phone, p.email, ...(p.children || []).map((c) => c.name)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
  );

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-primary">Эцэг эх</h1>
        {can("members.create") && (
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            <Plus className="size-4" /> Эцэг эх нэмэх
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-8" placeholder="Нэр, утас, хүүхэд..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Нэр</TableHead>
                <TableHead>Утас</TableHead>
                <TableHead>Имэйл</TableHead>
                <TableHead>Хүүхэд</TableHead>
                <TableHead>Нэвтрэх</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">{p.name}</div>
                  </TableCell>
                  <TableCell>{p.phone || "—"}</TableCell>
                  <TableCell>{p.email || "—"}</TableCell>
                  <TableCell>
                    {p.childrenCount ? (
                      <div className="flex flex-wrap gap-1">
                        {(p.children || []).map((c) => (
                          <Badge key={c.id} variant="secondary">{c.name}</Badge>
                        ))}
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.hasPassword ? "default" : "secondary"}>
                      {p.hasPassword ? "нууц үгтэй" : "тохируулаагүй"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ActionCell>
                      {can("members.update") && (
                        <IconActionButton
                          action="edit"
                          onClick={() => {
                            setEditing(p);
                            setOpen(true);
                          }}
                        />
                      )}
                      {can("members.delete") && (
                        <IconActionButton
                          action="delete"
                          onClick={async () => {
                            if (!confirm("Устгах уу?")) return;
                            await api(`/api/admin/parents/${p.id}`, { method: "DELETE" });
                            toast.success("Устгалаа");
                            load();
                          }}
                        />
                      )}
                    </ActionCell>
                  </TableCell>
                </TableRow>
              ))}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Эцэг эх алга.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full gap-0 sm:max-w-3xl!">
          {open && (
            <ParentDrawer
              key={editing?.id ?? "new"}
              parent={editing}
              onSaved={async () => {
                setOpen(false);
                await load();
              }}
              onCancel={() => setOpen(false)}
            />
          )}
        </SheetContent>
      </Sheet>
    </Shell>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}

function ParentDrawer({
  parent,
  onSaved,
  onCancel,
}: {
  parent: ParentRow | null;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ParentForm>(
    parent
      ? {
          ...empty,
          name: parent.name,
          phone: parent.phone || "",
          email: parent.email || "",
          avatarUrl: parent.avatarUrl || "",
        }
      : empty
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ParentForm>(key: K, value: ParentForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Нэр, утас оруулна уу");
      return;
    }
    if (!parent && !form.password.trim()) {
      toast.error("Нууц үг оруулна уу");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        avatarUrl: form.avatarUrl || null,
        password: form.password.trim() || undefined,
      };
      if (parent) await api(`/api/admin/parents/${parent.id}`, { method: "PUT", body: JSON.stringify(body) });
      else await api("/api/admin/parents", { method: "POST", body: JSON.stringify(body) });
      toast.success("Хадгаллаа");
      await onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <SheetHeader className="border-b border-border text-center">
        <SheetTitle className="text-center">{parent ? "Эцэг эх засах" : "Эцэг эх нэмэх"}</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Нэр" required>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Утас" required>
            <Input value={form.phone} placeholder="+97699112233" onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Имэйл">
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Нууц үг" required={!parent}>
            <Input
              type="password"
              value={form.password}
              placeholder={parent?.hasPassword ? "Хоосон бол хэвээр үлдэнэ" : "Апп-д утастай нэвтрэх нууц үг"}
              onChange={(e) => set("password", e.target.value)}
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">Эцэг эх апп-д утас + нууц үгээр нэвтэрнэ.</p>
          </Field>
          <div className="md:col-span-2">
            <FileUpload label="Зураг холбоос" folder="prime/parents" value={form.avatarUrl} onChange={(avatarUrl) => set("avatarUrl", avatarUrl)} />
          </div>
          {parent && parent.children.length > 0 && (
            <div className="md:col-span-2 space-y-2">
              <Label>Холбоотой хүүхэд</Label>
              <div className="flex flex-wrap gap-2">
                {parent.children.map((c) => (
                  <Badge key={c.id} variant="secondary">
                    {c.name}
                    {c.memberType ? ` · ${c.memberType}` : ""}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <SheetFooter className="flex-row justify-end border-t border-border">
        <Button variant="outline" onClick={onCancel}>Болих</Button>
        {(parent ? can("members.update") : can("members.create")) && (
          <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : parent ? "Шинэчлэх" : "Үүсгэх"}</Button>
        )}
      </SheetFooter>
    </>
  );
}
