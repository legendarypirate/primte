"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

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
      <h1 className="mb-2 font-heading text-3xl text-primary">RBAC / Role</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Head / Senior / Admin / Assistant эрхийг эндээс өөрчилнө. Шинэ role нэмж permission-оор хязгаарлаж болно.
      </p>
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
            <div className="pt-3 space-y-2">
              <Label>Шинэ role</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Custom admin" />
              <Button
                className="w-full"
                variant="outline"
                onClick={async () => {
                  if (!newName.trim()) return;
                  try {
                    const data = await api<{ role: Role }>("/api/admin/roles", {
                      method: "POST",
                      body: JSON.stringify({ name: newName.trim(), permissions: [] }),
                    });
                    setNewName("");
                    await load();
                    setSelectedId(data.role.id);
                    toast.success("Role нэмлээ");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Алдаа");
                  }
                }}
              >
                Нэмэх
              </Button>
            </div>
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
    </Shell>
  );
}
