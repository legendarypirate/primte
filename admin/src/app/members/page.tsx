"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FieldSelect } from "@/components/field-select";
import { FileUpload } from "@/components/file-upload";
import { api, tugrik } from "@/lib/api";
import { can } from "@/lib/auth";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";

type Named = { id: string; name: string; requiresParent?: boolean };
type Member = {
  id: string;
  name: string;
  memberCode: string;
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
  memberType?: { name: string } | null;
  developmentActivity?: { name: string } | null;
};

const empty = {
  name: "",
  memberCode: "",
  phone: "",
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

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [memberTypes, setMemberTypes] = useState<Named[]>([]);
  const [activities, setActivities] = useState<Named[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [topup, setTopup] = useState({ id: "", amount: 50000 });

  const selectedType = useMemo(
    () => memberTypes.find((t) => t.id === form.memberTypeId),
    [memberTypes, form.memberTypeId]
  );

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
    load().catch((e) => toast.error(e.message));
  }, []);

  function payload() {
    return {
      ...form,
      memberTypeId: form.memberTypeId || null,
      developmentActivityId: form.developmentActivityId || null,
      parentId: form.parentId || null,
    };
  }

  async function save() {
    try {
      if (editing) {
        await api(`/api/admin/members/${editing}`, { method: "PUT", body: JSON.stringify(payload()) });
      } else {
        await api("/api/admin/members", { method: "POST", body: JSON.stringify(payload()) });
      }
      setForm(empty);
      setEditing(null);
      await load();
      toast.success("Хадгаллаа");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Гишүүд</h1>
      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Гишүүн засах" : "Шинэ гишүүн"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1"><Label>Нэр</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-1"><Label>Код</Label><Input value={form.memberCode} onChange={(e) => setForm({ ...form, memberCode: e.target.value })} /></div>
            <div className="space-y-1"><Label>Утас</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <FileUpload
              label="Профайл зураг"
              folder="prime/members"
              value={form.avatarUrl}
              onChange={(avatarUrl) => setForm({ ...form, avatarUrl })}
            />
            <div className="space-y-1">
              <Label>Гишүүний төрөл</Label>
              <FieldSelect value={form.memberTypeId} onChange={(memberTypeId) => setForm({ ...form, memberTypeId })}>
                <option value="">Сонгох</option>
                {memberTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </FieldSelect>
            </div>
            <div className="space-y-1">
              <Label>Хөгжлийн хөтөлбөр</Label>
              <FieldSelect value={form.developmentActivityId} onChange={(developmentActivityId) => setForm({ ...form, developmentActivityId })}>
                <option value="">Сонгох</option>
                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>{activity.name}</option>
                ))}
              </FieldSelect>
            </div>
            {selectedType?.requiresParent && (
              <div className="space-y-3 rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Junior гишүүнд эцэг/эх шаардлагатай</p>
                <div className="space-y-1">
                  <Label>Эцэг/эх гишүүн</Label>
                  <FieldSelect value={form.parentId} onChange={(parentId) => setForm({ ...form, parentId })}>
                    <option value="">Бүртгэлгүй / нэрээр</option>
                    {members.filter((m) => m.id !== editing).map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.memberCode})</option>
                    ))}
                  </FieldSelect>
                </div>
                <div className="space-y-1"><Label>Эцэг/эх нэр</Label><Input value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} /></div>
                <div className="space-y-1"><Label>Эцэг/эх утас</Label><Input value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} /></div>
                <div className="space-y-1"><Label>Эцэг/эх имэйл</Label><Input value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })} /></div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Түвшин</Label><Input type="number" value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Ранк</Label><Input type="number" value={form.rank} onChange={(e) => setForm({ ...form, rank: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1"><Label>Эхлэх</Label><Input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} /></div>
              <div className="space-y-1"><Label>Дуусах</Label><Input type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} /></div>
            </div>
            <div className="flex gap-2">
              {(editing ? can("members.update") : can("members.create")) && (
                <Button onClick={save}>{editing ? "Шинэчлэх" : "Үүсгэх"}</Button>
              )}
              {editing && <Button variant="outline" onClick={() => { setEditing(null); setForm(empty); }}>Болих</Button>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Жагсаалт</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Төрөл</TableHead>
                  <TableHead>Хөтөлбөр</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div>{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.memberCode}</div>
                    </TableCell>
                    <TableCell>{m.memberType?.name || "—"}</TableCell>
                    <TableCell>{m.developmentActivity?.name || "—"}</TableCell>
                    <TableCell>{tugrik(m.walletBalance)}</TableCell>
                    <TableCell><Badge variant={m.status === "active" ? "default" : "secondary"}>{m.status}</Badge></TableCell>
                    <TableCell>
                      <ActionCell>
                        <IconActionButton
                          action="edit"
                          onClick={() => {
                            setEditing(m.id);
                            setForm({
                              ...empty,
                              name: m.name,
                              memberCode: m.memberCode,
                              phone: m.phone || "",
                              level: m.level,
                              rank: m.rank,
                              walletBalance: m.walletBalance,
                              validFrom: dateValue(m.validFrom),
                              validTo: dateValue(m.validTo),
                              status: m.status,
                              memberTypeId: m.memberTypeId || "",
                              developmentActivityId: m.developmentActivityId || "",
                              parentId: m.parentId || "",
                              parentName: m.parentName || "",
                              parentPhone: m.parentPhone || "",
                              parentEmail: m.parentEmail || "",
                              avatarUrl: m.avatarUrl || "",
                            });
                          }}
                        />
                        {can("members.topup") && (
                          <IconActionButton
                            action="topup"
                            onClick={async () => {
                              const amount = Number(prompt("Цэнэглэх дүн", String(topup.amount)) || 0);
                              if (!amount) return;
                              setTopup({ id: m.id, amount });
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
