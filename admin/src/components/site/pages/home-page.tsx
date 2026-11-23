"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { COURSES, GOLD, HOME_FILTERS, HOME_IDS, type Course } from "@/components/site/prime/courses";
import { useRegister } from "@/components/site/prime/register-context";
import "@/styles/prime-home.css";

const SLIDES = [
  { src: "/prime/hero-1.jpg", pos: "60% 30%" },
  { src: "/prime/hero-2.jpg", pos: "50% 35%" },
  { src: "/prime/hero-3.jpg", pos: "50% 30%" },
  { src: "/prime/hero-4.jpg", pos: "60% 50%" },
];

const PILLARS = [
  {
    href: "/membership",
    title: "Гишүүнчлэл",
    text: "Клубын гишүүн болж, тогтмол бэлтгэл, тэмцээнд оролцох эрхтэй бол.",
    img: "/prime/pillar-membership.jpg",
  },
  {
    href: "/training",
    title: "Сургалт",
    text: "Туршилтын буудлага, Course 1, Course 2, жуниор хөтөлбөр.",
    img: "/prime/pillar-training.jpg",
  },
  {
    href: "/ranking",
    title: "Тэмцээн",
    text: "Ням гараг бүр клубын тэмцээн. Level I-ээс олон улсын түвшин хүртэл.",
    img: "/prime/pillar-competition.jpg",
  },
];

const RULES = [
  { n: "1", title: "Аюулгүй ажиллагааны үндсэн дүрэм", href: "/ranking/rules" },
  { n: "2", title: "Зэвсгийн ангилал", href: "/about" },
  { n: "3", title: "Дасгалын зохиомж", href: "/ranking/rules" },
  { n: "4", title: "Тэмцээний түвшин", href: "/ranking" },
  { n: "5", title: "Тэмцээнээс хасах “DQ”", href: "/ranking/rules" },
];

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function GoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D8AE4A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

export function HomePage() {
  const { openRegister } = useRegister();
  const [slide, setSlide] = useState(0);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setSlide((i) => (i + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const courses = useMemo(
    () => HOME_IDS.map((id) => COURSES.find((c) => c.id === id)!).filter((c) => filter === "all" || c.id === filter),
    [filter]
  );

  return (
    <div className="prime-home" data-page="home">
      <section
        id="top"
        style={{
          position: "relative",
          overflow: "hidden",
          width: "100%",
          height: "100vh",
          minHeight: 760,
          maxHeight: 1000,
          display: "flex",
          alignItems: "flex-end",
          background: "#15161A",
        }}
      >
        <div className="slides" aria-hidden="true">
          {SLIDES.map((s, i) => (
            <img key={s.src} className={`slide${i === slide ? " is-active" : ""}`} src={s.src} alt="" style={{ objectPosition: s.pos }} />
          ))}
        </div>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(11,12,14,.92) 0%, rgba(11,12,14,.70) 45%, rgba(11,12,14,.15) 100%)" }} />
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(11,12,14,.85) 0%, rgba(11,12,14,0) 40%)" }} />
        <div
          className="hero-in"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "140px 20px clamp(40px, 6vw, 80px)",
            display: "flex",
            flexDirection: "column",
            gap: 28,
            boxSizing: "border-box",
          }}
        >
          <span
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              background: "rgba(11,12,14,.55)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(216,174,74,.35)",
              color: "#D8AE4A",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".06em",
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D8AE4A" }} />
            IPSC ACTION AIR MONGOLIA
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(42px, 6vw, 84px)",
              lineHeight: 1.02,
              letterSpacing: "-.02em",
              color: "#FFFFFF",
              maxWidth: 760,
            }}
          >
            Хурд. Хүч. <span style={{ color: "#D8AE4A" }}>Цэц.</span>
          </h1>
          <p style={{ margin: 0, fontSize: 19, lineHeight: 1.6, color: "#D3D5DA", maxWidth: 520 }}>
            Практик буудлагын спортын «Прайм» клуб. Мэргэжлийн багшийн удирдлагатай, аюулгүй орчинд эхнээсээ тэмцээний түвшин хүртэл.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <button
              type="button"
              className="btn-y"
              onClick={() => openRegister("trial")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "18px 28px",
                borderRadius: 16,
                background: "#D8AE4A",
                color: "#0B0C0E",
                fontWeight: 700,
                fontSize: 16,
                border: 0,
                cursor: "pointer",
              }}
            >
              Туршилтын буудлага захиалах
              <ArrowIcon />
            </button>
            <a
              className="btn-g"
              href="#programs"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "18px 26px",
                borderRadius: 16,
                background: "rgba(255,255,255,.10)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,.18)",
                color: "#FFFFFF",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Хөтөлбөр үзэх
            </a>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 20, marginTop: 24 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {[
                ["2019", "Байгуулагдсан"],
                ["Ням бүр", "Клубын тэмцээн"],
                ["6мм", "Action Air буу"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  style={{
                    padding: "16px 20px",
                    borderRadius: 20,
                    background: "rgba(11,12,14,.55)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,.10)",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 24, fontWeight: 700, color: "#FFFFFF" }}>{value}</div>
                  <div style={{ fontSize: 14, color: "#B5B8BF" }}>{label}</div>
                </div>
              ))}
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 16px",
                borderRadius: 14,
                background: "rgba(11,12,14,.55)",
                backdropFilter: "blur(10px)",
                fontSize: 14,
                fontWeight: 600,
                color: "#E8E9EC",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D8AE4A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Урбанек төв, Сүхбаатар дүүрэг
            </span>
          </div>
        </div>
      </section>

      <div style={{ padding: "0 20px" }}>
        <main style={{ maxWidth: 1280, margin: "0 auto" }}>
          <section id="about" style={{ marginTop: 96 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 32 }}>
              <h2 className="rise" style={{ margin: 0, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-.01em" }}>
                Клубт юу хийх вэ
              </h2>
              <p style={{ margin: 0, maxWidth: 420, color: "#A9ACB4", fontSize: 16, lineHeight: 1.6 }}>
                Гурван замаас сонгоод эхэл. Анх удаа бол туршилтын буудлагаас эхлэхийг зөвлөж байна.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {PILLARS.map((p) => (
                <Link
                  key={p.href}
                  id={p.href === "/membership" ? "membership" : undefined}
                  className="lift pop"
                  href={p.href}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 28,
                    background: "#15161A",
                    border: "1px solid rgba(255,255,255,.06)",
                    overflow: "hidden",
                    color: "#E8E9EC",
                  }}
                >
                  <div style={{ height: 220, background: "#1E2026", overflow: "hidden" }}>
                    <img src={p.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                  <div style={{ padding: "24px 26px 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ margin: 0, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>{p.title}</h3>
                      <span style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(216,174,74,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <GoIcon />
                      </span>
                    </div>
                    <p style={{ margin: 0, color: "#A9ACB4", fontSize: 15, lineHeight: 1.6 }}>{p.text}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section id="programs" style={{ marginTop: 96 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 32 }}>
              <h2 className="rise" style={{ margin: 0, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-.01em" }}>
                Онцлох сургалтууд
              </h2>
              <div
                role="group"
                aria-label="Шүүлтүүр"
                style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: 6, borderRadius: 999, background: "#15161A", border: "1px solid rgba(255,255,255,.06)" }}
              >
                {HOME_FILTERS.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    data-filter={id}
                    aria-pressed={filter === id}
                    onClick={() => setFilter(id)}
                    style={{
                      minHeight: 44,
                      padding: "10px 18px",
                      borderRadius: 999,
                      border: 0,
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 700,
                      background: filter === id ? GOLD : "transparent",
                      color: filter === id ? "#0B0C0E" : "#C9CBD1",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
              {courses.map((c, i) => (
                <HomeCourseCard key={c.id} course={c} index={i} onRegister={openRegister} />
              ))}
            </div>
          </section>

          <section
            id="events"
            className="pop"
            style={{
              marginTop: 96,
              borderRadius: 32,
              background: "#D8AE4A",
              color: "#0B0C0E",
              padding: "clamp(28px, 4vw, 56px)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 28,
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 28 }}>
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 24,
                  background: "#0B0C0E",
                  color: "#D8AE4A",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 30, fontWeight: 800 }}>НЯМ</span>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".06em" }}>ГАРАГ БҮР</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".1em" }}>КЛУБЫН ТЭМЦЭЭН</span>
                <h2 className="rise" style={{ margin: 0, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, letterSpacing: "-.01em" }}>
                  Level I клубын тэмцээн
                </h2>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Урбанек төв · Сард 3 удаа · Course 2 төгссөн гишүүд</span>
              </div>
            </div>
            <Link href="/ranking" style={{ padding: "18px 28px", borderRadius: 16, background: "#0B0C0E", color: "#FFFFFF", fontWeight: 700, fontSize: 16 }}>
              Дэлгэрэнгүй
            </Link>
          </section>

          <section id="rules" style={{ marginTop: 96 }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 16, marginBottom: 28 }}>
              <h2 className="rise" style={{ margin: 0, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-.01em" }}>
                Спортын дүрэм
              </h2>
              <Link className="btn-g" href="/ranking/rules" style={{ padding: "12px 18px", borderRadius: 999, background: "rgba(255,255,255,.06)", color: "#E8E9EC", fontWeight: 600, fontSize: 14 }}>
                Бүх дүрэм
              </Link>
            </div>
            <div className="rule-cards">
              {RULES.map((r) => (
                <Link key={r.n} className="lift pop rule-card" href={r.href}>
                  <span className="rc-n">{r.n}</span>
                  <span className="rc-t">{r.title}</span>
                  <span className="rc-go" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section
            id="trial"
            className="pop"
            style={{
              marginTop: 96,
              borderRadius: 32,
              background: "#15161A",
              border: "1px solid rgba(255,255,255,.06)",
              padding: "clamp(32px, 5vw, 72px)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
            }}
          >
            <h2
              className="rise"
              style={{
                margin: 0,
                fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
                fontSize: "clamp(30px, 4vw, 52px)",
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-.02em",
                maxWidth: 760,
                lineHeight: 1.1,
              }}
            >
              Анхны буудлагаа <span style={{ color: "#D8AE4A" }}>өнөөдөр</span> захиал
            </h2>
            <p style={{ margin: 0, color: "#A9ACB4", fontSize: 18, maxWidth: 540, lineHeight: 1.6 }}>
              Инструктортой хамт 100 ширхэг сумаар эйрсофт гар буу эсвэл карабинаар буудна. 12-оос дээш насны хүн бүрт, туршлага шаардлагагүй.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 8 }}>
              <button
                type="button"
                className="btn-y"
                onClick={() => openRegister("trial")}
                style={{ padding: "18px 30px", borderRadius: 16, background: "#D8AE4A", color: "#0B0C0E", fontWeight: 700, fontSize: 16, border: 0, cursor: "pointer" }}
              >
                Цаг захиалах
              </button>
              <a
                className="btn-g"
                href="tel:86110200"
                style={{
                  padding: "18px 28px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  color: "#E8E9EC",
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                Залгах: 8611-0200
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function HomeCourseCard({
  course,
  index,
  onRegister,
}: {
  course: Course;
  index: number;
  onRegister: (id: string) => void;
}) {
  return (
    <article
      className="lift pop card-in"
      style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: 28,
        background: "#15161A",
        border: "1px solid rgba(255,255,255,.06)",
        overflow: "hidden",
        ["--i" as string]: index,
      }}
    >
      <div style={{ position: "relative", height: 200, margin: "10px 10px 0", borderRadius: 20, background: "#1E2026", overflow: "hidden" }}>
        <img
          src={course.img}
          alt={course.title}
          className={course.soon ? "course-soon" : undefined}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <span
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            padding: "7px 12px",
            borderRadius: 999,
            background: "rgba(11,12,14,.82)",
            color: GOLD,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: ".06em",
          }}
        >
          {course.tag}
        </span>
        <span
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            padding: "7px 12px",
            borderRadius: 999,
            background: "rgba(11,12,14,.82)",
            color: "#E8E9EC",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {course.soon ? "Тун удахгүй" : course.age}
        </span>
      </div>
      <div style={{ padding: "22px 24px 24px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <h3 style={{ margin: 0, fontFamily: "var(--font-montserrat), Montserrat, sans-serif", fontSize: 20, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.25 }}>
          {course.title}
        </h3>
        <p style={{ margin: 0, color: "#A9ACB4", fontSize: 15, lineHeight: 1.6, flex: 1 }}>{course.text}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 13, color: "#C9CBD1" }}>
          <span style={{ padding: "6px 10px", borderRadius: 10, background: "rgba(255,255,255,.05)" }}>{course.length}</span>
          <span style={{ padding: "6px 10px", borderRadius: 10, background: "rgba(216,174,74,.12)", color: GOLD, fontWeight: 700 }}>{course.price}</span>
        </div>
        {course.soon ? (
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <span
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                borderRadius: 14,
                background: "rgba(255,255,255,.06)",
                color: "#8D919A",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Тун удахгүй
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              type="button"
              className="btn-y"
              onClick={() => onRegister(course.id)}
              style={{
                flex: 1,
                minHeight: 48,
                padding: 14,
                borderRadius: 14,
                background: GOLD,
                color: "#0B0C0E",
                fontWeight: 700,
                fontSize: 15,
                border: 0,
                cursor: "pointer",
              }}
            >
              Бүртгүүлэх
            </button>
            {course.link ? (
              <Link
                className="btn-g"
                href={course.link}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 48,
                  borderRadius: 14,
                  background: "rgba(255,255,255,.06)",
                  color: "#E8E9EC",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                Дэлгэрэнгүй
              </Link>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
