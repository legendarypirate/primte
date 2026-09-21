export function getPermissions(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("prime_admin_permissions") || "[]");
  } catch {
    return [];
  }
}

export function can(key: string) {
  const perms = getPermissions();
  return perms.includes("*") || perms.includes(key);
}

export function saveSession(admin: { name: string; permissions?: string[]; role?: { name: string } | null }, token?: string) {
  if (token) localStorage.setItem("prime_admin_token", token);
  localStorage.setItem("prime_admin_name", admin.name);
  localStorage.setItem("prime_admin_permissions", JSON.stringify(admin.permissions || []));
  localStorage.setItem("prime_admin_role", admin.role?.name || "");
}
