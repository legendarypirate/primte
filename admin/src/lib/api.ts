const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3151";

function token() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("prime_admin_token") || "";
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token()) headers.set("Authorization", `Bearer ${token()}`);
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Хүсэлт амжилтгүй.");
  return data as T;
}

export function assetUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API}${path}`;
}

export function tugrik(n = 0) {
  return `₮${Number(n).toLocaleString("en-US")}`;
}

export { API };
