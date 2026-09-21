"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [open, setOpen] = useState(true);
  const [todayCount, setTodayCount] = useState(0);
  const [capacity, setCapacity] = useState(40);

  useEffect(() => {
    api<{ settings: { club?: { open: boolean; todayCount: number; capacity: number } } }>("/api/admin/settings")
      .then((d) => {
        const club = d.settings.club || { open: true, todayCount: 0, capacity: 40 };
        setOpen(club.open);
        setTodayCount(club.todayCount);
        setCapacity(club.capacity);
      })
      .catch((e) => toast.error(e.message));
  }, []);

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Тохиргоо</h1>
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Клубын төлөв</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={open} onChange={(e) => setOpen(e.target.checked)} />
            Нээлттэй
          </label>
          <div className="space-y-1"><Label>Өнөөдрийн тоо</Label><Input type="number" value={todayCount} onChange={(e) => setTodayCount(Number(e.target.value))} /></div>
          <div className="space-y-1"><Label>Хүчин чадал</Label><Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} /></div>
          <Button onClick={async () => {
            await api("/api/admin/settings", { method: "PUT", body: JSON.stringify({ club: { open, todayCount, capacity } }) });
            toast.success("Хадгаллаа");
          }}>Хадгалах</Button>
        </CardContent>
      </Card>
    </Shell>
  );
}
