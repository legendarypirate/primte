"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { IconActionButton } from "@/components/icon-action-button";
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

type ClubDate = {
  date: string;
  open: boolean;
  start: string;
  end: string;
};

type ClubSettings = {
  open: boolean;
  todayCount: number;
  capacity: number;
  hours?: ClubHour[];
  weeklyHours?: ClubHour[];
  dates?: ClubDate[];
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

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isoWeekday(dateKey: string) {
  const day = new Date(`${dateKey}T12:00:00`).getDay();
  return day === 0 ? 7 : day;
}

function formatDateLabel(dateKey: string) {
  return dateKey.replaceAll("-", ".");
}

function weekdayLabel(dateKey: string) {
  return WEEKDAYS.find((day) => day.weekday === isoWeekday(dateKey))?.label || "";
}

function draftForDate(dateKey: string, weekly: ClubHour[], dates: ClubDate[]): ClubDate {
  const found = dates.find((row) => row.date === dateKey);
  if (found) return { ...found };
  const weeklyDay = weekly.find((row) => row.weekday === isoWeekday(dateKey)) || WEEKDAYS[0];
  return { date: dateKey, open: weeklyDay.open, start: weeklyDay.start, end: weeklyDay.end };
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
  const [dates, setDates] = useState<ClubDate[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [dateDraft, setDateDraft] = useState<ClubDate>(() => draftForDate(todayKey(), WEEKDAYS, []));
  const [history, setHistory] = useState<ClubHistory[]>([]);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  function applyClub(club: ClubSettings) {
    const weekly = normalizeHours(club.weeklyHours || club.hours);
    const nextDates = (club.dates || []).filter((row) => row.date);
    setOpen(club.open);
    setTodayCount(club.todayCount ?? 0);
    setCapacity(club.capacity ?? 40);
    setHours(weekly);
    setDates(nextDates);
    setHistory(club.history || []);
    setDateDraft(draftForDate(selectedDate, weekly, nextDates));
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

  function selectDate(dateKey: string) {
    setSelectedDate(dateKey);
    setDateDraft(draftForDate(dateKey, hours, dates));
  }

  async function persistDates(nextDates: ClubDate[], message: string) {
    setDates(nextDates);
    setSaving(true);
    try {
      await saveClub({ open, todayCount, capacity, hours, dates: nextDates });
      toast.success(message);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Алдаа");
    } finally {
      setSaving(false);
    }
  }

  function upsertSelectedDate() {
    if (!selectedDate) return;
    const next = { ...dateDraft, date: selectedDate };
    const nextDates = [...dates.filter((row) => row.date !== selectedDate), next].sort((a, b) => a.date.localeCompare(b.date));
    void persistDates(nextDates, `${formatDateLabel(selectedDate)} өдрийн цагийг хадгаллаа`);
  }

  function removeDate(dateKey: string) {
    const nextDates = dates.filter((row) => row.date !== dateKey);
    if (selectedDate === dateKey) setDateDraft(draftForDate(dateKey, hours, []));
    void persistDates(nextDates, `${formatDateLabel(dateKey)} өдрийн тохиргоог устгалаа`);
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
      await saveClub({ open: nextOpen, todayCount, capacity, hours, dates });
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
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
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
              <Toggle checked={open} disabled={toggling} onClick={toggleOpen} />
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

            <div className="space-y-2 pt-2">
              <Label>7 хоногийн үндсэн хуваарь</Label>
              <p className="text-xs text-muted-foreground">
                Даваа–Нямын default цаг. Тусгай өдрийг доорх date picker-оор дарж өөрчилнө.
              </p>
              <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {hours.map((day) => (
                  <div key={day.weekday} className="grid gap-2 px-3 py-3 sm:grid-cols-[6.5rem_auto_1fr] sm:items-center">
                    <div className="font-medium">{day.label}</div>
                    <div className="flex items-center gap-2">
                      <Toggle checked={day.open} onClick={() => patchHour(day.weekday, { open: !day.open })} />
                      <span className="text-xs text-muted-foreground">{day.open ? "Нээлттэй" : "Хаалттай"}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Input
                        type="time"
                        className="w-full min-w-28"
                        value={day.start}
                        disabled={!day.open}
                        onChange={(e) => patchHour(day.weekday, { start: e.target.value })}
                      />
                      <span className="text-muted-foreground">–</span>
                      <Input
                        type="time"
                        className="w-full min-w-28"
                        value={day.end}
                        disabled={!day.open}
                        onChange={(e) => patchHour(day.weekday, { end: e.target.value })}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Өдөр өдрийн цаг</Label>
              <p className="text-xs text-muted-foreground">
                Огноо сонгоод тухайн өдрийн нээлттэй цагийг тохируулна. Сонгоогүй өдөр дээрх 7 хоногийн хуваарийг ашиглана.
              </p>
              <div className="space-y-3 rounded-lg border border-border p-3">
                <div className="space-y-1">
                  <Label>Огноо</Label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      if (e.target.value) selectDate(e.target.value);
                    }}
                  />
                </div>
                {selectedDate ? (
                  <>
                    <div className="text-sm font-medium">
                      {weekdayLabel(selectedDate)} · {formatDateLabel(selectedDate)}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Toggle
                        checked={dateDraft.open}
                        onClick={() => setDateDraft((prev) => ({ ...prev, open: !prev.open }))}
                      />
                      <span className="text-xs text-muted-foreground">{dateDraft.open ? "Нээлттэй" : "Хаалттай"}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <Input
                        type="time"
                        className="w-full min-w-28"
                        value={dateDraft.start}
                        disabled={!dateDraft.open}
                        onChange={(e) => setDateDraft((prev) => ({ ...prev, start: e.target.value }))}
                      />
                      <span className="text-muted-foreground">–</span>
                      <Input
                        type="time"
                        className="w-full min-w-28"
                        value={dateDraft.end}
                        disabled={!dateDraft.open}
                        onChange={(e) => setDateDraft((prev) => ({ ...prev, end: e.target.value }))}
                      />
                    </div>
                    <Button type="button" variant="outline" disabled={saving} onClick={upsertSelectedDate}>
                      {saving ? "Хадгалж байна..." : "Энэ өдрийг хадгалах"}
                    </Button>
                  </>
                ) : null}
              </div>
              {dates.length > 0 ? (
                <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                  {dates.map((row) => (
                    <div key={row.date} className="flex items-center gap-3 px-3 py-2">
                      <button type="button" className="min-w-0 flex-1 text-left" onClick={() => selectDate(row.date)}>
                        <div className="font-medium">
                          {weekdayLabel(row.date)} · {formatDateLabel(row.date)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {row.open ? `${row.start} – ${row.end}` : "Хаалттай"}
                        </div>
                      </button>
                      <IconActionButton action="delete" onClick={() => removeDate(row.date)} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Тусгай өдөр тохируулаагүй байна.</p>
              )}
            </div>

            <Button
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                try {
                  await saveClub({ open, todayCount, capacity, hours, dates });
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
              <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto pr-1">
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
      </div>
    </Shell>
  );
}

function Toggle({
  checked,
  onClick,
  disabled,
}: {
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-primary" : "bg-muted-foreground/30"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white transition-transform",
          checked ? "left-5" : "left-0.5"
        )}
      />
    </button>
  );
}
