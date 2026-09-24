import { notFound } from "next/navigation";
import { AthleteDetailPage } from "@/components/site/pages/athlete-detail-page";
import { getAthleteBySlug } from "@/lib/athletes";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const athlete = getAthleteBySlug(slug);
  if (!athlete) return { title: "Тамирчин олдсонгүй | PRIME" };
  return {
    title: `${athlete.name} — Чансаа | PRIME`,
    description: `${athlete.name} тамирчны дэлгэрэнгүй чансаа, тэмцээний түүх.`,
  };
}

export default async function AthleteRankingPage({ params }: Props) {
  const { slug } = await params;
  const athlete = getAthleteBySlug(slug);
  if (!athlete) notFound();
  return <AthleteDetailPage athlete={athlete} />;
}
