"use client";

import Link from "next/link";
import {
  Award,
  BookOpen,
  Shield,
  Target,
  Users,
} from "lucide-react";
import { EditableBackground } from "@/components/site/editable-background";
import { EditableText } from "@/components/site/editable-text";
import { ContentSection, LionIcon, OutlineButton, PageHero, RedButton, SectionTag } from "../primitives";

const pointMethods = [
  {
    points: "1 оноо",
    title: "Мэргэжил, Прайм төрөлтийн бэлтгэлд оролцох",
  },
  {
    points: "2 оноо",
    title: "1р түвшний тэмцээнд оролцолцоо аюулгүй ажиллагааны алдаа гаргаж DQ авсан бол",
  },
  {
    points: "5 оноо",
    title: "Нэг тэмцээний үр дүнгээс авах чансааны оноо.",
  },
  {
    points: "10 оноо",
    title: "Сарын 1 удаа хөнөлцөлд Тамирчин тэмцээний тайланг бүрэн оруулах ажиллагаанд (Range) оролцох",
  },
];

export function MembershipPage() {
  return (
    <>
      <PageHero
        eyebrow="MEMBERSHIP"
        title="ГИШҮҮНЧЛЭЛ"
        description="Аюулгүй, зөв, хариуцлагатай буудлагын соёлыг хамтдаа бүтээе."
        aside={
          <EditableText
            field="hero.aside"
            defaultValue="Discipline, Skill, Community"
            multiline
            as="p"
            className="hidden text-right font-serif text-2xl italic text-muted-foreground lg:block"
          />
        }
      >
        <RedButton href="/contact">
          <EditableText field="hero.ctaPrimary" defaultValue="ГИШҮҮНЧЛЭЛД ЭЛСЭХ →" />
        </RedButton>
        <OutlineButton href="/training">
          <EditableText field="hero.ctaSecondary" defaultValue="АЮУЛГҮЙ БУУДЛАГА, ИЛҮҮ САЙН НИЙГЭМ" />
        </OutlineButton>
      </PageHero>

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
            <EditableBackground
              field="about.cardImageUrl"
              className="flex h-64 w-full items-center justify-center rounded-2xl border border-border"
              fallbackClassName="bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707]"
              placeholder="About card зураг"
              editMode="cover"
            >
              <LionIcon className="relative z-10 size-24 text-[#e31e24]/30" />
              <div className="absolute bottom-4 right-4 z-10 text-right">
                <EditableText
                  field="about.cardBrand"
                  defaultValue="PRIME"
                  className="text-xs font-bold tracking-[0.2em] text-[#e31e24] block"
                />
                <EditableText
                  field="about.cardSubtitle"
                  defaultValue="PRACTICAL SHOOTING CLUB"
                  className="text-[8px] tracking-[0.15em] text-muted-foreground block"
                />
              </div>
              <EditableText
                field="about.cardQuote"
                defaultValue="«Аюулгүй буудлага Илүү хариуцлагатай нийгэмд хүргэдэг.»"
                multiline
                as="p"
                className="absolute top-4 right-4 z-10 max-w-[140px] text-right text-xs italic text-muted-foreground"
              />
              <EditableText
                field="about.cardAuthor"
                defaultValue="— PRIME"
                className="absolute bottom-4 left-4 z-10 text-xs font-semibold text-muted-foreground"
              />
            </EditableBackground>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <EditableBackground
            field="about.infoLeftImageUrl"
            className="flex gap-4 rounded-xl border border-border bg-card p-5"
            fallbackClassName="bg-card"
            imageClassName="object-cover opacity-25"
            overlayClassName="bg-[#101012]/80"
            placeholder="Card background"
            editMode="corner"
          >
            <Shield className="relative z-10 size-5 shrink-0 text-[#e31e24]" />
            <EditableText
              field="about.infoLeft"
              defaultValue="Прайм клубын гишүүнээр элсэхийн тулд практик буудлагын спортын аюулгүй ажиллагааны сургалтанд хамрагдах шаардлагатай."
              multiline
              as="p"
              className="relative z-10 text-sm text-muted-foreground block"
            />
          </EditableBackground>
          <EditableBackground
            field="about.infoRightImageUrl"
            className="rounded-xl border border-border bg-card p-5"
            fallbackClassName="bg-card"
            imageClassName="object-cover opacity-25"
            overlayClassName="bg-[#101012]/80"
            placeholder="Card background"
            editMode="corner"
          >
            <EditableText
              field="about.infoRightIntro"
              defaultValue="Тухайн сургалтыг дараах газруудад авуулах эрхтэй:"
              as="p"
              className="text-sm text-muted-foreground block"
            />
            <EditableText
              field="about.infoRightList"
              defaultValue={"• МПБХ-ны төв клуб – Төв аймаг, Сэргэлэн сум\n• МПБХ-ны Prime клуб."}
              multiline
              as="p"
              className="relative z-10 mt-2 space-y-1 text-sm text-muted-foreground block whitespace-pre-line"
            />
          </EditableBackground>
        </div>
      </ContentSection>

      <ContentSection dark>
        <SectionTag n="02" label="ГИШҮҮНЧЛЭЛИЙН ТӨРӨЛ" fieldPrefix="section.02" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-[#e31e24]/40">
            <EditableBackground
              field="types.adult.imageUrl"
              className="relative h-56"
              fallbackClassName="bg-gradient-to-br from-[#1a1410] via-[#161215] to-[#0d0d0f]"
              placeholder="Adult card зураг"
            >
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <LionIcon className="size-20 text-[#e31e24]/20" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#0d0d0f] to-transparent p-6">
                <Users className="mb-2 size-5 text-[#e31e24]" />
                <EditableText
                  field="types.adult.title"
                  defaultValue="НАСАНД ХҮРЭГЧИД"
                  as="p"
                  className="text-lg font-bold block"
                />
                <EditableText
                  field="types.adult.subtitle"
                  defaultValue="(18-с дээш насны)"
                  as="p"
                  className="text-xs text-muted-foreground block"
                />
              </div>
            </EditableBackground>
            <div className="p-6">
              <EditableText
                field="types.adult.price"
                defaultValue="250,000₮ / сар"
                as="p"
                className="text-3xl font-bold text-[#e31e24] block"
              />
              <Link href="/training" className="mt-4 inline-flex items-center gap-2 text-sm text-[#e31e24] hover:underline">
                <EditableText field="types.adult.link" defaultValue="Дэлгэрэнгүй →" />
              </Link>
            </div>
          </div>

          <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-[#e31e24]/40">
            <EditableBackground
              field="types.junior.imageUrl"
              className="relative h-56"
              fallbackClassName="bg-gradient-to-br from-[#101820] via-[#12151a] to-[#0d0d0f]"
              placeholder="Junior card зураг"
            >
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <Award className="size-20 text-[#e31e24]/20" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-[#0d0d0f] to-transparent p-6">
                <Award className="mb-2 size-5 text-[#e31e24]" />
                <EditableText
                  field="types.junior.title"
                  defaultValue="ЖУНИОР ХӨТӨЛБӨР"
                  as="p"
                  className="text-lg font-bold block"
                />
                <EditableText
                  field="types.junior.subtitle"
                  defaultValue="(14-18 насны)"
                  as="p"
                  className="text-xs text-muted-foreground block"
                />
              </div>
            </EditableBackground>
            <div className="p-6">
              <EditableText
                field="types.junior.note"
                defaultValue="Тухайн суралцагчийн JR түвшингээс хамаарна."
                multiline
                as="p"
                className="text-sm text-muted-foreground block"
              />
              <Link href="/training/junior" className="mt-4 inline-flex items-center gap-2 text-sm text-[#e31e24] hover:underline">
                <EditableText field="types.junior.link" defaultValue="Дэлгэрэнгүй →" />
              </Link>
            </div>
          </div>
        </div>

        <EditableBackground
          field="types.annualNoteImageUrl"
          className="mt-8 rounded-xl border border-[#ffffff15] p-6"
          fallbackClassName="bg-[#101012]"
          placeholder="Note box background"
          editMode="corner"
        >
          <EditableText
            field="types.annualNote"
            defaultValue="Гишүүнчлэлийн эрх нь сар, сараар сунгагдах ёстой бөгөөд тухайн сардаа гишүүнчлэлийн эрх нь хүчинтэй байж, клубын зохион байгуулсан аливаа үйл ажиллагаанд оролцох эрхээр хэрэгждэг. Клубын гишүүн нь тухайн сард, долоо хоног бүрийн амралтын өдрүүдэд жагсаал клубын тэмцээнүүдэд болон мэргэжил, пүрэв гарагуудад зохион байгуулдаг бэлтгэлүүдэд нэм хураамжгүйгээр оролцох боломжтой."
            multiline
            as="p"
            className="relative z-10 text-sm text-muted-foreground leading-7 block"
          />
        </EditableBackground>
      </ContentSection>

      <ContentSection>
        <SectionTag n="03" label="АЮУЛГҮЙ АЖИЛЛАГААНЫ СУРГАЛТ" fieldPrefix="section.03" />
        <EditableText
          field="training.intro"
          defaultValue="Насанд хүрэгчийн аюулгүй ажиллагааны сургалт нь 2 хуваагдах бөгөөд:"
          as="p"
          className="mb-8 text-sm text-muted-foreground block"
        />
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr_0.6fr]">
          <EditableBackground
            field="training.course1.imageUrl"
            className="rounded-2xl border border-border p-6"
            fallbackClassName="bg-card"
            placeholder="Course 1 background"
            editMode="corner"
          >
            <div className="relative z-10 mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#e31e24]/10 text-[#e31e24]">
                <BookOpen className="size-5" />
              </div>
              <div>
                <EditableText field="training.course1.tag" defaultValue="COURSE 1" className="text-xs font-bold tracking-[0.15em] text-[#e31e24] block" />
                <EditableText field="training.course1.title" defaultValue="1 долоо хоногийн тэмцээнд сургалт" className="text-sm font-semibold block" />
              </div>
            </div>
            <EditableText
              field="training.course1.body"
              defaultValue="Практик буудлагын хийн гар бууны төрлийн анхан шатны мэдлэгүүлтүүд болон. Сургалтыг төгссөнөөр долоо хоног бүрийн Мягмар, Пүрэв гарагуудад явагдах бэлтгэлүүдэд оролцох болон гишүүнчлэлийн сургалтанд хамрагдах эрх нээгдэнэ."
              multiline
              as="p"
              className="relative z-10 text-sm leading-7 text-muted-foreground block"
            />
            <Link href="/training/course-1" className="relative z-10 mt-4 inline-flex items-center gap-2 text-sm text-[#e31e24] hover:underline">
              <EditableText field="training.course1.link" defaultValue="Дэлгэрэнгүй →" />
            </Link>
          </EditableBackground>

          <EditableBackground
            field="training.course2.imageUrl"
            className="rounded-2xl border border-border p-6"
            fallbackClassName="bg-card"
            placeholder="Course 2 background"
            editMode="corner"
          >
            <div className="relative z-10 mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#e31e24]/10 text-[#e31e24]">
                <Target className="size-5" />
              </div>
              <div>
                <EditableText field="training.course2.tag" defaultValue="COURSE 2" className="text-xs font-bold tracking-[0.15em] text-[#e31e24] block" />
                <EditableText field="training.course2.title" defaultValue="1 долоо хоногийн сургалт" className="text-sm font-semibold block" />
              </div>
            </div>
            <EditableText
              field="training.course2.body"
              defaultValue="Сургалтыг тигсснөөр Прайм клубын сургалтанд гүнзгийрүүлэн элсэх, сараар 3 удаа хөнөлцөх нэм гарагийн 1р түвшний тэмцээнд оролцох эрх нээгдэж, чансааны оноо тооцоолох эхлэнэ."
              multiline
              as="p"
              className="relative z-10 text-sm leading-7 text-muted-foreground block"
            />
            <Link href="/training/course-2" className="relative z-10 mt-4 inline-flex items-center gap-2 text-sm text-[#e31e24] hover:underline">
              <EditableText field="training.course2.link" defaultValue="Дэлгэрэнгүй →" />
            </Link>
          </EditableBackground>

          <EditableBackground
            field="training.quoteImageUrl"
            className="flex flex-col items-center justify-center rounded-2xl border border-border p-6 text-center"
            fallbackClassName="bg-[#101012]"
            placeholder="Quote background"
            editMode="corner"
          >
            <EditableText
              field="training.quote"
              defaultValue="«Практик буудлагын спортын онцлог нь сурааг дуусна гэсэн ойлголт байхгүй, насан туршдаа хичээллэж спортоор хичээллэх боломжтой.»"
              multiline
              as="p"
              className="relative z-10 text-sm italic leading-7 text-muted-foreground block"
            />
          </EditableBackground>
        </div>
      </ContentSection>

      <ContentSection dark>
        <SectionTag n="04" label="КЛУБЫН ҮНДСЭН ГИШҮҮНЭЭР ЭЛСЭХ" fieldPrefix="section.04" />
        <EditableText
          field="fullMember.intro"
          defaultValue="Прайм клубын үндсэн гишүүд нь практик буудлагын хийн гар бууны бүх түвшний тэмцээнд зохих журмын дагуу оролцох эрхтэй бол сургалтын гишүүнчлэгүүс үндсэн гишүүн болохонд нийт 30 оноо цуглуулсан байх шаардлагатай."
          multiline
          as="p"
          className="mb-6 text-sm leading-7 text-muted-foreground block"
        />

        <EditableText
          field="fullMember.pointsTitle"
          defaultValue="ОНОО ЦУГЛУУЛАХ БОЛОМЖИТ АРГУУД"
          as="h3"
          className="mt-10 font-heading text-xl font-bold block"
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pointMethods.map((item, idx) => (
            <EditableBackground
              key={idx}
              field={`points.${idx}.imageUrl`}
              className="rounded-xl border border-border p-5"
              fallbackClassName="bg-card"
              placeholder="Point card background"
              editMode="corner"
            >
              <EditableText
                field={`points.${idx}.value`}
                defaultValue={item.points}
                as="p"
                className="relative z-10 text-3xl font-bold text-[#e31e24] block"
              />
              <EditableText
                field={`points.${idx}.title`}
                defaultValue={item.title}
                multiline
                as="p"
                className="relative z-10 mt-3 text-sm font-semibold leading-6 block"
              />
            </EditableBackground>
          ))}
        </div>

        <EditableBackground
          field="fullMember.bannerImageUrl"
          className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-xl border border-[#e31e24]/30 p-6"
          fallbackClassName="bg-gradient-to-r from-[#14080a] to-[#101012]"
          placeholder="CTA banner background"
          editMode="corner"
        >
          <EditableText
            field="fullMember.ctaBody"
            defaultValue="Хэрэв 30 оноог цуглуулж дууссан бол registration@prime.mn хаягруу МПБХ-ны гишүүнчлэлийн жилийн хураамжийн төлсөн баримтыг хавсаргаж, үндсэн гишүүнчлэлээр элсэж хүсэлтээ явуулан, гишүүнчлэлийн дугаар авснаар Прайм клубын үндсэн гишүүн болох юм."
            multiline
            as="p"
            className="relative z-10 text-sm text-muted-foreground block flex-1"
          />
          <RedButton href="/contact" className="relative z-10">
            <EditableText field="fullMember.ctaButton" defaultValue="ҮНДСЭН ГИШҮҮНЭЭР ЭЛСЭХ" />
          </RedButton>
        </EditableBackground>
      </ContentSection>
    </>
  );
}
