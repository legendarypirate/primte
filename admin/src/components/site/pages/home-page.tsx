"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crosshair,
  Eye,
  FileText,
  PackageCheck,
  Shield,
  ShieldAlert,
  ShoppingCart,
  Target,
  Trophy,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { EditableBackground } from "@/components/site/editable-background";
import { ContentSection, LionIcon, OutlineButton, PageHero, RedButton, SectionTag } from "../primitives";

const safetyRules = [
  { n: "01", title: "Зэвсгийг үргэлж аюулгүй чиглэлд барина.", body: "Буудлага хийгээгүй үед ч бууны хошуу үргэлж аюулгүй чиглэлд заагдсан байна." },
  { n: "02", title: "Сүмтүй эсэхийг үргэлж шалгана.", body: "Зэвсгийг гартаа авах бүрт хөг, замаг шалгаж аюулгүй байдлыг хангах ёстой." },
  { n: "03", title: "Триггер дээр хуруугаа байршуулахгүй.", body: "Зорилтонд буудах бэлэн болоогүй тохиолдолд хурууг спускээс гадуур барина." },
  { n: "04", title: "Зорилтоо болон түүний цаад орчныг танина.", body: "Зорилтонд буудахын өмнө зорилт ба түүний арын орчныг бүрэн шалгана." },
];

const featureCards = [
  {
    icon: Target,
    title: "Зэвсгийн ангилал",
    body: "IPSC Action Air-д зөвхөн S.A. зөвшөөрөгдсөн airsoft зэвсэг ашиглана.",
    href: "/about",
  },
  {
    icon: Crosshair,
    title: "Дасгалын зохиомж",
    body: "Хөдөлгөөн, байрлал, оновч дараалал бүхий бодит нөхцөлтэй дасгалууд.",
    href: "/training",
  },
  {
    icon: BarChart3,
    title: "Тэмцээний түвшин",
    body: "Орон нутгаас олон улсын түвшний тэмцээнүүд.",
    href: "/ranking",
  },
  {
    icon: XCircle,
    title: "Тэмцээнээс хасах (DQ)",
    body: "Аюулгүй ажиллагааны зөрчил, дүрэм зөрчсөн тохиолдолд тэмцээнээс хасна.",
    href: "/about",
  },
];

const levels = [
  { n: "1", title: "Level I", label: "Клубын ТҮВШИН" },
  { n: "2", title: "Level II", label: "Бүсийн ТҮВШИН" },
  { n: "3", title: "Level III", label: "Үндэсний ТҮВШИН" },
  { n: "4", title: "Level IV", label: "Олон улсын ТҮВШИН" },
  { n: "5", title: "Level V", label: "Дэлхийн аварга шалгаруулах ТҮВШИН" },
];

const courses = [
  {
    id: "course-1",
    title: "COURSE 1",
    subtitle: "Гишүүнчлэлийн сургалт",
    duration: "2 өдөр",
    audience: "Анхан шат",
    details: "Аюулгүй ажиллагаа, үндсэн техник, IPSC суурь мэдлэг",
    price: "350,000₮",
    href: "/training/course-1",
  },
  {
    id: "course-2",
    title: "COURSE 2",
    subtitle: "Гишүүнчлэлийн сургалт",
    duration: "2 өдөр",
    audience: "Анхан шат (C1 төгссөн)",
    details: "Дээд техник, стратеги, тэмцээний бэлтгэл",
    price: "350,000₮",
    href: "/training/course-2",
  },
  {
    id: "junior",
    title: "Junior хөтөлбөр",
    subtitle: "Жуниор хөтөлбөр",
    duration: "4 долоо хоног",
    audience: "12-17 нас",
    details: "Аюулгүй байдал, оновчтой ур чадвар, зөв дадал",
    price: "250,000₮",
    href: "/training",
  },
];

const products = [
  {
    name: "Cytac Universal Holster",
    sub: "Холстер (Universal)",
    price: "120,000₮",
  },
  {
    name: "Double Alpha Shooting Belt",
    sub: "Тактикийн бүс",
    price: "180,000₮",
  },
  {
    name: "DAA Magazine Pouch",
    sub: "Сумны цүнх",
    price: "95,000₮",
  },
  {
    name: "ESS Crossbow (Clear)",
    sub: "Хамгаалалтын шил",
    price: "160,000₮",
  },
];

const newsItems = [
  {
    date: "2024.10.20",
    title: "PRIME клубийн намрын тэмцээн амжилттай боллоо",
    desc: "50+ тамирчин оролцсон клубын аварга шалгаруулах тэмцээн өндөрлөлөө.",
  },
  {
    date: "2024.09.14",
    title: "IPSC Action Air сургалт амжилттай зохион байгууллаа",
    desc: "Шинэ гишүүдийн ээлжит сургалт амжилттай дууслаа.",
  },
  {
    date: "2024.08.03",
    title: "Жуниор хөтөлбөрийн шинэ элсэлт эхэллээ",
    desc: "12-17 насны сурагчдад зориулсан тусгай хөтөлбөр.",
  },
];

export function HomePage() {
  const [cart, setCart] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "Course 1",
    time: "19:00 - 22:00",
    notes: "",
  });

  const handleAddToCart = (productName: string) => {
    setCart((prev) => [...prev, productName]);
    toast.success(`${productName} сагсанд нэмэгдлээ!`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error("Нэр болон утасны дугаараа оруулна уу.");
      return;
    }
    toast.success("Таны бүртгэлийн хүсэлт амжилттай илгээгдлээ!");
    setFormData({ name: "", email: "", phone: "", course: "Course 1", time: "19:00 - 22:00", notes: "" });
  };

  return (
    <>
      {/* 01 - HERO / ТАНИЛЦУУЛГА */}
      <PageHero
        eyebrow="01 —— ТАНИЛЦУУЛГА"
        titleText={"ИЛҮҮ САЙН ХҮН\nИЛҮҮ АЮУЛГҮЙ НИЙГЭМ"}
        renderTitle={(text) => {
          const [line1, line2 = ""] = text.split("\n");
          return (
            <>
              {line1}
              {line2 ? (
                <>
                  <br />
                  <span className="text-[#e31e24]">{line2.replace(" НИЙГЭМ", "").trim()}</span>
                  {line2.includes("НИЙГЭМ") ? " НИЙГЭМ" : null}
                </>
              ) : null}
            </>
          );
        }}
        description="PRIME IPSC Club нь практик буудлагын спортыг Монголд хөгжүүлэх, аюулгүй, хариуцлагатай, мэргэжлийн соёл түгээх зорилготой клуб юм."
        aside={
          <div className="space-y-4">
            {/* IPSC Info Box */}
            <EditableBackground
              field="hero.aside.ipscImageUrl"
              className="rounded-2xl border border-[#e31e24]/40 p-6 shadow-2xl shadow-black/80"
              fallbackClassName="bg-gradient-to-br from-[#181612] via-[#101012] to-[#08080a]"
              editMode="corner"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e31e24] bg-[#e31e24]/10 text-[#e31e24]">
                  <LionIcon className="size-7" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">IPSC гэж юу вэ?</h3>
                  <p className="text-[10px] uppercase tracking-widest text-[#e31e24]">
                    International Practical Shooting Confederation
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#a0a0a5]">
                IPSC (International Practical Shooting Confederation) нь бодит нөхцөлд ойр, хөдөлгөөнтэй, хурд, хүч, нарийвчлалыг хослуулсан практик буудлагын олон улсын спорт юм. Дэлхийн 100+ оронд түгсэн, аюулгүй байдал, сахилга бат, техник ур чадварыг хөгжүүлдэг.
              </p>
              <Link
                href="/about"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#e31e24] hover:underline"
              >
                <span>Илүү ихийг мэдэх</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </EditableBackground>

            {/* Tactical Banner Quote */}
            <EditableBackground
              field="hero.aside.quoteImageUrl"
              className="rounded-2xl border border-[#ffffff10] p-6 text-right shadow-xl"
              fallbackClassName="bg-[#121215]"
              editMode="corner"
            >
              <div className="absolute top-0 right-0 size-32 bg-[radial-gradient(circle_at_100%_0%,#e31e2420,transparent_70%)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#e31e24]">
                PRIME IPSC ACTION AIR
              </p>
              <blockquote className="mt-2 text-xs italic leading-relaxed text-white">
                "Хурд бол ур чадвар. Нарийвчлал бол хариуцлага. Харин аюулгүй байдал бол бүхний үндэс."
              </blockquote>
            </EditableBackground>
          </div>
        }
      >
        <RedButton href="/about">
          IPSC гэж юу вэ?
          <ArrowRight className="size-4" />
        </RedButton>
        <OutlineButton href="/training">IPSC Action Air</OutlineButton>
      </PageHero>

      {/* 02 - СПОРТЫН ДҮРЭМ (SAFETY FIRST) */}
      <ContentSection id="safety" dark>
        <SectionTag n="02" label="СПОРТЫН ДҮРЭМ" />
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
            4 ҮНДСЭН АЮУЛГҮЙ АЖИЛЛАГААНЫ ДҮРЭМ
          </h2>
          <p className="text-xs uppercase tracking-widest text-[#e31e24]">SAFETY FIRST</p>
          <p className="text-sm text-muted-foreground">
            Аюулгүй байдал бол спортын үндэс. Үргэлж санаа, үргэлж мөрдөн.
          </p>
        </div>

        {/* 4 Safety Rules Cards Horizontal Row */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {safetyRules.map((rule, idx) => (
            <EditableBackground
              key={rule.n}
              field={`safety.rules.${idx}.imageUrl`}
              className="rounded-xl border border-[#ffffff15] p-5 shadow-lg transition-all hover:border-[#e31e24]/60"
              fallbackClassName="bg-[#101014]"
              editMode="corner"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg border border-[#e31e24]/40 bg-[#e31e24]/10 font-mono text-sm font-bold text-[#e31e24]">
                  {rule.n}
                </span>
                <Shield className="size-4 text-[#e31e24]/40" />
              </div>
              <h4 className="text-xs font-bold text-white">{rule.title}</h4>
              <p className="relative z-10 mt-2 text-[11px] leading-relaxed text-[#a0a0a5]">{rule.body}</p>
            </EditableBackground>
          ))}
        </div>

        {/* 4 Feature Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map(({ icon: Icon, title, body, href }, idx) => (
            <EditableBackground
              key={title}
              field={`safety.features.${idx}.imageUrl`}
              className="flex flex-col justify-between rounded-xl border border-[#ffffff10] p-5 transition-all hover:border-[#e31e24]/50"
              fallbackClassName="bg-[#121215]"
              editMode="corner"
            >
              <div>
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/30 bg-[#e31e24]/10 text-[#e31e24]">
                  <Icon className="size-5" />
                </div>
                <h4 className="font-heading text-sm font-bold text-white">{title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">{body}</p>
              </div>
              <Link
                href={href}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#e31e24] hover:text-white"
              >
                <span>Дэлгэрэнгүй</span>
                <ArrowRight className="size-3" />
              </Link>
            </EditableBackground>
          ))}
        </div>

        {/* Stepper horizontal bar: ТЭМЦЭЭНИЙ 5 ТҮВШИН */}
        <div className="mt-12 rounded-2xl border border-[#ffffff10] bg-[#0c0c0e] p-6">
          <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <h3 className="font-heading text-base font-bold text-white uppercase tracking-wider">
              ТЭМЦЭЭНИЙ 5 ТҮВШИН
            </h3>
            <p className="text-xs text-[#a0a0a5]">Олон улсын стандартын дагуу үнэлэгддэг</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {levels.map((lvl) => (
              <div
                key={lvl.n}
                className="flex items-center gap-3 rounded-xl border border-[#ffffff10] bg-[#141418] p-3 transition-colors hover:border-[#e31e24]/50"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e31e24] bg-[#e31e24]/20 font-mono text-xs font-bold text-[#e31e24]">
                  {lvl.n}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{lvl.title}</p>
                  <p className="text-[10px] text-[#a0a0a5]">{lvl.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      {/* 03 - СУРГАЛТ */}
      <ContentSection id="training">
        <SectionTag n="03" label="СУРГАЛТ" />
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
            ИЛҮҮ ИХ УР ЧАДВАР, ИЛҮҮ ИХ БОЛОМЖ
          </h2>
          <p className="text-sm text-muted-foreground">
            Онол, дадлага, аюулгүй ажиллагаа хосолсон мэргэжлийн сургалтын хөтөлбөр.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          {/* 3 Course Cards */}
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {courses.map((c, idx) => (
              <EditableBackground
                key={c.id}
                field={`training.courses.${idx}.imageUrl`}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#ffffff15] p-5 shadow-xl transition-all hover:border-[#e31e24]/60"
                fallbackClassName="bg-[#101014]"
                editMode="corner"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#e31e24]">
                      {c.title}
                    </span>
                  </div>
                  <h4 className="font-heading text-sm font-bold text-white">{c.subtitle}</h4>

                  <ul className="mt-4 space-y-2 text-xs text-[#a0a0a5]">
                    <li className="flex items-center gap-2">
                      <Clock className="size-3.5 text-[#e31e24]" />
                      <span>Хугацаа: {c.duration}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="size-3.5 text-[#e31e24]" />
                      <span>Хамрах хүрээ: {c.audience}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#e31e24] mt-0.5" />
                      <span className="text-[11px] leading-tight">{c.details}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 border-t border-[#ffffff10] pt-4">
                  <p className="text-xs text-[#a0a0a5]">Үнэ</p>
                  <p className="font-mono text-xl font-extrabold text-[#e31e24]">{c.price}</p>
                  <Link
                    href={c.href}
                    className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#e31e24] text-xs font-bold text-white transition hover:bg-[#c91920]"
                  >
                    <span>Бүртгүүлэх</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </EditableBackground>
            ))}
          </div>

          {/* Quick Registration Form */}
          <div className="rounded-2xl border border-[#e31e24]/40 bg-[#121215] p-6 shadow-2xl">
            <h3 className="font-heading text-base font-bold uppercase tracking-wider text-white">
              СУРГАЛТЫН БҮРТГЭЛ
            </h3>
            <p className="mt-1 text-xs text-[#a0a0a5]">Доорх формоор бүртгэлээ илгээнэ үү</p>

            <form onSubmit={handleFormSubmit} className="mt-5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#a0a0a5]">Овог, нэр *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Овог, нэр оруулах"
                  className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#a0a0a5]">И-мэйл *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#a0a0a5]">Гар утас *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9911-XXXX"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-semibold text-[#a0a0a5]">Сургалтын төрөл</label>
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
                  <label className="block text-[11px] font-semibold text-[#a0a0a5]">Боломжит цаг</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white outline-none focus:border-[#e31e24]"
                  >
                    <option value="19:00 - 22:00">Ажлын өдөр (19:00 - 22:00)</option>
                    <option value="18:00 - 22:00">Амралтын өдөр (18:00 - 22:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#a0a0a5]">Зурвас / Тайлбар</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Асуулт, тэмдэглэл байвал энд бичнэ үү..."
                  className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                />
              </div>

              <button
                type="submit"
                className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#e31e24] text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#c91920]"
              >
                <span>Бүртгэл илгээх</span>
                <ArrowRight className="size-4" />
              </button>

              <p className="mt-2 text-center text-[10px] text-[#a0a0a5]">
                Бид тантай 1 ажлын өдрийн дотор холбогдоно.
              </p>
            </form>
          </div>
        </div>
      </ContentSection>

      {/* 04 - ДЭЛГҮҮР */}
      <ContentSection id="shop" dark>
        <SectionTag n="04" label="ДЭЛГҮҮР" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
              МЭРГЭЖЛИЙН ТОНОГ ТӨХӨӨРӨМЖ
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Илүү сайн үр дүнд хүрэхэд зэвсэг тоног төхөөрөмж чухал.
            </p>
          </div>
          <OutlineButton href="/contact">Бүх бүтээгдэхүүн →</OutlineButton>
        </div>

        {/* 4 Shop Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, idx) => (
            <div
              key={p.name}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#ffffff15] bg-[#121215] p-5 shadow-xl transition-all hover:border-[#e31e24]/50 hover:bg-[#18181d]"
            >
              <div>
                <EditableBackground
                  field={`shop.products.${idx}.imageUrl`}
                  className="mb-4 flex h-36 items-center justify-center rounded-xl border border-[#ffffff10] p-4 transition-transform group-hover:scale-105"
                  fallbackClassName="bg-[#0a0a0c]"
                  editMode="cover"
                >
                  <ShoppingCart className="relative z-10 size-10 text-[#e31e24]/60" />
                </EditableBackground>
                <h4 className="font-heading text-sm font-bold text-white">{p.name}</h4>
                <p className="mt-1 text-xs text-[#a0a0a5]">{p.sub}</p>
              </div>

              <div className="mt-4 border-t border-[#ffffff10] pt-4 flex items-center justify-between">
                <span className="font-mono text-base font-extrabold text-[#e31e24]">{p.price}</span>
                <button
                  type="button"
                  onClick={() => handleAddToCart(p.name)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#ffffff20] bg-[#1b1b20] px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[#e31e24] hover:bg-[#e31e24]"
                >
                  <ShoppingCart className="size-3.5" />
                  <span>Сагсанд нэмэх</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </ContentSection>

      {/* 05 - ГИШҮҮНЧЛЭЛ */}
      <ContentSection id="membership">
        <SectionTag n="05" label="ГИШҮҮНЧЛЭЛ" />
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
            НЭГ ДЭЭР ИЛҮҮ ХҮЧТЭЙ
          </h2>
          <p className="text-sm text-muted-foreground">
            PRIME IPSC Club-ийн гишүүн болж, тогтмол сургалт, тэмцээн, нийгэмлэгийн үйл ажиллагаанд оролцоорой.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Adult Membership */}
          <div className="rounded-2xl border border-[#e31e24]/50 bg-[#121215] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-white uppercase">Насанд хүрэгчид</span>
              <span className="rounded bg-[#e31e24]/20 px-2 py-0.5 text-[10px] font-bold text-[#e31e24]">
                ҮНДСЭН
              </span>
            </div>
            <p className="mt-4 font-mono text-2xl font-extrabold text-[#e31e24]">
              250,000₮ <span className="text-xs font-normal text-muted-foreground">/ жил</span>
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-[#a0a0a5]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#e31e24]" />
                <span>Клубын бүх үйл ажиллагаанд хамрагдах</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#e31e24]" />
                <span>Тогтмол дасгал, тэмцээнд оролцох</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#e31e24]" />
                <span>Давуу сургалтын хөнгөлөлт</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[#e31e24]" />
                <span>Клубын өмсгөл ашиглах</span>
              </li>
            </ul>
          </div>

          {/* Junior Membership */}
          <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-heading text-sm font-bold text-white uppercase">Жуниор гишүүнчлэл</span>
              <span className="rounded bg-[#e31e24]/20 px-2 py-0.5 text-[10px] font-bold text-[#e31e24]">
                12-17 НАС
              </span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#a0a0a5]">
              Хүүхэд залуучуудад зориулсан тусгай нөхцөлтэй аюулгүй байдлын сургалт бүхий гишүүнчлэл.
            </p>
            <div className="mt-6">
              <OutlineButton href="/membership" className="w-full">
                Дэлгэрэнгүй →
              </OutlineButton>
            </div>
          </div>

          {/* Stepper Path: ГИШҮҮН БОЛОХ ЗАМ */}
          <div className="rounded-2xl border border-[#ffffff15] bg-[#0c0c0e] p-6 shadow-xl">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-[#e31e24]">
              ГИШҮҮН БОЛОХ ЗАМ
            </h4>
            <div className="mt-5 space-y-3">
              {[
                { n: "1", label: "Course 1", sub: "Суурь сургалт" },
                { n: "2", label: "Course 2", sub: "Баталгаажуулах сургалт" },
                { n: "3", label: "Суралцагч гишүүн", sub: "6 сар" },
                { n: "4", label: "Үндсэн гишүүн", sub: "Клубын гишүүн" },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e31e24] text-xs font-bold text-white">
                    {step.n}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{step.label}</p>
                    <p className="text-[10px] text-muted-foreground">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 06 - ЧАНСАА / ЖУРАМ */}
      <ContentSection id="ranking" dark>
        <SectionTag n="06" label="ЧАНСАА / ЖУРАМ" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
              ИЛ ТОД, СПОРТЫН ЁС ЗҮЙН ДАГУУ
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Тэмцээний чансаа, журам нь олон улсын IPSC стандартын дагуу хэрэгжинэ.
            </p>
          </div>
          <OutlineButton href="/ranking">Дэлгэрэнгүй →</OutlineButton>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Card 1: Rating rules */}
          <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl">
            <BarChart3 className="mb-4 size-8 text-[#e31e24]" />
            <h4 className="font-heading text-sm font-bold text-white">
              Тамирчдын чансаа тодорхойлох журам
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">
              Тэмцээний үр дүнг онцгой системээр тооцож, тамирчдын нийт чансааг тогтооно.
            </p>
            <ul className="mt-4 space-y-1.5 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-[#e31e24]" />
                <span>Эрэмбэ чансаа</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-[#e31e24]" />
                <span>Ангилал тус бүрээр</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-[#e31e24]" />
                <span>Жилийн эцсийн оноо</span>
              </li>
            </ul>
          </div>

          {/* Card 2: MPBK rules */}
          <div className="rounded-2xl border border-[#ffffff15] bg-[#121215] p-6 shadow-xl">
            <FileText className="mb-4 size-8 text-[#e31e24]" />
            <h4 className="font-heading text-sm font-bold text-white">
              МПБХ-ны тэмцээн явуулах журам
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">
              Тэмцээн зохион байгуулах, шүүгчдийн бүрэлдэхүүн, аюулгүй ажиллагааны журам.
            </p>
            <ul className="mt-4 space-y-1.5 text-[11px] text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-[#e31e24]" />
                <span>IPSC дүрмийн дагуу</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-[#e31e24]" />
                <span>Аюулгүй ажиллагааны хяналт</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="size-1 rounded-full bg-[#e31e24]" />
                <span>Ил тод үнэлгээ</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Banner */}
          <EditableBackground
            field="ranking.philosophyImageUrl"
            className="flex flex-col justify-end rounded-2xl border border-[#e31e24]/40 p-8 shadow-2xl"
            fallbackClassName="bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707]"
            editMode="corner"
          >
            <div className="absolute top-4 right-4 text-[#e31e24]/20">
              <LionIcon className="size-24" />
            </div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#e31e24]">
              PRIME PHILOSOPHY
            </p>
            <blockquote className="mt-2 font-heading text-2xl font-extrabold uppercase leading-tight text-white">
              "ДҮРЭМ БОЛ СПОРТЫН СҮНС"
            </blockquote>
          </EditableBackground>
        </div>
      </ContentSection>

      {/* 07 - МЭДЭЭ / СҮҮЛД БОЛСОН ҮЙЛ АЖИЛЛАГАА */}
      <ContentSection id="news">
        <SectionTag n="07" label="МЭДЭЭ / СҮҮЛД БОЛСОН ҮЙЛ АЖИЛЛАГАА" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl">
              БИДНИЙ ЗАМНАЛ
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Тэмцээн, сургалт, арга хэмжээний мэдээ, онцлох үйл явдлууд.
            </p>
          </div>
          <OutlineButton href="/contact">Бүх мэдээ →</OutlineButton>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {newsItems.map((item, idx) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-2xl border border-[#ffffff15] bg-[#121215] shadow-xl transition-all hover:border-[#e31e24]/50"
            >
              <EditableBackground
                field={`news.${idx}.imageUrl`}
                className="flex h-44 items-end border-b border-[#ffffff10] p-5"
                fallbackClassName="bg-gradient-to-br from-[#1a1814] via-[#121215] to-[#070707]"
                editMode="cover"
              >
                <span className="relative z-10 rounded bg-[#000000]/60 px-2.5 py-1 font-mono text-xs font-bold text-[#e31e24]">
                  {item.date}
                </span>
              </EditableBackground>
              <div className="p-5">
                <h4 className="font-heading text-sm font-bold text-white transition-colors group-hover:text-[#e31e24]">
                  {item.title}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#a0a0a5]">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>
    </>
  );
}
