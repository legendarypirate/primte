"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type ClubHistory = {
  id: string;
  open: boolean;
  adminId?: string;
  adminName?: string;
  at: string;
};

type ClubHour = {
  weekday: number;
  label?: string;
  open: boolean;
  start: string;
  end: string;
};

type ClubSettings = {
  open: boolean;
  todayCount: number;
  capacity: number;
  hours?: ClubHour[];
  history?: ClubHistory[];
};

const WEEKDAYS: ClubHour[] = [
  { weekday: 1, label: "Даваа", open: true, start: "10:00", end: "22:00" },
  { weekday: 2, label: "Мягмар", open: true, start: "10:00", end: "22:00" },
  { weekday: 3, label: "Лхагва", open: true, start: "10:00", end: "22:00" },
  { weekday: 4, label: "Пүрэв", open: true, start: "10:00", end: "22:00" },
  { weekday: 5, label: "Баасан", open: true, start: "10:00", end: "22:00" },
  { weekday: 6, label: "Бямба", open: true, start: "10:00", end: "22:00" },
  { weekday: 7, label: "Ням", open: true, start: "10:00", end: "22:00" },
];

function normalizeHours(hours?: ClubHour[]) {
  return WEEKDAYS.map((day) => {
    const found = hours?.find((row) => row.weekday === day.weekday);
    return {
      ...day,
      open: found ? found.open !== false : day.open,
      start: found?.start || day.start,
      end: found?.end || day.end,
    };
  });
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function SettingsPage() {
  const [open, setOpen] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [capacity, setCapacity] = useState(40);
  const [hours, setHours] = useState<ClubHour[]>(WEEKDAYS);
  const [history, setHistory] = useState<ClubHistory[]>([]);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  function applyClub(club: ClubSettings) {
    setOpen(club.open);
    setTodayCount(club.todayCount ?? 0);
    setCapacity(club.capacity ?? 40);
    setHours(normalizeHours(club.hours));
    setHistory(club.history || []);
  }

  async function load() {
    const data = await api<{ settings: { club?: ClubSettings } }>("/api/admin/settings");
    applyClub(data.settings.club || { open: true, todayCount: 0, capacity: 40, hours: WEEKDAYS, history: [] });
  }

  useEffect(() => {
    load().catch((e) => toast.error(e instanceof Error ? e.message : "Алдаа"));
  }, []);

  function patchHour(weekday: number, patch: Partial<ClubHour>) {
    setHours((prev) => prev.map((row) => (row.weekday === weekday ? { ...row, ...patch } : row)));
  }

  async function saveClub(next: Partial<ClubSettings> & { open: boolean; todayCount: number; capacity: number }) {
    const data = await api<{ settings: { club?: ClubSettings } }>("/api/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ club: next }),
    });
    applyClub(data.settings.club || next);
  }

  async function toggleOpen() {
    if (toggling) return;
    const nextOpen = !open;
    setOpen(nextOpen);
    setToggling(true);
    try {
      await saveClub({ open: nextOpen, todayCount, capacity, hours });
      toast.success(nextOpen ? "Клуб нээлээ. Гишүүдэд мэдэгдэл илгээлээ." : "Клуб хаалаа. Гишүүдэд мэдэгдэл илгээлээ.");
    } catch (e) {
      setOpen(!nextOpen);
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setToggling(false);
    }
  }

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Тохиргоо</h1>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Клубын төлөв</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border px-3 py-3">
              <div>
                <div className="text-sm font-medium">{open ? "Нээлттэй" : "Хаалттай"}</div>
                <div className="text-xs text-muted-foreground">
                  {open ? "Гишүүд клубт нэвтрэх боломжтой" : "Клуб хаагдсан байна"}
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={open}
                disabled={toggling}
                onClick={toggleOpen}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors disabled:opacity-50",
                  open ? "bg-primary" : "bg-muted-foreground/30"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                    open ? "left-5" : "left-0.5"
                  )}
                />
              </button>
            </div>
            <div className="space-y-1">
              <Label>Өнөөдрийн ирц</Label>
              <div className="rounded-lg border border-border px-3 py-2 text-sm">
                {todayCount}/{capacity} <span className="text-muted-foreground">· QR уншуулалтаар автоматаар нэмэгдэнэ</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Хүчин чадал</Label>
              <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value === "" ? 0 : Number(e.target.value))} />
            </div>
            <Button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await saveClub({ open, todayCount, capacity, hours });
                  toast.success("Хадгаллаа");
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Алдаа");
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Нээх / хаах түүх</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Одоогоор түүх байхгүй.</p>
            ) : (
              <ul className="divide-y divide-border">
                {history.map((row) => (
                  <li key={row.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div>
                      <div className="font-medium">{row.adminName || "Админ"}</div>
                      <div className="text-xs text-muted-foreground">{formatWhen(row.at)}</div>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        row.open ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {row.open ? "Нээсэн" : "Хаалсан"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>7 хоногийн цагийн хуваарь</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="mb-3 text-sm text-muted-foreground">
              Гишүүдийн апп дээрх клубын төлөв дээр энэ хуваарь харагдана. Өдөр бүрийн нээлттэй цагийг тохируулна.
            </p>
            <div className="divide-y divide-border rounded-lg border border-border">
              {hours.map((day) => (
                <div key={day.weekday} className="flex flex-wrap items-center gap-3 px-3 py-3">
                  <div className="w-24 font-medium">{day.label}</div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={day.open}
                    onClick={() => patchHour(day.weekday, { open: !day.open })}
                    className={cn(
                      "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                      day.open ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
                        day.open ? "left-5" : "left-0.5"
                      )}
                    />
                  </button>
                  <span className="w-20 text-xs text-muted-foreground">{day.open ? "Нээлттэй" : "Хаалттай"}</span>
                  <Input
                    type="time"
                    className="w-32"
                    value={day.start}
                    disabled={!day.open}
                    onChange={(e) => patchHour(day.weekday, { start: e.target.value })}
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="time"
                    className="w-32"
                    value={day.end}
                    disabled={!day.open}
                    onChange={(e) => patchHour(day.weekday, { end: e.target.value })}
                  />
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Button
                disabled={saving}
                onClick={async () => {
                  setSaving(true);
                  try {
                    await saveClub({ open, todayCount, capacity, hours });
                    toast.success("Цагийн хуваарь хадгаллаа");
                  } catch (e) {
                    toast.error(e instanceof Error ? e.message : "Алдаа");
                  } finally {
                    setSaving(false);
                  }
                }}
              >
                {saving ? "Хадгалж байна..." : "Хуваарь хадгалах"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
