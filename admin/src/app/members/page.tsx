"use client";

import { useEffect, useMemo, useState } from "react";
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
import { FieldSelect } from "@/components/field-select";
import { FileUpload } from "@/components/file-upload";
import { api, tugrik } from "@/lib/api";
import { can } from "@/lib/auth";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { cn } from "@/lib/utils";

type Named = { id: string; name: string; requiresParent?: boolean };
type Member = {
  id: string;
  name: string;
  memberCode: string;
  hasPassword?: boolean;
  phone?: string;
  level: number;
  rank: number;
  status: string;
  walletBalance: number;
  validFrom?: string;
  validTo?: string;
  memberTypeId?: string | null;
  developmentActivityId?: string | null;
  parentId?: string | null;
  parentName?: string | null;
  parentPhone?: string | null;
  parentEmail?: string | null;
  avatarUrl?: string | null;
  memberType?: { name: string; requiresParent?: boolean } | null;
  developmentActivity?: { name: string } | null;
};

type MemberForm = {
  name: string;
  memberCode: string;
  phone: string;
  password: string;
  level: number | "";
  rank: number | "";
  walletBalance: number;
  validFrom: string;
  validTo: string;
  status: string;
  memberTypeId: string;
  developmentActivityId: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  avatarUrl: string;
};

const empty: MemberForm = {
  name: "",
  memberCode: "",
  phone: "",
  password: "",
  level: 1,
  rank: 0,
  walletBalance: 0,
  validFrom: "",
  validTo: "",
  status: "active",
  memberTypeId: "",
  developmentActivityId: "",
  parentId: "",
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  avatarUrl: "",
};

function dateValue(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function num(value: number | "") {
  return value === "" ? 0 : Number(value);
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberTypes, setMemberTypes] = useState<Named[]>([]);
  const [activities, setActivities] = useState<Named[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  async function load() {
    const [memberData, lookups] = await Promise.all([
      api<{ members: Member[] }>("/api/admin/members"),
      api<{ memberTypes: Named[]; activities: Named[] }>("/api/admin/lookups"),
    ]);
    setMembers(memberData.members);
    setMemberTypes(lookups.memberTypes);
    setActivities(lookups.activities);
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api<{ members: Member[] }>("/api/admin/members"),
      api<{ memberTypes: Named[]; activities: Named[] }>("/api/admin/lookups"),
    ])
      .then(([memberData, lookups]) => {
        if (cancelled) return;
        setMembers(memberData.members);
        setMemberTypes(lookups.memberTypes);
        setActivities(lookups.activities);
      })
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const q = query.trim().toLowerCase();
  const visible = members.filter(
    (m) =>
      !q ||
      [m.name, m.memberCode, m.phone, m.parentName, m.memberType?.name]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
  );

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
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-8" placeholder="Нэр, код, утас..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Нэр</TableHead>
                <TableHead>Төрөл</TableHead>
                <TableHead>Эцэг/эх</TableHead>
                <TableHead>Хөтөлбөр</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Төлөв</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {m.memberCode}
                      {m.phone ? ` · ${m.phone}` : ""}
                      {m.hasPassword ? " · нууц үгтэй" : ""}
                    </div>
                  </TableCell>
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
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Гишүүн алга.
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
            <MemberDrawer
              key={editing?.id ?? "new"}
              member={editing}
              members={members}
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
  members,
  memberTypes,
  activities,
  onSaved,
  onCancel,
}: {
  member: Member | null;
  members: Member[];
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
          memberCode: member.memberCode,
          phone: member.phone || "",
          level: member.level,
          rank: member.rank,
          walletBalance: member.walletBalance,
          validFrom: dateValue(member.validFrom),
          validTo: dateValue(member.validTo),
          status: member.status,
          memberTypeId: member.memberTypeId || "",
          developmentActivityId: member.developmentActivityId || "",
          parentId: member.parentId || "",
          parentName: member.parentName || "",
          parentPhone: member.parentPhone || "",
          parentEmail: member.parentEmail || "",
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

  function chooseParent(parentId: string) {
    const parent = members.find((m) => m.id === parentId);
    setForm((current) => ({
      ...current,
      parentId,
      parentName: parent?.name || current.parentName,
      parentPhone: parent?.phone || current.parentPhone,
    }));
  }

  async function save() {
    if (!form.name.trim() || !form.memberCode.trim()) {
      toast.error("Нэр болон код оруулна уу");
      return;
    }
    if (selectedType?.requiresParent && !form.parentId && !form.parentName.trim()) {
      toast.error("Эцэг/эх сонгох эсвэл нэрийг нь оруулна уу");
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
        parentId: form.parentId || null,
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
          <Field label="Утас">
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
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
          <Field label="Эцэг/эх">
            <FieldSelect value={form.parentId} onChange={chooseParent}>
              <option value="">Сонгох</option>
              {members
                .filter((m) => m.id !== member?.id)
                .map((m) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.memberCode})</option>
                ))}
            </FieldSelect>
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
          <Field label="Эцэг/эхийн нэр">
            <Input value={form.parentName} onChange={(e) => set("parentName", e.target.value)} />
          </Field>
          <Field label="Эцэг/эхийн утас">
            <Input value={form.parentPhone} onChange={(e) => set("parentPhone", e.target.value)} />
          </Field>
          <Field label="Эцэг/эхийн имэйл">
            <Input value={form.parentEmail} onChange={(e) => set("parentEmail", e.target.value)} />
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
