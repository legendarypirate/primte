"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "./courses";
import { RegisterContext } from "./register-context";
import { RegisterModal } from "./register-modal";
import "@/styles/prime-home.css";

export function PrimeShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [regOpen, setRegOpen] = useState(false);
  const [regCourse, setRegCourse] = useState("trial");
  const year = new Date().getFullYear();

  function openRegister(id = "trial") {
    setRegCourse(id);
    setRegOpen(true);
    setMenuOpen(false);
  }

  function isCurrent(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <RegisterContext.Provider value={{ openRegister }}>
      <div className="prime-home">
        <header style={{ position: "sticky", top: 0, zIndex: 10, height: 0, padding: "0 20px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 16 }}>
            <nav
              aria-label="Үндсэн цэс"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "10px 10px 10px 20px",
                borderRadius: 999,
                background: "rgba(22,23,27,.82)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <Link href="/" aria-label="Prime — нүүр хуудас" style={{ display: "flex", alignItems: "center", gap: 10, color: "#FFFFFF" }}>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: "#D8AE4A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B0C0E" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v4M12 19v4M1 12h4M19 12h4" />
                  </svg>
                </span>
                <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: ".04em" }}>
                  PRIME
                </span>
              </Link>
              <div className="nav-links" style={{ display: "flex", flexWrap: "wrap", gap: 28, fontSize: 15, fontWeight: 600 }}>
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    className="navlink"
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  className="btn-g nav-login"
                  href="/login"
                  style={{
                    padding: "12px 20px",
                    borderRadius: 999,
                    color: "#E8E9EC",
                    fontWeight: 600,
                    fontSize: 15,
                    background: "rgba(255,255,255,.06)",
                  }}
                >
                  Нэвтрэх
                </Link>
                <button
                  type="button"
                  className="btn-y"
                  onClick={() => openRegister("trial")}
                  style={{ padding: "12px 22px", borderRadius: 999, color: "#0B0C0E", background: "#D8AE4A", fontWeight: 700, fontSize: 15, border: 0, cursor: "pointer" }}
                >
                  Захиалах
                </button>
                <button
                  type="button"
                  className="burger"
                  aria-label="Цэс"
                  aria-expanded={menuOpen}
                  aria-controls="mmenu"
                  onClick={() => setMenuOpen((v) => !v)}
                  style={{
                    width: 46,
                    height: 46,
                    border: 0,
                    borderRadius: 999,
                    cursor: "pointer",
                    background: "rgba(255,255,255,.08)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8E9EC" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                  </svg>
                </button>
              </div>
            </nav>
            <div
              id="mmenu"
              hidden={!menuOpen}
              style={{
                marginTop: 8,
                padding: 10,
                borderRadius: 24,
                background: "#15161A",
                border: "1px solid rgba(255,255,255,.08)",
                flexDirection: "column",
              }}
            >
              <Link href="/" onClick={() => setMenuOpen(false)}>
                Нүүр
              </Link>
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link href="/login" id="mm-login" onClick={() => setMenuOpen(false)}>
                Нэвтрэх
              </Link>
            </div>
          </div>
        </header>

        {children}

        <div style={{ padding: "0 20px" }}>
          <footer
            style={{
              maxWidth: 1280,
              margin: "96px auto 0",
              padding: "48px 0 32px",
              borderTop: "1px solid rgba(255,255,255,.08)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 32,
              fontSize: 15,
              color: "#A9ACB4",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontWeight: 800, fontSize: 20, color: "#FFFFFF" }}>PRIME</span>
              <span style={{ lineHeight: 1.6 }}>Монгол улс, Улаанбаатар, Сүхбаатар дүүрэг, 2-р хороо, Нарны зам-25, Урбанек төв</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ color: "#FFFFFF", fontWeight: 700 }}>Холбоо барих</span>
              <a href="mailto:info@IPSCAA.com">info@IPSCAA.com</a>
              <a href="tel:86110200">8611-0200</a>
              <a href="tel:90880200">9088-0200 (бүртгэл)</a>
              <a href="mailto:registration@prime.mn">registration@prime.mn</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ color: "#FFFFFF", fontWeight: 700 }}>Сургалт</span>
              <Link className="navlink" href="/training">
                Туршилтын буудлага
              </Link>
              <Link className="navlink" href="/training/course-1">
                Course 1
              </Link>
              <Link className="navlink" href="/training/course-2">
                Course 2
              </Link>
              <Link className="navlink" href="/training/junior">
                Жуниор хөтөлбөр
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ color: "#FFFFFF", fontWeight: 700 }}>Сошиал</span>
              <div style={{ display: "flex", gap: 10 }}>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8E9EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8E9EC" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r=".8" fill="#E8E9EC" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,.06)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8E9EC" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="5" width="20" height="14" rx="4" />
                    <path d="M10 9l5 3-5 3z" />
                  </svg>
                </a>
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,.06)", fontSize: 13, color: "#8D919A" }}>
              © 2022–{year} Prime Practical Shooting Club · IPSC Action Air Mongolia ·{" "}
              <Link className="navlink" href="/ranking/rules">
                Спортын дүрэм
              </Link>
            </div>
          </footer>
        </div>

        <RegisterModal open={regOpen} courseId={regCourse} onClose={() => setRegOpen(false)} />
      </div>
    </RegisterContext.Provider>
  );
}
