"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FieldSelect } from "@/components/field-select";
import { api } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, FilterField, StatusBadge, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FormDrawer } from "@/components/form-drawer";

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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await api<{ memberTypes: MemberType[] }>("/api/admin/member-types");
    setItems(data.memberTypes);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (!category || item.category === category) &&
          matchesQuery(query, [item.name, item.slug, item.category, item.level])
      ),
    [items, query, category]
  );
  const table = useClientTable(filtered, { resetKey: `${query}|${category}` });

  function close() {
    setOpen(false);
    setEditing(null);
    setForm(empty);
  }

  function openCreate() {
    setEditing(null);
    setForm(empty);
    setOpen(true);
  }

  function openEdit(item: MemberType) {
    setEditing(item.id);
    setForm({
      name: item.name,
      category: item.category,
      level: item.level == null ? "" : String(item.level),
      isInactive: item.isInactive,
      requiresParent: item.requiresParent,
      hasAppAccess: item.hasAppAccess,
    });
    setOpen(true);
  }

  function payload() {
    return {
      ...form,
      level: form.level === "" ? null : Number(form.level),
      hasAppAccess: form.isInactive ? false : form.hasAppAccess,
    };
  }

  async function save() {
    if (!form.name.trim()) return toast.error("Нэр оруулна уу.");
    setSaving(true);
    try {
      if (editing) {
        await api(`/api/admin/member-types/${editing}`, { method: "PUT", body: JSON.stringify(payload()) });
      } else {
        await api("/api/admin/member-types", { method: "POST", body: JSON.stringify(payload()) });
      }
      toast.success("Хадгаллаа");
      close();
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">Гишүүний төрөл</h1>
          <p className="text-sm text-muted-foreground">
            Student / Official / Junior төрлүүд динамик. Junior төрөлд эцэг/эх шаардана. Inactive төрөл апп нэвтрэлтийг хаана.
          </p>
        </div>
        <Button onClick={openCreate}><Plus className="size-4" /> Шинэ төрөл</Button>
      </div>
      <DataTable
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Төрөл хайх..."
        unit="төрөл"
        total={table.total}
        page={table.page}
        pageCount={table.pageCount}
        onPageChange={table.setPage}
        pageSize={table.pageSize}
        onPageSizeChange={table.setPageSize}
        hasActiveFilters={Boolean(category || query.trim())}
        onClear={() => {
          setCategory("");
          setQuery("");
        }}
        filters={
          <FilterField label="Ангилал" className="w-36">
            <FieldSelect value={category} onChange={setCategory}>
              <option value="">Бүх ангилал</option>
              <option value="student">Student</option>
              <option value="official">Official</option>
              <option value="junior">Junior</option>
            </FieldSelect>
          </FilterField>
        }
      >
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
            {table.visible.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.level ?? "—"}</TableCell>
                <TableCell className="space-x-1">
                  {item.requiresParent && <Badge variant="secondary">parent</Badge>}
                  <StatusBadge active={!item.isInactive} activeLabel="Апп" inactiveLabel="Inactive" />
                </TableCell>
                <TableCell>
                  <ActionCell>
                    <IconActionButton action="edit" onClick={() => openEdit(item)} />
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
            {table.visible.length === 0 && <TableEmpty colSpan={5}>Төрөл алга.</TableEmpty>}
          </TableBody>
        </Table>
      </DataTable>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}
        title={editing ? "Төрөл засах" : "Шинэ төрөл"}
        footer={
          <>
            <Button variant="outline" onClick={close}>Болих</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
          </>
        }
      >
        <div className="space-y-1">
          <Label>Нэр</Label>
          <Input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
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
      </FormDrawer>
    </Shell>
  );
}
