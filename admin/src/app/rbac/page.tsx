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
import { cn } from "@/lib/utils";

type Permission = { key: string; group: string; label: string };
type Catalog = {
  key: string;
  label: string;
  description: string;
  grouped: Record<string, Permission[]>;
};
type Role = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  kind: "admin" | "member" | "judge";
  permissions: string[];
  isSuper: boolean;
  isSystem: boolean;
};

const KINDS: Array<Role["kind"]> = ["admin", "member", "judge"];

export default function RbacPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [catalogs, setCatalogs] = useState<Record<string, Catalog>>({});
  const [kind, setKind] = useState<Role["kind"]>("admin");
  const [selectedId, setSelectedId] = useState<string>("");
  const [newName, setNewName] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const visibleRoles = useMemo(() => roles.filter((role) => role.kind === kind), [roles, kind]);
  const selected = useMemo(
    () => visibleRoles.find((r) => r.id === selectedId) || null,
    [visibleRoles, selectedId]
  );
  const catalog = catalogs[kind];

  async function load() {
    const [roleData, permData] = await Promise.all([
      api<{ roles: Role[] }>("/api/admin/roles"),
      api<{ catalogs: Record<string, Catalog> }>("/api/admin/permissions"),
    ]);
    setRoles(roleData.roles);
    setCatalogs(permData.catalogs || {});
    setSelectedId((id) => {
      const current = roleData.roles.find((r) => r.id === id);
      if (current) return id;
      return roleData.roles.find((r) => r.kind === kind)?.id || roleData.roles[0]?.id || "";
    });
  }

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, []);

  useEffect(() => {
    if (!visibleRoles.some((role) => role.id === selectedId)) {
      setSelectedId(visibleRoles[0]?.id || "");
    }
  }, [kind, visibleRoles, selectedId]);

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
          <h1 className="font-heading text-3xl text-primary">Эрх, үүрэг</h1>
          <p className="text-sm text-muted-foreground">
            Админ вэб, Prime апп, Score апп тус бүрийн 4 төрлийн эрхийг эндээс тохируулна.
          </p>
        </div>
        <Button onClick={() => { setNewName(""); setOpen(true); }}>
          <Plus className="size-4" /> Шинэ төрөл
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {KINDS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setKind(item)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm",
              kind === item ? "border-primary bg-primary text-primary-foreground" : "border-border"
            )}
          >
            {catalogs[item]?.label || item}
          </button>
        ))}
      </div>
      {catalog?.description && (
        <p className="mb-4 text-sm text-muted-foreground">{catalog.description}</p>
      )}

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Төрөл</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {visibleRoles.map((role) => (
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
            <CardTitle>{selected?.name || "Эрх"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {selected?.isSuper && (
              <p className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm">
                Ерөнхий админ нь бүх эрхтэй. Эрхийн матриц автоматаар нээлттэй.
              </p>
            )}
            {Object.entries(catalog?.grouped || {}).map(([group, items]) => (
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
                  if (!confirm("Төрөл устгах уу?")) return;
                  try {
                    await api(`/api/admin/roles/${selected.id}`, { method: "DELETE" });
                    setSelectedId("");
                    await load();
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Алдаа");
                  }
                }}
              >
                Төрөл устгах
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <FormDrawer
        open={open}
        onOpenChange={(next) => { if (!next) { setOpen(false); setNewName(""); } else setOpen(true); }}
        title="Шинэ төрөл"
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
                    body: JSON.stringify({ name: newName.trim(), kind, permissions: [] }),
                  });
                  setNewName("");
                  setOpen(false);
                  await load();
                  setSelectedId(data.role.id);
                  toast.success("Төрөл нэмлээ");
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
          <Input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Тухайн аппын нэмэлт төрөл" />
          <p className="text-xs text-muted-foreground">
            {catalog?.label || "Админ вэб"} хэсэгт нэмэгдэнэ.
          </p>
        </div>
      </FormDrawer>
    </Shell>
  );
}
