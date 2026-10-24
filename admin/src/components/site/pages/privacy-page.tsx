"use client";

import { ArrowRight, Mail, Shield } from "lucide-react";
import { EditableText } from "@/components/site/editable-text";
import { ContentSection, PageHero, RedButton } from "../primitives";

type PolicySection = {
  id: string;
  titleField: string;
  titleDefault: string;
  bodyField: string;
  bodyDefault: string;
};

const SECTIONS: PolicySection[] = [
  {
    id: "intro",
    titleField: "sections.intro.title",
    titleDefault: "1. Ерөнхий",
    bodyField: "sections.intro.body",
    bodyDefault:
      "Prime Club («PRIME Practical Shooting Club», «Бид») нь вэб сайт (primeadmin.teensclub.mn), гишүүний апп болон клубын үйл ажиллагааны үед таны хувийн мэдээллийг хуульд нийцүүлэн цуглуулж, ашиглаж, хамгаална. Энэхүү Нууцлалын бодлого нь мэдээлэл цуглуулах, ашиглах, хадгалах, хуваалцах, таны эрхийг тайлбарлана.",
  },
  {
    id: "collect",
    titleField: "sections.collect.title",
    titleDefault: "2. Цуглуулж болох мэдээлэл",
    bodyField: "sections.collect.body",
    bodyDefault:
      "• Холбоо барих мэдээлэл: нэр, утас, и-мэйл, хаяг.\n• Гишүүнчлэл, бүртгэл: гишүүний төрөл, сургалтын түвшин, эцэг эх/ хамгаалагчийн мэдээлэл (Junior хөтөлбөрт).\n• Тэмцээн, чансаа: оролцсон тэмцээний үр дүн, оноо, зэрэглэл.\n• Техникийн мэдээлэл: апп эсвэл вэб ашиглалтын лог, төхөөрөмжийн төрөл, IP хаяг (аюулгүй байдал, алдаа засах зорилгоор).\n• Та өөрөө илгээсэн зурвас, санал хүсэлт, бүртгэлийн маягтын агуулга.",
  },
  {
    id: "use",
    titleField: "sections.use.title",
    titleDefault: "3. Мэдээллийг хэрхэн ашиглах вэ",
    bodyField: "sections.use.body",
    bodyDefault:
      "Бид мэдээллийг дараах зорилгоор ашиглана: сургалт, гишүүнчлэл, тэмцээний бүртгэл; аюулгүй ажиллагааны шаардлага биелүүлэх; чансаа, үр дүн харуулах; таны асуултад хариулах; клубын мэдэгдэл илгээх (та зөвшөөрсөн тохиолдолд); вэб сайт, апп-ын аюулгүй байдал, сайжруулалт; хуульд заасан үүрэг биелүүлэх.",
  },
  {
    id: "share",
    titleField: "sections.share.title",
    titleDefault: "4. Хуваалцах нөхцөл",
    bodyField: "sections.share.body",
    bodyDefault:
      "Бид таны хувийн мэдээллийг худалдаж, түрээслэдэггүй. Зөвхөн дараах тохиолдолд хязгаарлагдмал хэмжээгээр хуваалцаж болно: IPSC болон тэмцээний зохион байгуулагч, албан ёсны үр дүн батлах; хууль, шүүхийн шийдвэрийн дагуу; таны зөвшөөрөлтэй; техникийн үйлчилгээ үзүүлэгч (нууцлалын гэрээний доор). Тэмцээний үр дүн, чансаа нь клубын нээлттэй хэсэгт харагдаж болно.",
  },
  {
    id: "security",
    titleField: "sections.security.title",
    titleDefault: "5. Хадгалалт, аюулгүй байдал",
    bodyField: "sections.security.body",
    bodyDefault:
      "Мэдээллийг зөвхөн шаардлагатай хугацаанд хадгална. Нууц үг, сүлжээний хамгаалалт, хандалтын хяналт зэрэг техник, зохион байгуулалтын арга хэмжээ авна. Гэсэн хэдий ч интернэтээр дамжуулах мэдээлэл 100% аюулгүй байх баталгаа байхгүй тул та нууц үгээ хамгаалах хариуцлага хүлээнэ.",
  },
  {
    id: "rights",
    titleField: "sections.rights.title",
    titleDefault: "6. Таны эрх",
    bodyField: "sections.rights.body",
    bodyDefault:
      "Та өөрийн мэдээлэлд хандах, засварлах, устгуулах, боловсруулалтыг хязгаарлах, зөвшөөрлөө цуцлах хүсэлт гаргах эрхтэй (хуульд өөрөөр заагдаагүй бол). Хүсэлтээ доорх холбоо барих сувгаар илгээнэ үү. Бид хуульд заасан хугацаанд хариу өгнө.",
  },
  {
    id: "children",
    titleField: "sections.children.title",
    titleDefault: "7. Хүүхэд, Junior хөтөлбөр",
    bodyField: "sections.children.body",
    bodyDefault:
      "12–17 насны Junior гишүүдийн мэдээллийг эцэг эх эсвэл хууль ёсны хамгаалагчийн зөвшөөрөл, хяналтын доор боловсруулна. Эцэг эх апп-аар хүүхдийнхээ мэдээлэл, ирц, үр дүнтэй холбоотой хэсгийг харах боломжтой.",
  },
  {
    id: "changes",
    titleField: "sections.changes.title",
    titleDefault: "8. Бодлогын өөрчлөлт",
    bodyField: "sections.changes.body",
    bodyDefault:
      "Бид энэ бодлогыг шинэчилж болно. Шинэчилсэн хувилбарыг энэ хуудсанд нийтэлнэ. Чухал өөрчлөлтийн талаар вэб сайт эсвэл апп-аар мэдэгдэж болно.",
  },
];

export function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="LEGAL"
        titleText="НУУЦЛАЛЫН БОДЛОГО"
        description="Prime Club-ийн вэб сайт, гишүүний апп болон клубын үйл ажиллагаатай холбоотой хувийн мэдээллийн хамгаалалт."
        fieldPrefix="hero"
        aside={
          <div className="rounded-2xl border border-[#e31e24]/40 bg-gradient-to-br from-[#1c1810] via-[#121215] to-[#070707] p-8 shadow-2xl">
            <Shield className="size-10 text-[#e31e24]" />
            <EditableText
              field="hero.aside.title"
              defaultValue="PRIME CLUB"
              as="p"
              className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#e31e24] block"
            />
            <EditableText
              field="hero.aside.body"
              defaultValue="Таны мэдээллийг хүндэтгэн, хуульд нийцүүлэн хамгаална."
              as="p"
              className="mt-3 text-sm leading-relaxed text-[#a0a0a5] block"
            />
            <EditableText
              field="hero.updated"
              defaultValue="Сүүлд шинэчилсэн: 2026 оны 3 сар"
              as="p"
              className="mt-6 text-[10px] uppercase tracking-widest text-[#6a6a70] block"
            />
          </div>
        }
      />

      <ContentSection id="policy">
        <div className="mx-auto max-w-3xl space-y-10">
          {SECTIONS.map((section) => (
            <article key={section.id} id={section.id} className="scroll-mt-24">
              <EditableText
                field={section.titleField}
                defaultValue={section.titleDefault}
                as="h2"
                className="font-heading text-xl font-bold uppercase tracking-wide text-white md:text-2xl block"
              />
              <EditableText
                field={section.bodyField}
                defaultValue={section.bodyDefault}
                as="p"
                multiline
                className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#a0a0a5] block"
              />
            </article>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="contact" dark>
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 rounded-2xl border border-[#ffffff15] bg-[#0c0c0e] p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <EditableText
              field="contact.title"
              defaultValue="Асуулт, хүсэлт"
              as="h2"
              className="font-heading text-2xl font-bold uppercase text-white block"
            />
            <EditableText
              field="contact.body"
              defaultValue="Нууцлалтай холбоотой асуулт эсвэл мэдээлэлд хандах хүсэлтээ илгээнэ үү."
              as="p"
              className="mt-2 text-sm text-[#a0a0a5] block"
            />
            <p className="mt-4 flex items-center gap-2 text-sm text-white">
              <Mail className="size-4 text-[#e31e24]" />
              <EditableText field="contact.email" defaultValue="registration@prime.mn" as="span" />
            </p>
          </div>
          <RedButton href="/contact" className="inline-flex gap-2">
            <EditableText field="contact.cta" defaultValue="Холбоо барих" as="span" />
            <ArrowRight className="size-4" />
          </RedButton>
        </div>
      </ContentSection>
    </>
  );
}
