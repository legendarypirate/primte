"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/shell";
import { api, tugrik } from "@/lib/api";

type Dashboard = {
  stats: {
    members: number;
    products: number;
    competitions: number;
    orders: number;
    attendanceToday: number;
    walletSum: number;
  };
  recentMembers: { id: string; name: string; memberCode: string; walletBalance: number }[];
  recentOrders: { id: string; total: number; status: string; Member?: { name: string } }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    api<Dashboard>("/api/admin/dashboard").then(setData).catch(() => setData(null));
  }, []);

  const stats = [
    ["Гишүүд", data?.stats.members ?? "—"],
    ["Бүтээгдэхүүн", data?.stats.products ?? "—"],
    ["Тэмцээн", data?.stats.competitions ?? "—"],
    ["Захиалга", data?.stats.orders ?? "—"],
    ["Өнөөдрийн ирц", data?.stats.attendanceToday ?? "—"],
    ["Wallet нийт", tugrik(data?.stats.walletSum ?? 0)],
  ];

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Хянах самбар</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{value}</CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Сүүлийн гишүүд</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {(data?.recentMembers || []).map((m) => (
              <div key={m.id} className="flex justify-between">
                <span>{m.name}</span>
                <span className="text-muted-foreground">{m.memberCode}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Сүүлийн захиалга</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {(data?.recentOrders || []).map((o) => (
              <div key={o.id} className="flex justify-between">
                <span>{o.Member?.name || "Гишүүн"}</span>
                <span>{tugrik(o.total)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
