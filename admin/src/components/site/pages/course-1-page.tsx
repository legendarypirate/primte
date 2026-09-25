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
import { EditableBackground } from "@/components/site/editable-background";
import { EditableText } from "@/components/site/editable-text";
import { ContentSection, LionIcon, OutlineButton, PageHero, RedButton, SectionTag } from "../primitives";

const faqs = [
  {
    q: "Course 1-д өмнө нь туршлага хэрэгтэй юу?",
    a: "Үгүй, Course 1 нь анхан шатны сургалт учраас өмнө нь буудлагаар хичээллэж байгаагүй хүмүүст бүрэн зориулагдсан. Аюулгүй ажиллагаанаас эхлэн системтэй заана.",
  },
  {
    q: "Сургалтын хэрэгсэл төлбөрт багтах уу?",
    a: "Тийм, буу, тоноглол, хамгаалалтын шил, сум зэрэг бүх хэрэгсэл сургалтын 370,000₮ төлбөрт бүрэн багтсан болно.",
  },
  {
    q: "Бүртгэл хэзээ баталгаажих вэ?",
    a: "Төлбөр шилжиж, цахим анкетын мэдээлэл баталгаажсаны дараа таны суудлыг нөөцөлж цаг баталгаажина.",
  },
  {
    q: "Төлбөрийн буцаалт хэрхэн явагдах вэ?",
    a: "Сургалт эхлэхээс 24-48 цагийн өмнө мэдэгдсэн тохиолдолд 10%, 24 цагаас доош хугацаанд 20%-ийн суутгалтайгаар буцаан олгогдоно.",
  },
];

export function Course1Page() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "male",
    hand: "right",
    medical: "",
    email: "",
    phone: "",
    schedule: "Ажлын өдрийн анги (Дав, Лха, Баа 19:00-22:00)",
    purpose: "",
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Шаардлагатай талбаруудыг бөглөнө үү.");
      return;
    }
    toast.success("Course 1 сургалтын бүртгэл амжилттай илгээгдлээ!");
  };

  return (
    <>
      {/* 01 - HERO HEADER */}
      <section className="relative overflow-hidden border-b border-[#ffffff15] bg-[#070707] py-16 md:py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <EditableText
                field="hero.eyebrow"
                defaultValue="TRAIN. COMPETE. BELONG."
                as="p"
                className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24] block"
              />
              <EditableText
                field="hero.title"
                defaultValue="COURSE 1"
                as="h1"
                className="mt-3 font-heading text-4xl font-extrabold uppercase leading-none tracking-tight text-white md:text-5xl lg:text-6xl block"
              />
              <EditableText
                field="hero.subtitle"
                defaultValue="ГИШҮҮНЧЛЭЛИЙН АНХАН ШАТНЫ СУРГАЛТ"
                as="h2"
                className="mt-2 font-heading text-xl font-bold uppercase text-[#e31e24] md:text-2xl block"
              />
              <EditableText
                field="hero.description"
                defaultValue="IPSC Action Air Handgun төрлийн анхан шатны сургалт. Аюулгүй ажиллагаа, суурь ойлголт, буудлагын үндсэн дадал эзэмшүүлэх практик сургалт."
                multiline
                as="p"
                className="mt-4 max-w-xl text-xs leading-relaxed text-[#a0a0a5] block"
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <RedButton href="#register">
                  <EditableText field="hero.ctaPrimary" defaultValue="БҮРТГҮҮЛЭХ" /> <ArrowRight className="size-4" />
                </RedButton>
                <OutlineButton href="#video">
                  <Play className="size-3.5 fill-current text-[#e31e24]" />
                  <EditableText field="hero.ctaSecondary" defaultValue="Сургалтын тухай видео үзэх" />
                </OutlineButton>
              </div>
            </div>

            {/* Same Rules A Brighter Generation Graphic Card */}
            <EditableBackground
              field="hero.cardImageUrl"
              className="relative overflow-hidden rounded-2xl border border-[#e31e24]/40 p-8 text-right shadow-2xl"
              fallbackClassName="bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707]"
              placeholder="Hero card background"
              editMode="corner"
            >
              <LionIcon className="absolute top-4 left-4 size-24 text-[#e31e24]/15" />
              <EditableText
                field="hero.cardEyebrow"
                defaultValue="DISCIPLINE SKILL"
                as="p"
                className="relative z-10 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24] block"
              />
              <EditableText
                field="hero.cardTitle"
                defaultValue="A SAFER TOMORROW"
                as="h3"
                className="relative z-10 mt-2 font-heading text-2xl font-extrabold uppercase text-white block"
              />
              <EditableText
                field="hero.cardQuote"
                defaultValue={'"Same Rules, A Brighter Generation"'}
                multiline
                as="p"
                className="relative z-10 mt-4 font-serif text-lg italic text-[#e31e24] block"
              />
            </EditableBackground>
          </div>

          {/* Quick Info Bar */}
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <EditableBackground
              field="quickInfo.age.imageUrl"
              className="flex items-center gap-3 rounded-xl border border-[#ffffff15] p-4"
              fallbackClassName="bg-[#121215]"
              placeholder="Info tile background"
              editMode="corner"
            >
              <User className="relative z-10 size-5 text-[#e31e24]" />
              <div className="relative z-10">
                <EditableText field="quickInfo.age.label" defaultValue="Насны шаардлага" as="p" className="text-[10px] uppercase text-[#a0a0a5] block" />
                <EditableText field="quickInfo.age.value" defaultValue="18+ нас" as="p" className="text-xs font-bold text-white block" />
              </div>
            </EditableBackground>
            <EditableBackground
              field="quickInfo.duration.imageUrl"
              className="flex items-center gap-3 rounded-xl border border-[#ffffff15] p-4"
              fallbackClassName="bg-[#121215]"
              placeholder="Info tile background"
              editMode="corner"
            >
              <Clock className="relative z-10 size-5 text-[#e31e24]" />
              <div className="relative z-10">
                <EditableText field="quickInfo.duration.label" defaultValue="Нийт хугацаа" as="p" className="text-[10px] uppercase text-[#a0a0a5] block" />
                <EditableText field="quickInfo.duration.value" defaultValue="3 өдөр / 9 цаг (эсвэл 2 өдөр)" as="p" className="text-xs font-bold text-white block" />
              </div>
            </EditableBackground>
            <EditableBackground
              field="quickInfo.group.imageUrl"
              className="flex items-center gap-3 rounded-xl border border-[#ffffff15] p-4"
              fallbackClassName="bg-[#121215]"
              placeholder="Info tile background"
              editMode="corner"
            >
              <Users className="relative z-10 size-5 text-[#e31e24]" />
              <div className="relative z-10">
                <EditableText field="quickInfo.group.label" defaultValue="Жижиг бүлэг" as="p" className="text-[10px] uppercase text-[#a0a0a5] block" />
                <EditableText field="quickInfo.group.value" defaultValue="4-6 суралцагч" as="p" className="text-xs font-bold text-white block" />
              </div>
            </EditableBackground>
            <EditableBackground
              field="quickInfo.price.imageUrl"
              className="flex items-center gap-3 rounded-xl border border-[#e31e24]/40 p-4"
              fallbackClassName="bg-[#181612]"
              placeholder="Info tile background"
              editMode="corner"
            >
              <CreditCard className="relative z-10 size-5 text-[#e31e24]" />
              <div className="relative z-10">
                <EditableText field="quickInfo.price.label" defaultValue="Сургалтын төлбөр" as="p" className="text-[10px] uppercase text-[#a0a0a5] block" />
                <EditableText field="quickInfo.price.value" defaultValue="370,000₮" as="p" className="font-mono text-sm font-extrabold text-[#e31e24] block" />
              </div>
            </EditableBackground>
          </div>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <div className="border-b border-[#ffffff10] bg-[#09090b] py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 text-xs text-[#a0a0a5] md:px-6">
          <Link href="/" className="hover:text-white flex items-center gap-1">
            <Home className="size-3.5" /> <EditableText field="breadcrumb.home" defaultValue="Нүүр" />
          </Link>
          <span>/</span>
          <Link href="/training" className="hover:text-white">
            <EditableText field="breadcrumb.training" defaultValue="Сургалт" />
          </Link>
          <span>/</span>
          <EditableText
            field="breadcrumb.current"
            defaultValue="Гишүүнчлэлийн анхан шатны сургалт [Course 1]"
            className="font-semibold text-[#e31e24]"
          />
        </div>
      </div>

      {/* MAIN CONTENT + RIGHT STICKY FORM */}
      <ContentSection id="main">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          {/* LEFT COLUMN */}
          <div className="space-y-10">
            {/* Overview & Video Thumbnail */}
            <div>
              <EditableText
                field="overview.eyebrow"
                defaultValue="IPSC ACTION AIR"
                className="font-mono text-xs font-bold uppercase tracking-widest text-[#e31e24]"
              />
              <EditableText
                field="overview.title"
                defaultValue="COURSE 1: Гишүүнчлэлийн анхан шатны сургалт"
                as="h2"
                className="mt-1 font-heading text-2xl font-extrabold uppercase text-white block"
              />
              <EditableText
                field="overview.body"
                defaultValue="IPSC Action Air Handgun төрлийн анхан шатны сургалт. Аюулгүй ажиллагаа, суурь ойлголт, буудлагын үндсэн дадал эзэмшүүлэх практик сургалт. 18-с дээш насны иргэдэд зориулагдсан танилцах түвшиний сургалт юм."
                multiline
                as="p"
                className="mt-3 text-xs leading-relaxed text-[#a0a0a5] block"
              />

              {/* Video Preview Box */}
              <div id="video" className="mt-6 overflow-hidden rounded-2xl border border-[#ffffff15] bg-[#121215] shadow-xl">
                <EditableBackground
                  field="video.imageUrl"
                  className="relative flex h-52 items-center justify-center"
                  fallbackClassName="bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707]"
                  placeholder="Video thumbnail"
                  editMode="corner"
                >
                  <button
                    type="button"
                    onClick={() => toast.info("Видео тоглуулж байна...")}
                    className="group relative z-10 flex flex-col items-center gap-2"
                  >
                    <div className="flex size-14 items-center justify-center rounded-full bg-[#e31e24] text-white shadow-lg shadow-[#e31e24]/40 transition-transform group-hover:scale-110">
                      <Play className="size-6 fill-current ml-0.5" />
                    </div>
                    <EditableText field="video.title" defaultValue="Сургалтын танилцуулга видео" className="text-xs font-bold text-white" />
                    <EditableText field="video.duration" defaultValue="02:36" className="font-mono text-[10px] text-[#e31e24]" />
                  </button>
                </EditableBackground>
              </div>

              {/* 4 Highlight Badges */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: Shield, text: "Аюулгүй ажиллагаа" },
                  { icon: Target, text: "Суурь ойлголт" },
                  { icon: FileText, text: "Практик дадлага" },
                  { icon: CheckCircle2, text: "Course 2 эрх нээгдэнэ" },
                ].map((b, i) => (
                  <EditableBackground
                    key={i}
                    field={`badges.${i}.imageUrl`}
                    className="flex flex-col items-center rounded-xl border border-[#ffffff15] p-3 text-center"
                    fallbackClassName="bg-[#121215]"
                    placeholder="Badge background"
                    editMode="corner"
                  >
                    <b.icon className="relative z-10 mb-2 size-5 text-[#e31e24]" />
                    <EditableText field={`badges.${i}.text`} defaultValue={b.text} className="relative z-10 text-xs font-bold text-white" />
                  </EditableBackground>
                ))}
              </div>
            </div>

            {/* СУРГАЛТЫН ЕРӨНХИЙ МЭДЭЭЛЭЛ */}
            <EditableBackground
              field="general.imageUrl"
              className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl space-y-4"
              fallbackClassName="bg-[#121215]"
              placeholder="Card background"
              editMode="corner"
            >
              <EditableText
                field="general.title"
                defaultValue="СУРГАЛТЫН ЕРӨНХИЙ МЭДЭЭЛЭЛ"
                as="h3"
                className="relative z-10 font-heading text-sm font-bold uppercase tracking-wider text-[#e31e24] block"
              />
              <div className="relative z-10 grid gap-3 sm:grid-cols-2 text-xs text-[#a0a0a5]">
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <EditableText field="general.type.label" defaultValue="Сургалтын төрөл" />
                  <EditableText field="general.type.value" defaultValue="IPSC Action Air Handgun" className="font-bold text-white" />
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <EditableText field="general.scope.label" defaultValue="Хамрах хүрээ" />
                  <EditableText field="general.scope.value" defaultValue="18-с дээш насны иргэн" className="font-bold text-white" />
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <EditableText field="general.duration.label" defaultValue="Нийт хугацаа" />
                  <EditableText field="general.duration.value" defaultValue="3 өдөр (9 цаг) / 2 өдөр (8 цаг)" className="font-bold text-white" />
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <EditableText field="general.capacity.label" defaultValue="Анги дүүргэлт" />
                  <EditableText field="general.capacity.value" defaultValue="4-6 суралцагч" className="font-bold text-white" />
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <EditableText field="general.instructor.label" defaultValue="Сургагч багш" />
                  <EditableText field="general.instructor.value" defaultValue="МПБХ-ны инструктор" className="font-bold text-white" />
                </div>
                <div className="flex items-center justify-between border-b border-[#ffffff10] pb-2">
                  <EditableText field="general.price.label" defaultValue="Сургалтын төлбөр" />
                  <EditableText field="general.price.value" defaultValue="370,000₮" className="font-mono font-bold text-[#e31e24]" />
                </div>
              </div>
            </EditableBackground>

            {/* ХИЧЭЭЛИЙН ХУВААРЬ */}
            <EditableBackground
              field="schedule.imageUrl"
              className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl space-y-4"
              fallbackClassName="bg-[#121215]"
              placeholder="Card background"
              editMode="corner"
            >
              <EditableText
                field="schedule.title"
                defaultValue="ХИЧЭЭЛИЙН ХУВААРЬ"
                as="h3"
                className="relative z-10 font-heading text-sm font-bold uppercase tracking-wider text-white block"
              />
              <div className="relative z-10 grid gap-4 sm:grid-cols-2">
                <EditableBackground
                  field="schedule.threeDay.imageUrl"
                  className="rounded-xl border border-[#ffffff10] p-4 text-xs space-y-2"
                  fallbackClassName="bg-[#0c0c0e]"
                  placeholder="Schedule card background"
                  editMode="corner"
                >
                  <EditableText field="schedule.threeDay.title" defaultValue="3 өдрийн анги (9 цаг)" as="h4" className="relative z-10 font-bold text-[#e31e24] block" />
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.threeDay.session.label" defaultValue="Нэг удаагийн оролт:" />{" "}
                    <EditableText field="schedule.threeDay.session.value" defaultValue="3 цаг" className="font-bold" />
                  </p>
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.threeDay.days.label" defaultValue="Сургалтын өдөр:" />{" "}
                    <EditableText field="schedule.threeDay.days.value" defaultValue="3 өдөр" className="font-bold" />
                  </p>
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.threeDay.weekdays.label" defaultValue="Үндсэн өдрүүд:" />{" "}
                    <EditableText field="schedule.threeDay.weekdays.value" defaultValue="Даваа, Лхагва, Баасан" className="font-bold" />
                  </p>
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.threeDay.hours.label" defaultValue="Үндсэн цагууд:" />{" "}
                    <EditableText field="schedule.threeDay.hours.value" defaultValue="19:00 - 22:00" className="font-bold" />
                  </p>
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.threeDay.total.label" defaultValue="Нийт цаг:" />{" "}
                    <EditableText field="schedule.threeDay.total.value" defaultValue="9 цаг" className="font-bold text-white" />
                  </p>
                </EditableBackground>

                <EditableBackground
                  field="schedule.twoDay.imageUrl"
                  className="rounded-xl border border-[#ffffff10] p-4 text-xs space-y-2"
                  fallbackClassName="bg-[#0c0c0e]"
                  placeholder="Schedule card background"
                  editMode="corner"
                >
                  <EditableText field="schedule.twoDay.title" defaultValue="2 өдрийн анги (8 цаг)" as="h4" className="relative z-10 font-bold text-[#e31e24] block" />
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.twoDay.session.label" defaultValue="Нэг удаагийн оролт:" />{" "}
                    <EditableText field="schedule.twoDay.session.value" defaultValue="4 цаг" className="font-bold" />
                  </p>
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.twoDay.days.label" defaultValue="Сургалтын өдөр:" />{" "}
                    <EditableText field="schedule.twoDay.days.value" defaultValue="2 өдөр" className="font-bold" />
                  </p>
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.twoDay.weekdays.label" defaultValue="Үндсэн өдрүүд:" />{" "}
                    <EditableText field="schedule.twoDay.weekdays.value" defaultValue="Бямба, Ням" className="font-bold" />
                  </p>
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.twoDay.hours.label" defaultValue="Үндсэн цагууд:" />{" "}
                    <EditableText field="schedule.twoDay.hours.value" defaultValue="18:00 - 22:00" className="font-bold" />
                  </p>
                  <p className="relative z-10 text-[#a0a0a5]">
                    <EditableText field="schedule.twoDay.total.label" defaultValue="Нийт цаг:" />{" "}
                    <EditableText field="schedule.twoDay.total.value" defaultValue="8 цаг" className="font-bold text-white" />
                  </p>
                </EditableBackground>
              </div>
              <EditableText
                field="schedule.note"
                defaultValue="* Санамж: 4 ба түүнээс дээш суралцагчийн хүсэлтээр үндсэн цагаас өөр цагийн хуваарьтай анги үүсгэх боломжтой."
                multiline
                as="p"
                className="relative z-10 text-[11px] text-[#8a8a90] italic block"
              />
            </EditableBackground>

            {/* БҮРДҮҮЛЭХ МАТЕРИАЛ */}
            <EditableBackground
              field="materials.imageUrl"
              className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl space-y-4"
              fallbackClassName="bg-[#121215]"
              placeholder="Card background"
              editMode="corner"
            >
              <EditableText
                field="materials.title"
                defaultValue="БҮРДҮҮЛЭХ МАТЕРИАЛ"
                as="h3"
                className="relative z-10 font-heading text-sm font-bold uppercase tracking-wider text-[#e31e24] block"
              />
              <div className="relative z-10 grid gap-3 sm:grid-cols-2">
                {[
                  "Анкет, аюулгүй ажиллагааны баталгаа (Сургалтад хамрагдах үед бөглөнө)",
                  "3x4 хэмжээтэй цээж зураг (Файлаар болон хэвлэмэл)",
                  "Иргэний үнэмлэхийн цахим лавлагаа (E-Mongolia-с .pdf)",
                  "Оршин суугаа хаягийн тодорхойлолт (E-Mongolia-с .pdf)",
                ].map((mat, i) => (
                  <EditableBackground
                    key={i}
                    field={`materials.items.${i}.imageUrl`}
                    className="flex items-start gap-2.5 rounded-xl border border-[#ffffff10] p-3 text-xs text-[#a0a0a5]"
                    fallbackClassName="bg-[#0c0c0e]"
                    placeholder="Item background"
                    editMode="corner"
                  >
                    <FileCheck className="relative z-10 size-4 shrink-0 text-[#e31e24] mt-0.5" />
                    <EditableText field={`materials.items.${i}.text`} defaultValue={mat} multiline as="p" className="relative z-10 block" />
                  </EditableBackground>
                ))}
              </div>
              <p className="relative z-10 text-[11px] text-[#8a8a90]">
                <EditableText field="materials.note.prefix" defaultValue="Санамж: Дээрх материалыг" />{" "}
                <EditableText field="materials.note.email" defaultValue="registration@prime.mn" className="font-bold text-[#e31e24]" />{" "}
                <EditableText field="materials.note.middle" defaultValue="хаягаар илгээх эсвэл" />{" "}
                <EditableText field="materials.note.phone" defaultValue="9088-0200" className="font-bold text-white" />{" "}
                <EditableText field="materials.note.suffix" defaultValue="утасаар мэдэгдэнэ үү." />
              </p>
            </EditableBackground>

            {/* ТӨЛБӨРИЙН МЭДЭЭЛЭЛ */}
            <EditableBackground
              field="payment.imageUrl"
              className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl space-y-4"
              fallbackClassName="bg-[#121215]"
              placeholder="Card background"
              editMode="corner"
            >
              <EditableText
                field="payment.title"
                defaultValue="ТӨЛБӨРИЙН МЭДЭЭЛЭЛ"
                as="h3"
                className="relative z-10 font-heading text-sm font-bold uppercase tracking-wider text-white block"
              />
              <div className="relative z-10 grid gap-4 sm:grid-cols-2 text-xs">
                <EditableBackground
                  field="payment.bank.imageUrl"
                  className="rounded-xl border border-[#e31e24]/30 p-4 space-y-1 text-[#a0a0a5]"
                  fallbackClassName="bg-[#161412]"
                  placeholder="Bank card background"
                  editMode="corner"
                >
                  <p className="relative z-10">
                    <EditableText field="payment.bank.account.label" defaultValue="Данс:" />{" "}
                    <EditableText field="payment.bank.account.value" defaultValue="800065600" className="font-bold text-white" />
                  </p>
                  <p className="relative z-10">
                    <EditableText field="payment.bank.name.label" defaultValue="Дансны нэр:" />{" "}
                    <EditableText field="payment.bank.name.value" defaultValue="Праим Буудлагын Академи" className="font-bold text-white" />
                  </p>
                  <p className="relative z-10">
                    <EditableText field="payment.bank.iban.label" defaultValue="IBAN:" />{" "}
                    <EditableText field="payment.bank.iban.value" defaultValue="40000 4000 8000 96500" className="font-bold text-[#e31e24]" />
                  </p>
                  <p className="relative z-10">
                    <EditableText field="payment.bank.reference.label" defaultValue="Гүйцэтгэх утга:" />{" "}
                    <EditableText field="payment.bank.reference.value" defaultValue="Утасны дугаар, course1" className="font-bold text-white" />
                  </p>
                </EditableBackground>
                <EditableBackground
                  field="payment.refund.imageUrl"
                  className="rounded-xl border border-[#ffffff10] p-4 space-y-2 text-[#a0a0a5]"
                  fallbackClassName="bg-[#0c0c0e]"
                  placeholder="Refund card background"
                  editMode="corner"
                >
                  <EditableText field="payment.refund.title" defaultValue="Төлбөрийн буцаалт (торгууль)" as="h4" className="relative z-10 font-bold text-[#e31e24] block" />
                  <p className="relative z-10">
                    <EditableText field="payment.refund.early.label" defaultValue="• 24-48 цагийн өмнө мэдэгдсэн бол:" />{" "}
                    <EditableText field="payment.refund.early.value" defaultValue="10%" className="font-bold text-white" />
                  </p>
                  <p className="relative z-10">
                    <EditableText field="payment.refund.late.label" defaultValue="• 24 цагийн дотор мэдэгдсэн бол:" />{" "}
                    <EditableText field="payment.refund.late.value" defaultValue="20%" className="font-bold text-white" />
                  </p>
                </EditableBackground>
              </div>
            </EditableBackground>

            {/* СУРГАЛТЫГ ТӨГССӨНӨӨР */}
            <EditableBackground
              field="outcomes.imageUrl"
              className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl space-y-4"
              fallbackClassName="bg-[#121215]"
              placeholder="Card background"
              editMode="corner"
            >
              <EditableText
                field="outcomes.title"
                defaultValue="СУРГАЛТЫГ ТӨГССӨНӨӨР"
                as="h3"
                className="relative z-10 font-heading text-sm font-bold uppercase tracking-wider text-[#e31e24] block"
              />
              <div className="relative z-10 grid gap-3 sm:grid-cols-2 text-xs text-white font-semibold">
                <EditableBackground
                  field="outcomes.items.0.imageUrl"
                  className="flex items-center gap-2 rounded-xl border border-[#ffffff10] p-3"
                  fallbackClassName="bg-[#0c0c0e]"
                  placeholder="Item background"
                  editMode="corner"
                >
                  <CheckCircle2 className="relative z-10 size-4 text-[#e31e24]" />
                  <EditableText field="outcomes.items.0.text" defaultValue="Course 2-д хамрагдах эрх" className="relative z-10" />
                </EditableBackground>
                <EditableBackground
                  field="outcomes.items.1.imageUrl"
                  className="flex items-center gap-2 rounded-xl border border-[#ffffff10] p-3"
                  fallbackClassName="bg-[#0c0c0e]"
                  placeholder="Item background"
                  editMode="corner"
                >
                  <CheckCircle2 className="relative z-10 size-4 text-[#e31e24]" />
                  <EditableText field="outcomes.items.1.text" defaultValue="Баталгаа, суурь техниктэй болно" className="relative z-10" />
                </EditableBackground>
                <EditableBackground
                  field="outcomes.items.2.imageUrl"
                  className="flex items-center gap-2 rounded-xl border border-[#ffffff10] p-3"
                  fallbackClassName="bg-[#0c0c0e]"
                  placeholder="Item background"
                  editMode="corner"
                >
                  <CheckCircle2 className="relative z-10 size-4 text-[#e31e24]" />
                  <EditableText field="outcomes.items.2.text" defaultValue="Аюулгүй ажиллагааны суурь эзэмшинэ" className="relative z-10" />
                </EditableBackground>
                <EditableBackground
                  field="outcomes.items.3.imageUrl"
                  className="flex items-center gap-2 rounded-xl border border-[#ffffff10] p-3"
                  fallbackClassName="bg-[#0c0c0e]"
                  placeholder="Item background"
                  editMode="corner"
                >
                  <CheckCircle2 className="relative z-10 size-4 text-[#e31e24]" />
                  <EditableText field="outcomes.items.3.text" defaultValue="Клубын үйл ажиллагаатай танилцана" className="relative z-10" />
                </EditableBackground>
              </div>
            </EditableBackground>
          </div>

          {/* RIGHT STICKY REGISTRATION FORM */}
          <div id="register" className="sticky top-24">
            <EditableBackground
              field="form.imageUrl"
              className="rounded-2xl border border-[#e31e24]/50 p-6 shadow-2xl"
              fallbackClassName="bg-[#121215]"
              placeholder="Form background"
              editMode="corner"
            >
              <EditableText
                field="form.title"
                defaultValue="СУРГАЛТЫН БҮРТГЭЛ (Course 1)"
                as="h3"
                className="relative z-10 font-heading text-base font-bold uppercase tracking-wider text-white block"
              />

              {/* 3 Step Indicator Header */}
              <div className="relative z-10 mt-4 flex items-center justify-between border-b border-[#ffffff15] pb-3 text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-[#e31e24]">
                  <EditableText field="form.steps.0.number" defaultValue="1" className="flex size-5 items-center justify-center rounded-full bg-[#e31e24] text-[10px] text-white" />
                  <EditableText field="form.steps.0.label" defaultValue="Мэдээлэл" />
                </span>
                <span className="flex items-center gap-1.5 text-[#a0a0a5]">
                  <EditableText field="form.steps.1.number" defaultValue="2" className="flex size-5 items-center justify-center rounded-full bg-[#1b1b20] text-[10px]" />
                  <EditableText field="form.steps.1.label" defaultValue="Баталгаажуулалт" />
                </span>
                <span className="flex items-center gap-1.5 text-[#a0a0a5]">
                  <EditableText field="form.steps.2.number" defaultValue="3" className="flex size-5 items-center justify-center rounded-full bg-[#1b1b20] text-[10px]" />
                  <EditableText field="form.steps.2.label" defaultValue="Амжилттай" />
                </span>
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 mt-5 space-y-3.5">
                <div>
                  <EditableText field="form.name.label" defaultValue="Овог, нэр *" as="label" className="block text-xs font-semibold text-[#a0a0a5]" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Жишээ: Батзориг"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>

                <div>
                  <EditableText field="form.gender.label" defaultValue="Хүйс *" as="label" className="block text-xs font-semibold text-[#a0a0a5]" />
                  <div className="mt-1 flex gap-4 text-xs text-white">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={() => setFormData({ ...formData, gender: "male" })}
                        className="accent-[#e31e24]"
                      />
                      <EditableText field="form.gender.male" defaultValue="Эрэгтэй" />
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={() => setFormData({ ...formData, gender: "female" })}
                        className="accent-[#e31e24]"
                      />
                      <EditableText field="form.gender.female" defaultValue="Эмэгтэй" />
                    </label>
                  </div>
                </div>

                <div>
                  <EditableText field="form.hand.label" defaultValue="Хүчтэй гарын байрлал *" as="label" className="block text-xs font-semibold text-[#a0a0a5]" />
                  <div className="mt-1 flex gap-4 text-xs text-white">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="hand"
                        value="right"
                        checked={formData.hand === "right"}
                        onChange={() => setFormData({ ...formData, hand: "right" })}
                        className="accent-[#e31e24]"
                      />
                      <EditableText field="form.hand.right" defaultValue="Баруун" />
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="hand"
                        value="left"
                        checked={formData.hand === "left"}
                        onChange={() => setFormData({ ...formData, hand: "left" })}
                        className="accent-[#e31e24]"
                      />
                      <EditableText field="form.hand.left" defaultValue="Солой" />
                    </label>
                  </div>
                </div>

                <div>
                  <EditableText
                    field="form.medical.label"
                    defaultValue="Ямар нэгэн суурь өвчин, харшилтай эсэх"
                    as="label"
                    className="block text-xs font-semibold text-[#a0a0a5]"
                  />
                  <input
                    type="text"
                    value={formData.medical}
                    onChange={(e) => setFormData({ ...formData, medical: e.target.value })}
                    placeholder="Жишээ: Харшилгүй"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>

                <div>
                  <EditableText field="form.email.label" defaultValue="И-мэйл хаяг *" as="label" className="block text-xs font-semibold text-[#a0a0a5]" />
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
                  <EditableText field="form.phone.label" defaultValue="Гар утасны дугаар *" as="label" className="block text-xs font-semibold text-[#a0a0a5]" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9988-1234"
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>

                <div>
                  <EditableText
                    field="form.schedule.label"
                    defaultValue="Сургалтад хамрагдах боломжит цагаа сонгоно уу *"
                    as="label"
                    className="block text-xs font-semibold text-[#a0a0a5]"
                  />
                  <select
                    value={formData.schedule}
                    onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white outline-none focus:border-[#e31e24]"
                  >
                    <option value="Ажлын өдрийн анги (Дав, Лха, Баа 19:00-22:00)">Ажлын өдрийн анги (Дав, Лха, Баа 19:00-22:00)</option>
                    <option value="Амралтын өдрийн анги (Бям, Ням 18:00-22:00)">Амралтын өдрийн анги (Бям, Ням 18:00-22:00)</option>
                  </select>
                </div>

                <div>
                  <EditableText
                    field="form.purpose.label"
                    defaultValue="Сургалтад хамрагдаж байгаа зорилго *"
                    as="label"
                    className="block text-xs font-semibold text-[#a0a0a5]"
                  />
                  <textarea
                    rows={2}
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Жишээ: Хобби, өөрийгөө хөгжүүлэх, тэмцээнд оролцох..."
                    className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#e31e24] text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#c91920]"
                >
                  <EditableText field="form.submit" defaultValue="БҮРТГҮҮЛЭХ" />
                  <ArrowRight className="size-4" />
                </button>

                <EditableText
                  field="form.privacyNote"
                  defaultValue="🔒 Таны мэдээлэл хамгаалагдсан болно."
                  as="p"
                  className="mt-2 text-center text-[10px] text-[#a0a0a5] block"
                />
              </form>
            </EditableBackground>
          </div>
        </div>
      </ContentSection>

      {/* SPECIAL OFFER BANNER */}
      <ContentSection id="offer" dark>
        <EditableBackground
          field="offer.imageUrl"
          className="relative overflow-hidden rounded-3xl border border-[#e31e24]/50 p-8 md:p-10 shadow-2xl"
          fallbackClassName="bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707]"
          placeholder="Offer banner background"
          editMode="corner"
        >
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <EditableText
                field="offer.eyebrow"
                defaultValue="SPECIAL OFFER ——"
                as="p"
                className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24] block"
              />
              <h2 className="mt-1 font-heading text-2xl font-extrabold uppercase text-white md:text-3xl">
                <EditableText field="offer.title" defaultValue="Course 1 + Course 2 хамт бүртгүүлбэл" />{" "}
                <EditableText field="offer.price" defaultValue="650,000₮" className="text-[#e31e24]" />
              </h2>
            </div>
            <RedButton href="#register">
              <EditableText field="offer.cta" defaultValue="ХАМТ БҮРТГҮҮЛЭХ →" />
            </RedButton>
          </div>
        </EditableBackground>
      </ContentSection>

      {/* FAQ SECTION */}
      <ContentSection id="faq">
        <SectionTag n="FAQ" label="ТҮГЭЭМЭЛ АСУУЛТ" />
        <EditableText
          field="faq.title"
          defaultValue="ТҮГЭЭМЭЛ АСУУЛТ"
          as="h2"
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
        />

        <div className="mt-8 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <EditableBackground
                key={idx}
                field={`faq.${idx}.imageUrl`}
                className="overflow-hidden rounded-2xl border border-[#ffffff15] shadow-lg"
                fallbackClassName="bg-[#121215]"
                placeholder="FAQ background"
                editMode="corner"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="relative z-10 flex w-full items-center justify-between p-5 text-left text-xs font-bold text-white transition hover:text-[#e31e24]"
                >
                  <EditableText field={`faq.${idx}.q`} defaultValue={faq.q} />
                  <ChevronDown className={`size-4 text-[#e31e24] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="relative z-10 border-t border-[#ffffff10] p-5 text-xs leading-relaxed text-[#a0a0a5] bg-[#0c0c0e]">
                    <EditableText field={`faq.${idx}.a`} defaultValue={faq.a} multiline as="p" className="block" />
                  </div>
                )}
              </EditableBackground>
            );
          })}
        </div>

        {/* Need Help Card */}
        <EditableBackground
          field="help.imageUrl"
          className="mt-10 rounded-2xl border border-[#ffffff15] p-6 text-center space-y-3"
          fallbackClassName="bg-[#121215]"
          placeholder="Help card background"
          editMode="corner"
        >
          <Headphones className="relative z-10 mx-auto size-8 text-[#e31e24]" />
          <EditableText
            field="help.title"
            defaultValue="НЭМЭЛТ АСУУЛТ БАЙНА УУ?"
            as="h4"
            className="relative z-10 font-heading text-sm font-bold uppercase text-white block"
          />
          <EditableText field="help.body" defaultValue="Бидэнтэй холбогдон уу." as="p" className="relative z-10 text-xs text-[#a0a0a5] block" />
          <div className="relative z-10 flex flex-wrap justify-center gap-6 pt-2 text-xs font-mono font-bold text-white">
            <span className="flex items-center gap-2"><Phone className="size-4 text-[#e31e24]" /> <EditableText field="help.phone" defaultValue="9088-0200" /></span>
            <span className="flex items-center gap-2"><Mail className="size-4 text-[#e31e24]" /> <EditableText field="help.email" defaultValue="registration@prime.mn" /></span>
          </div>
        </EditableBackground>
      </ContentSection>
    </>
  );
}
