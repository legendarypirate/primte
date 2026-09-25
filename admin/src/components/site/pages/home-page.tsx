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
  Target,
  Trophy,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { EditableBackground } from "@/components/site/editable-background";
import { EditableText } from "@/components/site/editable-text";
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

const adultMembershipItems = [
  "Клубын бүх үйл ажиллагаанд хамрагдах",
  "Тогтмол дасгал, тэмцээнд оролцох",
  "Давуу сургалтын хөнгөлөлт",
  "Клубын өмсгөл ашиглах",
];

const ratingItems = ["Эрэмбэ чансаа", "Ангилал тус бүрээр", "Жилийн эцсийн оноо"];

const competitionRuleItems = ["IPSC дүрмийн дагуу", "Аюулгүй ажиллагааны хяналт", "Ил тод үнэлгээ"];

export function HomePage() {
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
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-[#e31e24] bg-[#e31e24]/10 text-[#e31e24]">
                  <LionIcon className="size-7" />
                </div>
                <div>
                  <EditableText
                    field="hero.aside.ipsc.title"
                    defaultValue="IPSC гэж юу вэ?"
                    as="h3"
                    className="font-heading text-lg font-bold text-white block"
                  />
                  <EditableText
                    field="hero.aside.ipsc.subtitle"
                    defaultValue="International Practical Shooting Confederation"
                    as="p"
                    className="text-[10px] uppercase tracking-widest text-[#e31e24] block"
                  />
                </div>
              </div>
              <EditableText
                field="hero.aside.ipsc.body"
                defaultValue="IPSC (International Practical Shooting Confederation) нь бодит нөхцөлд ойр, хөдөлгөөнтэй, хурд, хүч, нарийвчлалыг хослуулсан практик буудлагын олон улсын спорт юм. Дэлхийн 100+ оронд түгсэн, аюулгүй байдал, сахилга бат, техник ур чадварыг хөгжүүлдэг."
                multiline
                as="p"
                className="relative z-10 mt-4 text-xs leading-relaxed text-[#a0a0a5] block"
              />
              <Link
                href="/about"
                className="relative z-10 mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#e31e24] hover:underline"
              >
                <EditableText field="hero.aside.ipsc.link" defaultValue="Илүү ихийг мэдэх" />
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
              <EditableText
                field="hero.aside.quote.label"
                defaultValue="PRIME IPSC ACTION AIR"
                as="p"
                className="relative z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-[#e31e24] block"
              />
              <EditableText
                field="hero.aside.quote.text"
                defaultValue={'"Хурд бол ур чадвар. Нарийвчлал бол хариуцлага. Харин аюулгүй байдал бол бүхний үндэс."'}
                multiline
                as="blockquote"
                className="relative z-10 mt-2 text-xs italic leading-relaxed text-white block"
              />
            </EditableBackground>
          </div>
        }
      >
        <RedButton href="/about">
          <EditableText field="hero.ctaPrimary" defaultValue="IPSC гэж юу вэ?" />
          <ArrowRight className="size-4" />
        </RedButton>
        <OutlineButton href="/training">
          <EditableText field="hero.ctaSecondary" defaultValue="IPSC Action Air" />
        </OutlineButton>
      </PageHero>

      {/* 02 - СПОРТЫН ДҮРЭМ (SAFETY FIRST) */}
      <ContentSection id="safety" dark>
        <SectionTag n="02" label="СПОРТЫН ДҮРЭМ" />
        <div className="flex flex-col gap-2">
          <EditableText
            field="safety.title"
            defaultValue="4 ҮНДСЭН АЮУЛГҮЙ АЖИЛЛАГААНЫ ДҮРЭМ"
            as="h2"
            className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
          />
          <EditableText
            field="safety.tagline"
            defaultValue="SAFETY FIRST"
            as="p"
            className="text-xs uppercase tracking-widest text-[#e31e24] block"
          />
          <EditableText
            field="safety.subtitle"
            defaultValue="Аюулгүй байдал бол спортын үндэс. Үргэлж санаа, үргэлж мөрдөн."
            multiline
            as="p"
            className="text-sm text-muted-foreground block"
          />
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
              <div className="relative z-10 mb-3 flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg border border-[#e31e24]/40 bg-[#e31e24]/10 font-mono text-sm font-bold text-[#e31e24]">
                  <EditableText field={`safety.rules.${idx}.n`} defaultValue={rule.n} />
                </span>
                <Shield className="size-4 text-[#e31e24]/40" />
              </div>
              <EditableText
                field={`safety.rules.${idx}.title`}
                defaultValue={rule.title}
                multiline
                as="h4"
                className="relative z-10 text-xs font-bold text-white block"
              />
              <EditableText
                field={`safety.rules.${idx}.body`}
                defaultValue={rule.body}
                multiline
                as="p"
                className="relative z-10 mt-2 text-[11px] leading-relaxed text-[#a0a0a5] block"
              />
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
              <div className="relative z-10">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/30 bg-[#e31e24]/10 text-[#e31e24]">
                  <Icon className="size-5" />
                </div>
                <EditableText
                  field={`safety.features.${idx}.title`}
                  defaultValue={title}
                  as="h4"
                  className="font-heading text-sm font-bold text-white block"
                />
                <EditableText
                  field={`safety.features.${idx}.body`}
                  defaultValue={body}
                  multiline
                  as="p"
                  className="mt-2 text-xs leading-relaxed text-[#a0a0a5] block"
                />
              </div>
              <Link
                href={href}
                className="relative z-10 mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#e31e24] hover:text-white"
              >
                <EditableText field={`safety.features.${idx}.link`} defaultValue="Дэлгэрэнгүй" />
                <ArrowRight className="size-3" />
              </Link>
            </EditableBackground>
          ))}
        </div>

        {/* Stepper horizontal bar: ТЭМЦЭЭНИЙ 5 ТҮВШИН */}
        <EditableBackground
          field="safety.levels.imageUrl"
          className="mt-12 rounded-2xl border border-[#ffffff10] p-6"
          fallbackClassName="bg-[#0c0c0e]"
          editMode="corner"
        >
          <div className="relative z-10 mb-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <EditableText
              field="safety.levels.title"
              defaultValue="ТЭМЦЭЭНИЙ 5 ТҮВШИН"
              as="h3"
              className="font-heading text-base font-bold text-white uppercase tracking-wider block"
            />
            <EditableText
              field="safety.levels.subtitle"
              defaultValue="Олон улсын стандартын дагуу үнэлэгддэг"
              as="p"
              className="text-xs text-[#a0a0a5] block"
            />
          </div>
          <div className="relative z-10 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {levels.map((lvl, idx) => (
              <EditableBackground
                key={lvl.n}
                field={`safety.levels.${idx}.imageUrl`}
                className="flex items-center gap-3 rounded-xl border border-[#ffffff10] p-3 transition-colors hover:border-[#e31e24]/50"
                fallbackClassName="bg-[#141418]"
                editMode="corner"
              >
                <div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e31e24] bg-[#e31e24]/20 font-mono text-xs font-bold text-[#e31e24]">
                  <EditableText field={`safety.levels.${idx}.n`} defaultValue={lvl.n} />
                </div>
                <div className="relative z-10">
                  <EditableText
                    field={`safety.levels.${idx}.title`}
                    defaultValue={lvl.title}
                    as="p"
                    className="text-xs font-bold text-white block"
                  />
                  <EditableText
                    field={`safety.levels.${idx}.label`}
                    defaultValue={lvl.label}
                    as="p"
                    className="text-[10px] text-[#a0a0a5] block"
                  />
                </div>
              </EditableBackground>
            ))}
          </div>
        </EditableBackground>
      </ContentSection>

      {/* 03 - СУРГАЛТ */}
      <ContentSection id="training">
        <SectionTag n="03" label="СУРГАЛТ" />
        <div className="flex flex-col gap-2">
          <EditableText
            field="training.title"
            defaultValue="ИЛҮҮ ИХ УР ЧАДВАР, ИЛҮҮ ИХ БОЛОМЖ"
            as="h2"
            className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
          />
          <EditableText
            field="training.subtitle"
            defaultValue="Онол, дадлага, аюулгүй ажиллагаа хосолсон мэргэжлийн сургалтын хөтөлбөр."
            multiline
            as="p"
            className="text-sm text-muted-foreground block"
          />
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
                <div className="relative z-10">
                  <div className="mb-3 flex items-center justify-between">
                    <EditableText
                      field={`training.courses.${idx}.title`}
                      defaultValue={c.title}
                      className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#e31e24]"
                    />
                  </div>
                  <EditableText
                    field={`training.courses.${idx}.subtitle`}
                    defaultValue={c.subtitle}
                    as="h4"
                    className="font-heading text-sm font-bold text-white block"
                  />

                  <ul className="mt-4 space-y-2 text-xs text-[#a0a0a5]">
                    <li className="flex items-center gap-2">
                      <Clock className="size-3.5 text-[#e31e24]" />
                      <span>
                        <EditableText field={`training.courses.${idx}.durationLabel`} defaultValue="Хугацаа:" />{" "}
                        <EditableText field={`training.courses.${idx}.duration`} defaultValue={c.duration} />
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="size-3.5 text-[#e31e24]" />
                      <span>
                        <EditableText field={`training.courses.${idx}.audienceLabel`} defaultValue="Хамрах хүрээ:" />{" "}
                        <EditableText field={`training.courses.${idx}.audience`} defaultValue={c.audience} />
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="size-3.5 shrink-0 text-[#e31e24] mt-0.5" />
                      <EditableText
                        field={`training.courses.${idx}.details`}
                        defaultValue={c.details}
                        multiline
                        as="p"
                        className="text-[11px] leading-tight block"
                      />
                    </li>
                  </ul>
                </div>

                <div className="relative z-10 mt-6 border-t border-[#ffffff10] pt-4">
                  <EditableText
                    field={`training.courses.${idx}.priceLabel`}
                    defaultValue="Үнэ"
                    as="p"
                    className="text-xs text-[#a0a0a5] block"
                  />
                  <EditableText
                    field={`training.courses.${idx}.price`}
                    defaultValue={c.price}
                    as="p"
                    className="font-mono text-xl font-extrabold text-[#e31e24] block"
                  />
                  <Link
                    href={c.href}
                    className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#e31e24] text-xs font-bold text-white transition hover:bg-[#c91920]"
                  >
                    <EditableText field={`training.courses.${idx}.cta`} defaultValue="Бүртгүүлэх" />
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </EditableBackground>
            ))}
          </div>

          {/* Quick Registration Form */}
          <EditableBackground
            field="training.form.imageUrl"
            className="rounded-2xl border border-[#e31e24]/40 p-6 shadow-2xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <EditableText
              field="training.form.title"
              defaultValue="СУРГАЛТЫН БҮРТГЭЛ"
              as="h3"
              className="relative z-10 font-heading text-base font-bold uppercase tracking-wider text-white block"
            />
            <EditableText
              field="training.form.subtitle"
              defaultValue="Доорх формоор бүртгэлээ илгээнэ үү"
              as="p"
              className="relative z-10 mt-1 text-xs text-[#a0a0a5] block"
            />

            <form onSubmit={handleFormSubmit} className="relative z-10 mt-5 space-y-3">
              <div>
                <EditableText
                  field="training.form.nameLabel"
                  defaultValue="Овог, нэр *"
                  as="label"
                  className="block text-[11px] font-semibold text-[#a0a0a5]"
                />
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
                  <EditableText
                    field="training.form.emailLabel"
                    defaultValue="И-мэйл *"
                    as="label"
                    className="block text-[11px] font-semibold text-[#a0a0a5]"
                  />
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
                  <EditableText
                    field="training.form.phoneLabel"
                    defaultValue="Гар утас *"
                    as="label"
                    className="block text-[11px] font-semibold text-[#a0a0a5]"
                  />
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
                  <EditableText
                    field="training.form.courseLabel"
                    defaultValue="Сургалтын төрөл"
                    as="label"
                    className="block text-[11px] font-semibold text-[#a0a0a5]"
                  />
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
                  <EditableText
                    field="training.form.timeLabel"
                    defaultValue="Боломжит цаг"
                    as="label"
                    className="block text-[11px] font-semibold text-[#a0a0a5]"
                  />
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
                <EditableText
                  field="training.form.notesLabel"
                  defaultValue="Зурвас / Тайлбар"
                  as="label"
                  className="block text-[11px] font-semibold text-[#a0a0a5]"
                />
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
                <EditableText field="training.form.submit" defaultValue="Бүртгэл илгээх" />
                <ArrowRight className="size-4" />
              </button>

              <EditableText
                field="training.form.helper"
                defaultValue="Бид тантай 1 ажлын өдрийн дотор холбогдоно."
                as="p"
                className="mt-2 text-center text-[10px] text-[#a0a0a5] block"
              />
            </form>
          </EditableBackground>
        </div>
      </ContentSection>

      {/* 05 - ГИШҮҮНЧЛЭЛ */}
      <ContentSection id="membership">
        <SectionTag n="04" label="ГИШҮҮНЧЛЭЛ" fieldPrefix="section.05" />
        <div className="flex flex-col gap-2">
          <EditableText
            field="membership.title"
            defaultValue="НЭГ ДЭЭР ИЛҮҮ ХҮЧТЭЙ"
            as="h2"
            className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
          />
          <EditableText
            field="membership.subtitle"
            defaultValue="PRIME IPSC Club-ийн гишүүн болж, тогтмол сургалт, тэмцээн, нийгэмлэгийн үйл ажиллагаанд оролцоорой."
            multiline
            as="p"
            className="text-sm text-muted-foreground block"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Adult Membership */}
          <EditableBackground
            field="membership.adult.imageUrl"
            className="rounded-2xl border border-[#e31e24]/50 p-6 shadow-xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <div className="relative z-10 flex items-center justify-between">
              <EditableText
                field="membership.adult.title"
                defaultValue="Насанд хүрэгчид"
                className="font-heading text-sm font-bold text-white uppercase"
              />
              <EditableText
                field="membership.adult.badge"
                defaultValue="ҮНДСЭН"
                className="rounded bg-[#e31e24]/20 px-2 py-0.5 text-[10px] font-bold text-[#e31e24]"
              />
            </div>
            <p className="relative z-10 mt-4 font-mono text-2xl font-extrabold text-[#e31e24]">
              <EditableText field="membership.adult.price" defaultValue="250,000₮" />{" "}
              <EditableText
                field="membership.adult.period"
                defaultValue="/ жил"
                className="text-xs font-normal text-muted-foreground"
              />
            </p>
            <ul className="relative z-10 mt-6 space-y-2.5 text-xs text-[#a0a0a5]">
              {adultMembershipItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-[#e31e24]" />
                  <EditableText field={`membership.adult.items.${idx}`} defaultValue={item} />
                </li>
              ))}
            </ul>
          </EditableBackground>

          {/* Junior Membership */}
          <EditableBackground
            field="membership.junior.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <div className="relative z-10 flex items-center justify-between">
              <EditableText
                field="membership.junior.title"
                defaultValue="Жуниор гишүүнчлэл"
                className="font-heading text-sm font-bold text-white uppercase"
              />
              <EditableText
                field="membership.junior.badge"
                defaultValue="12-17 НАС"
                className="rounded bg-[#e31e24]/20 px-2 py-0.5 text-[10px] font-bold text-[#e31e24]"
              />
            </div>
            <EditableText
              field="membership.junior.body"
              defaultValue="Хүүхэд залуучуудад зориулсан тусгай нөхцөлтэй аюулгүй байдлын сургалт бүхий гишүүнчлэл."
              multiline
              as="p"
              className="relative z-10 mt-4 text-xs leading-relaxed text-[#a0a0a5] block"
            />
            <div className="relative z-10 mt-6">
              <OutlineButton href="/membership" className="w-full">
                <EditableText field="membership.junior.cta" defaultValue="Дэлгэрэнгүй →" />
              </OutlineButton>
            </div>
          </EditableBackground>

          {/* Stepper Path: ГИШҮҮН БОЛОХ ЗАМ */}
          <EditableBackground
            field="membership.path.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
            fallbackClassName="bg-[#0c0c0e]"
            editMode="corner"
          >
            <EditableText
              field="membership.path.title"
              defaultValue="ГИШҮҮН БОЛОХ ЗАМ"
              as="h4"
              className="relative z-10 font-heading text-xs font-bold uppercase tracking-wider text-[#e31e24] block"
            />
            <div className="relative z-10 mt-5 space-y-3">
              {[
                { n: "1", label: "Course 1", sub: "Суурь сургалт" },
                { n: "2", label: "Course 2", sub: "Баталгаажуулах сургалт" },
                { n: "3", label: "Суралцагч гишүүн", sub: "6 сар" },
                { n: "4", label: "Үндсэн гишүүн", sub: "Клубын гишүүн" },
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e31e24] text-xs font-bold text-white">
                    <EditableText field={`membership.path.steps.${idx}.n`} defaultValue={step.n} />
                  </div>
                  <div>
                    <EditableText
                      field={`membership.path.steps.${idx}.label`}
                      defaultValue={step.label}
                      as="p"
                      className="text-xs font-bold text-white block"
                    />
                    <EditableText
                      field={`membership.path.steps.${idx}.sub`}
                      defaultValue={step.sub}
                      as="p"
                      className="text-[10px] text-muted-foreground block"
                    />
                  </div>
                </div>
              ))}
            </div>
          </EditableBackground>
        </div>
      </ContentSection>

      {/* 06 - ЧАНСАА / ЖУРАМ */}
      <ContentSection id="ranking" dark>
        <SectionTag n="05" label="ЧАНСАА / ЖУРАМ" fieldPrefix="section.06" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <EditableText
              field="ranking.title"
              defaultValue="ИЛ ТОД, СПОРТЫН ЁС ЗҮЙН ДАГУУ"
              as="h2"
              className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
            />
            <EditableText
              field="ranking.subtitle"
              defaultValue="Тэмцээний чансаа, журам нь олон улсын IPSC стандартын дагуу хэрэгжинэ."
              multiline
              as="p"
              className="mt-1 text-sm text-muted-foreground block"
            />
          </div>
          <OutlineButton href="/ranking">
            <EditableText field="ranking.cta" defaultValue="Дэлгэрэнгүй →" />
          </OutlineButton>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Card 1: Rating rules */}
          <EditableBackground
            field="ranking.rating.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <BarChart3 className="relative z-10 mb-4 size-8 text-[#e31e24]" />
            <EditableText
              field="ranking.rating.title"
              defaultValue="Тамирчдын чансаа тодорхойлох журам"
              as="h4"
              className="relative z-10 font-heading text-sm font-bold text-white block"
            />
            <EditableText
              field="ranking.rating.body"
              defaultValue="Тэмцээний үр дүнг онцгой системээр тооцож, тамирчдын нийт чансааг тогтооно."
              multiline
              as="p"
              className="relative z-10 mt-2 text-xs leading-relaxed text-[#a0a0a5] block"
            />
            <ul className="relative z-10 mt-4 space-y-1.5 text-[11px] text-muted-foreground">
              {ratingItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-[#e31e24]" />
                  <EditableText field={`ranking.rating.items.${idx}`} defaultValue={item} />
                </li>
              ))}
            </ul>
          </EditableBackground>

          {/* Card 2: MPBK rules */}
          <EditableBackground
            field="ranking.rules.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <FileText className="relative z-10 mb-4 size-8 text-[#e31e24]" />
            <EditableText
              field="ranking.rules.title"
              defaultValue="МПБХ-ны тэмцээн явуулах журам"
              as="h4"
              className="relative z-10 font-heading text-sm font-bold text-white block"
            />
            <EditableText
              field="ranking.rules.body"
              defaultValue="Тэмцээн зохион байгуулах, шүүгчдийн бүрэлдэхүүн, аюулгүй ажиллагааны журам."
              multiline
              as="p"
              className="relative z-10 mt-2 text-xs leading-relaxed text-[#a0a0a5] block"
            />
            <ul className="relative z-10 mt-4 space-y-1.5 text-[11px] text-muted-foreground">
              {competitionRuleItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="size-1 rounded-full bg-[#e31e24]" />
                  <EditableText field={`ranking.rules.items.${idx}`} defaultValue={item} />
                </li>
              ))}
            </ul>
          </EditableBackground>

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
            <EditableText
              field="ranking.philosophy.label"
              defaultValue="PRIME PHILOSOPHY"
              as="p"
              className="relative z-10 font-mono text-xs font-bold uppercase tracking-widest text-[#e31e24] block"
            />
            <EditableText
              field="ranking.philosophy.quote"
              defaultValue={'"ДҮРЭМ БОЛ СПОРТЫН СҮНС"'}
              multiline
              as="blockquote"
              className="relative z-10 mt-2 font-heading text-2xl font-extrabold uppercase leading-tight text-white block"
            />
          </EditableBackground>
        </div>
      </ContentSection>

      {/* 07 - МЭДЭЭ / СҮҮЛД БОЛСОН ҮЙЛ АЖИЛЛАГАА */}
      <ContentSection id="news">
        <SectionTag n="06" label="МЭДЭЭ / СҮҮЛД БОЛСОН ҮЙЛ АЖИЛЛАГАА" fieldPrefix="section.07" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <EditableText
              field="news.title"
              defaultValue="БИДНИЙ ЗАМНАЛ"
              as="h2"
              className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
            />
            <EditableText
              field="news.subtitle"
              defaultValue="Тэмцээн, сургалт, арга хэмжээний мэдээ, онцлох үйл явдлууд."
              multiline
              as="p"
              className="mt-1 text-sm text-muted-foreground block"
            />
          </div>
          <OutlineButton href="/contact">
            <EditableText field="news.cta" defaultValue="Бүх мэдээ →" />
          </OutlineButton>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {newsItems.map((item, idx) => (
            <EditableBackground
              key={item.title}
              field={`news.${idx}.cardImageUrl`}
              className="group overflow-hidden rounded-2xl border border-[#ffffff15] shadow-xl transition-all hover:border-[#e31e24]/50"
              fallbackClassName="bg-[#121215]"
              editMode="corner"
            >
              <EditableBackground
                field={`news.${idx}.imageUrl`}
                className="flex h-44 items-end border-b border-[#ffffff10] p-5"
                fallbackClassName="bg-gradient-to-br from-[#1a1814] via-[#121215] to-[#070707]"
                editMode="cover"
              >
                <span className="relative z-10 rounded bg-[#000000]/60 px-2.5 py-1 font-mono text-xs font-bold text-[#e31e24]">
                  <EditableText field={`news.${idx}.date`} defaultValue={item.date} />
                </span>
              </EditableBackground>
              <div className="relative z-10 p-5">
                <EditableText
                  field={`news.${idx}.title`}
                  defaultValue={item.title}
                  multiline
                  as="h4"
                  className="font-heading text-sm font-bold text-white transition-colors group-hover:text-[#e31e24] block"
                />
                <EditableText
                  field={`news.${idx}.desc`}
                  defaultValue={item.desc}
                  multiline
                  as="p"
                  className="mt-2 text-xs leading-relaxed text-[#a0a0a5] block"
                />
              </div>
            </EditableBackground>
          ))}
        </div>
      </ContentSection>
    </>
  );
}
