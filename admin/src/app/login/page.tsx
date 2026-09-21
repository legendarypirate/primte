"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@prime.mn");
  const [password, setPassword] = useState("PrimeAdmin0328");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api<{ token: string; admin: { name: string; permissions?: string[]; role?: { name: string } | null } }>(
        "/api/auth/admin/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );
      saveSession(data.admin, data.token);
      router.replace("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Нэвтрэх амжилтгүй");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#d4b15f22,transparent_45%),#070707] p-6">
      <form onSubmit={submit} className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-card p-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-primary">PRACTICAL SHOOTING CLUB</p>
          <h1 className="mt-1 font-heading text-3xl tracking-[0.18em] text-primary">PRIME</h1>
          <p className="mt-2 text-sm text-muted-foreground">Админ нэвтрэх</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Имэйл</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Нууц үг</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading} size="lg">
          {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
        </Button>
      </form>
    </div>
  );
}
