"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api, tugrik } from "@/lib/api";

type Tx = { id: string; title: string; amount: number; kind: string; createdAt: string; Member?: { name: string } };

export default function TransactionsPage() {
  const [items, setItems] = useState<Tx[]>([]);
  useEffect(() => {
    api<{ transactions: Tx[] }>("/api/admin/transactions").then((d) => setItems(d.transactions)).catch((e) => toast.error(e.message));
  }, []);

  return (
    <Shell>
      <h1 className="mb-6 font-heading text-3xl text-primary">Гүйлгээ</h1>
      <Card>
        <CardHeader><CardTitle>Wallet түүх</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Гишүүн</TableHead><TableHead>Гүйлгээ</TableHead><TableHead>Дүн</TableHead><TableHead>Төрөл</TableHead></TableRow></TableHeader>
            <TableBody>
              {items.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.Member?.name}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell className={t.amount > 0 ? "text-emerald-400" : ""}>{tugrik(t.amount)}</TableCell>
                  <TableCell>{t.kind}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Shell>
  );
}
