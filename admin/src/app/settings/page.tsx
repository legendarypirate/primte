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

type ClubSettings = {
  open: boolean;
  todayCount: number;
  capacity: number;
  history?: ClubHistory[];
};

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
  const [history, setHistory] = useState<ClubHistory[]>([]);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);

  function applyClub(club: ClubSettings) {
    setOpen(club.open);
    setTodayCount(club.todayCount ?? 0);
    setCapacity(club.capacity ?? 40);
    setHistory(club.history || []);
  }

  async function load() {
    const data = await api<{ settings: { club?: ClubSettings } }>("/api/admin/settings");
    applyClub(data.settings.club || { open: true, todayCount: 0, capacity: 40, history: [] });
  }

  useEffect(() => {
    load().catch((e) => toast.error(e instanceof Error ? e.message : "Алдаа"));
  }, []);

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
      await saveClub({ open: nextOpen, todayCount, capacity });
      toast.success(nextOpen ? "Клуб нээлээ" : "Клуб хаалаа");
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
              <Label>Өнөөдрийн тоо</Label>
              <Input type="number" value={todayCount} onChange={(e) => setTodayCount(e.target.value === "" ? 0 : Number(e.target.value))} />
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
                  await saveClub({ open, todayCount, capacity });
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
      </div>
    </Shell>
  );
}
