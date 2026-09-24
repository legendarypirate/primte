"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Crown,
  FileText,
  Mail,
  Shield,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { EditableText } from "@/components/site/editable-text";
import { ContentSection, LionIcon, OutlineButton, PageHero, RedButton, SectionTag } from "../primitives";

const pointMethods = [
  {
    points: "1 оноо",
    title: "Мэргэжил, Прайм төрөлтийн бэлтгэлд оролцох",
    body: "Тэмцээний тухайн дасгал дахь гүйцэтгэлийн хувь. (дээд оноотой харьцуулсан хувь)",
  },
  {
    points: "2 оноо",
    title: "1р түвшний тэмцээнд оролцолцоо аюулгүй ажиллагааны алдаа гаргаж DQ авсан бол",
    body: "1р түвшний тэмцээнд оролцолцоо аюулгүй ажиллагааны алдаа гаргаж DQ авсан бол",
  },
  {
    points: "5 оноо",
    title: "Нэг тэмцээний үр дүнгээс авах чансааны оноо.",
    body: "1р түвшний тэмцээнд оролцолцоо DQ авагүй бол 2р түвшний тэмцээнд оролцох эрх нээгдэнэ.",
  },
  {
    points: "10 оноо",
    title: "Сарын 1 удаа хөнөлцөлд Тамирчин тэмцээний тайланг бүрүн оруулах ажиллагаанд (Range) оролцох",
    body: "Сарын 1 удаа хөнөлцөлд Тамирчин тэмцээний тайланг бүрүн оруулах ажиллагаанд (Range) оролцох",
  },
];

export function MembershipPage() {
  return (
    <>
      {/* ── Hero ── */}
      <PageHero
        eyebrow="MEMBERSHIP"
        title="ГИШҮҮНЧЛЭЛ"
        description="Аюулгүй, зөв, хариуцлагатай буудлагын соёлыг хамтдаа бүтээе."
        aside={
          <p className="hidden text-right font-serif text-2xl italic text-muted-foreground lg:block">
            Discipline,{" "}
            <span className="text-[#e31e24]">Skill</span>,{" "}
            Community
          </p>
        }
      >
        <RedButton href="/contact">
          ГИШҮҮНЧЛЭЛД ЭЛСЭХ →
        </RedButton>
        <OutlineButton href="/training">АЮУЛГҮЙ БУУДЛАГА, ИЛҮҮ САЙН НИЙГЭМ</OutlineButton>
      </PageHero>

      {/* ── 01 About Membership ── */}
      <ContentSection>
        <SectionTag n="01" label="ABOUT MEMBERSHIP" fieldPrefix="section.01" />
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <EditableText
              field="about.title"
              defaultValue="ПРАЙМ КЛУБЫН ГИШҮҮНЧЛЭЛ"
              as="h2"
              className="font-heading text-3xl font-bold"
            />
            <EditableText
              field="about.body"
              defaultValue="Prime Practical Shooting Club нь практик буудлагын спорт клуб бөгөөд ОУПБХ, МПБХ-ноос олгосон эрхийн дагуу IPSC Action Air тамирын бэлтгэл зохиогоор сургалт явуулах, тэмцээн уралдаан зохион байгуулах, ОУ-ын тэмцээнд тамирчдаа бэлтгэн оролцуулах үндсэн зорилготойгоор 2019 онд байгуулагдсан."
              multiline
              as="p"
              className="mt-6 text-sm leading-7 text-muted-foreground block"
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707]">
              <LionIcon className="size-24 text-[#e31e24]/30" />
              <div className="absolute bottom-4 right-4 text-right">
                <p className="text-xs font-bold tracking-[0.2em] text-[#e31e24]">PRIME</p>
                <p className="text-[8px] tracking-[0.15em] text-muted-foreground">PRACTICAL SHOOTING CLUB</p>
              </div>
              <p className="absolute top-4 right-4 max-w-[140px] text-right text-xs italic text-muted-foreground">
                &ldquo;Аюулгүй буудлага Илүү хариуцлагатай нийгэмд хүргэдэг.&rdquo;
              </p>
              <p className="absolute bottom-4 left-4 text-xs font-semibold text-muted-foreground">
                — PRIME
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="flex gap-4 rounded-xl border border-border bg-card p-5">
            <Shield className="size-5 shrink-0 text-[#e31e24]" />
            <div>
              <p className="text-sm text-muted-foreground">
                Прайм клубын гишүүнээр элсэхийн тулд практик буудлагын спортын аюулгүй ажиллагааны сургалтанд хамрагдах шаардлагатай.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">
              Тухайн сургалтыг дараах газруудад авуулах эрхтэй:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• МПБХ-ны төв клуб – Төв аймаг, Сэргэлэн сум</li>
              <li>• МПБХ-ны Prime клуб.</li>
            </ul>
          </div>
        </div>
      </ContentSection>

      {/* ── 02 Membership Types ── */}
      <ContentSection dark>
        <SectionTag n="02" label="ГИШҮҮНЧЛЭЛИЙН ТӨРӨЛ" />
        <div className="grid gap-6 md:grid-cols-2">
          {/* Adult Membership */}
          <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-[#e31e24]/40">
            <div className="relative h-56 bg-gradient-to-br from-[#1a1410] via-[#161215] to-[#0d0d0f]">
              <div className="absolute inset-0 flex items-center justify-center">
                <LionIcon className="size-20 text-[#e31e24]/20" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d0d0f] to-transparent p-6">
                <Users className="mb-2 size-5 text-[#e31e24]" />
                <p className="text-lg font-bold">НАСАНД ХҮРЭГЧИД</p>
                <p className="text-xs text-muted-foreground">(18-с дээш насны)</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-[#e31e24]">
                250,000<span className="text-lg">₮</span>
                <span className="ml-1 text-sm font-normal text-muted-foreground">/ сар</span>
              </p>
              <Link href="/training" className="mt-4 inline-flex items-center gap-2 text-sm text-[#e31e24] hover:underline">
                Дэлгэрэнгүй →
              </Link>
            </div>
          </div>

          {/* Junior Membership */}
          <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-[#e31e24]/40">
            <div className="relative h-56 bg-gradient-to-br from-[#101820] via-[#12151a] to-[#0d0d0f]">
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="size-20 text-[#e31e24]/20" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d0d0f] to-transparent p-6">
                <Award className="mb-2 size-5 text-[#e31e24]" />
                <p className="text-lg font-bold">ЖУНИОР ХӨТӨЛБӨР</p>
                <p className="text-xs text-muted-foreground">(14-18 насны)</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground">Тухайн суралцагчийн JR түвшингээс хамаарна.</p>
              <Link href="/training/junior" className="mt-4 inline-flex items-center gap-2 text-sm text-[#e31e24] hover:underline">
                Дэлгэрэнгүй →
              </Link>
            </div>
          </div>
        </div>

        {/* Annual membership note */}
        <div className="mt-8 rounded-xl border border-[#ffffff15] bg-[#101012] p-6 text-sm text-muted-foreground leading-7">
          Гишүүнчлэлийн эрх нь сар, сараар сунгагдах ёсвх бөгөөд тухайн сардаа гишүүнчлэлийн эрх нь хүчинтэй байж,
          клубын зохион байгуулсан аливаа үйл ажиллагаанд оролцох эрхээр хэрэгждэг. Клубын гишүүн нь тухайн сард,
          долоо хоног бүрийн амралтын өдрүүдэд жагсаал клубын тэмцээнүүдэд болон мэргэжил, пүрэв гарагуудад зохион
          байгуулдагдаг бэлтгэлүүдэд номхот хураамжгүйгээр оролцох боломжтой.
        </div>
      </ContentSection>

      {/* ── 03 Safety Training ── */}
      <ContentSection>
        <SectionTag n="03" label="АЮУЛГҮЙ АЖИЛЛАГААНЫ СУРГАЛТ" />
        <p className="mb-8 text-sm text-muted-foreground">
          Насанд хүрэгчийн аюулгүй ажиллагааны сургалт нь 2 хуваагдах бөгөөд:
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.6fr]">
          {/* Course 1 */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#e31e24]/10 text-[#e31e24]">
                <BookOpen className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#e31e24]">COURSE 1</p>
                <p className="text-sm font-semibold">1 долоо хоногийн тэмцээнд сургалт</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              Практик буудлагын хийн гар бууны төрлийн анхан шатны мэдлэгүүлтүүд болон. Сургалтыг төгссөнөөр
              долоо хоног бүрийн Мягмар, Пүрэв гарагуудад явагдах бэлтгэлүүдэд оролцох болон гишүүнчлэлийн
              сургалтанд хамрагдах эрх нээгдэнэ.
            </p>
            <Link href="/training/course-1" className="mt-4 inline-flex items-center gap-2 text-sm text-[#e31e24] hover:underline">
              Дэлгэрэнгүй →
            </Link>
          </div>

          {/* Course 2 */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#e31e24]/10 text-[#e31e24]">
                <Target className="size-5" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.15em] text-[#e31e24]">COURSE 2</p>
                <p className="text-sm font-semibold">1 долоо хоногийн сургалт</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">
              Сургалтыг тигсснөөр Прайм клубын сургалтанд гүнзгийрүүлэн элсэх, сараар 3 удаа
              хөнөлцөх нэм гарагийн 1р түвшний тэмцээнд оролцох эрх нээгдэж, чансааны оноо тооцоолох эхлэнэ.
            </p>
            <Link href="/training/course-2" className="mt-4 inline-flex items-center gap-2 text-sm text-[#e31e24] hover:underline">
              Дэлгэрэнгүй →
            </Link>
          </div>

          {/* Quote */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-[#101012] p-6 text-center">
            <p className="text-sm italic leading-7 text-muted-foreground">
              &ldquo;Практик буудлагын спортын онцлог нь сурааг дуусна гэсэн ойлголт байхгүй,
              насан туршдаа хичээллэж спортоор хичээллэх боломжтой.&rdquo;
            </p>
          </div>
        </div>
      </ContentSection>

      {/* ── 04 Full Member Path ── */}
      <ContentSection dark>
        <SectionTag n="04" label="КЛУБЫН ҮНДСЭН ГИШҮҮНЭЭР ЭЛСЭХ" />
        <p className="mb-6 text-sm leading-7 text-muted-foreground">
          Прайм клубын үндсэн гишүүд нь практик буудлагын хийн гар бууны бүх түвшний тэмцээнд зохих журмын дагуу
          оролцох эрхтэй бол сургалтын гишүүнчлэгүүс үндсэн гишүүн болохонд нийт 30 оноо цуглуулсан байх шаардлагатай.
        </p>

        <h3 className="mt-10 font-heading text-xl font-bold">ОНОО ЦУГЛУУЛАХ БОЛОМЖИТ АРГУУД</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pointMethods.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-card p-5">
              <p className="text-3xl font-bold text-[#e31e24]">{item.points}</p>
              <p className="mt-3 text-sm font-semibold leading-6">{item.title}</p>
              {/* <p className="mt-1 text-xs text-muted-foreground">{item.body}</p> */}
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-[#e31e24]/30 bg-gradient-to-r from-[#14080a] to-[#101012] p-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Хэрэв 30 оноог цуглуулж дууссан бол{" "}
              <Link href="mailto:registration@prime.mn" className="text-[#e31e24] hover:underline">
                registration@prime.mn
              </Link>{" "}
              хаягруу МПБХ-ны гишүүнчлэлийн жилийн хураамжийн төлсөн баримтыг хавсаргаж, үндсэн гишүүнчлэлээр элсэж хүсэлтээ явуулан,
              гишүүнчлэлийн дугаар авснаар Прайм клубын үндсэн гишүүн болох юм.
            </p>
          </div>
          <RedButton href="/contact">
            ҮНДСЭН ГИШҮҮНЭЭР ЭЛСЭХ
          </RedButton>
        </div>
      </ContentSection>
    </>
  );
}
