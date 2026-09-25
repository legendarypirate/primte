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
  LayoutTemplate,
  FolderTree,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { can, saveSession } from "@/lib/auth";

type NavItem = { href: string; label: string; icon: LucideIcon; permission: string };
type NavGroup = { id: string; label: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    id: "overview",
    label: "Ерөнхий",
    items: [{ href: "/dashboard", label: "Хянах самбар", icon: LayoutDashboard, permission: "dashboard.view" }],
  },
  {
    id: "members",
    label: "Гишүүд",
    items: [
      { href: "/members", label: "Гишүүд", icon: Users, permission: "members.view" },
      { href: "/parents", label: "Эцэг эх", icon: HeartHandshake, permission: "members.view" },
      { href: "/attendance", label: "Ирц / QR", icon: QrCode, permission: "attendance.view" },
      { href: "/member-types", label: "Гишүүний төрөл", icon: Tags, permission: "member_types.manage" },
      { href: "/activities", label: "Хөгжлийн хөтөлбөр", icon: Briefcase, permission: "activities.manage" },
    ],
  },
  {
    id: "events",
    label: "Тэмцээн & сургалт",
    items: [
      { href: "/competitions", label: "Тэмцээн", icon: Trophy, permission: "competitions.view" },
      { href: "/trainings", label: "Сургалт", icon: GraduationCap, permission: "trainings.view" },
      { href: "/match-types", label: "Match type", icon: Swords, permission: "match_types.manage" },
      { href: "/divisions", label: "Division", icon: Layers, permission: "divisions.manage" },
    ],
  },
  {
    id: "store",
    label: "Дэлгүүр & санхүү",
    items: [
      { href: "/products", label: "Бараа", icon: ShoppingBag, permission: "products.view" },
      { href: "/products/categories", label: "Барааны ангилал", icon: FolderTree, permission: "products.view" },
      { href: "/orders", label: "Захиалга", icon: Receipt, permission: "orders.view" },
      { href: "/transactions", label: "Гүйлгээ", icon: Wallet, permission: "transactions.view" },
    ],
  },
  {
    id: "content",
    label: "Контент",
    items: [
      { href: "/notices", label: "Мэдэгдэл", icon: Bell, permission: "notices.view" },
      { href: "/site-editor", label: "Вэб сайт", icon: LayoutTemplate, permission: "site.view" },
    ],
  },
  {
    id: "system",
    label: "Систем",
    items: [
      { href: "/rbac", label: "RBAC / Role", icon: Shield, permission: "roles.manage" },
      { href: "/staff", label: "Админ хэрэглэгч", icon: UserCog, permission: "staff.manage" },
      { href: "/settings", label: "Тохиргоо", icon: Settings, permission: "settings.manage" },
    ],
  },
];

const COLLAPSED_KEY = "prime_admin_sidebar_collapsed";
const CLOSED_GROUPS_KEY = "prime_admin_sidebar_closed_groups";

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("Admin");
  const [roleName, setRoleName] = useState("");
  const [tick, setTick] = useState(0);
  const [collapsed, setCollapsed] = useState(() => readStored(COLLAPSED_KEY, false));
  const [closedGroups, setClosedGroups] = useState<string[]>(() => readStored(CLOSED_GROUPS_KEY, []));

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

  function toggleCollapsed() {
    setCollapsed((prev) => {
      localStorage.setItem(COLLAPSED_KEY, JSON.stringify(!prev));
      return !prev;
    });
  }

  function toggleGroup(id: string) {
    setClosedGroups((prev) => {
      const next = prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id];
      localStorage.setItem(CLOSED_GROUPS_KEY, JSON.stringify(next));
      return next;
    });
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Уншиж байна...</div>;
  }

  const groups = navGroups
    .map((group) => ({ ...group, items: group.items.filter((item) => can(item.permission)) }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 flex h-screen shrink-0 flex-col border-r border-border bg-sidebar py-6 transition-[width] duration-200",
          collapsed ? "w-16 px-2" : "w-64 px-4"
        )}
      >
        <div className={cn("flex items-start pb-4", collapsed ? "justify-center" : "justify-between px-2")}>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-xs tracking-[0.28em] text-primary">PRACTICAL SHOOTING</p>
              <h1 className="font-heading text-2xl font-semibold tracking-[0.2em] text-primary">PRIME</h1>
              <p className="truncate text-xs text-muted-foreground">{roleName || "Admin console"}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleCollapsed}
            title={collapsed ? "Цэс дэлгэх" : "Цэс хураах"}
            aria-label={collapsed ? "Цэс дэлгэх" : "Цэс хураах"}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        </div>
        <nav className="flex-1 space-y-3 overflow-y-auto overflow-x-hidden" key={tick}>
          {groups.map((group, index) => {
            const hasActive = group.items.some((item) => item.href === pathname);
            const open = collapsed || hasActive || !closedGroups.includes(group.id);
            return (
              <div key={group.id}>
                {collapsed ? (
                  index > 0 && <div className="mx-2 mb-1.5 border-t border-sidebar-border" />
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    disabled={hasActive}
                    className="flex w-full items-center justify-between rounded-md px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-sidebar-foreground disabled:cursor-default disabled:hover:text-muted-foreground"
                  >
                    {group.label}
                    <ChevronDown className={cn("size-3.5 transition-transform", !open && "-rotate-90")} />
                  </button>
                )}
                {open && (
                  <div className="mt-0.5 space-y-0.5">
                    {group.items.map((item) => {
                      const active = pathname === item.href;
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            "flex items-center gap-2.5 rounded-md py-1.5 text-sm transition-colors",
                            collapsed ? "justify-center px-0" : "px-3",
                            active ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                          )}
                        >
                          <Icon className="size-4 shrink-0" />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          title={collapsed ? "Гарах" : undefined}
          className={cn("mt-2 h-8", collapsed ? "justify-center px-0" : "justify-start px-3")}
          onClick={() => {
            localStorage.removeItem("prime_admin_token");
            localStorage.removeItem("prime_admin_permissions");
            router.replace("/login");
          }}
        >
          <LogOut className="size-4" />
          {!collapsed && "Гарах"}
        </Button>
        {!collapsed && <p className="mt-3 truncate px-2 text-xs text-muted-foreground">{name}</p>}
      </aside>
      <main className="min-w-0 flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
