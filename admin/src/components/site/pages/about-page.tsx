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
import { EditableBackground } from "@/components/site/editable-background";
import { EditableText } from "@/components/site/editable-text";
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
          <EditableBackground
            field="hero.aside.imageUrl"
            className="rounded-2xl border border-[#e31e24]/40 p-8 shadow-2xl"
            fallbackClassName="bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707]"
            editMode="corner"
          >
            <div className="absolute top-4 right-4 text-[#e31e24]/15">
              <LionIcon className="size-36" />
            </div>
            <EditableText
              field="hero.aside.eyebrow"
              defaultValue="PRIME IPSC CLUB"
              as="p"
              className="relative z-10 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24] block"
            />
            <EditableText
              field="hero.aside.title"
              defaultValue="MORE THAN A SPORT"
              as="h3"
              className="relative z-10 mt-4 font-heading text-3xl font-extrabold uppercase leading-tight text-white block"
            />
            <EditableText
              field="hero.aside.body"
              defaultValue="Аюулгүй байдал, сахилга бат, техник ур чадварыг нэгтгэсэн олон улсын практик буудлагын соёл."
              multiline
              as="p"
              className="relative z-10 mt-3 text-xs leading-relaxed text-[#a0a0a5] block"
            />
          </EditableBackground>
        }
      >
        <RedButton href="#history">
          <EditableText field="hero.ctaPrimary" defaultValue="Бидний түүх" />
          <ArrowRight className="size-4" />
        </RedButton>
        <OutlineButton onClick={() => setShowVideo(true)}>
          <Play className="size-3.5 fill-current" />
          <EditableText field="hero.ctaVideo" defaultValue="PRIME-ийн тухай видео үзэх" />
        </OutlineButton>
      </PageHero>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <EditableBackground
            field="video.modalImageUrl"
            className="relative w-full max-w-3xl rounded-2xl border border-[#e31e24]/40 p-6 shadow-2xl"
            fallbackClassName="bg-[#0c0c0e]"
            placeholder="Video modal background"
            editMode="corner"
          >
            <div className="relative z-10 flex items-center justify-between pb-4 border-b border-[#ffffff15]">
              <EditableText
                field="video.title"
                defaultValue="PRIME-ийн тухай видео"
                as="h3"
                className="font-heading text-base font-bold text-white uppercase"
              />
              <button
                type="button"
                onClick={() => setShowVideo(false)}
                className="text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>
            <EditableBackground
              field="video.placeholderImageUrl"
              className="relative z-10 mt-4 flex h-72 items-center justify-center rounded-xl text-center"
              fallbackClassName="bg-[#141418]"
              placeholder="Video placeholder background"
              editMode="corner"
            >
              <div className="relative z-10">
                <Play className="mx-auto mb-2 size-12 text-[#e31e24]" />
                <EditableText
                  field="video.placeholderTitle"
                  defaultValue="PRIME Action Air Introduction Video"
                  as="p"
                  className="text-sm font-bold text-white block"
                />
                <EditableText
                  field="video.placeholderNote"
                  defaultValue="Тун удахгүй видео контент тавигдана"
                  as="p"
                  className="mt-1 text-xs text-muted-foreground block"
                />
              </div>
            </EditableBackground>
          </EditableBackground>
        </div>
      )}

      {/* 02 - КЛУБЫН ТАНИЛЦУУЛГА */}
      <ContentSection id="history" dark>
        <SectionTag n="02" label="КЛУБЫН ТАНИЛЦУУЛГА" />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <EditableText
              field="history.title"
              defaultValue="ДИСЦИПЛИН. ХӨГЖИЛ. ИЛҮҮ САЙН ӨНӨӨДӨР."
              multiline
              as="h2"
              className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
            />
            <EditableText
              field="history.body"
              defaultValue="PRIME Practical Shooting Club нь 2019 онд байгуулагдсан IPSC Action Air төрлийн тамирчдын клуб юм. Бид практик буудлагын спортын соёлыг түгээж, тамирчдыг бэлтгэж, сургалт явуулах, тэмцээн зохион байгуулах, олон улсын тавцанд оролцох замаар Монгол дахь IPSC хөдөлгөөнийг хөгжүүлэхэд зорьж ажилладаг."
              multiline
              as="p"
              className="mt-4 text-sm leading-relaxed text-[#a0a0a5] block"
            />
            <div className="mt-6">
              <OutlineButton href="/training">
                <EditableText field="history.cta" defaultValue="Илүү дэлгэрэнгүй →" />
              </OutlineButton>
            </div>
          </div>

          {/* Lion emblem banner */}
          <EditableBackground
            field="history.emblemImageUrl"
            className="rounded-2xl border border-[#e31e24]/40 p-8 text-center shadow-2xl"
            fallbackClassName="bg-[#121215]"
            editMode="corner"
          >
            <LionIcon className="relative z-10 mx-auto size-16 text-[#e31e24]" />
            <EditableText
              field="history.emblemTitle"
              defaultValue="PRIME PRACTICAL SHOOTING CLUB"
              as="h3"
              className="relative z-10 mt-4 font-heading text-xl font-bold uppercase tracking-wider text-white block"
            />
            <EditableText
              field="history.emblemQuote"
              defaultValue={'"Илүү аюулгүй, илүү чадварлаг ирээдүйг хамтдаа бүтээе."'}
              multiline
              as="blockquote"
              className="relative z-10 mt-3 text-xs italic leading-relaxed text-[#e31e24] block"
            />
          </EditableBackground>
        </div>
      </ContentSection>

      {/* 03 - ТООН ҮЗҮҮЛЭЛТ */}
      <ContentSection id="stats">
        <SectionTag n="03" label="ТООН ҮЗҮҮЛЭЛТ" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label }, idx) => (
            <EditableBackground
              key={label}
              field={`stats.${idx}.imageUrl`}
              className="flex flex-col items-center justify-center rounded-2xl border border-[#ffffff15] p-6 text-center shadow-xl transition-all hover:border-[#e31e24]/50"
              fallbackClassName="bg-[#101014]"
              placeholder="Stat card background"
              editMode="corner"
            >
              <div className="relative z-10 mb-3 flex size-12 items-center justify-center rounded-xl border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
                <Icon className="size-6" />
              </div>
              <EditableText
                field={`stats.${idx}.value`}
                defaultValue={value}
                as="p"
                className="relative z-10 font-mono text-3xl font-extrabold text-white block"
              />
              <EditableText
                field={`stats.${idx}.label`}
                defaultValue={label}
                as="p"
                className="relative z-10 mt-1 text-xs text-[#a0a0a5] block"
              />
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* 04 - БИДНИЙ ҮНЭТ ЗҮЙЛС */}
      <ContentSection id="values" dark>
        <SectionTag n="04" label="БИДНИЙ ҮНЭТ ЗҮЙЛС" />
        <EditableText
          field="values.title"
          defaultValue="БИДНИЙ ЗОРИЛГО, АЛСЫН ХАРАА, ҮНЭТ ЗҮЙЛС"
          multiline
          as="h2"
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
        />

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {/* Card 1: Purpose */}
          <EditableBackground
            field="values.purpose.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl transition-all hover:border-[#e31e24]/50"
            fallbackClassName="bg-[#121215]"
            placeholder="Card background"
            editMode="corner"
          >
            <div className="relative z-10 mb-4 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
              <Target className="size-5" />
            </div>
            <EditableText
              field="values.purpose.title"
              defaultValue="БИДНИЙ ЗОРИЛГО"
              as="h4"
              className="relative z-10 font-heading text-base font-bold uppercase tracking-wider text-[#e31e24] block"
            />
            <EditableText
              field="values.purpose.body"
              defaultValue="Аюулгүй, хариуцлагатай практик буудлагын спортыг түгээж, тамирчдын ур чадварыг дээшлүүлэх."
              multiline
              as="p"
              className="relative z-10 mt-3 text-xs leading-relaxed text-[#a0a0a5] block"
            />
          </EditableBackground>

          {/* Card 2: Vision */}
          <EditableBackground
            field="values.vision.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl transition-all hover:border-[#e31e24]/50"
            fallbackClassName="bg-[#121215]"
            placeholder="Card background"
            editMode="corner"
          >
            <div className="relative z-10 mb-4 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
              <Flag className="size-5" />
            </div>
            <EditableText
              field="values.vision.title"
              defaultValue="АЛСЫН ХАРАА"
              as="h4"
              className="relative z-10 font-heading text-base font-bold uppercase tracking-wider text-[#e31e24] block"
            />
            <EditableText
              field="values.vision.body"
              defaultValue="Монголд IPSC Action Air спортын тэргүүлэгч клуб байж, олон улсын тавцанд амжилттай тамирчдыг бэлтгэх."
              multiline
              as="p"
              className="relative z-10 mt-3 text-xs leading-relaxed text-[#a0a0a5] block"
            />
          </EditableBackground>

          {/* Card 3: Values */}
          <EditableBackground
            field="values.values.imageUrl"
            className="rounded-2xl border border-[#ffffff15] p-6 shadow-xl transition-all hover:border-[#e31e24]/50"
            fallbackClassName="bg-[#121215]"
            placeholder="Card background"
            editMode="corner"
          >
            <div className="relative z-10 mb-4 flex size-10 items-center justify-center rounded-lg border border-[#e31e24]/40 bg-[#e31e24]/10 text-[#e31e24]">
              <Users className="size-5" />
            </div>
            <EditableText
              field="values.values.title"
              defaultValue="ҮНЭТ ЗҮЙЛС"
              as="h4"
              className="relative z-10 font-heading text-base font-bold uppercase tracking-wider text-[#e31e24] block"
            />
            <EditableText
              field="values.values.body"
              defaultValue="Аюулгүй байдал, сахилга бат, хариуцлага, тасралтгүй суралцах, хамтын нийгэмлэг, шударга өРСӨЛДӨӨН."
              multiline
              as="p"
              className="relative z-10 mt-3 text-xs leading-relaxed text-[#a0a0a5] block"
            />
          </EditableBackground>
        </div>
      </ContentSection>

      {/* 05 - БИДНИЙ ЗАМНАЛ */}
      <ContentSection id="timeline">
        <SectionTag n="05" label="БИДНИЙ ЗАМНАЛ" />
        <EditableText
          field="timeline.title"
          defaultValue="ӨСӨЛТ, ХӨГЖЛИЙН ТҮҮХ"
          as="h2"
          className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
        />

        <div className="relative mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {timeline.map((item, idx) => (
            <EditableBackground
              key={item.year}
              field={`timeline.${idx}.imageUrl`}
              className="relative flex flex-col justify-between rounded-xl border border-[#ffffff15] p-5 shadow-lg"
              fallbackClassName="bg-[#101014]"
              placeholder="Timeline card background"
              editMode="corner"
            >
              <div className="relative z-10">
                <EditableText
                  field={`timeline.${idx}.year`}
                  defaultValue={item.year}
                  className="font-mono text-xl font-extrabold text-[#e31e24]"
                />
                <EditableText
                  field={`timeline.${idx}.title`}
                  defaultValue={item.title}
                  as="h4"
                  className="mt-2 font-heading text-xs font-bold text-white block"
                />
                <EditableText
                  field={`timeline.${idx}.desc`}
                  defaultValue={item.desc}
                  multiline
                  as="p"
                  className="mt-2 text-[11px] leading-relaxed text-[#a0a0a5] block"
                />
              </div>
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* 06 - КЛУБЫН АМЬДРАЛ */}
      <ContentSection id="gallery" dark>
        <SectionTag n="06" label="КЛУБЫН АМЬДРАЛ" />
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <EditableText
              field="gallery.title"
              defaultValue="БИДНИЙ ӨДӨР ТУТМЫН АМЬДРАЛ"
              as="h2"
              className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
            />
            <EditableText
              field="gallery.subtitle"
              defaultValue="Сургалт, тэмцээн, нөхөрлөл, хөгжил — PRIME-ийн амьдралын нэг хэсэг."
              multiline
              as="p"
              className="mt-1 text-sm text-muted-foreground block"
            />
          </div>
          <OutlineButton href="/contact">
            <EditableText field="gallery.cta" defaultValue="ГАЛЕРЕЙ ҮЗЭХ →" />
          </OutlineButton>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {galleryItems.map((g, idx) => (
            <EditableBackground
              key={idx}
              field={`gallery.${idx}.imageUrl`}
              className="group flex h-48 flex-col justify-end overflow-hidden rounded-2xl border border-[#ffffff15] p-5 shadow-xl transition-transform hover:scale-105"
              fallbackClassName={`bg-gradient-to-t ${g.color}`}
              imageClassName="object-cover opacity-70"
              overlayClassName={`bg-gradient-to-t ${g.color} opacity-60`}
              editMode="cover"
            >
              <div className="relative z-10">
                <EditableText
                  field={`gallery.${idx}.tag`}
                  defaultValue={g.tag}
                  className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#e31e24]"
                />
                <EditableText
                  field={`gallery.${idx}.title`}
                  defaultValue={g.title}
                  as="h4"
                  className="font-heading text-base font-extrabold uppercase text-white block"
                />
              </div>
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* 07 - БАГШ, ИНСТРУКТОР */}
      <ContentSection id="team">
        <SectionTag n="07" label="БАГШ, ИНСТРУКТОР" />
        <div className="flex flex-col gap-2">
          <EditableText
            field="team.title"
            defaultValue="МАНАЙ БАГ"
            as="h2"
            className="font-heading text-3xl font-extrabold uppercase tracking-tight text-white md:text-4xl block"
          />
          <EditableText
            field="team.subtitle"
            defaultValue="Туршлагатай, мэргэшсэн багш, инструкторууд таны хөгжлийн хөтөч болно."
            multiline
            as="p"
            className="text-sm text-muted-foreground block"
          />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person, idx) => (
            <EditableBackground
              key={person.name}
              field={`team.${idx}.cardImageUrl`}
              className="group overflow-hidden rounded-2xl border border-[#ffffff15] shadow-xl transition-all hover:border-[#e31e24]/60"
              fallbackClassName="bg-[#101014]"
              placeholder="Team card background"
              editMode="corner"
            >
              <EditableBackground
                field={`team.${idx}.imageUrl`}
                className="relative flex h-52 items-center justify-center"
                fallbackClassName="bg-gradient-to-br from-[#1a1814] via-[#101012] to-[#070707]"
                editMode="cover"
              >
                <LionIcon className="relative z-10 size-20 text-[#e31e24]/20 transition-transform group-hover:scale-110" />
              </EditableBackground>
              <div className="relative z-10 p-5">
                <EditableText
                  field={`team.${idx}.name`}
                  defaultValue={person.name}
                  as="h4"
                  className="font-heading text-base font-bold text-white block"
                />
                <EditableText
                  field={`team.${idx}.role`}
                  defaultValue={person.role}
                  as="p"
                  className="mt-1 text-xs font-semibold text-[#e31e24] block"
                />
                <EditableText
                  field={`team.${idx}.sub`}
                  defaultValue={person.sub}
                  as="p"
                  className="mt-0.5 text-[11px] text-[#a0a0a5] block"
                />
              </div>
            </EditableBackground>
          ))}
        </div>
      </ContentSection>

      {/* 08 - НИЙГЭМЛЭГТ НЭГД */}
      <ContentSection id="cta" dark>
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
                defaultValue="08 —— НИЙГЭМЛЭГТ НЭГД"
                as="p"
                className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24] block"
              />
              <EditableText
                field="cta.title"
                defaultValue="ИЛҮҮ ИХ БОЛОМЖ ТАНЫГ ХҮЛЭЭЖ БАЙНА"
                multiline
                as="h2"
                className="mt-2 font-heading text-3xl font-extrabold uppercase text-white md:text-4xl block"
              />
              <EditableText
                field="cta.body"
                defaultValue="Сургалтад хамрагдаж, PRIME клубийн гишүүн болж, өөрийн боломжийг нээ."
                multiline
                as="p"
                className="mt-2 max-w-xl text-xs text-[#a0a0a5] block"
              />
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <RedButton href="/training">
                <EditableText field="cta.primary" defaultValue="СУРГАЛТАД БҮРТГҮҮЛЭХ →" />
              </RedButton>
              <OutlineButton href="/contact">
                <EditableText field="cta.secondary" defaultValue="ХОЛБОО БАРИХ →" />
              </OutlineButton>
            </div>
          </div>
        </EditableBackground>
      </ContentSection>
    </>
  );
}
