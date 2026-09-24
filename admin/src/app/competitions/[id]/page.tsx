"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/file-upload";
import { api, tugrik } from "@/lib/api";
import { ActionCell, IconActionButton } from "@/components/icon-action-button";

type Division = { id: string; abbreviation: string; name: string };
type MatchType = { id: string; name: string };
type SquadRow = { label: string; dayLabel: string; date: string; timeStart: string; timeEnd: string; finalDayStart: string; finalDayEnd: string };
type ScheduleRow = { day: string; stages: string; date: string; squads: string };

type CompetitionForm = {
  title: string;
  subtitle: string;
  eventDate: string;
  eventEndDate: string;
  registrationOpenAt: string;
  registrationCloseAt: string;
  location: string;
  organizer: string;
  capacity: number;
  fee: number;
  level: string;
  stageCount: number;
  minShots: number;
  status: string;
  about: string;
  prizes: string;
  rules: string;
  extraInfo: string;
  mdName: string;
  mdPhone: string;
  mdEmail: string;
  squadCapacity: number;
  squadsPerShift: number;
  lateRegistrationNote: string;
  imageUrl: string;
  matchTypeId: string;
  divisionIds: string[];
  categories: string[];
  requirements: string[];
  refundPolicy: string[];
  squads: SquadRow[];
  schedule: ScheduleRow[];
};

type Registration = {
  id: string;
  status: string;
  category?: string;
  squadLabel?: string;
  paymentReference?: string;
  feePaid?: number;
  createdAt?: string;
  member?: { id: string; name: string; memberCode: string; phone?: string };
  division?: { abbreviation: string; name: string };
};

const defaultSquad = (): SquadRow => ({
  label: "", dayLabel: "", date: "", timeStart: "", timeEnd: "", finalDayStart: "", finalDayEnd: "",
});
const defaultSchedule = (): ScheduleRow => ({ day: "", stages: "", date: "", squads: "" });

const emptyForm: CompetitionForm = {
  title: "", subtitle: "", eventDate: "", eventEndDate: "", registrationOpenAt: "", registrationCloseAt: "",
  location: "", organizer: "", capacity: 50, fee: 0, level: "", stageCount: 0, minShots: 0, status: "upcoming",
  about: "", prizes: "", rules: "", extraInfo: "", mdName: "", mdPhone: "", mdEmail: "",
  squadCapacity: 8, squadsPerShift: 3, lateRegistrationNote: "", imageUrl: "", matchTypeId: "",
  divisionIds: [], categories: ["Overall", "Lady", "Junior", "Senior"], requirements: [], refundPolicy: [],
  squads: [], schedule: [],
};

function toLocalInput(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toDateInput(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    confirmed: "bg-green-600",
    paid: "bg-green-600",
    waitlist: "bg-amber-600",
    pending: "bg-amber-600",
    cancelled: "bg-muted text-muted-foreground",
  };
  return <Badge className={map[status] || "bg-secondary"}>{status}</Badge>;
}

export default function CompetitionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [form, setForm] = useState<CompetitionForm>(emptyForm);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [matchTypes, setMatchTypes] = useState<MatchType[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [joined, setJoined] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [compRes, lookupRes, regRes] = await Promise.all([
      api<{ competition: CompetitionForm & { joined?: number } }>(`/api/admin/competitions/${id}`),
      api<{ divisions: Division[]; matchTypes: MatchType[] }>("/api/admin/lookups"),
      api<{ registrations: Registration[] }>(`/api/admin/competitions/${id}/registrations`),
    ]);
    const c = compRes.competition;
    setForm({
      title: c.title || "",
      subtitle: c.subtitle || "",
      eventDate: toDateInput(c.eventDate as string),
      eventEndDate: toDateInput(c.eventEndDate as string),
      registrationOpenAt: toLocalInput(c.registrationOpenAt as string),
      registrationCloseAt: toLocalInput(c.registrationCloseAt as string),
      location: c.location || "",
      organizer: c.organizer || "",
      capacity: c.capacity ?? 50,
      fee: c.fee ?? 0,
      level: c.level || "",
      stageCount: c.stageCount ?? 0,
      minShots: c.minShots ?? 0,
      status: c.status || "upcoming",
      about: c.about || "",
      prizes: c.prizes || "",
      rules: c.rules || "",
      extraInfo: c.extraInfo || "",
      mdName: c.mdName || "",
      mdPhone: c.mdPhone || "",
      mdEmail: c.mdEmail || "",
      squadCapacity: c.squadCapacity ?? 8,
      squadsPerShift: c.squadsPerShift ?? 3,
      lateRegistrationNote: c.lateRegistrationNote || "",
      imageUrl: c.imageUrl || "",
      matchTypeId: c.matchTypeId || "",
      divisionIds: c.divisionIds || [],
      categories: c.categories?.length ? c.categories : emptyForm.categories,
      requirements: c.requirements || [],
      refundPolicy: c.refundPolicy || [],
      squads: (c.squads as SquadRow[])?.length ? (c.squads as SquadRow[]) : [],
      schedule: (c.schedule as ScheduleRow[])?.length ? (c.schedule as ScheduleRow[]) : [],
    });
    setJoined(c.joined ?? 0);
    setDivisions(lookupRes.divisions);
    setMatchTypes(lookupRes.matchTypes);
    setRegistrations(regRes.registrations);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load().catch((e) => toast.error(e.message));
  }, [load]);

  async function save() {
    try {
      const payload = {
        ...form,
        eventDate: form.eventDate || null,
        eventEndDate: form.eventEndDate || null,
        registrationOpenAt: form.registrationOpenAt || null,
        registrationCloseAt: form.registrationCloseAt || null,
        matchTypeId: form.matchTypeId || null,
      };
      await api(`/api/admin/competitions/${id}`, { method: "PUT", body: JSON.stringify(payload) });
      toast.success("Хадгаллаа");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  async function updateRegistrationStatus(regId: string, status: string) {
    try {
      await api(`/api/admin/competitions/${id}/registrations/${regId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      toast.success("Шинэчлэгдлээ");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  async function deleteRegistration(regId: string, memberName?: string) {
    const label = memberName ? `"${memberName}"` : "Энэ оролцогчийг";
    if (!confirm(`${label} бүртгэлээс бүрмөсөн устгах уу? Гишүүн дахин бүртгүүлэх боломжтой болно.`)) return;
    try {
      await api(`/api/admin/competitions/${id}/registrations/${regId}`, { method: "DELETE" });
      toast.success("Устгалаа");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    }
  }

  function toggleDivision(divisionId: string) {
    setForm((f) => ({
      ...f,
      divisionIds: f.divisionIds.includes(divisionId)
        ? f.divisionIds.filter((d) => d !== divisionId)
        : [...f.divisionIds, divisionId],
    }));
  }

  function listField(key: "categories" | "requirements" | "refundPolicy", value: string) {
    setForm((f) => ({
      ...f,
      [key]: value.split("\n").map((s) => s.trim()).filter(Boolean),
    }));
  }

  if (loading) {
    return (
      <Shell>
        <div className="text-muted-foreground">Уншиж байна...</div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <Link href="/competitions" className="text-sm text-muted-foreground hover:text-primary">← Тэмцээний жагсаалт</Link>
          <h1 className="font-heading text-3xl text-primary">{form.title || "Тэмцээн"}</h1>
          <p className="text-base text-muted-foreground">{joined}/{form.capacity} оролцогч · {tugrik(form.fee)}</p>
        </div>
        <Button className="h-10 px-5" onClick={save}>Хадгалах</Button>
      </div>

      <Tabs defaultValue="basic" className="gap-4">
        <TabsList
          variant="line"
          className="mb-6 h-auto w-full flex-wrap items-center justify-start gap-2 border-b border-border pb-3"
        >
          <TabsTrigger value="basic" className="h-10 flex-none px-4 text-sm sm:text-base">Үндсэн</TabsTrigger>
          <TabsTrigger value="divisions" className="h-10 flex-none px-4 text-sm sm:text-base">Ангилал</TabsTrigger>
          <TabsTrigger value="squads" className="h-10 flex-none px-4 text-sm sm:text-base">Скуад & хуваарь</TabsTrigger>
          <TabsTrigger value="content" className="h-10 flex-none px-4 text-sm sm:text-base">Агуулга</TabsTrigger>
          <TabsTrigger value="competitors" className="h-10 flex-none px-4 text-sm sm:text-base">
            Оролцогчид ({registrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-2">
          <Card>
            <CardContent className="grid gap-5 pt-6 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2"><Label>Нэр</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="space-y-1"><Label>Дэд гарчиг (IPSC Action Air)</Label><Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
              <div className="space-y-1">
                <Label>Match type</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" value={form.matchTypeId} onChange={(e) => setForm({ ...form, matchTypeId: e.target.value })}>
                  <option value="">—</option>
                  {matchTypes.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="space-y-1"><Label>Тэмцээн эхлэх</Label><Input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></div>
              <div className="space-y-1"><Label>Тэмцээн дуусах</Label><Input type="date" value={form.eventEndDate} onChange={(e) => setForm({ ...form, eventEndDate: e.target.value })} /></div>
              <div className="space-y-1"><Label>Бүртгэл нээгдэх</Label><Input type="datetime-local" value={form.registrationOpenAt} onChange={(e) => setForm({ ...form, registrationOpenAt: e.target.value })} /></div>
              <div className="space-y-1"><Label>Бүртгэл хаагдах</Label><Input type="datetime-local" value={form.registrationCloseAt} onChange={(e) => setForm({ ...form, registrationCloseAt: e.target.value })} /></div>
              <div className="space-y-1"><Label>Байршил</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
              <div className="space-y-1"><Label>Зохион байгуулагч</Label><Input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} /></div>
              <div className="space-y-1"><Label>Түвшин</Label><Input value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Level 2" /></div>
              <div className="space-y-1"><Label>Төлөв</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="upcoming">upcoming</option>
                  <option value="open">open</option>
                  <option value="past">past</option>
                </select>
              </div>
              <div className="space-y-1"><Label>Хүчин чадал</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Хураамж</Label><Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Стэйж</Label><Input type="number" value={form.stageCount} onChange={(e) => setForm({ ...form, stageCount: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Мин. буудалт</Label><Input type="number" value={form.minShots} onChange={(e) => setForm({ ...form, minShots: Number(e.target.value) })} /></div>
              <div className="space-y-1 md:col-span-2">
                <FileUpload label="Зураг" folder="prime/competitions" value={form.imageUrl} onChange={(imageUrl) => setForm({ ...form, imageUrl })} />
              </div>
              <div className="space-y-1"><Label>MD нэр</Label><Input value={form.mdName} onChange={(e) => setForm({ ...form, mdName: e.target.value })} /></div>
              <div className="space-y-1"><Label>MD утас</Label><Input value={form.mdPhone} onChange={(e) => setForm({ ...form, mdPhone: e.target.value })} /></div>
              <div className="space-y-1 md:col-span-2"><Label>MD имэйл</Label><Input value={form.mdEmail} onChange={(e) => setForm({ ...form, mdEmail: e.target.value })} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="divisions" className="mt-2">
          <Card>
            <CardHeader><CardTitle>Division сонгох</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {divisions.map((d) => (
                  <Button
                    key={d.id}
                    type="button"
                    size="sm"
                    variant={form.divisionIds.includes(d.id) ? "default" : "outline"}
                    onClick={() => toggleDivision(d.id)}
                  >
                    {d.abbreviation} — {d.name}
                  </Button>
                ))}
                {!divisions.length && <p className="text-sm text-muted-foreground"><Link href="/divisions" className="text-primary underline">Division</Link> нэмнэ үү.</p>}
              </div>
              <div className="space-y-1">
                <Label>Категори (мөр бүрт нэг)</Label>
                <Textarea rows={5} value={form.categories.join("\n")} onChange={(e) => listField("categories", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="squads" className="mt-2">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Скуад</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setForm({ ...form, squads: [...form.squads, defaultSquad()] })}>+ Нэмэх</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.squads.map((sq, i) => (
                  <div key={i} className="grid gap-2 rounded-lg border p-3 md:grid-cols-2">
                    <Input placeholder="SQ1" value={sq.label} onChange={(e) => { const squads = [...form.squads]; squads[i] = { ...sq, label: e.target.value }; setForm({ ...form, squads }); }} />
                    <Input placeholder="Day 1" value={sq.dayLabel} onChange={(e) => { const squads = [...form.squads]; squads[i] = { ...sq, dayLabel: e.target.value }; setForm({ ...form, squads }); }} />
                    <Input type="date" value={sq.date} onChange={(e) => { const squads = [...form.squads]; squads[i] = { ...sq, date: e.target.value }; setForm({ ...form, squads }); }} />
                    <Input placeholder="18:00" value={sq.timeStart} onChange={(e) => { const squads = [...form.squads]; squads[i] = { ...sq, timeStart: e.target.value }; setForm({ ...form, squads }); }} />
                    <Input placeholder="22:00" value={sq.timeEnd} onChange={(e) => { const squads = [...form.squads]; squads[i] = { ...sq, timeEnd: e.target.value }; setForm({ ...form, squads }); }} />
                    <IconActionButton action="delete" onClick={() => setForm({ ...form, squads: form.squads.filter((_, j) => j !== i) })} />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1"><Label>Нэг скуад</Label><Input type="number" value={form.squadCapacity} onChange={(e) => setForm({ ...form, squadCapacity: Number(e.target.value) })} /></div>
                  <div className="space-y-1"><Label>Нэг ээлжинд</Label><Input type="number" value={form.squadsPerShift} onChange={(e) => setForm({ ...form, squadsPerShift: Number(e.target.value) })} /></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Хуваарь</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setForm({ ...form, schedule: [...form.schedule, defaultSchedule()] })}>+ Нэмэх</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {form.schedule.map((row, i) => (
                  <div key={i} className="grid gap-2 rounded-lg border p-3 md:grid-cols-2">
                    <Input placeholder="Day 1" value={row.day} onChange={(e) => { const schedule = [...form.schedule]; schedule[i] = { ...row, day: e.target.value }; setForm({ ...form, schedule }); }} />
                    <Input placeholder="Stage 1-6" value={row.stages} onChange={(e) => { const schedule = [...form.schedule]; schedule[i] = { ...row, stages: e.target.value }; setForm({ ...form, schedule }); }} />
                    <Input type="date" value={row.date} onChange={(e) => { const schedule = [...form.schedule]; schedule[i] = { ...row, date: e.target.value }; setForm({ ...form, schedule }); }} />
                    <Input placeholder="SQ1-3" value={row.squads} onChange={(e) => { const schedule = [...form.schedule]; schedule[i] = { ...row, squads: e.target.value }; setForm({ ...form, schedule }); }} />
                    <IconActionButton action="delete" onClick={() => setForm({ ...form, schedule: form.schedule.filter((_, j) => j !== i) })} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-2">
          <Card>
            <CardContent className="grid gap-4 pt-6">
              <div className="space-y-1"><Label>Тэмцээний тухай</Label><Textarea rows={4} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} /></div>
              <div className="space-y-1"><Label>Шагналт байрууд</Label><Textarea rows={4} value={form.prizes} onChange={(e) => setForm({ ...form, prizes: e.target.value })} /></div>
              <div className="space-y-1"><Label>Дүрэм</Label><Textarea rows={4} value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} /></div>
              <div className="space-y-1"><Label>Анхаарах шаардлага (мөр бүрт нэг)</Label><Textarea rows={4} value={form.requirements.join("\n")} onChange={(e) => listField("requirements", e.target.value)} /></div>
              <div className="space-y-1"><Label>Буцаалтын нөхцөл (мөр бүрт нэг)</Label><Textarea rows={3} value={form.refundPolicy.join("\n")} onChange={(e) => listField("refundPolicy", e.target.value)} /></div>
              <div className="space-y-1"><Label>Нэмэлт мэдээлэл</Label><Textarea rows={3} value={form.extraInfo} onChange={(e) => setForm({ ...form, extraInfo: e.target.value })} /></div>
              <div className="space-y-1"><Label>Хоцорсон бүртгэлийн тайлбар</Label><Textarea rows={3} value={form.lateRegistrationNote} onChange={(e) => setForm({ ...form, lateRegistrationNote: e.target.value })} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="mt-2">
          <Card>
            <CardHeader><CardTitle>Оролцогчдын жагсаалт</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Гишүүн</TableHead>
                    <TableHead>Ангилал</TableHead>
                    <TableHead>Категори</TableHead>
                    <TableHead>Скуад</TableHead>
                    <TableHead>Төлөв</TableHead>
                    <TableHead>Төлбөр</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        <div className="font-medium">{r.member?.name}</div>
                        <div className="text-xs text-muted-foreground">{r.member?.memberCode}</div>
                      </TableCell>
                      <TableCell>{r.division ? `${r.division.abbreviation} (${r.division.name})` : "—"}</TableCell>
                      <TableCell>{r.category || "—"}</TableCell>
                      <TableCell>{r.squadLabel || "—"}</TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                      <TableCell>{r.feePaid ? tugrik(r.feePaid) : "—"}</TableCell>
                      <TableCell>
                        <ActionCell>
                          {r.status === "waitlist" && (
                            <IconActionButton action="approve" onClick={() => updateRegistrationStatus(r.id, "confirmed")} />
                          )}
                          {r.status !== "cancelled" && (
                            <IconActionButton action="cancel" onClick={() => updateRegistrationStatus(r.id, "cancelled")} />
                          )}
                          <IconActionButton
                            action="delete"
                            onClick={() => deleteRegistration(r.id, r.member?.name)}
                          />
                        </ActionCell>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!registrations.length && (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Оролцогч байхгүй</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Shell>
  );
}
