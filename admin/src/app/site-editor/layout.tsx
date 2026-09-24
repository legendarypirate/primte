"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveSession } from "@/lib/auth";

export default function SiteEditorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("prime_admin_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    api<{ admin: { name: string; permissions?: string[]; role?: { name: string } | null } }>("/api/auth/admin/me")
      .then((data) => saveSession(data.admin))
      .catch(() => router.replace("/login"));
  }, [router]);

  return <div className="min-h-screen bg-[#070707]">{children}</div>;
}
