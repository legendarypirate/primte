"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  HelpCircle,
  Mail,
  Phone,
  Play,
  Shield,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { ContentSection, LionIcon, OutlineButton, PageHero, RedButton, SectionTag, Stepper } from "../primitives";

const whyUs = [
  {
    icon: Shield,
    title: "АЮУЛГҮЙ АЖИЛЛАГАА",
    desc: "Олон улсын стандартын дагуу, аюулгүй орчин.",
  },
  {
    icon: UserCheck,
    title: "МЭРГЭЖЛИЙН БАГШ",
    desc: "МПБХ-ны сертификаттай, туршлагатай инструкторууд.",
  },
  {
    icon: BarChart3,
    title: "ТҮВШИН АХИХ СИСТЕМ",
    desc: "Тодорхой шатлалтай ур чадвараа тасралтгүй сайжруулах.",
  },
  {
    icon: Trophy,
    title: "ТЭМЦЭЭНД БЭЛТГЭХ",
    desc: "Орон нутгийн болон олон улсын тэмцээнд оролцоход бэлтгэнэ.",
  },
];

const courses = [
  {
    id: "course-1",
    code: "COURSE 1",
    title: "ГИШҮҮНЧЛЭЛИЙН АНХАН ШАТНЫ СУРГАЛТ",
    type: "IPSC Action Air Handgun",
    duration: "3 өдөр (нийт 9 цаг) эсвэл 2 өдөр (нийт 8 цаг)",
    capacity: "4-6 суралцагч",
    price: "370,000₮",
    href: "/training/course-1",
    buttonText: "БҮРТГҮҮЛЭХ →",
  },
  {
    id: "course-2",
    code: "COURSE 2",
    title: "ГИШҮҮНЧЛЭЛИЙН АНХАН ДУНД ШАТНЫ СУРГАЛТ",
    type: "IPSC Action Air Handgun",
    duration: "3 өдөр (нийт 9 цаг) эсвэл 2 өдөр (нийт 8 цаг)",
    capacity: "4-6 суралцагч",
    price: "370,000₮",
    href: "/training/course-2",
    buttonText: "БҮРТГҮҮЛЭХ →",
  },
  {
    id: "junior",
    code: "JUNIOR",
    title: "ЖУНИОР ХӨТӨЛБӨР",
    type: "12-18 насны хүүхддэд зориулсан цогц хөтөлбөр",
    duration: "3 сараар",
    capacity: "Аюулгүй ажиллагаа, тэвчээр, хариуцлага",
    price: "750,000₮",
    href: "/training/course-1",
    buttonText: "УРДЧИЛСАН БҮРТГЭЛ →",
  },
];

const compareMatrix = [
  {
    feature: "Хамрах хүрээ",
    c1: "18-с дээш насны Монгол Улсын иргэн",
    c2: "Course 1 төгссөн эсвэл суурьтай хүн",
    junior: "12-18 нас (Төлөөлөгчөөр бүртгүүлнэ)",
  },
  {
    feature: "Үргэлжлэх хугацаа",
    c1: "3 өдөр (3 цаг x 3) / 2 өдөр (4 цаг x 2)",
    c2: "3 өдөр (3 цаг x 3) / 2 өдөр (4 цаг x 2)",
    junior: "Түвшинчилсэн урт хугацааны хөтөлбөр (3 сар)",
  },
  {
    feature: "Өдрийн бүтэц",
    c1: "Онол, аюулгүй ажиллагаа, техникийн сургалт",
    c2: "Онол, дадлага, хөдөлгөөний дадлага, стэйж",
    junior: "Онол, дадлага, ур чадвар, сэтгэл зүйн сургалт",
  },
  {
    feature: "Үндсэн хуваарь",
    c1: "Дав, Лха, Баа 19:00-22:00 эсвэл Бям, Ням 18:00-22:00",
    c2: "Дав, Лха, Баа 19:00-22:00 эсвэл Бям, Ням 18:00-22:00",
    junior: "Тусгай хуваарийн дагуу (клубын тохиролцоогоор)",
  },
  {
    feature: "Төлбөр",
    c1: "370,000₮",
    c2: "370,000₮",
    junior: "3 сараар 750,000₮",
  },
  {
    feature: "Багтах зүйлс / хэрэгсэл",
    c1: "Зэвсэг хэрэгслийн ашиглалт багтсан",
    c2: "Өөрийн зэвсэг хэрэгслээр хамрагдана",
    junior: "Клубын зэвсэг, хамгаалах тоноглол",
  },
  {
    feature: "Дараагийн шат",
    c1: "Course 2-т хамрагдах эрх нээгдэнэ",
    c2: "Суралцагч гишүүнээр элсэх боломж",
    junior: "Тогтмол дасгал, тэмцээний боломж",
  },
];

const steps = [
  { number: "01", label: "Course сонгох" },
  { number: "02", label: "Маягт бөглөх" },
  { number: "03", label: "Төлбөр баталгаажуулах" },
  { number: "04", label: "Баримт бичиг илгээх" },
  { number: "05", label: "Хуваарь баталгаажих" },
];

const docRequirements = [
  {
    title: "COURSE 1 — Анхан шат",
    items: [
      "Анкет, аюулгүй ажиллагааны баталгаа",
      "3x4 хэмжээтэй цээж зураг",
      "Иргэний үнэмлэхийн цахим лавлагаа",
      "Оршин суугаа хаягийн тодорхойлолт",
    ],
  },
  {
    title: "COURSE 2 — Анхан дунд шат",
    items: [
      "Гишүүнчлэлийн анкет",
      "Цээж зураг тодорхойлолтын хамт",
      "А-33 маягтын тодорхойлолт",
    ],
  },
  {
    title: "JUNIOR — Жуниор хөтөлбөр",
    items: [
      "Хүүхдийн төрөрсний гэрчилгээний хуулбар",
      "Хүүхдийн 3x4 зураг",
      "Төлөөлөгчийн 3x4 зураг",
      "Төлөөлөгчийн иргэний үнэмлэхийн лавлагаа",
      "Төлөөлөгчийн зөвшөөрлийн лавлагаа",
    ],
  },
];

const instructors = [
  { name: "Б.ЭНХБАЯР", role: "МПБХ-ны инструктор", sub: "Клубын үүсгэн байгуулагч" },
  { name: "Д.ОДБАЯР", role: "Техникийн сургалт", sub: "IPSC инструктор" },
  { name: "С.МӨНХТУЛГА", role: "Аюулгүй ажиллагааны сургалт", sub: "Ахлах инструктор" },
  { name: "Г.ЭРДЭНЭ", role: "Жуниор хөтөлбөр", sub: "Инструктор" },
];

export function TrainingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "Course 1",
    time: "19:00 - 22:00",
    notes: "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Нэр болон утасны дугаараа оруулна уу.");
      return;
    }
    toast.success("Таны сургалтын бүртгэл амжилттай илгээгдлээ!");
    setFormData({ name: "", email: "", phone: "", course: "Course 1", time: "19:00 - 22:00", notes: "" });
  };

  return (
    <>
      {/* 01 - HERO / СУРГАЛТ */}
      <PageHero
        eyebrow="01 —— TRAINING PROGRAMS"
        title="СУРГАЛТ"
        description="PRIME IPSC Club нь Монгол Улсад олон улсын стандарттай, аюулгүй, мэргэжлийн IPSC Action Air сургалтыг санал болгодог. Дисциплин, ур чадвар, итгэл үнэмшлийг хамтдаа бий болгоно."
        aside={
          <div className="relative overflow-hidden rounded-2xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 text-right shadow-2xl">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24]">
              DISCIPLINE · SKILL
            </p>
            <h3 className="mt-2 font-heading text-2xl font-extrabold uppercase text-white">
              A SAFER TOMORROW
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">
              Аюулгүй байдал, практик буудлагын бодит дадлага сургалт.
            </p>
          </div>
        }
      >
        <RedButton href="#courses">
          СУРГАЛТАНД БҮРТГҮҮЛЭХ
          <ArrowRight className="size-4" />
        </RedButton>
        <OutlineButton href="#courses">COURSE-ҮҮД ҮЗЭХ</OutlineButton>
      </PageHero>

      {/* 02 - ЯАГААД PRIME-ЫГ СОНГОХ ВЭ? */}
      <ContentSection id="why" dark>
        <SectionTag n="02" label="ЯАГААД PRIME-ЫГ СОНГОХ ВЭ?" />
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          СУРГАЛТЫН ДАВУУ ТАЛУУД
        </h2>
        <p className="mt-2 max-w-2xl text-xs text-muted-foreground">
          Бодит буудлагад ойр, аюулгүй, хөдөлгөөний ба тактикийн иж бүрэн соёлд суралцана.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl transition-all hover:border-[#e31e24]/50"
            >
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
                <Icon className="size-6" />
              </div>
              <h4 className="font-heading text-sm font-bold text-white uppercase">{title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">{desc}</p>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* 03 - СУРГАЛТЫН ХӨТӨЛБӨРҮҮД */}
      <ContentSection id="courses">
        <SectionTag n="03" label="СУРГАЛТЫН ХӨТӨЛБӨРҮҮД" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
              СУРГАЛТЫН ХӨТӨЛБӨРҮҮД
            </h2>
            <p className="text-xs text-muted-foreground">Та өөрийн түвшинд тохирох сургалтыг сонгоно уу.</p>
          </div>
          <Link href="/training/course-1" className="text-xs font-bold text-[#e31e24] hover:underline">
            ALL COURSES →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {courses.map((c) => (
            <div
              key={c.id}
              className="flex flex-col justify-between rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl transition-all hover:border-[#e31e24]/60"
            >
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e31e24]">
                  {c.code}
                </span>
                <h3 className="mt-2 font-heading text-base font-bold text-white uppercase">{c.title}</h3>
                <p className="mt-1 text-xs text-[#a0a0a5]">{c.type}</p>

                <div className="mt-6 space-y-2 border-t border-[#ffffff10] pt-4 text-xs text-[#a0a0a5]">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-[#e31e24]" />
                    <span>{c.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-[#e31e24]" />
                    <span>{c.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[#ffffff10] pt-4">
                <p className="font-mono text-2xl font-extrabold text-[#e31e24]">{c.price}</p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={c.href}
                    className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[#ffffff20] bg-[#1b1b20] text-xs font-bold text-white transition hover:border-[#e31e24] hover:text-[#e31e24]"
                  >
                    ДЭЛГЭРЭНГҮЙ
                  </Link>
                  <Link
                    href={c.href}
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#e31e24] text-xs font-bold text-white shadow-md transition hover:bg-[#c91920]"
                  >
                    <span>{c.buttonText}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* 04 - СУРГАЛТЫН ХАРЬЦУУЛАЛТ */}
      <ContentSection id="compare" dark>
        <SectionTag n="04" label="СУРГАЛТЫН ХАРЬЦУУЛАЛТ" />
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          СУРГАЛТЫН ХАРЬЦУУЛАЛТ
        </h2>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-[#ffffff15] bg-[#121215]">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="border-b border-[#ffffff15] bg-[#0a0a0c] font-mono text-[11px] font-bold uppercase tracking-wider text-[#e31e24]">
              <tr>
                <th className="p-4">Үзүүлэлт</th>
                <th className="p-4">COURSE 1 / Анхан шат</th>
                <th className="p-4">COURSE 2 / Анхан дунд шат</th>
                <th className="p-4">Жуниор хөтөлбөр</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff10] text-[#a0a0a5]">
              {compareMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#16161b]">
                  <td className="p-4 font-bold text-white">{row.feature}</td>
                  <td className="p-4">{row.c1}</td>
                  <td className="p-4">{row.c2}</td>
                  <td className="p-4">{row.junior}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ContentSection>

      {/* 05 - СУРГАЛТЫН ХУВААРЬ */}
      <ContentSection id="schedule">
        <SectionTag n="05" label="СУРГАЛТЫН ХУВААРЬ" />
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          СУРГАЛТЫН ХУВААРЬ
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col justify-between rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl">
            <div>
              <Calendar className="mb-3 size-8 text-[#e31e24]" />
              <h4 className="font-heading text-sm font-bold text-white uppercase">АЖЛЫН ӨДРИЙН АНГИ</h4>
              <p className="mt-2 text-xs text-[#a0a0a5]">Даваа / Лхагва / Баасан</p>
              <p className="mt-1 font-mono text-sm font-bold text-[#e31e24]">19:00 - 22:00</p>
            </div>
            <ArrowRight className="mt-4 size-5 text-[#e31e24]" />
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl">
            <div>
              <Calendar className="mb-3 size-8 text-[#e31e24]" />
              <h4 className="font-heading text-sm font-bold text-white uppercase">АМРАЛТЫН ӨДРИЙН АНГИ</h4>
              <p className="mt-2 text-xs text-[#a0a0a5]">Бямба / Ням</p>
              <p className="mt-1 font-mono text-sm font-bold text-[#e31e24]">18:00 - 22:00</p>
            </div>
            <ArrowRight className="mt-4 size-5 text-[#e31e24]" />
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-[#e31e24]/40 bg-[#161412] p-6 shadow-xl">
            <div>
              <Users className="mb-3 size-8 text-[#e31e24]" />
              <h4 className="font-heading text-sm font-bold text-white uppercase">ТУСГАЙ ЦАГ ҮҮСГЭХ БОЛОМЖ</h4>
              <p className="mt-2 text-xs text-[#a0a0a5]">
                6+ суралцагчтай бол хүссэн цагт тусгай анги үүсгэнэ.
              </p>
            </div>
            <span className="mt-4 font-mono text-[10px] font-bold text-[#e31e24]">TRAIN PRACTICE PROGRESS</span>
          </div>
        </div>
      </ContentSection>

      {/* 06 - БҮРТГҮҮЛЭХ АЛХАМ */}
      <ContentSection id="steps" dark>
        <SectionTag n="06" label="БҮРТГҮҮЛЭХ АЛХАМ" />
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          ХӨНГӨН 5 АЛХАМ
        </h2>

        <div className="mt-8">
          <Stepper steps={steps} currentStep={3} />
        </div>
      </ContentSection>

      {/* 07 - ШААРДЛАГАТАЙ БАРИМТ БИЧИГ */}
      <ContentSection id="docs">
        <SectionTag n="07" label="ШААРДЛАГАТАЙ БАРИМТ БИЧИГ" />
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          БҮРДҮҮЛЭХ МАТЕРИАЛ
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {docRequirements.map((req) => (
            <div
              key={req.title}
              className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl"
            >
              <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#e31e24]">
                {req.title}
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs text-[#a0a0a5]">
                {req.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-[#e31e24] mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* 08 - БАГШ, ИНСТРУКТОРУУД */}
      <ContentSection id="instructors" dark>
        <SectionTag n="08" label="БАГШ, ИНСТРУКТОРУУД" />
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          МАНАЙ БАГ
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.map((ins) => (
            <div
              key={ins.name}
              className="overflow-hidden rounded-2xl border border-[#ffffff15] bg-[#121215] shadow-xl"
            >
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-[#1a1814] to-[#070707]">
                <LionIcon className="size-16 text-[#e31e24]/30" />
              </div>
              <div className="p-4">
                <h4 className="font-heading text-sm font-bold text-white">{ins.name}</h4>
                <p className="mt-1 text-xs font-semibold text-[#e31e24]">{ins.role}</p>
                <p className="mt-0.5 text-[10px] text-[#a0a0a5]">{ins.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* 09 - СУРГАЛТЫН БҮРТГЭЛ */}
      <ContentSection id="register">
        <SectionTag n="09" label="СУРГАЛТЫН БҮРТГЭЛ" />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Form */}
          <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl">
            <h3 className="font-heading text-lg font-bold uppercase text-white">Сургалтын бүртгэл</h3>
            <p className="mt-1 text-xs text-[#a0a0a5]">Өөрийн мэдээллээ оруулж бүртгүүлнэ үү.</p>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Овог, нэр *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Овог, нэр оруулах"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">И-мэйл *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@mail.com"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Гар утас *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9911-XXXX"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Course сонгох</label>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white outline-none focus:border-[#e31e24]"
                  >
                    <option value="Course 1">Course 1 (Анхан шат)</option>
                    <option value="Course 2">Course 2 (Анхан дунд)</option>
                    <option value="Junior">Junior хөтөлбөр</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Боломжит цаг</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white outline-none focus:border-[#e31e24]"
                  >
                    <option value="19:00 - 22:00">Ажлын өдөр (19:00-22:00)</option>
                    <option value="18:00 - 22:00">Амралтын өдөр (18:00-22:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a0a0a5]">Зурвас / Тайлбар</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Тайлбар бичнэ үү..."
                  className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                />
              </div>

              <RedButton onClick={() => handleFormSubmit} className="w-full">
                БҮРТГЭЛ ИЛГЭЭХ →
              </RedButton>
            </form>
          </div>

          {/* Payment & Contact Box */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#e31e24]/40 bg-[#161412] p-6 shadow-xl space-y-4">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-[#e31e24]">
                ХОЛБОО БАРИХ
              </h4>
              <ul className="space-y-3 text-xs text-[#a0a0a5]">
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-[#e31e24]" />
                  <span>registration@prime.mn</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 text-[#e31e24]" />
                  <span>9088-0200</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 text-[#e31e24]" />
                  <span>8611-0200</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl space-y-3">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                ТӨЛБӨРИЙН МЭДЭЭЛЭЛ
              </h4>
              <p className="text-xs text-[#a0a0a5]">
                Данс: <strong className="text-white">800065600 (Худалдаа хөгжлийн банк)</strong>
                <br />
                Дансны нэр: <strong className="text-white">Праим Буудлагын Академи</strong>
                <br />
                IBAN: <strong className="text-[#e31e24]">40000 4000 8000 96500</strong>
                <br />
                Гүйцэтгэх утга: <strong className="text-white">Утасны дугаар, course1 / course2</strong>
              </p>
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 10 - НЭМЭЛТ МЭДЭЭЛЭЛ */}
      <ContentSection id="discounts" dark>
        <SectionTag n="10" label="НЭМЭЛТ МЭДЭЭЛЭЛ" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl">
            <h4 className="font-heading text-xs font-bold uppercase text-[#e31e24]">Төлбөрийн буцаалт</h4>
            <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">
              24-48 цагийн өмнө мэдэгдсэн бол 10%, 24 цагийн дотор 20% торгуультай.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e31e24]/50 bg-[#181612] p-6 shadow-xl">
            <h4 className="font-heading text-xs font-bold uppercase text-[#e31e24]">2 шат хамт бүртгүүлбэл</h4>
            <p className="mt-1 font-mono text-2xl font-extrabold text-[#e31e24]">650,000₮</p>
            <p className="mt-1 text-[11px] text-[#a0a0a5]">(Course 1 + Course 2 combo)</p>
          </div>

          <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl">
            <h4 className="font-heading text-xs font-bold uppercase text-white">Жуниор урьдчилсан бүртгэл</h4>
            <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">
              Суудлын тоо хязгаартай. Урьдчилан анкет бөглөнө үү.
            </p>
          </div>
        </div>
      </ContentSection>

      {/* 11 - PRIME-ТАЙ ЭХЛҮҮЛ */}
      <ContentSection id="bottom-cta">
        <div className="relative overflow-hidden rounded-3xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24]">
                11 —— PRIME-ТАЙ ЭХЛҮҮЛ
              </p>
              <h2 className="mt-2 font-heading text-3xl font-extrabold uppercase text-white md:text-4xl">
                Мэргэжлийн, аюулгүй буудагч болох аяллаа PRIME-ТАЙ ЭХЛҮҮЛ.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <RedButton href="#register">БҮРТГҮҮЛЭХ →</RedButton>
              <OutlineButton href="/contact">ХОЛБОО БАРИХ →</OutlineButton>
            </div>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
