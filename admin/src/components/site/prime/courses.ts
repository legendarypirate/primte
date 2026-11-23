export type CourseId = "trial" | "c1" | "c2" | "junior" | "solo" | "group" | "master";
export type CourseGroup = "beginner" | "advanced" | "kids";

export type Course = {
  id: CourseId;
  grp: CourseGroup;
  tag: string;
  age: string;
  img: string;
  title: string;
  link?: string;
  price?: string;
  length?: string;
  text: string;
  who: string;
  soon?: boolean;
};

export const GOLD = "#D8AE4A";

export const COURSES: Course[] = [
  {
    id: "trial",
    grp: "beginner",
    tag: "ЭХЛЭГЧ",
    age: "12+",
    img: "/prime/trial.jpg",
    title: "Туршилтын буудлага",
    link: "/training",
    price: "100,000₮-с",
    length: "30–60 минут",
    text: "Мэргэжлийн инструкторын зааварчилгаагаар 100 ширхэг 6 мм-ийн сумаар эйрсофт хийн гар буу эсвэл карабинаар туршиж буудна.",
    who: "Туршиж үзэх хүсэлтэй 12-оос дээш насны хүн бүр",
  },
  {
    id: "c1",
    grp: "beginner",
    tag: "ГИШҮҮНЧЛЭЛ",
    age: "18+",
    img: "/prime/course1.jpg",
    title: "Гишүүнчлэлийн сургалт (Course 1)",
    link: "/training/course-1",
    price: "370,000₮",
    length: "2–3 өдөр",
    text: "Хийн гар бууны төрлийн анхан шатны сургалт. Хэрэгсэл, сум, газ төлбөрт багтсан. 4–6 суралцагчтай анги.",
    who: "Хичээллэх сонирхолтой 18-аас дээш насны Монгол улсын иргэд",
  },
  {
    id: "c2",
    grp: "advanced",
    tag: "ГИШҮҮНЧЛЭЛ",
    age: "18+",
    img: "/prime/training.jpg",
    title: "Гишүүнчлэлийн сургалт (Course 2)",
    link: "/training/course-2",
    price: "370,000₮",
    length: "2–3 өдөр",
    text: "Анхан дунд шатны сургалт. Төгссөнөөр клубын суралцагч гишүүн болж, Ням гарагийн тэмцээнд оролцоно. Өөрийн хэрэгсэлтэй.",
    who: "Course 1 эсвэл практик буудлагын бусад төрлийн сургалт төгссөн хүмүүс",
  },
  {
    id: "junior",
    grp: "kids",
    tag: "ЖУНИОР",
    age: "12–18",
    img: "/prime/junior.jpg",
    title: "Жуниор хөтөлбөр",
    link: "/training/junior",
    price: "750,000₮ / 3 сар",
    length: "Сард 12 цаг",
    text: "Хүүхдэд аюулгүй ажиллагаа, төвлөрөл, хариуцлага олгох 3 түвшний цогц хөтөлбөр. Үндэсний шигшээ хүртэл өсөх боломж.",
    who: "12–18 насны хүүхэд. Эцэг эх нь бүртгүүлнэ.",
  },
  {
    id: "solo",
    grp: "beginner",
    tag: "ГАНЦААРЧИЛСАН",
    age: "18+",
    img: "/prime/membership.jpg",
    title: "Ганцаарчилсан сургалт",
    soon: true,
    text: "Амжилттай төгссөнөөр гэрчилгээ гардаж, Монгол улсад явагдаж буй бүх тэмцээнд оролцох эрх нээгдэнэ.",
    who: "Багштай нүүр тулан, өөрийн хурдаар суралцахыг хүссэн хүмүүс",
  },
  {
    id: "group",
    grp: "advanced",
    tag: "АХИСАН",
    age: "18+",
    img: "/prime/competition.jpg",
    title: "Группын сургалт",
    soon: true,
    text: "Спортын амжилтаа ахиулах, ур чадвараа нэмэгдүүлэх зорилготой сургалт.",
    who: "Сургалтад хамрагдаж, тэмцээнд оролцож, тодорхой хугацаанд хичээллэсэн тамирчид",
  },
  {
    id: "master",
    grp: "advanced",
    tag: "АХИСАН",
    age: "18+",
    img: "/prime/hero.jpg",
    title: "Мастер класс сургалт",
    soon: true,
    text: "Туршлагатай тамирчдад зориулсан ахисан түвшний сургалт.",
    who: "Ахисан түвшний тамирчид",
  },
];

export const HOME_IDS: CourseId[] = ["c1", "trial", "junior"];
export const HOME_FILTERS: [string, string][] = [
  ["all", "Бүгд"],
  ["trial", "Эхлэгч"],
  ["c1", "Гишүүнчлэл"],
  ["junior", "Жуниор"],
];

export const OPEN_COURSES = COURSES.filter((c) => !c.soon);
export const COURSE_GROUP: Record<string, "adult" | "trial" | "junior"> = {
  c1: "adult",
  c2: "adult",
  trial: "trial",
  junior: "junior",
};

export const COURSE_NOTES: Record<string, string> = {
  c1: "Клубын Course 1 бүртгэлийн маягттай ижил асуултууд. Төлбөр 370,000₮ (Course 1 + 2 хамт 650,000₮).",
  c2: "Course 1 төгссөн байх шаардлагатай. Өөрийн хэрэгсэлтэй хамрагдана. Төлбөр 370,000₮.",
  trial: "12-оос дээш насны хүн бүрт нээлттэй. 100 ширхэг сум, 30–60 минут.",
  junior: "12–18 насны хүүхдийг эцэг эх нь бүртгүүлнэ. Шинэ ангийн хуваарийг и-мэйл, утсаар илгээнэ.",
};

export const NAV_ITEMS = [
  { href: "/about", label: "Танилцуулга" },
  { href: "/training", label: "Сургалт" },
  { href: "/ranking", label: "Тэмцээн" },
  { href: "/ranking/rules", label: "Спортын дүрэм" },
  { href: "/membership", label: "Гишүүнчлэл" },
] as const;
