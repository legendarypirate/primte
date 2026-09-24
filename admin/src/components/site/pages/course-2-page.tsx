"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  FileCheck,
  FileText,
  Headphones,
  HelpCircle,
  Home,
  Info,
  Mail,
  Phone,
  Play,
  Shield,
  Target,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { ContentSection, LionIcon, OutlineButton, PageHero, RedButton, SectionTag } from "../primitives";

const faqs = [
  {
    q: "Course 2-д зөвхөн Course 1 төгссөн хүн хамрагдах уу?",
    a: "Тийм, эсвэл бусад төрлийн практик буудлагын туршлагатай болохыг шүүлгэж баталгаажуулсан тохиолдолд шууд орох боломжтой.",
  },
  {
    q: "Өөрийн хэрэгсэлгүй бол хамрагдах боломжтой юу?",
    a: "Боломжтой, гэхдээ Course 2-т өөрийн airsoft хэрэгсэлтэй байхыг илүү зөвлөдөг. Клубээс шаардлагатай тоноглолоор хангаж болно.",
  },
  {
    q: "Сургалтын сертификат олгодог уу?",
    a: "Төгсөлтийн дараа МПБХ болон PRIME клубын баталгаажуулалттай сертификат олгоно.",
  },
  {
    q: "Төлбөрийн буцаалт хэрхэн явагдах вэ?",
    a: "Сургалт эхлэхээс 24-48 цагийн өмнө мэдэгдсэн тохиолдолд 10%, 24 цагаас доош хугацаанд 20%-ийн суутгалтайгаар буцаан олгогдоно.",
  },
];

export function Course2Page() {
  const [formData, setFormData] = useState({
    name: "",
    classType: "Ээлжит 2-р шат",
    certNo: "",
    gender: "male",
    hand: "right",
    medical: "",
    email: "",
    phone: "",
    schedule: "Ажлын өдрийн анги (Дав, Лха, Баа 19:00-22:00)",
    gearModel: "",
    magsCount: "3-4 дойз",
    hasOwnGun: "yes",
    purpose: "",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Шаардлагатай талбаруудыг бөглөнө үү.");
      return;
    }
    toast.success("Course 2 сургалтын бүртгэл амжилттай илгээгдлээ!");
  };

  return (
    <>
      {/* 01 - HERO HEADER */}
      <section className="relative overflow-hidden border-b border-[#ffffff15] bg-[#070707] py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24]">
                TRAIN. COMPETE. BELONG.
              </p>
              <h1 className="mt-3 font-heading text-4xl font-extrabold uppercase leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
                COURSE 2
              </h1>
              <h2 className="mt-2 font-heading text-xl font-bold uppercase text-[#e31e24] md:text-2xl">
                ГИШҮҮНЧЛЭЛИЙН АНХАН ДУНД ШАТНЫ СУРГАЛТ
              </h2>
              <p className="mt-4 max-w-xl text-xs leading-relaxed text-[#a0a0a5]">
                Анхан шатны мэдлэгээ баталгаажуулж, илүү нарийн техник, тактик, хөдөлгөөн, дасгалын гүйцэтгэлийг эзэмшихэд зориулагдсан дунд шатны сургалт юм.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <RedButton href="#register">
                  БҮРТГҮҮЛЭХ <ArrowRight className="size-4" />
                </RedButton>
                <OutlineButton href="#video">
                  <Play className="size-3.5 fill-current text-[#e31e24]" />
                  <span>Сургалтын тухай видео үзэх</span>
                </OutlineButton>
              </div>
            </div>

            {/* Quote Graphic Card */}
            <div className="relative overflow-hidden rounded-2xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 text-right shadow-2xl">
              <LionIcon className="absolute top-4 left-4 size-24 text-[#e31e24]/15" />
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24]">
                IPSC ACTION AIR
              </p>
              <h3 className="mt-2 font-heading text-2xl font-extrabold uppercase text-white">
                DISCIPLINE CREATES FREEDOM
              </h3>
              <p className="mt-4 font-serif text-base italic text-[#e31e24]">
                "Ур чадвар, тактикаа дараагийн түвшинд ахиул."
              </p>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-xl border border-[#ffffff15] bg-[#121215] p-4">
              <Clock className="size-5 text-[#e31e24]" />
              <div>
                <p className="text-[10px] uppercase text-[#a0a0a5]">Сургалтын хугацаа</p>
                <p className="text-xs font-bold text-white">3-9 долоо хоног</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[#ffffff15] bg-[#121215] p-4">
              <Users className="size-5 text-[#e31e24]" />
              <div>
                <p className="text-[10px] uppercase text-[#a0a0a5]">Анги дүүргэлт</p>
                <p className="text-xs font-bold text-white">4-6 суралцагч</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[#ffffff15] bg-[#121215] p-4">
              <Shield className="size-5 text-[#e31e24]" />
              <div>
                <p className="text-[10px] uppercase text-[#a0a0a5]">Багш инструктор</p>
                <p className="text-xs font-bold text-white">МПБХ-ны багш</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-[#e31e24]/40 bg-[#181612] p-4">
              <CreditCard className="size-5 text-[#e31e24]" />
              <div>
                <p className="text-[10px] uppercase text-[#a0a0a5]">Клубын гишүүн болох</p>
                <p className="font-mono text-sm font-extrabold text-[#e31e24]">Эрх нээгдэнэ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <div className="border-b border-[#ffffff10] bg-[#09090b] py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-xs text-[#a0a0a5] md:px-6">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="size-3.5" /> Нүүр
          </Link>
          <span>/</span>
          <Link href="/training" className="hover:text-white">
            Сургалт
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#e31e24]">Гишүүнчлэлийн анхан дунд шатны сургалт [Course 2]</span>
        </div>
      </div>

      {/* MAIN CONTENT + RIGHT STICKY FORM */}
      <ContentSection id="main">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-10">
            {/* Overview & Video Thumbnail */}
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e31e24]">
                IPSC ACTION AIR
              </span>
              <h2 className="mt-1 font-heading text-2xl font-extrabold uppercase text-white">
                COURSE 2: Гишүүнчлэлийн анхан дунд шатны сургалт
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-[#a0a0a5]">
                Энэхүү сургалт нь практик буудлагын спорт Action Air гар бууны төрлөөр анхан шатны мэдлэгээ баталгаажуулж, илүү нарийн техник, тактик, хөдөлгөөн, дасгалын гүйцэтгэлийг эзэмшихэд зориулагдсан дунд шатны сургалт юм.
              </p>

              {/* Video Preview Box */}
              <div id="video" className="mt-6 overflow-hidden rounded-2xl border border-[#ffffff15] bg-[#121215] shadow-xl">
                <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707]">
                  <button
                    type="button"
                    onClick={() => toast.info("Видео тоглуулж байна...")}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="flex size-14 items-center justify-center rounded-full bg-[#e31e24] text-white shadow-lg shadow-[#e31e24]/40 transition-transform group-hover:scale-110">
                      <Play className="size-6 fill-current ml-0.5" />
                    </div>
                    <span className="text-xs font-bold text-white">Сургалтын танилцуулга видео</span>
                    <span className="font-mono text-[10px] text-[#e31e24]">02:50</span>
                  </button>
                </div>
              </div>

              {/* 4 Highlight Badges */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Target, text: "Техник" },
                  { icon: Shield, text: "Хөдөлгөөн" },
                  { icon: FileText, text: "Тактик" },
                  { icon: CheckCircle2, text: "Практик дадлага" },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-xl border border-[#ffffff15] bg-[#121215] p-3 text-center"
                  >
                    <b.icon className="mb-2 size-5 text-[#e31e24]" />
                    <span className="text-xs font-bold text-white">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* СУРГАЛТЫН ЕРӨНХИЙ МЭДЭЭЛЭЛ */}
            <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#e31e24]">
                СУРГАЛТЫН ЕРӨНХИЙ МЭДЭЭЛЭЛ
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 text-xs text-[#a0a0a5]">
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <span>Сургалтын төрөл</span>
                  <strong className="text-white">IPSC Action Air Handgun</strong>
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <span>Хамрах хүрээ</span>
                  <strong className="text-white">Course 1 төгссөн / Суурьтай</strong>
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <span>Нийт хугацаа</span>
                  <strong className="text-white">3 өдөр (9 цаг) / 2 өдөр (8 цаг)</strong>
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <span>Анги дүүргэлт</span>
                  <strong className="text-white">4-6 суралцагч</strong>
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <span>Сургагч багш</span>
                  <strong className="text-white">МПБХ-ны инструктор</strong>
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <span>Сургалтын төлбөр</span>
                  <strong className="font-mono font-bold text-[#e31e24]">370,000₮</strong>
                </div>
              </div>
            </div>

            {/* ХИЧЭЭЛИЙН ХУВААРЬ */}
            <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                ХИЧЭЭЛИЙН ХУВААРЬ
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#ffffff10] bg-[#0c0c0e] p-4 text-xs space-y-2">
                  <h4 className="font-bold text-[#e31e24]">3 өдрийн анги (9 цаг)</h4>
                  <p className="text-[#a0a0a5]">Нэг удаагийн оролт: <strong>3 цаг</strong></p>
                  <p className="text-[#a0a0a5]">Сургалтын өдөр: <strong>3 өдөр</strong></p>
                  <p className="text-[#a0a0a5]">Үндсэн өдрүүд: <strong>Даваа, Лхагва, Баасан</strong></p>
                  <p className="text-[#a0a0a5]">Үндсэн цагууд: <strong>19:00 - 22:00</strong></p>
                  <p className="text-[#a0a0a5]">Нийт цаг: <strong className="text-white">9 цаг</strong></p>
                </div>

                <div className="rounded-xl border border-[#ffffff10] bg-[#0c0c0e] p-4 text-xs space-y-2">
                  <h4 className="font-bold text-[#e31e24]">2 өдрийн анги (8 цаг)</h4>
                  <p className="text-[#a0a0a5]">Нэг удаагийн оролт: <strong>4 цаг</strong></p>
                  <p className="text-[#a0a0a5]">Сургалтын өдөр: <strong>2 өдөр</strong></p>
                  <p className="text-[#a0a0a5]">Үндсэн өдрүүд: <strong>Бямба, Ням</strong></p>
                  <p className="text-[#a0a0a5]">Үндсэн цагууд: <strong>18:00 - 22:00</strong></p>
                  <p className="text-[#a0a0a5]">Нийт цаг: <strong className="text-white">8 цаг</strong></p>
                </div>
              </div>
            </div>

            {/* БҮРДҮҮЛЭХ МАТЕРИАЛ */}
            <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#e31e24]">
                БҮРДҮҮЛЭХ МАТЕРИАЛ
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  "Гишүүнчлэлийн анкет (Сургалтын үед бөглөнө)",
                  "Цээж зураг тодорхойлолтын хамт",
                  "А-33 маягтын тодорхойлолт",
                ].map((mat, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl border border-[#ffffff10] bg-[#0c0c0e] p-3 text-xs text-[#a0a0a5]">
                    <FileCheck className="size-4 shrink-0 text-[#e31e24] mt-0.5" />
                    <span>{mat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ТӨЛБӨРИЙН МЭДЭЭЛЭЛ */}
            <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                ТӨЛБӨРИЙН МЭДЭЭЛЭЛ
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-xl border border-[#e31e24]/30 bg-[#161412] p-4 space-y-1 text-[#a0a0a5]">
                  <p>Данс: <strong className="text-white">800065600</strong></p>
                  <p>Дансны нэр: <strong className="text-white">Праим Буудлагын Академи</strong></p>
                  <p>IBAN: <strong className="text-[#e31e24]">40000 4000 8000 96500</strong></p>
                  <p>Гүйцэтгэх утга: <strong className="text-white">Утасны дугаар, course2</strong></p>
                </div>
                <div className="rounded-xl border border-[#ffffff10] bg-[#0c0c0e] p-4 space-y-2 text-[#a0a0a5]">
                  <h4 className="font-bold text-[#e31e24]">Төлбөрийн буцаалт (торгууль)</h4>
                  <p>• 24-48 цагийн өмнө мэдэгдсэн бол: <strong className="text-white">10%</strong></p>
                  <p>• 24 цагийн дотор мэдэгдсэн бол: <strong className="text-white">20%</strong></p>
                </div>
              </div>
            </div>

            {/* СУРГАЛТЫГ ТӨГССӨНӨӨР */}
            <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#e31e24]">
                СУРГАЛТЫГ ТӨГССӨНӨӨР
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 text-xs text-white font-semibold">
                <div className="flex items-center gap-2 rounded-xl border border-[#ffffff10] bg-[#0c0c0e] p-3">
                  <CheckCircle2 className="size-4 text-[#e31e24]" />
                  <span>Клубын суралцагч гишүүн болох</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#ffffff10] bg-[#0c0c0e] p-3">
                  <CheckCircle2 className="size-4 text-[#e31e24]" />
                  <span>Тэмцээнд хамрагдах өрсөлдөх эрх</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#ffffff10] bg-[#0c0c0e] p-3">
                  <CheckCircle2 className="size-4 text-[#e31e24]" />
                  <span>Бэлтгэл, дасгалд чөлөөтэй оролцох</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#ffffff10] bg-[#0c0c0e] p-3">
                  <CheckCircle2 className="size-4 text-[#e31e24]" />
                  <span>Чадварын шинэ төвшинд хүрэх</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT STICKY REGISTRATION FORM */}
          <div id="register" className="sticky top-24 rounded-2xl border border-[#e31e24]/50 bg-[#121215] p-6 shadow-2xl">
            <h3 className="font-heading text-base font-bold uppercase tracking-wider text-white">
              СУРГАЛТЫН БҮРТГЭЛ (Course 2)
            </h3>

            {/* 3 Step Indicator Header */}
            <div className="mt-4 flex items-center justify-between border-b border-[#ffffff15] pb-3 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-[#e31e24]">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#e31e24] text-[10px] text-white">1</span>
                <span>Мэдээлэл</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#a0a0a5]">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#1b1b20] text-[10px]">2</span>
                <span>Баталгаажуулалт</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#a0a0a5]">
                <span className="flex size-5 items-center justify-center rounded-full bg-[#1b1b20] text-[10px]">3</span>
                <span>Амжилттай</span>
              </span>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#a0a0a5]">Овог, нэр *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Жишээ: Батборгил"
                  className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Бүртгүүлж буй анги *</label>
                  <select
                    value={formData.classType}
                    onChange={(e) => setFormData({ ...formData, classType: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white outline-none focus:border-[#e31e24]"
                  >
                    <option value="Ээлжит 2-р шат">Ээлжит 2-р шат</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Гэрчилгээний дугаар *</label>
                  <input
                    type="text"
                    required
                    value={formData.certNo}
                    onChange={(e) => setFormData({ ...formData, certNo: e.target.value })}
                    placeholder="Course1 - C1-XXXX"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Хүйс *</label>
                  <div className="mt-1 flex gap-3 text-xs text-white">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="c2gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={() => setFormData({ ...formData, gender: "male" })}
                        className="accent-[#e31e24]"
                      />
                      <span>Эр</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="c2gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={() => setFormData({ ...formData, gender: "female" })}
                        className="accent-[#e31e24]"
                      />
                      <span>Эм</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Хүчтэй гарын байрлал *</label>
                  <div className="mt-1 flex gap-3 text-xs text-white">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="c2hand"
                        value="right"
                        checked={formData.hand === "right"}
                        onChange={() => setFormData({ ...formData, hand: "right" })}
                        className="accent-[#e31e24]"
                      />
                      <span>Баруун</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="c2hand"
                        value="left"
                        checked={formData.hand === "left"}
                        onChange={() => setFormData({ ...formData, hand: "left" })}
                        className="accent-[#e31e24]"
                      />
                      <span>Солой</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a0a0a5]">Ямар нэгэн суурь өвчин, харшилтай эсэх</label>
                <input
                  type="text"
                  value={formData.medical}
                  onChange={(e) => setFormData({ ...formData, medical: e.target.value })}
                  placeholder="Харшилгүй..."
                  className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">И-мэйл хаяг *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@email.com"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Гар утасны дугаар *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9911-2233"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a0a0a5]">Өөрийн эйрсофт хэрэгслийн марк, модель *</label>
                <input
                  type="text"
                  required
                  value={formData.gearModel}
                  onChange={(e) => setFormData({ ...formData, gearModel: e.target.value })}
                  placeholder="Жишээ: WE Glock 17 Gen 5"
                  className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Нийт дойзны тоо *</label>
                  <select
                    value={formData.magsCount}
                    onChange={(e) => setFormData({ ...formData, magsCount: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white outline-none focus:border-[#e31e24]"
                  >
                    <option value="1-2 дойз">1-2 дойз</option>
                    <option value="3-4 дойз">3-4 дойз</option>
                    <option value="5+ дойз">5+ дойз</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#a0a0a5]">Хувийн буутай эсэх *</label>
                  <div className="mt-1 flex gap-3 text-xs text-white">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="ownGun"
                        value="yes"
                        checked={formData.hasOwnGun === "yes"}
                        onChange={() => setFormData({ ...formData, hasOwnGun: "yes" })}
                        className="accent-[#e31e24]"
                      />
                      <span>Тийм</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="ownGun"
                        value="no"
                        checked={formData.hasOwnGun === "no"}
                        onChange={() => setFormData({ ...formData, hasOwnGun: "no" })}
                        className="accent-[#e31e24]"
                      />
                      <span>Үгүй</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#a0a0a5]">Сургалтад хамрагдах зорилго *</label>
                <textarea
                  rows={2}
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="Бүртгэлийн зорилго..."
                  className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#e31e24] text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#c91920]"
              >
                <span>БҮРТГҮҮЛЭХ</span>
                <ArrowRight className="size-4" />
              </button>

              <p className="mt-2 text-center text-[10px] text-[#a0a0a5]">
                🔒 Таны мэдээлэл хамгаалагдсан болно.
              </p>
            </form>
          </div>
        </div>
      </ContentSection>

      {/* SPECIAL OFFER BANNER */}
      <ContentSection id="offer" dark>
        <div className="relative overflow-hidden rounded-3xl border border-[#e31e24]/50 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24]">
                SPECIAL OFFER ——
              </p>
              <h2 className="mt-1 font-heading text-2xl font-extrabold uppercase text-white md:text-3xl">
                Course 1 + Course 2 хамт бүртгүүлбэл <span className="text-[#e31e24]">650,000₮</span>
              </h2>
            </div>
            <RedButton href="#register">
              ХАМТ БҮРТГҮҮЛЭХ →
            </RedButton>
          </div>
        </div>
      </ContentSection>

      {/* FAQ SECTION */}
      <ContentSection id="faq">
        <SectionTag n="FAQ" label="ТҮГЭЭМЭЛ АСУУЛТ" />
        <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
          ТҮГЭЭМЭЛ АСУУЛТ
        </h2>

        <div className="mt-8 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#ffffff15] bg-[#121215] shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-xs font-bold text-white transition hover:text-[#e31e24]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`size-4 text-[#e31e24] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-[#ffffff10] p-5 text-xs leading-relaxed text-[#a0a0a5] bg-[#0c0c0e]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need Help Card */}
        <div className="mt-10 rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 text-center space-y-3">
          <Headphones className="mx-auto size-8 text-[#e31e24]" />
          <h4 className="font-heading text-sm font-bold uppercase text-white">НЭМЭЛТ АСУУЛТ БАЙНА УУ?</h4>
          <p className="text-xs text-[#a0a0a5]">Бидэнтэй холбогдон уу.</p>
          <div className="flex flex-wrap justify-center gap-6 pt-2 text-xs font-mono font-bold text-white">
            <span className="flex items-center gap-2"><Phone className="size-4 text-[#e31e24]" /> 9088-0200</span>
            <span className="flex items-center gap-2"><Mail className="size-4 text-[#e31e24]" /> registration@prime.mn</span>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
