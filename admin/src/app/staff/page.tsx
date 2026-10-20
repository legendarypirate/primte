"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MPassword } from "@/components/custom/fields";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FieldSelect } from "@/components/field-select";
import { api } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";
import { DataTable, FilterField, TableEmpty, matchesQuery, useClientTable } from "@/components/data-table";
import { FormDrawer } from "@/components/form-drawer";

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
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    const [staffData, lookup] = await Promise.all([
      api<{ staff: Staff[] }>("/api/admin/staff"),
      api<{ roles: Role[] }>("/api/admin/lookups"),
    ]);
    setStaff(staffData.staff);
    setRoles(lookup.roles);
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  const filtered = useMemo(
    () =>
      staff.filter(
        (item) =>
          (!roleFilter || item.roleId === roleFilter) &&
          matchesQuery(query, [item.name, item.email, item.role?.name])
      ),
    [staff, query, roleFilter]
  );
  const table = useClientTable(filtered, { resetKey: `${query}|${roleFilter}` });

  function blankForm() {
    return { ...empty, roleId: roles[0]?.id || "" };
  }

  function close() {
    setOpen(false);
    setEditing(null);
    setForm(blankForm());
  }

  function openCreate() {
    setEditing(null);
    setForm(blankForm());
    setOpen(true);
  }

  function openEdit(item: Staff) {
    setEditing(item.id);
    setForm({ name: item.name, email: item.email, password: "", roleId: item.roleId });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.email.trim()) return toast.error("Нэр, имэйл оруулна уу.");
    setSaving(true);
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
          <h1 className="font-heading text-3xl text-primary">Админ хэрэглэгч</h1>
          <p className="text-sm text-muted-foreground">Админд Head / Senior / Admin / Assistant role онооно.</p>
        </div>
        <Button onClick={openCreate}><Plus className="size-4" /> Шинэ админ</Button>
      </div>
      <DataTable
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Нэр, имэйл..."
        unit="админ"
        total={table.total}
        page={table.page}
        pageCount={table.pageCount}
        onPageChange={table.setPage}
        pageSize={table.pageSize}
        onPageSizeChange={table.setPageSize}
        hasActiveFilters={Boolean(roleFilter || query.trim())}
        onClear={() => {
          setRoleFilter("");
          setQuery("");
        }}
        filters={
          <FilterField label="Role" className="w-40">
            <FieldSelect value={roleFilter} onChange={setRoleFilter}>
              <option value="">Бүх role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </FieldSelect>
          </FilterField>
        }
      >
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
            {table.visible.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell><Badge>{item.role?.name || "—"}</Badge></TableCell>
                <TableCell>
                  <ActionCell>
                    <IconActionButton action="edit" onClick={() => openEdit(item)} />
                    <IconActionButton
                      action="delete"
                      onClick={async () => {
                        if (!confirm("Устгах уу?")) return;
                        try {
                          await api(`/api/admin/staff/${item.id}`, { method: "DELETE" });
                          load();
                        } catch (e) {
                          toast.error(e instanceof Error ? e.message : "Алдаа");
                        }
                      }}
                    />
                  </ActionCell>
                </TableCell>
              </TableRow>
            ))}
            {table.visible.length === 0 && <TableEmpty colSpan={4}>Админ алга.</TableEmpty>}
          </TableBody>
        </Table>
      </DataTable>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) close(); else setOpen(true); }}
        title={editing ? "Админ засах" : "Шинэ админ"}
        footer={
          <>
            <Button variant="outline" onClick={close}>Болих</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Хадгалж байна..." : editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
          </>
        }
      >
        <div className="space-y-1"><Label>Нэр</Label><Input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="space-y-1"><Label>Имэйл</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="space-y-1">
          <Label>{editing ? "Шинэ нууц үг (хоосон бол хэвээр)" : "Нууц үг"}</Label>
          <MPassword value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label>Role</Label>
          <FieldSelect value={form.roleId} onChange={(roleId) => setForm({ ...form, roleId })}>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </FieldSelect>
        </div>
      </FormDrawer>
    </Shell>
  );
}
