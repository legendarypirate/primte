"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { GraduationCap, HeartHandshake, Plus, UserRound } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FieldSelect } from "@/components/field-select";
import { FileUpload } from "@/components/file-upload";
import { api, tugrik } from "@/lib/api";
import { can } from "@/lib/auth";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { MPassword } from "@/components/custom/fields";
import { DataTable, FilterField, SortHead, StatusBadge, TableEmpty, useClientTable } from "@/components/data-table";
import { cn } from "@/lib/utils";
import { membershipLabel, membershipLevel } from "@/lib/membership";

type Named = {
  id: string;
  name: string;
  slug?: string;
  requiresParent?: boolean;
  category?: string;
  level?: number | null;
};
type ParentRow = { id: string; name: string; phone?: string; email?: string };
type RegistrationKind = "adult" | "junior" | "parent";
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
  xp?: number;
  rp?: number;
  level: number;
  membershipLabel?: string;
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
  category?: string | null;
  memberType?: { name: string; requiresParent?: boolean; category?: string } | null;
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
  xp: number | "";
  rp: number | "";
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
  xp: 0,
  rp: 0,
  level: 0,
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

const emptyFilters = {
  status: "",
  memberTypeId: "",
  level: "",
  gender: "",
  programId: "",
  classification: "",
};
type MemberFilters = typeof emptyFilters;
type SortKey = "name" | "code" | "email" | "birthday" | "gender" | "classification" | "level" | "xp" | "rp" | "parent" | "program" | "wallet" | "status";

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
    case "level":
      return member.membershipLabel || membershipLabel(membershipLevel(member.xp || 0, member.rp || 0));
    case "xp":
      return member.xp ?? 0;
    case "rp":
      return member.rp ?? 0;
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
  const [nextMemberCode, setNextMemberCode] = useState("S0001");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<MemberFilters>(emptyFilters);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [xpOpen, setXpOpen] = useState(false);
  const [xpAmount, setXpAmount] = useState<number | "">("");
  const [rpAmount, setRpAmount] = useState<number | "">("");
  const [xpSaving, setXpSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  async function load() {
    const [memberData, lookups, parentData] = await Promise.all([
      api<{ members: Member[] }>("/api/admin/members"),
      api<{ memberTypes: Named[]; activities: Named[]; nextMemberCode?: string }>("/api/admin/lookups"),
      api<{ parents: ParentRow[] }>("/api/admin/parents"),
    ]);
    setMembers(memberData.members);
    setMemberTypes(lookups.memberTypes);
    setActivities(lookups.activities);
    setParents(parentData.parents);
    if (lookups.nextMemberCode) setNextMemberCode(lookups.nextMemberCode);
    const ids = new Set(memberData.members.map((m) => m.id));
    setSelectedIds((current) => current.filter((id) => ids.has(id)));
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api<{ members: Member[] }>("/api/admin/members"),
      api<{ memberTypes: Named[]; activities: Named[]; nextMemberCode?: string }>("/api/admin/lookups"),
      api<{ parents: ParentRow[] }>("/api/admin/parents"),
    ])
      .then(([memberData, lookups, parentData]) => {
        if (cancelled) return;
        setMembers(memberData.members);
        setMemberTypes(lookups.memberTypes);
        setActivities(lookups.activities);
        setParents(parentData.parents);
        if (lookups.nextMemberCode) setNextMemberCode(lookups.nextMemberCode);
      })
      .catch((e) => toast.error(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  const q = query.trim().toLowerCase();
  const classifications = useMemo(() => {
    const values = new Set(members.map((m) => m.classification).filter(Boolean) as string[]);
    return [...values].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  }, [members]);
  const hasFilters = Boolean(q || Object.values(filters).some(Boolean));
  const filtered = useMemo(() => {
    const rows = members.filter((m) => {
      if (filters.status && m.status !== filters.status) return false;
      if (filters.memberTypeId && m.memberTypeId !== filters.memberTypeId) return false;
      if (filters.level !== "") {
        const level = membershipLevel(m.xp || 0, m.rp || 0);
        if (String(level) !== filters.level) return false;
      }
      if (filters.gender && (m.gender || "") !== filters.gender) return false;
      if (filters.programId && m.developmentActivityId !== filters.programId) return false;
      if (filters.classification && (m.classification || "") !== filters.classification) return false;
      if (!q) return true;
      return [m.name, m.username, m.memberCode, m.email, m.phone, m.parentName]
        .some((v) => String(v || "").toLowerCase().includes(q));
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
  }, [members, q, filters, sortKey, sortDir]);

  const table = useClientTable(filtered, {
    resetKey: `${query}|${filters.status}|${filters.memberTypeId}|${filters.level}|${filters.gender}|${filters.programId}|${filters.classification}`,
  });
  const visible = table.visible;
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const visibleIds = visible.map((m) => m.id);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));
  const someVisibleSelected = visibleIds.some((id) => selectedSet.has(id));
  const allFilteredSelected = filtered.length > 0 && filtered.every((m) => selectedSet.has(m.id));
  const selectedCount = selectedIds.length;
  const canAddXp = can("members.update");

  function setFilter<K extends keyof MemberFilters>(key: K, value: MemberFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilters() {
    setQuery("");
    setFilters(emptyFilters);
  }

  function toggleOne(id: string) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]));
  }

  function toggleVisible() {
    setSelectedIds((current) => {
      if (allVisibleSelected) return current.filter((id) => !visibleIds.includes(id));
      const next = new Set(current);
      visibleIds.forEach((id) => next.add(id));
      return [...next];
    });
  }

  function selectFiltered() {
    setSelectedIds(filtered.map((m) => m.id));
  }

  async function addXp() {
    const xp = num(xpAmount);
    const rp = num(rpAmount);
    if (!selectedIds.length) {
      toast.error("Гишүүн сонгоно уу");
      return;
    }
    if (!xp && !rp) {
      toast.error("XP эсвэл RP оруулна уу");
      return;
    }
    setXpSaving(true);
    try {
      await api("/api/admin/members/add-xp", {
        method: "POST",
        body: JSON.stringify({ memberIds: selectedIds, xp, rp }),
      });
      toast.success(`${selectedIds.length} гишүүнд XP нэмлээ`);
      setXpOpen(false);
      setXpAmount("");
      setRpAmount("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setXpSaving(false);
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
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
        <div className="flex flex-wrap items-center gap-2">
          {canAddXp && (
            <Button variant="outline" disabled={!selectedCount} onClick={() => setXpOpen(true)}>
              XP нэмэх{selectedCount ? ` (${selectedCount})` : ""}
            </Button>
          )}
          {can("members.create") && (
            <Button onClick={openCreate}>
              <Plus className="size-4" /> Бүртгэх
            </Button>
          )}
        </div>
      </div>

      <DataTable
            search={query}
            onSearchChange={setQuery}
            searchPlaceholder="Овог, нэр, код, утас, имэйл…"
            unit="гишүүн"
            total={table.total}
            page={table.page}
            pageCount={table.pageCount}
            onPageChange={table.setPage}
            pageSize={table.pageSize}
            onPageSizeChange={table.setPageSize}
            hasActiveFilters={hasFilters}
            onClear={clearFilters}
            filters={
              <>
                <FilterField label="Төлөв" className="w-36">
                  <FieldSelect value={filters.status} onChange={(status) => setFilter("status", status)}>
                    <option value="">Бүх төлөв</option>
                    <option value="active">Идэвхтэй</option>
                    <option value="inactive">Идэвхгүй</option>
                    <option value="expired">Хугацаа дууссан</option>
                  </FieldSelect>
                </FilterField>
                <FilterField label="Төрөл" className="w-44">
                  <FieldSelect value={filters.memberTypeId} onChange={(memberTypeId) => setFilter("memberTypeId", memberTypeId)}>
                    <option value="">Бүх төрөл</option>
                    {memberTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </FieldSelect>
                </FilterField>
                <FilterField label="Түвшин" className="w-40">
                  <FieldSelect value={filters.level} onChange={(level) => setFilter("level", level)}>
                    <option value="">Бүх түвшин</option>
                    <option value="0">Student member</option>
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                  </FieldSelect>
                </FilterField>
                <FilterField label="Хүйс" className="w-32">
                  <FieldSelect value={filters.gender} onChange={(gender) => setFilter("gender", gender)}>
                    <option value="">Хүйс</option>
                    <option value="эр">эр</option>
                    <option value="эм">эм</option>
                  </FieldSelect>
                </FilterField>
                <FilterField label="Хөтөлбөр" className="w-44">
                  <FieldSelect value={filters.programId} onChange={(programId) => setFilter("programId", programId)}>
                    <option value="">Бүх хөтөлбөр</option>
                    {activities.map((activity) => (
                      <option key={activity.id} value={activity.id}>{activity.name}</option>
                    ))}
                  </FieldSelect>
                </FilterField>
                {classifications.length > 0 && (
                  <FilterField label="Ангилал" className="w-40">
                    <FieldSelect value={filters.classification} onChange={(classification) => setFilter("classification", classification)}>
                      <option value="">Ангилал</option>
                      {classifications.map((value) => (
                        <option key={value} value={value}>{value}</option>
                      ))}
                    </FieldSelect>
                  </FilterField>
                )}
              </>
            }
            extra={
              selectedCount > 0 ? (
                <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <span className="text-sm font-medium">{selectedCount} сонгосон</span>
                  {!allFilteredSelected && filtered.length > selectedCount && (
                    <Button variant="ghost" size="sm" onClick={selectFiltered}>
                      Шүүлт дэх бүгдийг сонгох ({filtered.length})
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                    Болих
                  </Button>
                  {canAddXp && (
                    <Button size="sm" className="ml-auto" onClick={() => setXpOpen(true)}>
                      XP нэмэх
                    </Button>
                  )}
                </div>
              ) : null
            }
          >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <SelectCheckbox
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected && !allVisibleSelected}
                    onChange={toggleVisible}
                    label="Хуудасны бүгдийг сонгох"
                  />
                </TableHead>
                <SortHead label="Нэр" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
                <SortHead label="Код" active={sortKey === "code"} dir={sortDir} onClick={() => toggleSort("code")} />
                <SortHead label="Имэйл" active={sortKey === "email"} dir={sortDir} onClick={() => toggleSort("email")} />
                <SortHead label="Төрсөн" active={sortKey === "birthday"} dir={sortDir} onClick={() => toggleSort("birthday")} />
                <SortHead label="Хүйс" active={sortKey === "gender"} dir={sortDir} onClick={() => toggleSort("gender")} />
                <SortHead label="Ангилал" active={sortKey === "classification"} dir={sortDir} onClick={() => toggleSort("classification")} />
                <SortHead label="Түвшин" active={sortKey === "level"} dir={sortDir} onClick={() => toggleSort("level")} />
                <SortHead label="XP" active={sortKey === "xp"} dir={sortDir} onClick={() => toggleSort("xp")} />
                <SortHead label="RP" active={sortKey === "rp"} dir={sortDir} onClick={() => toggleSort("rp")} />
                <SortHead label="Эцэг/эх" active={sortKey === "parent"} dir={sortDir} onClick={() => toggleSort("parent")} />
                <SortHead label="Хөтөлбөр" active={sortKey === "program"} dir={sortDir} onClick={() => toggleSort("program")} />
                <SortHead label="Wallet" active={sortKey === "wallet"} dir={sortDir} onClick={() => toggleSort("wallet")} />
                <SortHead label="Төлөв" active={sortKey === "status"} dir={sortDir} onClick={() => toggleSort("status")} />
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((m) => (
                <TableRow key={m.id} data-state={selectedSet.has(m.id) ? "selected" : undefined}>
                  <TableCell>
                    <SelectCheckbox
                      checked={selectedSet.has(m.id)}
                      onChange={() => toggleOne(m.id)}
                      label={`${m.name} сонгох`}
                    />
                  </TableCell>
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
                  <TableCell>
                    {m.membershipLabel ||
                      membershipLabel(
                        membershipLevel(m.xp || 0, m.rp || 0),
                        m.memberType?.category || m.category
                      )}
                  </TableCell>
                  <TableCell>{m.xp ?? 0}</TableCell>
                  <TableCell>{m.rp ?? 0}</TableCell>
                  <TableCell>{m.parentName || "—"}</TableCell>
                  <TableCell>{m.developmentActivity?.name || "—"}</TableCell>
                  <TableCell>{tugrik(m.walletBalance)}</TableCell>
                  <TableCell>
                    <StatusBadge active={m.status === "active"} inactiveLabel={m.status} />
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
              {visible.length === 0 && <TableEmpty colSpan={15}>Гишүүн алга.</TableEmpty>}
            </TableBody>
          </Table>
          </DataTable>

      <Dialog open={xpOpen} onOpenChange={setXpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>XP / RP бүртгэх</DialogTitle>
            <DialogDescription>
              XP зөвхөн нэмэгдэнэ. RP чансааны оноо — нэмэх, хасах хоёулаа болно. Сонгосон {selectedCount} гишүүн.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="XP (+ only)">
              <Input
                type="number"
                min={0}
                value={xpAmount}
                onChange={(e) => setXpAmount(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </Field>
            <Field label="RP (+/−)">
              <Input
                type="number"
                value={rpAmount}
                onChange={(e) => setRpAmount(e.target.value === "" ? "" : Number(e.target.value))}
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setXpOpen(false)}>Болих</Button>
            <Button onClick={addXp} disabled={xpSaving}>{xpSaving ? "Нэмэж байна..." : "Нэмэх"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full gap-0 sm:max-w-3xl!">
          {open && (
            <MemberDrawer
              key={editing?.id ?? "new"}
              member={editing}
              parents={parents}
              memberTypes={memberTypes}
              activities={activities}
              nextMemberCode={nextMemberCode}
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

function SelectCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className="size-4 accent-primary"
    />
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

const registrationKinds: Array<{
  id: RegistrationKind;
  title: string;
  body: string;
  icon: typeof UserRound;
}> = [
  {
    id: "junior",
    title: "Жуниор",
    body: "18 хүртэлх суралцагч. Эцэг/эх заавал холбогдоно.",
    icon: GraduationCap,
  },
  {
    id: "parent",
    title: "Эцэг эх",
    body: "Эцэг эхийн апп-д нэвтрэх бүртгэл. Хүүхэд дараа холбоно.",
    icon: HeartHandshake,
  },
  {
    id: "adult",
    title: "Насанд хүрсэн гишүүн",
    body: "Клубийн энгийн гишүүн. Student → Official түвшин.",
    icon: UserRound,
  },
];

function defaultTypeId(memberTypes: Named[], kind: RegistrationKind) {
  if (kind === "junior") {
    return (
      memberTypes.find((t) => t.slug === "junior-l1")?.id ||
      memberTypes.find((t) => t.category === "junior" && !t.slug?.includes("inactive"))?.id ||
      ""
    );
  }
  return memberTypes.find((t) => t.slug === "student-member")?.id || "";
}

function typesForKind(memberTypes: Named[], kind: RegistrationKind) {
  if (kind === "junior") return memberTypes.filter((t) => t.category === "junior");
  return memberTypes.filter((t) => t.category !== "junior");
}

function inferKind(member: Member | null): RegistrationKind {
  if (member?.memberType?.category === "junior" || member?.category === "junior") return "junior";
  return "adult";
}

function MemberDrawer({
  member,
  parents,
  memberTypes,
  activities,
  nextMemberCode,
  onSaved,
  onCancel,
}: {
  member: Member | null;
  parents: ParentRow[];
  memberTypes: Named[];
  activities: Named[];
  nextMemberCode: string;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [kind, setKind] = useState<RegistrationKind | null>(member ? inferKind(member) : null);

  if (!member && !kind) {
    return (
      <>
        <SheetHeader className="border-b border-border text-center">
          <SheetTitle className="text-center">Бүртгэлийн төрөл</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="mb-4 text-sm text-muted-foreground">Хэнийг бүртгэхээ сонгоно уу.</p>
          <div className="grid gap-3">
            {registrationKinds.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setKind(item.id)}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50 hover:bg-muted/40"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{item.body}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <SheetFooter className="flex-row justify-end border-t border-border">
          <Button variant="outline" onClick={onCancel}>Болих</Button>
        </SheetFooter>
      </>
    );
  }

  if (kind === "parent") {
    return <ParentCreateForm onBack={() => setKind(null)} onSaved={onSaved} onCancel={onCancel} />;
  }

  return (
    <MemberFormDrawer
      member={member}
      kind={kind || "adult"}
      parents={parents}
      memberTypes={memberTypes}
      activities={activities}
      nextMemberCode={nextMemberCode}
      onBack={member ? undefined : () => setKind(null)}
      onSaved={onSaved}
      onCancel={onCancel}
    />
  );
}

function ParentCreateForm({
  onBack,
  onSaved,
  onCancel,
}: {
  onBack: () => void;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", avatarUrl: "" });
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Нэр, утас оруулна уу");
      return;
    }
    if (!form.password.trim()) {
      toast.error("Нууц үг оруулна уу");
      return;
    }
    setSaving(true);
    try {
      await api("/api/admin/parents", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          avatarUrl: form.avatarUrl || null,
          password: form.password.trim(),
        }),
      });
      toast.success("Эцэг эх бүртгэлээ. Жуниор хүүхдийг дараа холбоно.");
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
        <SheetTitle className="text-center">Эцэг эх бүртгэх</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Нэр" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Утас" required>
            <Input value={form.phone} placeholder="+97699112233" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Имэйл">
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Нууц үг" required>
            <MPassword
              value={form.password}
              placeholder="Апп-д утастай нэвтрэх нууц үг"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">Эцэг эх апп-д утас + нууц үгээр нэвтэрнэ.</p>
          </Field>
          <div className="md:col-span-2">
            <FileUpload label="Зураг холбоос" folder="prime/parents" value={form.avatarUrl} onChange={(avatarUrl) => setForm({ ...form, avatarUrl })} />
          </div>
        </div>
      </div>
      <SheetFooter className="flex-row justify-end border-t border-border">
        <Button variant="outline" onClick={onBack}>Буцах</Button>
        <Button variant="ghost" onClick={onCancel}>Болих</Button>
        {can("members.create") && (
          <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : "Үүсгэх"}</Button>
        )}
      </SheetFooter>
    </>
  );
}

function MemberFormDrawer({
  member,
  kind,
  parents,
  memberTypes,
  activities,
  nextMemberCode,
  onBack,
  onSaved,
  onCancel,
}: {
  member: Member | null;
  kind: Exclude<RegistrationKind, "parent">;
  parents: ParentRow[];
  memberTypes: Named[];
  activities: Named[];
  nextMemberCode: string;
  onBack?: () => void;
  onSaved: () => Promise<void>;
  onCancel: () => void;
}) {
  const kindTypes = useMemo(() => typesForKind(memberTypes, kind), [memberTypes, kind]);
  const fallbackTypeId = defaultTypeId(memberTypes, kind);
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
          xp: member.xp ?? 0,
          rp: member.rp ?? 0,
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
      : { ...empty, memberCode: nextMemberCode, memberTypeId: fallbackTypeId }
  );
  const [parentMode, setParentMode] = useState<"existing" | "new">(parents.length ? "existing" : "new");
  const [newParent, setNewParent] = useState({ name: "", phone: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const isJunior = kind === "junior";

  function set<K extends keyof MemberForm>(key: K, value: MemberForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    if (!form.name.trim() || !form.username.trim() || !form.memberCode.trim()) {
      toast.error("Нэр, нэвтрэх нэр, код оруулна уу");
      return;
    }
    if (isJunior && !form.birthday) {
      toast.error("Жуниор суралцагчийн төрсөн өдөр оруулна уу");
      return;
    }
    setSaving(true);
    try {
      let parentAccountId = form.parentAccountId || null;
      if (isJunior && !member && parentMode === "new") {
        if (!newParent.name.trim() || !newParent.phone.trim() || !newParent.password.trim()) {
          toast.error("Эцэг/эхийн нэр, утас, нууц үг оруулна уу");
          setSaving(false);
          return;
        }
        const created = await api<{ parent: ParentRow }>("/api/admin/parents", {
          method: "POST",
          body: JSON.stringify({
            name: newParent.name.trim(),
            phone: newParent.phone.trim(),
            email: newParent.email.trim() || null,
            password: newParent.password.trim(),
          }),
        });
        parentAccountId = created.parent.id;
      }
      if (isJunior && !parentAccountId) {
        toast.error("Эцэг/эх сонгоно уу, эсвэл шинээр бүртгэнэ үү");
        setSaving(false);
        return;
      }
      const body = {
        ...form,
        xp: num(form.xp),
        rp: num(form.rp),
        level: membershipLevel(num(form.xp), num(form.rp)),
        rank: num(form.rank),
        memberTypeId: form.memberTypeId || fallbackTypeId || null,
        developmentActivityId: form.developmentActivityId || null,
        parentAccountId: isJunior ? parentAccountId : member ? form.parentAccountId || null : null,
        parentId: null,
        password: form.password.trim() || undefined,
      };
      if (member) await api(`/api/admin/members/${member.id}`, { method: "PUT", body: JSON.stringify(body) });
      else await api("/api/admin/members", { method: "POST", body: JSON.stringify(body) });
      toast.success(isJunior ? "Жуниор бүртгэлээ" : "Гишүүн бүртгэлээ");
      await onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSaving(false);
    }
  }

  const title = member
    ? "Гишүүн засах"
    : isJunior
      ? "Жуниор бүртгэх"
      : "Насанд хүрсэн гишүүн бүртгэх";

  const selectedJuniorType = kindTypes.find((t) => t.id === form.memberTypeId);
  const juniorLevel = selectedJuniorType?.level || 1;

  return (
    <>
      <SheetHeader className="border-b border-border text-center">
        <SheetTitle className="text-center">{title}</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Код" required>
            <Input value={form.memberCode} placeholder="S0001" onChange={(e) => set("memberCode", e.target.value)} />
            {!member && <p className="text-xs text-muted-foreground">Шинэ гишүүний код S-ээр эхэлнэ.</p>}
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
          <Field label="Төрсөн өдөр" required={isJunior}>
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
          <Field label={isJunior ? "Жуниор түвшин" : "Гишүүний төрөл"} required>
            <FieldSelect value={form.memberTypeId} onChange={(memberTypeId) => set("memberTypeId", memberTypeId)}>
              <option value="">Сонгох</option>
              {kindTypes.map((type) => (
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
          {isJunior && (
            <div className="space-y-3 rounded-lg border border-border p-3 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label>Эцэг/эх <span className="text-destructive">*</span></Label>
                {!member && (
                  <div className="flex gap-1 rounded-lg bg-muted p-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setParentMode("existing")}
                      className={cn("rounded-md px-2 py-1", parentMode === "existing" ? "bg-background shadow-sm" : "text-muted-foreground")}
                    >
                      Бүртгэлтэй
                    </button>
                    <button
                      type="button"
                      onClick={() => setParentMode("new")}
                      className={cn("rounded-md px-2 py-1", parentMode === "new" ? "bg-background shadow-sm" : "text-muted-foreground")}
                    >
                      Шинээр бүртгэх
                    </button>
                  </div>
                )}
              </div>
              {(member || parentMode === "existing") ? (
                <>
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
                      Бүртгэлтэй эцэг эх алга. Дээрх “Шинээр бүртгэх”-ийг сонгоно уу, эсвэл{" "}
                      <Link href="/parents" className="text-primary underline">Эцэг эх</Link> хуудсыг ашиглана уу.
                    </p>
                  )}
                </>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Эцэг/эхийн нэр" required>
                    <Input value={newParent.name} onChange={(e) => setNewParent({ ...newParent, name: e.target.value })} />
                  </Field>
                  <Field label="Утас" required>
                    <Input value={newParent.phone} placeholder="+97699112233" onChange={(e) => setNewParent({ ...newParent, phone: e.target.value })} />
                  </Field>
                  <Field label="Имэйл">
                    <Input type="email" value={newParent.email} onChange={(e) => setNewParent({ ...newParent, email: e.target.value })} />
                  </Field>
                  <Field label="Нууц үг" required>
                    <MPassword
                      value={newParent.password}
                      placeholder="Эцэг эхийн апп-д нэвтрэх"
                      onChange={(e) => setNewParent({ ...newParent, password: e.target.value })}
                      autoComplete="new-password"
                    />
                  </Field>
                </div>
              )}
            </div>
          )}
          <Field label="Нууц үг">
            <MPassword
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
          <Field label="XP">
            <Input type="number" min={0} value={form.xp} onChange={(e) => set("xp", e.target.value === "" ? "" : Number(e.target.value))} />
          </Field>
          <Field label="RP">
            <Input type="number" min={0} value={form.rp} onChange={(e) => set("rp", e.target.value === "" ? "" : Number(e.target.value))} />
          </Field>
          <Field label="Гишүүнчлэлийн түвшин">
            <div className="rounded-lg border border-border px-3 py-2">
              <div className="text-sm font-medium">
                {isJunior
                  ? membershipLabel(juniorLevel, "junior")
                  : membershipLabel(membershipLevel(num(form.xp), num(form.rp)))}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {isJunior
                  ? "Жуниор түвшин нь хөтөлбөрийн анги. 18 нас хүртлээ насанд хүрэгчдийн системд шилжинэ."
                  : "XP > 50 → Level 1 · XP > 50 ба RP > 150 → Level 2 · XP > 200 ба RP > 600 → Level 3"}
              </p>
            </div>
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
        {onBack && <Button variant="outline" onClick={onBack}>Буцах</Button>}
        <Button variant={onBack ? "ghost" : "outline"} onClick={onCancel}>Болих</Button>
        {(member ? can("members.update") : can("members.create")) && (
          <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : member ? "Шинэчлэх" : "Үүсгэх"}</Button>
        )}
      </SheetFooter>
    </>
  );
}
