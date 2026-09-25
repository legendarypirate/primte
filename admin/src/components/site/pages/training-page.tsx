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
import { EditableBackground } from "@/components/site/editable-background";
import { EditableText } from "@/components/site/editable-text";
import { usePageContent } from "@/components/site/page-content-context";
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
  const ctx = usePageContent();
  const resolvedSteps = steps.map((step, idx) => ({
    ...step,
    label: ctx ? ctx.getField(`steps.${idx}.label`, step.label) : step.label,
  }));
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
          <EditableBackground
            field="hero.aside.imageUrl"
            className="rounded-2xl border border-[#e31e24]/40 p-8 text-right shadow-2xl"
            fallbackClassName="bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707]"
            editMode="corner"
          >
            <EditableText
              field="hero.aside.eyebrow"
              defaultValue="DISCIPLINE · SKILL"
              as="p"
              className="relative z-10 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24] block"
            />
            <EditableText
              field="hero.aside.title"
              defaultValue="A SAFER TOMORROW"
              as="h3"
              className="relative z-10 mt-2 font-heading text-2xl font-extrabold uppercase text-white block"
            />
            <EditableText
              field="hero.aside.body"
              defaultValue="Аюулгүй байдал, практик буудлагын бодит дадлага сургалт."
              multiline
              as="p"
              className="relative z-10 mt-2 text-xs leading-relaxed text-[#a0a0a5] block"
            />
          </EditableBackground>
        }
      >
        <RedButton href="#courses">
          <EditableText field="hero.ctaPrimary" defaultValue="СУРГАЛТАНД БҮРТГҮҮЛЭХ" />
          <ArrowRight className="size-4" />
        </RedButton>
        <OutlineButton href="#courses">
          <EditableText field="hero.ctaSecondary" defaultValue="COURSE-ҮҮД ҮЗЭХ" />
        </OutlineButton>
      </PageHero>

      {/* 02 - ЯАГААД PRIME-ЫГ СОНГОХ ВЭ? */}
      <ContentSection id="why" dark>
        <SectionTag n="02" label="ЯАГААД PRIME-ЫГ СОНГОХ ВЭ?" />
        <EditableText
          field="why.title"
          defaultValue="СУРГАЛТЫН ДАВУУ ТАЛУУД"
          as="h2"
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
        />
        <EditableText
          field="why.description"
          defaultValue="Бодит буудлагад ойр, аюулгүй, хөдөлгөөний ба тактикийн иж бүрэн соёлд суралцана."
          multiline
          as="p"
          className="mt-2 max-w-2xl text-xs text-muted-foreground block"
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map(({ icon: Icon, title, desc }, idx) => (
            <EditableBackground
              key={title}
              field={`why.${idx}.imageUrl`}
              className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl transition-all hover:border-[#e31e24]/50"
              fallbackClassName="bg-[#121215]"
              editMode="corner"
            >
              <div className="relative z-10 mb-4 flex size-12 items-center justify-center rounded-xl border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
                <Icon className="size-6" />
              </div>
              <EditableText
                field={`why.${idx}.title`}
                defaultValue={title}
                as="h4"
                className="relative z-10 font-heading text-sm font-bold text-white uppercase block"
              />
              <EditableText
                field={`why.${idx}.desc`}
                defaultValue={desc}
                multiline
                as="p"
                className="relative z-10 mt-2 text-xs leading-relaxed text-[#a0a0a5] block"
              />
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* 03 - СУРГАЛТЫН ХӨТӨЛБӨРҮҮД */}
      <ContentSection id="courses">
        <SectionTag n="03" label="СУРГАЛТЫН ХӨТӨЛБӨРҮҮД" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <EditableText
              field="courses.title"
              defaultValue="СУРГАЛТЫН ХӨТӨЛБӨРҮҮД"
              as="h2"
              className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
            />
            <EditableText
              field="courses.description"
              defaultValue="Та өөрийн түвшинд тохирох сургалтыг сонгоно уу."
              as="p"
              className="text-xs text-muted-foreground block"
            />
          </div>
          <Link href="/training/course-1" className="text-xs font-bold text-[#e31e24] hover:underline">
            <EditableText field="courses.allLink" defaultValue="ALL COURSES →" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {courses.map((c, idx) => (
            <EditableBackground
              key={c.id}
              field={`courses.${idx}.imageUrl`}
              className="flex flex-col justify-between rounded-2xl border border-[#ffffff15] p-6 shadow-xl transition-all hover:border-[#e31e24]/60"
              fallbackClassName="bg-[#121215]"
              editMode="corner"
            >
              <div className="relative z-10">
                <EditableText
                  field={`courses.${idx}.code`}
                  defaultValue={c.code}
                  className="font-mono text-xs font-bold uppercase tracking-widest text-[#e31e24]"
                />
                <EditableText
                  field={`courses.${idx}.title`}
                  defaultValue={c.title}
                  as="h3"
                  className="mt-2 font-heading text-base font-bold text-white uppercase block"
                />
                <EditableText
                  field={`courses.${idx}.type`}
                  defaultValue={c.type}
                  as="p"
                  className="mt-1 text-xs text-[#a0a0a5] block"
                />

                <div className="mt-6 space-y-2 border-t border-[#ffffff10] pt-4 text-xs text-[#a0a0a5]">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-[#e31e24]" />
                    <EditableText field={`courses.${idx}.duration`} defaultValue={c.duration} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-[#e31e24]" />
                    <EditableText field={`courses.${idx}.capacity`} defaultValue={c.capacity} />
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 border-t border-[#ffffff10] pt-4">
                <EditableText
                  field={`courses.${idx}.price`}
                  defaultValue={c.price}
                  as="p"
                  className="font-mono text-2xl font-extrabold text-[#e31e24] block"
                />
                <div className="mt-4 flex gap-2">
                  <Link
                    href={c.href}
                    className="flex h-10 flex-1 items-center justify-center rounded-lg border border-[#ffffff20] bg-[#1b1b20] text-xs font-bold text-white transition hover:border-[#e31e24] hover:text-[#e31e24]"
                  >
                    <EditableText field={`courses.${idx}.detailsText`} defaultValue="ДЭЛГЭРЭНГҮЙ" />
                  </Link>
                  <Link
                    href={c.href}
                    className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#e31e24] text-xs font-bold text-white shadow-md transition hover:bg-[#c91920]"
                  >
                    <EditableText field={`courses.${idx}.buttonText`} defaultValue={c.buttonText} />
                  </Link>
                </div>
              </div>
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* 04 - СУРГАЛТЫН ХАРЬЦУУЛАЛТ */}
      <ContentSection id="compare" dark>
        <SectionTag n="04" label="СУРГАЛТЫН ХАРЬЦУУЛАЛТ" />
        <EditableText
          field="compare.title"
          defaultValue="СУРГАЛТЫН ХАРЬЦУУЛАЛТ"
          as="h2"
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
        />

        <EditableBackground
          field="compare.tableImageUrl"
          className="mt-8 overflow-x-auto rounded-2xl border border-[#ffffff15]"
          fallbackClassName="bg-[#121215]"
          editMode="corner"
        >
          <table className="relative z-10 w-full min-w-[700px] text-left text-xs">
            <thead className="border-b border-[#ffffff15] bg-[#0a0a0c] font-mono text-[11px] font-bold uppercase tracking-wider text-[#e31e24]">
              <tr>
                <th className="p-4">
                  <EditableText field="compare.header.feature" defaultValue="Үзүүлэлт" />
                </th>
                <th className="p-4">
                  <EditableText field="compare.header.c1" defaultValue="COURSE 1 / Анхан шат" />
                </th>
                <th className="p-4">
                  <EditableText field="compare.header.c2" defaultValue="COURSE 2 / Анхан дунд шат" />
                </th>
                <th className="p-4">
                  <EditableText field="compare.header.junior" defaultValue="Жуниор хөтөлбөр" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff10] text-[#a0a0a5]">
              {compareMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#16161b]">
                  <td className="p-4 font-bold text-white">
                    <EditableText field={`compare.${idx}.feature`} defaultValue={row.feature} />
                  </td>
                  <td className="p-4">
                    <EditableText field={`compare.${idx}.c1`} defaultValue={row.c1} />
                  </td>
                  <td className="p-4">
                    <EditableText field={`compare.${idx}.c2`} defaultValue={row.c2} />
                  </td>
                  <td className="p-4">
                    <EditableText field={`compare.${idx}.junior`} defaultValue={row.junior} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </EditableBackground>
      </ContentSection>

      {/* 05 - СУРГАЛТЫН ХУВААРЬ */}
      <ContentSection id="schedule">
        <SectionTag n="05" label="СУРГАЛТЫН ХУВААРЬ" />
        <EditableText
          field="schedule.title"
          defaultValue="СУРГАЛТЫН ХУВААРЬ"
          as="h2"
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <EditableBackground
            field="schedule.weekday.imageUrl"
            className="flex flex-col justify-between rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <div className="relative z-10">
              <Calendar className="mb-3 size-8 text-[#e31e24]" />
              <EditableText
                field="schedule.weekday.title"
                defaultValue="АЖЛЫН ӨДРИЙН АНГИ"
                as="h4"
                className="font-heading text-sm font-bold text-white uppercase block"
              />
              <EditableText
                field="schedule.weekday.days"
                defaultValue="Даваа / Лхагва / Баасан"
                as="p"
                className="mt-2 text-xs text-[#a0a0a5] block"
              />
              <EditableText
                field="schedule.weekday.time"
                defaultValue="19:00 - 22:00"
                as="p"
                className="mt-1 font-mono text-sm font-bold text-[#e31e24] block"
              />
            </div>
            <ArrowRight className="relative z-10 mt-4 size-5 text-[#e31e24]" />
          </EditableBackground>

          <EditableBackground
            field="schedule.weekend.imageUrl"
            className="flex flex-col justify-between rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <div className="relative z-10">
              <Calendar className="mb-3 size-8 text-[#e31e24]" />
              <EditableText
                field="schedule.weekend.title"
                defaultValue="АМРАЛТЫН ӨДРИЙН АНГИ"
                as="h4"
                className="font-heading text-sm font-bold text-white uppercase block"
              />
              <EditableText
                field="schedule.weekend.days"
                defaultValue="Бямба / Ням"
                as="p"
                className="mt-2 text-xs text-[#a0a0a5] block"
              />
              <EditableText
                field="schedule.weekend.time"
                defaultValue="18:00 - 22:00"
                as="p"
                className="mt-1 font-mono text-sm font-bold text-[#e31e24] block"
              />
            </div>
            <ArrowRight className="relative z-10 mt-4 size-5 text-[#e31e24]" />
          </EditableBackground>

          <EditableBackground
            field="schedule.custom.imageUrl"
            className="flex flex-col justify-between rounded-2xl border border-[#e31e24]/40 p-6 shadow-xl"
            fallbackClassName="bg-[#161412]"
            editMode="corner"
          >
            <div className="relative z-10">
              <Users className="mb-3 size-8 text-[#e31e24]" />
              <EditableText
                field="schedule.custom.title"
                defaultValue="ТУСГАЙ ЦАГ ҮҮСГЭХ БОЛОМЖ"
                as="h4"
                className="font-heading text-sm font-bold text-white uppercase block"
              />
              <EditableText
                field="schedule.custom.body"
                defaultValue="6+ суралцагчтай бол хүссэн цагт тусгай анги үүсгэнэ."
                multiline
                as="p"
                className="mt-2 text-xs text-[#a0a0a5] block"
              />
            </div>
            <EditableText
              field="schedule.custom.tagline"
              defaultValue="TRAIN PRACTICE PROGRESS"
              className="relative z-10 mt-4 font-mono text-[10px] font-bold text-[#e31e24]"
            />
          </EditableBackground>
        </div>
      </ContentSection>

      {/* 06 - БҮРТГҮҮЛЭХ АЛХАМ */}
      <ContentSection id="steps" dark>
        <SectionTag n="06" label="БҮРТГҮҮЛЭХ АЛХАМ" />
        <EditableText
          field="steps.title"
          defaultValue="ХӨНГӨН 5 АЛХАМ"
          as="h2"
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
        />

        <div className="mt-8">
          <Stepper steps={resolvedSteps} currentStep={3} />
          {ctx?.editing ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-5">
              {steps.map((step, idx) => (
                <EditableText
                  key={step.number}
                  field={`steps.${idx}.label`}
                  defaultValue={step.label}
                  className="text-xs font-semibold uppercase tracking-wider text-white"
                />
              ))}
            </div>
          ) : null}
        </div>
      </ContentSection>

      {/* 07 - ШААРДЛАГАТАЙ БАРИМТ БИЧИГ */}
      <ContentSection id="docs">
        <SectionTag n="07" label="ШААРДЛАГАТАЙ БАРИМТ БИЧИГ" />
        <EditableText
          field="docs.title"
          defaultValue="БҮРДҮҮЛЭХ МАТЕРИАЛ"
          as="h2"
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
        />

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {docRequirements.map((req, idx) => (
            <EditableBackground
              key={req.title}
              field={`docs.${idx}.imageUrl`}
              className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
              fallbackClassName="bg-[#121215]"
              editMode="corner"
            >
              <EditableText
                field={`docs.${idx}.title`}
                defaultValue={req.title}
                as="h4"
                className="relative z-10 font-heading text-xs font-bold uppercase tracking-wider text-[#e31e24] block"
              />
              <ul className="relative z-10 mt-4 space-y-2.5 text-xs text-[#a0a0a5]">
                {req.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-[#e31e24] mt-0.5" />
                    <EditableText field={`docs.${idx}.items.${j}`} defaultValue={item} />
                  </li>
                ))}
              </ul>
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* 08 - БАГШ, ИНСТРУКТОРУУД */}
      <ContentSection id="instructors" dark>
        <SectionTag n="08" label="БАГШ, ИНСТРУКТОРУУД" />
        <EditableText
          field="instructors.title"
          defaultValue="МАНАЙ БАГ"
          as="h2"
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
        />


        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {instructors.map((ins, idx) => (
            <div
              key={ins.name}
              className="overflow-hidden rounded-2xl border border-[#ffffff15] bg-[#121215] shadow-xl"
            >
              <EditableBackground
                field={`instructors.${idx}.imageUrl`}
                className="flex h-44 items-center justify-center"
                fallbackClassName="bg-gradient-to-br from-[#1a1814] to-[#070707]"
                editMode="cover"
              >
                <LionIcon className="relative z-10 size-16 text-[#e31e24]/30" />
              </EditableBackground>
              <div className="p-4">
                <EditableText
                  field={`instructors.${idx}.name`}
                  defaultValue={ins.name}
                  as="h4"
                  className="font-heading text-sm font-bold text-white block"
                />
                <EditableText
                  field={`instructors.${idx}.role`}
                  defaultValue={ins.role}
                  as="p"
                  className="mt-1 text-xs font-semibold text-[#e31e24] block"
                />
                <EditableText
                  field={`instructors.${idx}.sub`}
                  defaultValue={ins.sub}
                  as="p"
                  className="mt-0.5 text-[10px] text-[#a0a0a5] block"
                />
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
          <EditableBackground
            field="register.form.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <EditableText
              field="register.form.title"
              defaultValue="Сургалтын бүртгэл"
              as="h3"
              className="relative z-10 font-heading text-lg font-bold uppercase text-white block"
            />
            <EditableText
              field="register.form.description"
              defaultValue="Өөрийн мэдээллээ оруулж бүртгүүлнэ үү."
              as="p"
              className="relative z-10 mt-1 text-xs text-[#a0a0a5] block"
            />

            <form onSubmit={handleFormSubmit} className="relative z-10 mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <EditableText
                    field="register.form.nameLabel"
                    defaultValue="Овог, нэр *"
                    as="label"
                    className="block text-xs font-semibold text-[#a0a0a5]"
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
                <div>
                  <EditableText
                    field="register.form.emailLabel"
                    defaultValue="И-мэйл *"
                    as="label"
                    className="block text-xs font-semibold text-[#a0a0a5]"
                  />
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
                  <EditableText
                    field="register.form.phoneLabel"
                    defaultValue="Гар утас *"
                    as="label"
                    className="block text-xs font-semibold text-[#a0a0a5]"
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
                <div>
                  <EditableText
                    field="register.form.courseLabel"
                    defaultValue="Course сонгох"
                    as="label"
                    className="block text-xs font-semibold text-[#a0a0a5]"
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
                    field="register.form.timeLabel"
                    defaultValue="Боломжит цаг"
                    as="label"
                    className="block text-xs font-semibold text-[#a0a0a5]"
                  />
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
                <EditableText
                  field="register.form.notesLabel"
                  defaultValue="Зурвас / Тайлбар"
                  as="label"
                  className="block text-xs font-semibold text-[#a0a0a5]"
                />
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Тайлбар бичнэ үү..."
                  className="mt-1 w-full rounded-lg border border-[#ffffff15] bg-[#0c0c0e] px-3 py-2 text-xs text-white placeholder-muted-foreground outline-none focus:border-[#e31e24]"
                />
              </div>

              <RedButton onClick={() => handleFormSubmit} className="w-full">
                <EditableText field="register.form.submit" defaultValue="БҮРТГЭЛ ИЛГЭЭХ →" />
              </RedButton>
            </form>
          </EditableBackground>

          {/* Payment & Contact Box */}
          <div className="space-y-4">
            <EditableBackground
              field="register.contact.imageUrl"
              className="rounded-2xl border border-[#e31e24]/40 p-6 shadow-xl space-y-4"
              fallbackClassName="bg-[#161412]"
              editMode="corner"
            >
              <EditableText
                field="register.contact.title"
                defaultValue="ХОЛБОО БАРИХ"
                as="h4"
                className="relative z-10 font-heading text-sm font-bold uppercase tracking-wider text-[#e31e24] block"
              />
              <ul className="relative z-10 space-y-3 text-xs text-[#a0a0a5]">
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-[#e31e24]" />
                  <EditableText field="register.contact.email" defaultValue="registration@prime.mn" />
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 text-[#e31e24]" />
                  <EditableText field="register.contact.phone1" defaultValue="9088-0200" />
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 text-[#e31e24]" />
                  <EditableText field="register.contact.phone2" defaultValue="8611-0200" />
                </li>
              </ul>
            </EditableBackground>

            <EditableBackground
              field="register.payment.imageUrl"
              className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl space-y-3"
              fallbackClassName="bg-[#121215]"
              editMode="corner"
            >
              <EditableText
                field="register.payment.title"
                defaultValue="ТӨЛБӨРИЙН МЭДЭЭЛЭЛ"
                as="h4"
                className="relative z-10 font-heading text-sm font-bold uppercase tracking-wider text-white block"
              />
              <p className="relative z-10 text-xs text-[#a0a0a5]">
                <EditableText field="register.payment.accountLabel" defaultValue="Данс:" />{" "}
                <strong className="text-white">
                  <EditableText field="register.payment.account" defaultValue="800065600 (Худалдаа хөгжлийн банк)" />
                </strong>
                <br />
                <EditableText field="register.payment.accountNameLabel" defaultValue="Дансны нэр:" />{" "}
                <strong className="text-white">
                  <EditableText field="register.payment.accountName" defaultValue="Праим Буудлагын Академи" />
                </strong>
                <br />
                <EditableText field="register.payment.ibanLabel" defaultValue="IBAN:" />{" "}
                <strong className="text-[#e31e24]">
                  <EditableText field="register.payment.iban" defaultValue="40000 4000 8000 96500" />
                </strong>
                <br />
                <EditableText field="register.payment.referenceLabel" defaultValue="Гүйцэтгэх утга:" />{" "}
                <strong className="text-white">
                  <EditableText field="register.payment.reference" defaultValue="Утасны дугаар, course1 / course2" />
                </strong>
              </p>
            </EditableBackground>
          </div>
        </div>
      </ContentSection>

      {/* 10 - НЭМЭЛТ МЭДЭЭЛЭЛ */}
      <ContentSection id="discounts" dark>
        <SectionTag n="10" label="НЭМЭЛТ МЭДЭЭЛЭЛ" />
        <div className="grid gap-4 sm:grid-cols-3">
          <EditableBackground
            field="discounts.refund.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <EditableText
              field="discounts.refund.title"
              defaultValue="Төлбөрийн буцаалт"
              as="h4"
              className="relative z-10 font-heading text-xs font-bold uppercase text-[#e31e24] block"
            />
            <EditableText
              field="discounts.refund.body"
              defaultValue="24-48 цагийн өмнө мэдэгдсэн бол 10%, 24 цагийн дотор 20% торгуультай."
              multiline
              as="p"
              className="relative z-10 mt-2 text-xs leading-relaxed text-[#a0a0a5] block"
            />
          </EditableBackground>

          <EditableBackground
            field="discounts.combo.imageUrl"
            className="rounded-2xl border border-[#e31e24]/50 p-6 shadow-xl"
            fallbackClassName="bg-[#181612]"
            editMode="corner"
          >
            <EditableText
              field="discounts.combo.title"
              defaultValue="2 шат хамт бүртгүүлбэл"
              as="h4"
              className="relative z-10 font-heading text-xs font-bold uppercase text-[#e31e24] block"
            />
            <EditableText
              field="discounts.combo.price"
              defaultValue="650,000₮"
              as="p"
              className="relative z-10 mt-1 font-mono text-2xl font-extrabold text-[#e31e24] block"
            />
            <EditableText
              field="discounts.combo.note"
              defaultValue="(Course 1 + Course 2 combo)"
              as="p"
              className="relative z-10 mt-1 text-[11px] text-[#a0a0a5] block"
            />
          </EditableBackground>

          <EditableBackground
            field="discounts.junior.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <EditableText
              field="discounts.junior.title"
              defaultValue="Жуниор урьдчилсан бүртгэл"
              as="h4"
              className="relative z-10 font-heading text-xs font-bold uppercase text-white block"
            />
            <EditableText
              field="discounts.junior.body"
              defaultValue="Суудлын тоо хязгаартай. Урьдчилан анкет бөглөнө үү."
              multiline
              as="p"
              className="relative z-10 mt-2 text-xs leading-relaxed text-[#a0a0a5] block"
            />
          </EditableBackground>
        </div>
      </ContentSection>

      {/* 11 - PRIME-ТАЙ ЭХЛҮҮЛ */}
      <ContentSection id="bottom-cta">
        <EditableBackground
          field="cta.bannerImageUrl"
          className="rounded-3xl border border-[#e31e24]/40 p-8 shadow-2xl md:p-12"
          fallbackClassName="bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707]"
          editMode="corner"
        >
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <EditableText
                field="cta.eyebrow"
                defaultValue="11 —— PRIME-ТАЙ ЭХЛҮҮЛ"
                as="p"
                className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24] block"
              />
              <EditableText
                field="cta.title"
                defaultValue="Мэргэжлийн, аюулгүй буудагч болох аяллаа PRIME-ТАЙ ЭХЛҮҮЛ."
                multiline
                as="h2"
                className="mt-2 font-heading text-3xl font-extrabold uppercase text-white md:text-4xl block"
              />
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <RedButton href="#register">
                <EditableText field="cta.primaryButton" defaultValue="БҮРТГҮҮЛЭХ →" />
              </RedButton>
              <OutlineButton href="/contact">
                <EditableText field="cta.secondaryButton" defaultValue="ХОЛБОО БАРИХ →" />
              </OutlineButton>
            </div>
          </div>
        </EditableBackground>
      </ContentSection>
    </>
  );
}
