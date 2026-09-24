"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Trophy,
  GraduationCap,
  Bell,
  Receipt,
  Wallet,
  QrCode,
  Settings,
  LogOut,
  Shield,
  Tags,
  Briefcase,
  UserCog,
  HeartHandshake,
  Swords,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { can, saveSession } from "@/lib/auth";

const nav = [
  { href: "/dashboard", label: "Хянах самбар", icon: LayoutDashboard, permission: "dashboard.view" },
  { href: "/members", label: "Гишүүд", icon: Users, permission: "members.view" },
  { href: "/parents", label: "Эцэг эх", icon: HeartHandshake, permission: "members.view" },
  { href: "/products", label: "Дэлгүүр", icon: ShoppingBag, permission: "products.view" },
  { href: "/competitions", label: "Тэмцээн", icon: Trophy, permission: "competitions.view" },
  { href: "/trainings", label: "Сургалт", icon: GraduationCap, permission: "trainings.view" },
  { href: "/orders", label: "Захиалга", icon: Receipt, permission: "orders.view" },
  { href: "/transactions", label: "Гүйлгээ", icon: Wallet, permission: "transactions.view" },
  { href: "/notices", label: "Мэдэгдэл", icon: Bell, permission: "notices.view" },
  { href: "/attendance", label: "Ирц / QR", icon: QrCode, permission: "attendance.view" },
  { href: "/member-types", label: "Гишүүний төрөл", icon: Tags, permission: "member_types.manage" },
  { href: "/activities", label: "Хөгжлийн хөтөлбөр", icon: Briefcase, permission: "activities.manage" },
  { href: "/match-types", label: "Match type", icon: Swords, permission: "match_types.manage" },
  { href: "/divisions", label: "Division", icon: Layers, permission: "divisions.manage" },
  { href: "/rbac", label: "RBAC / Role", icon: Shield, permission: "roles.manage" },
  { href: "/staff", label: "Админ хэрэглэгч", icon: UserCog, permission: "staff.manage" },
  { href: "/settings", label: "Тохиргоо", icon: Settings, permission: "settings.manage" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("Admin");
  const [roleName, setRoleName] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("prime_admin_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    api<{ admin: { name: string; permissions?: string[]; role?: { name: string } | null } }>("/api/auth/admin/me")
      .then((data) => {
        saveSession(data.admin);
        setName(data.admin.name);
        setRoleName(data.admin.role?.name || "");
        setTick((n) => n + 1);
        setReady(true);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Уншиж байна...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-border bg-sidebar px-4 py-6">
        <div className="px-2 pb-4">
          <p className="text-xs tracking-[0.28em] text-primary">PRACTICAL SHOOTING</p>
          <h1 className="font-heading text-2xl font-semibold tracking-[0.2em] text-primary">PRIME</h1>
          <p className="text-xs text-muted-foreground">{roleName || "Admin console"}</p>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto" key={tick}>
          {nav.filter((item) => can(item.permission)).map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          className="mt-2 h-8 justify-start px-3"
          onClick={() => {
            localStorage.removeItem("prime_admin_token");
            localStorage.removeItem("prime_admin_permissions");
            router.replace("/login");
          }}
        >
          <LogOut className="size-4" />
          Гарах
        </Button>
        <p className="mt-3 px-2 text-xs text-muted-foreground">{name}</p>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
