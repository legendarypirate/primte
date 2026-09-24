export type SiteBlock = {
  id: string;
  type: string;
  data: Record<string, unknown>;
};

export type SitePageData = {
  id: string;
  slug: string;
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  published: boolean;
  sortOrder: number;
  blocks: SiteBlock[];
  blockCount?: number;
  updatedAt?: string;
};

export type FieldDef =
  | { key: string; label: string; type: "text" | "textarea" | "url" | "checkbox" | "number"; placeholder?: string; fullWidth?: boolean }
  | { key: string; label: string; type: "image"; folder?: string; fullWidth?: boolean }
  | { key: string; label: string; type: "cta"; fields: FieldDef[] }
  | { key: string; label: string; type: "repeater"; itemLabel: string; fields: FieldDef[] };

export type BlockSchema = {
  type: string;
  label: string;
  description: string;
  fields: FieldDef[];
  defaultData: () => Record<string, unknown>;
};

export const BLOCK_SCHEMAS: BlockSchema[] = [
  {
    type: "hero",
    label: "Hero",
    description: "Page hero with title, description, CTAs, optional aside panel",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text", fullWidth: true },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "primaryCta", label: "Primary CTA", type: "cta", fields: [{ key: "text", label: "Text", type: "text" }, { key: "href", label: "Link", type: "url" }] },
      { key: "secondaryCta", label: "Secondary CTA", type: "cta", fields: [{ key: "text", label: "Text", type: "text" }, { key: "href", label: "Link", type: "url" }] },
      { key: "backgroundImageUrl", label: "Background image", type: "image", fullWidth: true },
      { key: "asideTag", label: "Aside tag", type: "text" },
      { key: "asideTitle", label: "Aside title", type: "text" },
      { key: "asideBody", label: "Aside body", type: "textarea", fullWidth: true },
      { key: "asideImageUrl", label: "Aside card decoration image", type: "image", fullWidth: true },
    ],
    defaultData: () => ({
      eyebrow: "PRIME IPSC CLUB",
      title: "New section title",
      description: "Description text here.",
      primaryCta: { text: "Learn more", href: "/" },
    }),
  },
  {
    type: "section-header",
    label: "Section header",
    description: "Numbered section title with optional anchor ID",
    fields: [
      { key: "anchorId", label: "Anchor ID", type: "text", placeholder: "safety" },
      { key: "number", label: "Number", type: "text", placeholder: "01" },
      { key: "label", label: "Label", type: "text" },
      { key: "title", label: "Title", type: "text", fullWidth: true },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "dark", label: "Dark background", type: "checkbox" },
    ],
    defaultData: () => ({ number: "01", label: "SECTION", title: "Section title", description: "" }),
  },
  {
    type: "stats-row",
    label: "Stats row",
    description: "Row of stat cards with optional icons",
    fields: [
      {
        key: "items",
        label: "Stats",
        type: "repeater",
        itemLabel: "Stat",
        fields: [
          { key: "icon", label: "Icon (Lucide name)", type: "text", placeholder: "Users" },
          { key: "value", label: "Value", type: "text" },
          { key: "label", label: "Label", type: "text" },
          { key: "highlight", label: "Highlight", type: "checkbox" },
        ],
      },
    ],
    defaultData: () => ({ items: [{ value: "100+", label: "гишүүн" }] }),
  },
  {
    type: "icon-cards",
    label: "Icon cards",
    description: "Grid of feature cards with Lucide icons",
    fields: [
      {
        key: "items",
        label: "Cards",
        type: "repeater",
        itemLabel: "Card",
        fields: [
          { key: "imageUrl", label: "Card image (optional)", type: "image" },
          { key: "icon", label: "Icon", type: "text", placeholder: "Target" },
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "textarea" },
          { key: "href", label: "Link", type: "url" },
        ],
      },
    ],
    defaultData: () => ({ items: [{ icon: "Target", title: "Card title", body: "Card description", href: "" }] }),
  },
  {
    type: "numbered-list",
    label: "Numbered list",
    description: "Numbered items with title and body",
    fields: [
      {
        key: "items",
        label: "Items",
        type: "repeater",
        itemLabel: "Item",
        fields: [
          { key: "n", label: "Number", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "textarea" },
        ],
      },
    ],
    defaultData: () => ({ items: [{ n: "01", title: "Item title", body: "Item body" }] }),
  },
  {
    type: "stepper",
    label: "Stepper",
    description: "Horizontal level/step progress",
    fields: [
      {
        key: "steps",
        label: "Steps",
        type: "repeater",
        itemLabel: "Step",
        fields: [
          { key: "n", label: "Number", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "label", label: "Label", type: "text" },
        ],
      },
    ],
    defaultData: () => ({ steps: [{ n: "1", title: "Step 1", label: "Label" }] }),
  },
  {
    type: "course-cards",
    label: "Course cards",
    description: "Training course cards with pricing",
    fields: [
      {
        key: "items",
        label: "Courses",
        type: "repeater",
        itemLabel: "Course",
        fields: [
          { key: "imageUrl", label: "Card image", type: "image" },
          { key: "title", label: "Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "text" },
          { key: "duration", label: "Duration", type: "text" },
          { key: "audience", label: "Audience", type: "text" },
          { key: "details", label: "Details", type: "textarea" },
          { key: "price", label: "Price", type: "text" },
          { key: "href", label: "Link", type: "url" },
        ],
      },
    ],
    defaultData: () => ({
      items: [{ title: "COURSE 1", subtitle: "Сургалт", duration: "2 өдөр", audience: "Анхан", details: "", price: "350,000₮", href: "/training" }],
    }),
  },
  {
    type: "pricing-grid",
    label: "Pricing grid",
    description: "Membership/pricing tier cards",
    fields: [
      {
        key: "items",
        label: "Tiers",
        type: "repeater",
        itemLabel: "Tier",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "price", label: "Price", type: "text" },
          { key: "features", label: "Features (one per line)", type: "textarea" },
          { key: "ctaText", label: "CTA text", type: "text" },
          { key: "ctaHref", label: "CTA link", type: "url" },
          { key: "highlighted", label: "Highlighted", type: "checkbox" },
        ],
      },
    ],
    defaultData: () => ({
      items: [{ title: "Official Member", price: "250,000₮/жил", features: "Feature 1\nFeature 2", ctaText: "Сонгох", ctaHref: "/contact", highlighted: true }],
    }),
  },
  {
    type: "news-list",
    label: "News list",
    description: "News/notice list items",
    fields: [
      {
        key: "items",
        label: "News items",
        type: "repeater",
        itemLabel: "News",
        fields: [
          { key: "date", label: "Date", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "textarea" },
        ],
      },
    ],
    defaultData: () => ({ items: [{ date: "2024.12.01", title: "News title", body: "News body" }] }),
  },
  {
    type: "timeline",
    label: "Timeline",
    description: "Vertical timeline of events",
    fields: [
      {
        key: "items",
        label: "Events",
        type: "repeater",
        itemLabel: "Event",
        fields: [
          { key: "year", label: "Year", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "textarea" },
        ],
      },
    ],
    defaultData: () => ({ items: [{ year: "2024", title: "Event", body: "Description" }] }),
  },
  {
    type: "team-grid",
    label: "Team grid",
    description: "Team member cards",
    fields: [
      {
        key: "items",
        label: "Members",
        type: "repeater",
        itemLabel: "Member",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "role", label: "Role", type: "text" },
          { key: "sub", label: "Subtitle", type: "text" },
          { key: "imageUrl", label: "Profile photo", type: "image" },
        ],
      },
    ],
    defaultData: () => ({ items: [{ name: "Name", role: "Role", sub: "Subtitle" }] }),
  },
  {
    type: "gallery",
    label: "Gallery",
    description: "Image/title gallery grid",
    fields: [
      {
        key: "items",
        label: "Items",
        type: "repeater",
        itemLabel: "Item",
        fields: [
          { key: "tag", label: "Tag", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "imageUrl", label: "Gallery image", type: "image" },
        ],
      },
    ],
    defaultData: () => ({ items: [{ tag: "TAG", title: "TITLE" }] }),
  },
  {
    type: "cta-banner",
    label: "CTA banner",
    description: "Call-to-action banner section",
    fields: [
      { key: "title", label: "Title", type: "text", fullWidth: true },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "ctaText", label: "Button text", type: "text" },
      { key: "ctaHref", label: "Button link", type: "url" },
      { key: "backgroundImageUrl", label: "Background image", type: "image", fullWidth: true },
    ],
    defaultData: () => ({ title: "Call to action", description: "", ctaText: "Learn more", ctaHref: "/" }),
  },
  {
    type: "rich-text",
    label: "Rich text",
    description: "Free-form text block",
    fields: [
      { key: "title", label: "Title (optional)", type: "text", fullWidth: true },
      { key: "content", label: "Content", type: "textarea", fullWidth: true },
      { key: "imageUrl", label: "Inline image", type: "image", fullWidth: true },
    ],
    defaultData: () => ({ title: "", content: "Your content here." }),
  },
  {
    type: "contact-hero",
    label: "Contact hero",
    description: "Contact page hero with sidebar text and optional background",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text", fullWidth: true },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "sidebarText", label: "Sidebar text (vertical)", type: "textarea" },
      { key: "backgroundImageUrl", label: "Background image", type: "image", fullWidth: true },
    ],
    defaultData: () => ({
      eyebrow: "PRIME PRACTICAL SHOOTING CLUB",
      title: "ХОЛБОО БАРИХ",
      description: "Сургалт, гишүүнчлэл, тэмцээн болон бусад бүх төрлийн асуулт, санал хүсэлтээ бидэнтэй холбогдон аваарай.",
      sidebarText: "Discipline · Skill · Community · A Higher Standard.",
    }),
  },
  {
    type: "contact-cards",
    label: "Contact info cards",
    description: "Phone, email, location, hours cards",
    fields: [
      { key: "sectionNumber", label: "Section number", type: "text" },
      { key: "sectionLabel", label: "Section label", type: "text" },
      { key: "intro", label: "Intro", type: "textarea", fullWidth: true },
      {
        key: "cards",
        label: "Cards",
        type: "repeater",
        itemLabel: "Card",
        fields: [
          { key: "icon", label: "Icon (Phone/Mail/MapPin/Clock)", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "lines", label: "Lines (one per row)", type: "textarea" },
          { key: "note", label: "Note", type: "textarea" },
          { key: "linkText", label: "Link text", type: "text" },
          { key: "linkHref", label: "Link URL", type: "url" },
        ],
      },
    ],
    defaultData: () => ({
      sectionNumber: "01",
      sectionLabel: "ХОЛБОО БАРИХ МЭДЭЭЛЭЛ",
      intro: "Бидэнтэй дараах сувгаар холбогдож, шаардлагатай мэдээллээ аваарай.",
      cards: [
        { icon: "Phone", title: "Утасны дугаар", lines: "8611-0200\n9088-0200", note: "Даваа – Баасан 09:00 – 18:00" },
      ],
    }),
  },
  {
    type: "contact-form-map",
    label: "Contact form + map",
    description: "Message form and location map side by side",
    fields: [
      { key: "formTag", label: "Form section #", type: "text" },
      { key: "formLabel", label: "Form label", type: "text" },
      { key: "formIntro", label: "Form intro", type: "textarea", fullWidth: true },
      { key: "submitText", label: "Submit button", type: "text" },
      { key: "subjects", label: "Subject options (one per line)", type: "textarea", fullWidth: true },
      { key: "mapTag", label: "Map section #", type: "text" },
      { key: "mapLabel", label: "Map label", type: "text" },
      { key: "mapIntro", label: "Map intro", type: "textarea", fullWidth: true },
      { key: "pinTitle", label: "Map pin title", type: "text" },
      { key: "pinLines", label: "Pin lines (one per row)", type: "textarea" },
      { key: "mapBadge", label: "Map badge", type: "text" },
      { key: "mapAddressBar", label: "Address bar", type: "textarea", fullWidth: true },
      { key: "mapLinkText", label: "Map link text", type: "text" },
      { key: "mapLinkHref", label: "Google Maps URL", type: "url", fullWidth: true },
      { key: "mapEmbedUrl", label: "Map embed iframe URL", type: "url", fullWidth: true },
      { key: "mapImageUrl", label: "Map preview image", type: "image", fullWidth: true },
    ],
    defaultData: () => ({
      formTag: "02",
      formLabel: "БИДЭНД ЗУРВАС ИЛГЭЭХ",
      formIntro: "Доорх form-ыг бөглөж, бид тантай хамгийн хурдан хугацаанд холбогдох болно.",
      submitText: "Илгээх",
      subjects: "Сургалтын талаар\nГишүүнчлэлийн талаар\nТэмцээний талаар\nЕрөнхий мэдээлэл",
      mapTag: "03",
      mapLabel: "МАНАЙ БАЙРШИЛ",
      mapIntro: "Клубын байршил, чиглэлийн гарын авлагыг дороос харна уу.",
      pinTitle: "Prime Practical Shooting Club",
      pinLines: "Яармаг, Хан-Уул дүүрэг\nУлаанбаатар, Монгол Улс",
      mapBadge: "KHAN-UUL DISTRICT",
      mapAddressBar: "Хан-Уул дүүрэг, Яармаг, Улаанбаатар",
      mapLinkText: "Google Map дээр нээх →",
      mapLinkHref: "https://maps.google.com",
    }),
  },
  {
    type: "contact-categories",
    label: "Contact FAQ categories",
    description: "Topic cards for common inquiries",
    fields: [
      { key: "sectionNumber", label: "Section number", type: "text" },
      { key: "sectionLabel", label: "Section label", type: "text" },
      { key: "intro", label: "Intro", type: "textarea", fullWidth: true },
      {
        key: "items",
        label: "Categories",
        type: "repeater",
        itemLabel: "Category",
        fields: [
          { key: "icon", label: "Icon", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "body", label: "Body", type: "textarea" },
          { key: "href", label: "Link", type: "url" },
        ],
      },
    ],
    defaultData: () => ({
      sectionNumber: "04",
      sectionLabel: "ТҮГЭЭМЭЛ ЛАВЛАГАА",
      intro: "",
      items: [{ icon: "HelpCircle", title: "Ерөнхий", body: "Description", href: "" }],
    }),
  },
  {
    type: "contact-social-cta",
    label: "Contact social CTA",
    description: "Bottom banner with social links",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text", fullWidth: true },
      { key: "description", label: "Description", type: "textarea", fullWidth: true },
      { key: "followLabel", label: "Follow label", type: "text" },
      { key: "backgroundImageUrl", label: "Background image", type: "image", fullWidth: true },
      {
        key: "socials",
        label: "Social links",
        type: "repeater",
        itemLabel: "Social",
        fields: [
          { key: "label", label: "Label (FB/IG/YT)", type: "text" },
          { key: "href", label: "URL", type: "url" },
        ],
      },
    ],
    defaultData: () => ({
      eyebrow: "PRIME PRACTICAL SHOOTING CLUB",
      title: "ХАМТДАА ӨСӨН ХӨГЖЬЕ",
      description: "",
      followLabel: "Бидний дагаарай",
      socials: [{ label: "FB", href: "#" }],
    }),
  },
];

export const BLOCK_SCHEMA_MAP = Object.fromEntries(BLOCK_SCHEMAS.map((s) => [s.type, s])) as Record<string, BlockSchema>;

export function newBlock(type: string): SiteBlock {
  const schema = BLOCK_SCHEMA_MAP[type];
  if (!schema) throw new Error(`Unknown block type: ${type}`);
  return { id: crypto.randomUUID(), type, data: schema.defaultData() };
}
