"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { FormDrawer } from "@/components/form-drawer";

type Permission = { key: string; group: string; label: string };
type Role = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  permissions: string[];
  isSuper: boolean;
  isSystem: boolean;
};

export default function RbacPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [grouped, setGrouped] = useState<Record<string, Permission[]>>({});
  const [selectedId, setSelectedId] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const selected = useMemo(() => roles.find((r) => r.id === selectedId) || null, [roles, selectedId]);

  async function load() {
    const [roleData, permData] = await Promise.all([
      api<{ roles: Role[] }>("/api/admin/roles"),
      api<{ grouped: Record<string, Permission[]> }>("/api/admin/permissions"),
    ]);
    setRoles(roleData.roles);
    setGrouped(permData.grouped);
    setSelectedId((id) => id || roleData.roles[0]?.id || "");
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  async function savePermissions(next: string[]) {
    if (!selected) return;
    try {
      await api(`/api/admin/roles/${selected.id}`, {
        method: "PUT",
        body: JSON.stringify({ permissions: next }),
      });
      await load();
      toast.success("Эрх хадгаллаа");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  function toggle(key: string) {
    if (!selected || selected.isSuper) return;
    const has = selected.permissions.includes(key);
    const next = has ? selected.permissions.filter((k) => k !== key) : [...selected.permissions, key];
    savePermissions(next);
  }

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl text-primary">RBAC / Role</h1>
          <p className="text-sm text-muted-foreground">
            Head / Senior / Admin / Assistant эрхийг эндээс өөрчилнө. Шинэ role нэмж permission-оор хязгаарлаж болно.
          </p>
        </div>
        <Button onClick={() => { setNewName(""); setOpen(true); }}>
          <Plus className="size-4" /> Шинэ role
        </Button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Admin type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedId(role.id)}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  selectedId === role.id ? "border-primary bg-primary/10 text-primary" : "border-border"
                }`}
              >
                <div className="font-medium">{role.name}</div>
                <div className="text-xs text-muted-foreground">{role.description || role.slug}</div>
              </button>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{selected?.name || "Permission"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selected?.isSuper && (
              <p className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm">
                Head admin нь бүх эрхтэй (super). Permission матриц автоматаар нээлттэй.
              </p>
            )}
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <h3 className="mb-2 text-sm font-semibold text-primary">{group}</h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {items.map((item) => {
                    const checked = Boolean(selected?.isSuper || selected?.permissions.includes(item.key));
                    return (
                      <label key={item.key} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!selected || selected.isSuper}
                          onChange={() => toggle(item.key)}
                        />
                        {item.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            {selected && !selected.isSystem && (
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!confirm("Role устгах уу?")) return;
                  try {
                    await api(`/api/admin/roles/${selected.id}`, { method: "DELETE" });
                    setSelectedId("");
                    await load();
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Алдаа");
                  }
                }}
              >
                Role устгах
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) { setOpen(false); setNewName(""); } else setOpen(true); }}
        title="Шинэ role"
        footer={
          <>
            <Button variant="outline" onClick={() => { setOpen(false); setNewName(""); }}>Болих</Button>
            <Button
              disabled={saving || !newName.trim()}
              onClick={async () => {
                if (!newName.trim()) return;
                setSaving(true);
                try {
                  const data = await api<{ role: Role }>("/api/admin/roles", {
                    method: "POST",
                    body: JSON.stringify({ name: newName.trim(), permissions: [] }),
                  });
                  setNewName("");
                  setOpen(false);
                  await load();
                  setSelectedId(data.role.id);
                  toast.success("Role нэмлээ");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Алдаа");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Нэмж байна..." : "Үүсгэх"}
            </Button>
          </>
        }
      >
        <div className="space-y-1">
          <Label>Нэр</Label>
          <Input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Custom admin" />
        </div>
      </FormDrawer>
    </Shell>
  );
}
