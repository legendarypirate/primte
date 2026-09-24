"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Award,
  Calendar,
  ChevronRight,
  Crosshair,
  Flag,
  Play,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { ContentSection, LionIcon, OutlineButton, PageHero, RedButton, SectionTag } from "../primitives";

const stats = [
  { icon: Calendar, value: "2019 онд", label: "байгуулагдсан" },
  { icon: Users, value: "100+", label: "гишүүн" },
  { icon: Trophy, value: "20+", label: "тэмцээн" },
  { icon: Star, value: "10+", label: "багш / инструктор" },
];

const timeline = [
  { year: "2019", title: "PRIME клуб байгуулагдав", desc: "Сонирхогчдын багаас эхлэл тавив." },
  { year: "2020", title: "Анхны сургалтууд", desc: "Тогтмол сургалт, гишүүдийн тоо өсөв." },
  { year: "2022", title: "Орон нутгийн тэмцээнүүд", desc: "Дотоод тэмцээнүүдийг зохион байгуулав." },
  { year: "2023", title: "Олон улсын тавцанд", desc: "Гадаад тэмцээнд оролцож, туршлага цуглуулав." },
  { year: "2024+", title: "Цаашид хөгжинө", desc: "Илүү олон тамирчин, илүү их боломж." },
];

const galleryItems = [
  { tag: "СУРГАЛТ", title: "ХӨГЖИЛ", color: "from-[#1a1814] via-[#101012] to-[#070707]" },
  { tag: "ТОНОГ ТӨХӨӨРӨМЖ", title: "МЭРГЭЖИЛ", color: "from-[#1c1810] via-[#121215] to-[#070707]" },
  { tag: "ХАМТ ОЛОН", title: "НӨХӨРЛӨЛ", color: "from-[#1a1814] via-[#101012] to-[#070707]" },
  { tag: "ТЭМЦЭЭН", title: "АМЖИЛТ", color: "from-[#151518] via-[#0d0d0f] to-[#070707]" },
  { tag: "ИЛҮҮ САЙН", title: "ӨНӨӨДӨР", color: "from-[#201515] via-[#121215] to-[#070707]" },
];

const team = [
  {
    name: "Б.ЭНХБАЯР",
    role: "Клубын үүсгэн байгуулагч",
    sub: "Ерөнхий инструктор",
  },
  {
    name: "Д.ОДБАЯР",
    role: "IPSC инструктор",
    sub: "Сургалтын багш",
  },
  {
    name: "С.МӨНХТУЛГА",
    role: "Ахлах инструктор",
    sub: "Техникийн сургалт",
  },
  {
    name: "Г.ЭРДЭНЭ",
    role: "Инструктор",
    sub: "Аюулгүй ажиллагаа",
  },
];

export function AboutPage() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      {/* 01 - HERO / БИДНИЙ ТУХАЙ */}
      <PageHero
        eyebrow="01 —— ABOUT US"
        title="БИДНИЙ ТУХАЙ"
        description="PRIME Practical Shooting Club нь 2019 онд байгуулагдсан IPSC Action Air клуб бөгөөд аюулгүй, хариуцлагатай, чадварлаг тамирчдыг хөгжүүлэхэд зориулагдсан."
        aside={
          <div className="relative overflow-hidden rounded-2xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 shadow-2xl">
            <div className="absolute top-4 right-4 text-[#e31e24]/15">
              <LionIcon className="size-36" />
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24]">
              PRIME IPSC CLUB
            </p>
            <h3 className="mt-4 font-heading text-3xl font-extrabold uppercase leading-tight text-white">
              MORE THAN A SPORT
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[#a0a0a5]">
              Аюулгүй байдал, сахилга бат, техник ур чадварыг нэгтгэсэн олон улсын практик буудлагын соёл.
            </p>
          </div>
        }
      >
        <RedButton href="#history">
          Бидний түүх
          <ArrowRight className="size-4" />
        </RedButton>
        <OutlineButton onClick={() => setShowVideo(true)}>
          <Play className="size-3.5 fill-current" />
          <span>PRIME-ийн тухай видео үзэх</span>
        </OutlineButton>
      </PageHero>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-3xl rounded-2xl border border-[#e31e24]/40 bg-[#0c0c0e] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#ffffff15]">
              <h3 className="font-heading text-base font-bold text-white uppercase">PRIME-ийн тухай видео</h3>
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                className="text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mt-4 flex h-72 items-center justify-center rounded-xl bg-[#141418] text-center">
              <div>
                <Play className="mx-auto mb-2 size-12 text-[#e31e24]" />
                <p className="text-sm font-bold text-white">PRIME Action Air Introduction Video</p>
                <p className="mt-1 text-xs text-muted-foreground">Тун удахгүй видео контент тавигдана</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 02 - КЛУБЫН ТАНИЛЦУУЛГА */}
      <ContentSection id="history" dark>
        <SectionTag n="02" label="КЛУБЫН ТАНИЛЦУУЛГА" />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
              ДИСЦИПЛИН. ХӨГЖИЛ. ИЛҮҮ САЙН ӨНӨӨДӨР.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#a0a0a5]">
              PRIME Practical Shooting Club нь 2019 онд байгуулагдсан IPSC Action Air төрлийн тамирчдын клуб юм. Бид практик буудлагын спортын соёлыг түгээж, тамирчдыг бэлтгэж, сургалт явуулах, тэмцээн зохион байгуулах, олон улсын тавцанд оролцох замаар Монгол дахь IPSC хөдөлгөөнийг хөгжүүлэхэд зорьж ажилладаг.
            </p>
            <div className="mt-6">
              <OutlineButton href="/training">Илүү дэлгэрэнгүй →</OutlineButton>
            </div>
          </div>

          {/* Lion emblem banner */}
          <div className="relative overflow-hidden rounded-2xl border border-[#e31e24]/40 bg-[#121215] p-8 text-center shadow-2xl">
            <LionIcon className="mx-auto size-16 text-[#e31e24]" />
            <h3 className="mt-4 font-heading text-xl font-bold uppercase tracking-wider text-white">
              PRIME PRACTICAL SHOOTING CLUB
            </h3>
            <blockquote className="mt-3 text-xs italic leading-relaxed text-[#e31e24]">
              "Илүү аюулгүй, илүү чадварлаг ирээдүйг хамтдаа бүтээе."
            </blockquote>
          </div>
        </div>
      </ContentSection>

      {/* 03 - ТООН ҮЗҮҮЛЭЛТ */}
      <ContentSection id="stats">
        <SectionTag n="03" label="ТООН ҮЗҮҮЛЭЛТ" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center rounded-2xl border border-[#ffffff15] bg-[#101014] p-6 text-center shadow-xl transition-all hover:border-[#e31e24]/50"
            >
              <div className="mb-3 flex size-12 items-center justify-center rounded-xl border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
                <Icon className="size-6" />
              </div>
              <p className="font-mono text-3xl font-extrabold text-white">{value}</p>
              <p className="mt-1 text-xs text-[#a0a0a5]">{label}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* 04 - БИДНИЙ ҮНЭТ ЗҮЙЛС */}
      <ContentSection id="values" dark>
        <SectionTag n="04" label="БИДНИЙ ҮНЭТ ЗҮЙЛС" />
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          БИДНИЙ ЗОРИЛГО, АЛСЫН ХАРАА, ҮНЭТ ЗҮЙЛС
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Card 1: Purpose */}
          <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl transition-all hover:border-[#e31e24]/50">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
              <Target className="size-5" />
            </div>
            <h4 className="font-heading text-base font-bold uppercase tracking-wider text-[#e31e24]">
              БИДНИЙ ЗОРИЛГО
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-[#a0a0a5]">
              Аюулгүй, хариуцлагатай практик буудлагын спортыг түгээж, тамирчдын ур чадварыг дээшлүүлэх.
            </p>
          </div>

          {/* Card 2: Vision */}
          <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl transition-all hover:border-[#e31e24]/50">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
              <Flag className="size-5" />
            </div>
            <h4 className="font-heading text-base font-bold uppercase tracking-wider text-[#e31e24]">
              АЛСЫН ХАРАА
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-[#a0a0a5]">
              Монголд IPSC Action Air спортын тэргүүлэгч клуб байж, олон улсын тавцанд амжилттай тамирчдыг бэлтгэх.
            </p>
          </div>

          {/* Card 3: Values */}
          <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl transition-all hover:border-[#e31e24]/50">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
              <Users className="size-5" />
            </div>
            <h4 className="font-heading text-base font-bold uppercase tracking-wider text-[#e31e24]">
              ҮНЭТ ЗҮЙЛС
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-[#a0a0a5]">
              Аюулгүй байдал, сахилга бат, хариуцлага, тасралтгүй суралцах, хамтын нийгэмлэг, шударга өРСӨЛДӨӨН.
            </p>
          </div>
        </div>
      </ContentSection>

      {/* 05 - БИДНИЙ ЗАМНАЛ */}
      <ContentSection id="timeline">
        <SectionTag n="05" label="БИДНИЙ ЗАМНАЛ" />
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          ӨСӨЛТ, ХӨГЖЛИЙН ТҮҮХ
        </h2>

        <div className="relative mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {timeline.map((item, idx) => (
            <div
              key={item.year}
              className="relative flex flex-col justify-between rounded-xl border border-[#ffffff15] bg-[#101014] p-5 shadow-lg"
            >
              <div>
                <span className="font-mono text-xl font-extrabold text-[#e31e24]">{item.year}</span>
                <h4 className="mt-2 font-heading text-xs font-bold text-white">{item.title}</h4>
                <p className="mt-2 text-[11px] leading-relaxed text-[#a0a0a5]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* 06 - КЛУБЫН АМЬДРАЛ */}
      <ContentSection id="gallery" dark>
        <SectionTag n="06" label="КЛУБЫН АМЬДРАЛ" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
              БИДНИЙ ӨДӨР ТУТМЫН АМЬДРАЛ
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Сургалт, тэмцээн, нөхөрлөл, хөгжил — PRIME-ийн амьдралын нэг хэсэг.
            </p>
          </div>
          <OutlineButton href="/contact">ГАЛЕРЕЙ ҮЗЭХ →</OutlineButton>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {galleryItems.map((g, idx) => (
            <div
              key={idx}
              className="group relative flex h-48 flex-col justify-end overflow-hidden rounded-2xl border border-[#ffffff15] p-5 shadow-xl transition-transform hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-t ${g.color}`} />
              <div className="relative z-10">
                <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#e31e24]">
                  {g.tag}
                </span>
                <h4 className="font-heading text-base font-extrabold uppercase text-white">{g.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* 07 - БАГШ, ИНСТРУКТОР */}
      <ContentSection id="team">
        <SectionTag n="07" label="БАГШ, ИНСТРУКТОР" />
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
            МАНАЙ БАГ
          </h2>
          <p className="text-sm text-muted-foreground">
            Туршлагатай, мэргэшсэн багш, инструкторууд таны хөгжлийн хөтөч болно.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person) => (
            <div
              key={person.name}
              className="group overflow-hidden rounded-2xl border border-[#ffffff15] bg-[#101014] shadow-xl transition-all hover:border-[#e31e24]/60"
            >
              {/* Graphic Profile Box */}
              <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707]">
                <LionIcon className="size-20 text-[#e31e24]/20 transition-transform group-hover:scale-110" />
              </div>
              <div className="p-5">
                <h4 className="font-heading text-base font-bold text-white">{person.name}</h4>
                <p className="mt-1 text-xs font-semibold text-[#e31e24]">{person.role}</p>
                <p className="mt-0.5 text-[11px] text-[#a0a0a5]">{person.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* 08 - НИЙГЭМЛЭГТ НЭГД */}
      <ContentSection id="cta" dark>
        <div className="relative overflow-hidden rounded-3xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24]">
                08 —— НИЙГЭМЛЭГТ НЭГД
              </p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold uppercase text-white md:text-4xl">
                ИЛҮҮ ИХ БОЛОМЖ ТАНЫГ ХҮЛЭЭЖ БАЙНА
              </h2>
              <p className="mt-2 max-w-xl text-xs text-[#a0a0a5]">
                Сургалтад хамрагдаж, PRIME клубийн гишүүн болж, өөрийн боломжийг нээ.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <RedButton href="/training">СУРГАЛТАД БҮРТГҮҮЛЭХ →</RedButton>
              <OutlineButton href="/contact">ХОЛБОО БАРИХ →</OutlineButton>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
