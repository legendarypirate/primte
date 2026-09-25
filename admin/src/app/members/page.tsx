"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronsUpDown, Plus, Search } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FieldSelect } from "@/components/field-select";
import { FileUpload } from "@/components/file-upload";
import { api, tugrik } from "@/lib/api";
import { can } from "@/lib/auth";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { cn } from "@/lib/utils";

type Named = { id: string; name: string; requiresParent?: boolean };
type ParentRow = { id: string; name: string; phone?: string; email?: string };
type Member = {
  id: string;
  name: string;
  username?: string | null;
  memberCode: string;
  hasPassword?: boolean;
  phone?: string;
  email?: string | null;
  birthday?: string | null;
  gender?: string | null;
  classification?: string | null;
  level: number;
  rank: number;
  status: string;
  walletBalance: number;
  validFrom?: string;
  validTo?: string;
  memberTypeId?: string | null;
  developmentActivityId?: string | null;
  parentAccountId?: string | null;
  parentName?: string | null;
  avatarUrl?: string | null;
  memberType?: { name: string; requiresParent?: boolean } | null;
  developmentActivity?: { name: string } | null;
};

type MemberForm = {
  name: string;
  username: string;
  memberCode: string;
  phone: string;
  email: string;
  birthday: string;
  gender: string;
  classification: string;
  password: string;
  level: number | "";
  rank: number | "";
  walletBalance: number;
  validFrom: string;
  validTo: string;
  status: string;
  memberTypeId: string;
  developmentActivityId: string;
  parentAccountId: string;
  avatarUrl: string;
};

const empty: MemberForm = {
  name: "",
  username: "",
  memberCode: "",
  phone: "",
  email: "",
  birthday: "",
  gender: "",
  classification: "",
  password: "",
  level: 1,
  rank: 0,
  walletBalance: 0,
  validFrom: "",
  validTo: "",
  status: "active",
  memberTypeId: "",
  developmentActivityId: "",
  parentAccountId: "",
  avatarUrl: "",
};

function dateValue(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function num(value: number | "") {
  return value === "" ? 0 : Number(value);
}

const PAGE_SIZE = 50;
type SortKey = "name" | "code" | "email" | "birthday" | "gender" | "classification" | "type" | "parent" | "program" | "wallet" | "status";

function sortValue(member: Member, key: SortKey) {
  switch (key) {
    case "name":
      return member.name || "";
    case "code":
      return member.memberCode || "";
    case "email":
      return member.email || "";
    case "birthday":
      return member.birthday || "";
    case "gender":
      return member.gender || "";
    case "classification":
      return member.classification || "";
    case "type":
      return member.memberType?.name || "";
    case "parent":
      return member.parentName || "";
    case "program":
      return member.developmentActivity?.name || "";
    case "wallet":
      return member.walletBalance ?? 0;
    case "status":
      return member.status || "";
  }
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [parents, setParents] = useState<ParentRow[]>([]);
  const [memberTypes, setMemberTypes] = useState<Named[]>([]);
  const [activities, setActivities] = useState<Named[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  async function load() {
    const [memberData, lookups, parentData] = await Promise.all([
      api<{ members: Member[] }>("/api/admin/members"),
      api<{ memberTypes: Named[]; activities: Named[] }>("/api/admin/lookups"),
      api<{ parents: ParentRow[] }>("/api/admin/parents"),
    ]);
    setMembers(memberData.members);
    setMemberTypes(lookups.memberTypes);
    setActivities(lookups.activities);
    setParents(parentData.parents);
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api<{ members: Member[] }>("/api/admin/members"),
      api<{ memberTypes: Named[]; activities: Named[] }>("/api/admin/lookups"),
      api<{ parents: ParentRow[] }>("/api/admin/parents"),
    ])
      .then(([memberData, lookups, parentData]) => {
        if (cancelled) return;
        setMembers(memberData.members);
        setMemberTypes(lookups.memberTypes);
        setActivities(lookups.activities);
        setParents(parentData.parents);
      })
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    const rows = members.filter((m) => {
      if (!q) return true;
      return [m.name, m.memberCode, m.email].some((v) => String(v || "").toLowerCase().includes(q));
    });
    const next = [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, { numeric: true, sensitivity: "base" });
      return sortDir === "asc" ? cmp : -cmp;
    });
    return next;
  }, [members, q, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function openCreate() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(member: Member) {
    setEditing(member);
    setOpen(true);
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl text-primary">Гишүүд</h1>
        {can("members.create") && (
          <Button onClick={openCreate}>
            <Plus className="size-4" /> Гишүүн нэмэх
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Нэр эсвэл кодаар хайх..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filtered.length} гишүүн · хуудас {currentPage}/{pageCount}
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <SortHead label="Нэр" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
                <SortHead label="Код" active={sortKey === "code"} dir={sortDir} onClick={() => toggleSort("code")} />
                <SortHead label="Имэйл" active={sortKey === "email"} dir={sortDir} onClick={() => toggleSort("email")} />
                <SortHead label="Төрсөн" active={sortKey === "birthday"} dir={sortDir} onClick={() => toggleSort("birthday")} />
                <SortHead label="Хүйс" active={sortKey === "gender"} dir={sortDir} onClick={() => toggleSort("gender")} />
                <SortHead label="Ангилал" active={sortKey === "classification"} dir={sortDir} onClick={() => toggleSort("classification")} />
                <SortHead label="Төрөл" active={sortKey === "type"} dir={sortDir} onClick={() => toggleSort("type")} />
                <SortHead label="Эцэг/эх" active={sortKey === "parent"} dir={sortDir} onClick={() => toggleSort("parent")} />
                <SortHead label="Хөтөлбөр" active={sortKey === "program"} dir={sortDir} onClick={() => toggleSort("program")} />
                <SortHead label="Wallet" active={sortKey === "wallet"} dir={sortDir} onClick={() => toggleSort("wallet")} />
                <SortHead label="Төлөв" active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")} />
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.username ? `@${m.username}` : ""}
                      {m.phone ? `${m.username ? " · " : ""}${m.phone}` : ""}
                      {m.hasPassword ? " · нууц үгтэй" : ""}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{m.memberCode}</TableCell>
                  <TableCell>{m.email || "—"}</TableCell>
                  <TableCell>{m.birthday ? String(m.birthday).slice(0, 10) : "—"}</TableCell>
                  <TableCell>{m.gender || "—"}</TableCell>
                  <TableCell>{m.classification || "—"}</TableCell>
                  <TableCell>{m.memberType?.name || "—"}</TableCell>
                  <TableCell>{m.parentName || "—"}</TableCell>
                  <TableCell>{m.developmentActivity?.name || "—"}</TableCell>
                  <TableCell>{tugrik(m.walletBalance)}</TableCell>
                  <TableCell>
                    <Badge variant={m.status === "active" ? "default" : "secondary"}>{m.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <ActionCell>
                      {can("members.update") && <IconActionButton action="edit" onClick={() => openEdit(m)} />}
                      {can("members.topup") && (
                        <IconActionButton
                          action="topup"
                          onClick={async () => {
                            const amount = Number(prompt("Цэнэглэх дүн", "50000") || 0);
                            if (!amount) return;
                            await api(`/api/admin/members/${m.id}/topup`, { method: "POST", body: JSON.stringify({ amount }) });
                            toast.success("Цэнэглэлээ");
                            load();
                          }}
                        />
                      )}
                      {can("members.delete") && (
                        <IconActionButton
                          action="delete"
                          onClick={async () => {
                            if (!confirm("Устгах уу?")) return;
                            await api(`/api/admin/members/${m.id}`, { method: "DELETE" });
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
                  <TableCell colSpan={12} className="py-10 text-center text-muted-foreground">
                    Гишүүн алга.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {filtered.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
                  Өмнөх
                </Button>
                <Button variant="outline" size="sm" disabled={currentPage >= pageCount} onClick={() => setPage(currentPage + 1)}>
                  Дараах
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full gap-0 sm:max-w-3xl!">
          {open && (
            <MemberDrawer
              key={editing?.id ?? "new"}
              member={editing}
              parents={parents}
              memberTypes={memberTypes}
              activities={activities}
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

function SortHead({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  const Icon = !active ? ChevronsUpDown : dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <TableHead>
      <button type="button" onClick={onClick} className="inline-flex items-center gap-1 hover:text-foreground">
        {label}
        <Icon className={cn("size-3.5", active ? "text-foreground" : "text-muted-foreground")} />
      </button>
    </TableHead>
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

function MemberDrawer({
  member,
  parents,
  memberTypes,
  activities,
  onSaved,
  onCancel,
}: {
  member: Member | null;
  parents: ParentRow[];
  memberTypes: Named[];
  activities: Named[];
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<MemberForm>(
    member
      ? {
          ...empty,
          name: member.name,
          username: member.username || "",
          memberCode: member.memberCode,
          phone: member.phone || "",
          email: member.email || "",
          birthday: dateValue(member.birthday),
          gender: member.gender || "",
          classification: member.classification || "",
          level: member.level,
          rank: member.rank,
          walletBalance: member.walletBalance,
          validFrom: dateValue(member.validFrom),
          validTo: dateValue(member.validTo),
          status: member.status,
          memberTypeId: member.memberTypeId || "",
          developmentActivityId: member.developmentActivityId || "",
          parentAccountId: member.parentAccountId || "",
          avatarUrl: member.avatarUrl || "",
        }
      : empty
  );
  const [saving, setSaving] = useState(false);

  const selectedType = useMemo(
    () => memberTypes.find((t) => t.id === form.memberTypeId),
    [memberTypes, form.memberTypeId]
  );

  function set<K extends keyof MemberForm>(key: K, value: MemberForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    if (!form.name.trim() || !form.username.trim() || !form.memberCode.trim()) {
      toast.error("Нэр, нэвтрэх нэр, код оруулна уу");
      return;
    }
    if (selectedType?.requiresParent && !form.parentAccountId) {
      toast.error("Эцэг/эх сонгоно уу");
      return;
    }
    setSaving(true);
    try {
      const body = {
        ...form,
        level: num(form.level),
        rank: num(form.rank),
        memberTypeId: form.memberTypeId || null,
        developmentActivityId: form.developmentActivityId || null,
        parentAccountId: form.parentAccountId || null,
        parentId: null,
        password: form.password.trim() || undefined,
      };
      if (member) await api(`/api/admin/members/${member.id}`, { method: "PUT", body: JSON.stringify(body) });
      else await api("/api/admin/members", { method: "POST", body: JSON.stringify(body) });
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
        <SheetTitle className="text-center">{member ? "Гишүүн засах" : "Гишүүн нэмэх"}</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Код" required>
            <Input value={form.memberCode} placeholder="001..." onChange={(e) => set("memberCode", e.target.value)} />
          </Field>
          <Field label="Эхлэх огноо">
            <Input type="date" value={form.validFrom} onChange={(e) => set("validFrom", e.target.value)} />
          </Field>
          <Field label="Нэр" required>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Нэвтрэх нэр" required>
            <Input value={form.username} placeholder="j.temuulen" onChange={(e) => set("username", e.target.value)} autoComplete="off" />
          </Field>
          <Field label="Утас">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="Имэйл">
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Төрсөн өдөр">
            <Input type="date" value={form.birthday} onChange={(e) => set("birthday", e.target.value)} />
          </Field>
          <Field label="Хүйс">
            <FieldSelect value={form.gender} onChange={(gender) => set("gender", gender)}>
              <option value="">Сонгох</option>
              <option value="эр">эр</option>
              <option value="эм">эм</option>
            </FieldSelect>
          </Field>
          <Field label="Ангилал">
            <Input value={form.classification} placeholder="Unclassified" onChange={(e) => set("classification", e.target.value)} />
          </Field>
          <Field label="Гишүүний төрөл" required>
            <FieldSelect value={form.memberTypeId} onChange={(memberTypeId) => set("memberTypeId", memberTypeId)}>
              <option value="">Сонгох</option>
              {memberTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </FieldSelect>
          </Field>
          <Field label="Хөгжлийн хөтөлбөр">
            <FieldSelect value={form.developmentActivityId} onChange={(developmentActivityId) => set("developmentActivityId", developmentActivityId)}>
              <option value="">Сонгох</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>{activity.name}</option>
              ))}
            </FieldSelect>
          </Field>
          <Field label="Эцэг/эх" required={selectedType?.requiresParent}>
            <FieldSelect value={form.parentAccountId} onChange={(parentAccountId) => set("parentAccountId", parentAccountId)}>
              <option value="">Сонгох</option>
              {parents.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}{p.phone ? ` · ${p.phone}` : ""}
                </option>
              ))}
            </FieldSelect>
            {parents.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Эхлээд <Link href="/parents" className="text-primary underline">Эцэг эх</Link> хуудаснаас бүртгэнэ үү.
              </p>
            )}
          </Field>
          <Field label="Нууц үг">
            <Input
              type="password"
              value={form.password}
              placeholder={member?.hasPassword ? "Хоосон бол хэвээр үлдэнэ" : "Апп-д нэвтрэх нууц үг"}
              onChange={(e) => set("password", e.target.value)}
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">Хоосон бол гишүүний кодоор нэвтэрнэ. Оноо баталгаажуулахад код хэвээр хэрэглэнэ.</p>
          </Field>
          <Field label="Дуусах огноо">
            <Input type="date" value={form.validTo} onChange={(e) => set("validTo", e.target.value)} />
          </Field>
          <Field label="Түвшин">
            <Input type="number" value={form.level} onChange={(e) => set("level", e.target.value === "" ? "" : Number(e.target.value))} />
          </Field>
          <Field label="Ранк">
            <Input type="number" value={form.rank} onChange={(e) => set("rank", e.target.value === "" ? "" : Number(e.target.value))} />
          </Field>
          <div className="md:col-span-2">
            <FileUpload label="Зураг холбоос" folder="prime/members" value={form.avatarUrl} onChange={(avatarUrl) => set("avatarUrl", avatarUrl)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 md:col-span-2">
            <div>
              <div className="text-sm font-medium">Төлөв</div>
              <div className="text-xs text-muted-foreground">{form.status === "active" ? "Идэвхтэй" : form.status === "expired" ? "Хугацаа дууссан" : "Идэвхгүй"}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.status === "active"}
              onClick={() => set("status", form.status === "active" ? "inactive" : "active")}
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                form.status === "active" ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                  form.status === "active" ? "left-5" : "left-0.5"
                )}
              />
            </button>
          </div>
        </div>
      </div>
      <SheetFooter className="flex-row justify-end border-t border-border">
        <Button variant="outline" onClick={onCancel}>Болих</Button>
        {(member ? can("members.update") : can("members.create")) && (
          <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : member ? "Шинэчлэх" : "Үүсгэх"}</Button>
        )}
      </SheetFooter>
    </>
  );
}
