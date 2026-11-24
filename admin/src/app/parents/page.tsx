"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/file-upload";
import { api } from "@/lib/api";
import { canAny } from "@/lib/auth";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { MPassword } from "@/components/custom/fields";
import { DataTable, StatusBadge, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";

type ChildRow = { id: string; name: string; memberCode?: string | null; memberType?: string };
type MemberOption = {
  id: string;
  name: string;
  memberCode?: string | null;
  phone?: string | null;
  username?: string | null;
  memberType?: string | null;
};
type ParentRow = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  avatarUrl?: string | null;
  hasPassword?: boolean;
  memberId?: string | null;
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

  const filtered = useMemo(
    () =>
      parents.filter((p) =>
        matchesQuery(query, [p.name, p.phone, p.email, ...(p.children || []).map((c) => c.name)])
      ),
    [parents, query]
  );
  const table = useClientTable(filtered, { resetKey: query });

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-primary">Эцэг эх</h1>
        {canAny("parents.manage", "members.create") && (
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

      <DataTable
            search={query}
            onSearchChange={setQuery}
            searchPlaceholder="Нэр, утас, хүүхэд..."
            unit="эцэг эх"
            total={table.total}
            page={table.page}
            pageCount={table.pageCount}
            onPageChange={table.setPage}
            pageSize={table.pageSize}
            onPageSizeChange={table.setPageSize}
          >
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
              {table.visible.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium">
                      {p.name}
                      {p.memberId ? (
                        <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal uppercase tracking-wide text-muted-foreground">
                          Гишүүн
                        </span>
                      ) : null}
                    </div>
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
                    <StatusBadge active={Boolean(p.hasPassword)} activeLabel="Нууц үгтэй" inactiveLabel="Тохируулаагүй" />
                  </TableCell>
                  <TableCell>
                    <ActionCell>
                      {canAny("parents.manage", "members.update") && (
                        <IconActionButton
                          action="edit"
                          onClick={() => {
                            setEditing(p);
                            setOpen(true);
                          }}
                        />
                      )}
                      {canAny("parents.manage", "members.delete") && (
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
              {table.visible.length === 0 && <TableEmpty colSpan={6}>Эцэг эх алга.</TableEmpty>}
            </TableBody>
          </Table>
          </DataTable>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full gap-0 sm:max-w-3xl!">
          {open && (
            <ParentDrawer
              key={editing?.id ?? "new"}
              parent={editing}
              onRefresh={load}
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
  onRefresh,
  onSaved,
  onCancel,
}: {
  parent: ParentRow | null;
  onRefresh: () => Promise<void>;
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
  const [children, setChildren] = useState<ChildRow[]>(parent?.children || []);
  const [members, setMembers] = useState<MemberOption[]>([]);
  const [memberQuery, setMemberQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (!parent) return;
    let cancelled = false;
    api<{ members: MemberOption[] }>("/api/admin/parents/member-options")
      .then((data) => {
        if (!cancelled) setMembers(data.members || []);
      })
      .catch((e) => toast.error(e instanceof Error ? e.message : "Гишүүн ачаалж чадсангүй"));
    return () => {
      cancelled = true;
    };
  }, [parent]);

  function set<K extends keyof ParentForm>(key: K, value: ParentForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyParent(next: ParentRow) {
    setChildren(next.children || []);
    setPicked([]);
  }

  const childIds = useMemo(() => new Set(children.map((c) => c.id)), [children]);
  const importable = useMemo(() => {
    const q = memberQuery.trim().toLowerCase();
    return members.filter((m) => {
      if (childIds.has(m.id)) return false;
      if (parent?.memberId && m.id === parent.memberId) return false;
      if (!q) return true;
      return [m.name, m.memberCode, m.phone, m.username, m.memberType]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [members, childIds, memberQuery, parent?.memberId]);

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

  async function importChildren() {
    if (!parent || !picked.length) {
      toast.error("Гишүүн сонгоно уу");
      return;
    }
    setImporting(true);
    try {
      const data = await api<{ parent: ParentRow }>(`/api/admin/parents/${parent.id}/children`, {
        method: "POST",
        body: JSON.stringify({ memberIds: picked }),
      });
      applyParent(data.parent);
      toast.success("Хүүхэд холболоо");
      await onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setImporting(false);
    }
  }

  async function removeChild(childId: string) {
    if (!parent) return;
    try {
      const data = await api<{ parent: ParentRow }>(`/api/admin/parents/${parent.id}/children/${childId}`, {
        method: "DELETE",
      });
      applyParent(data.parent);
      toast.success("Холбоос салгалаа");
      await onRefresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  function togglePicked(id: string) {
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
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
            <MPassword
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
          {parent ? (
            <div className="md:col-span-2 space-y-3 rounded-lg border border-border p-3">
              <div>
                <Label>Холбоотой хүүхэд</Label>
                <p className="mt-1 text-xs text-muted-foreground">Гишүүдийн жагсаалтаас хүүхэд импортлоно.</p>
              </div>
              {children.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {children.map((c) => (
                    <Badge key={c.id} variant="secondary" className="gap-1 pr-1">
                      {c.name}
                      {c.memberCode ? ` · ${c.memberCode}` : c.memberType ? ` · ${c.memberType}` : ""}
                      {canAny("parents.manage", "members.update") && (
                        <button
                          type="button"
                          className="rounded-full p-0.5 hover:bg-muted"
                          onClick={() => removeChild(c.id)}
                          aria-label={`${c.name} салгах`}
                        >
                          <X className="size-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Хүүхэд алга.</p>
              )}
              {canAny("parents.manage", "members.update") && (
                <div className="space-y-2">
                  <Input
                    value={memberQuery}
                    placeholder="Гишүүн хайх: нэр, ID, утас..."
                    onChange={(e) => setMemberQuery(e.target.value)}
                  />
                  <div className="max-h-56 overflow-y-auto rounded-md border border-border">
                    {importable.length === 0 ? (
                      <p className="p-3 text-xs text-muted-foreground">Тохирох гишүүн алга.</p>
                    ) : (
                      importable.map((m) => {
                        const checked = picked.includes(m.id);
                        return (
                          <label
                            key={m.id}
                            className="flex cursor-pointer items-center gap-2 border-b border-border px-3 py-2 text-sm last:border-b-0 hover:bg-muted/50"
                          >
                            <input
                              type="checkbox"
                              className="size-4 accent-primary"
                              checked={checked}
                              onChange={() => togglePicked(m.id)}
                            />
                            <span className="flex-1">
                              {m.name}
                              {m.memberCode ? ` · ${m.memberCode}` : ""}
                              {m.memberType ? ` · ${m.memberType}` : ""}
                            </span>
                            {m.phone ? <span className="text-xs text-muted-foreground">{m.phone}</span> : null}
                          </label>
                        );
                      })
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" onClick={importChildren} disabled={importing || picked.length === 0}>
                      {importing ? "Холбож байна..." : `Хүүхэд холбох${picked.length ? ` (${picked.length})` : ""}`}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="md:col-span-2 text-xs text-muted-foreground">
              Хадгалсны дараа Эцэг эх жагсаалтаас гишүүн импортлож хүүхэд холбоно.
            </p>
          )}
        </div>
      </div>
      <SheetFooter className="flex-row justify-end border-t border-border">
        <Button variant="outline" onClick={onCancel}>Болих</Button>
        {(parent ? canAny("parents.manage", "members.update") : canAny("parents.manage", "members.create")) && (
          <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : parent ? "Шинэчлэх" : "Үүсгэх"}</Button>
        )}
      </SheetFooter>
    </>
  );
}
