export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  category: string;
  categoryLabel?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  stock: number;
  inStock: boolean;
  featured: boolean;
  imageUrl?: string;
  images?: string[];
  relatedIds?: string[];
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  parentId: string | null;
  parentName?: string | null;
  path?: string;
  depth?: number;
  childCount?: number;
  productCount: number;
  totalProductCount?: number;
};

export function flattenCategoryTree(categories: ProductCategory[]): ProductCategory[] {
  const byParent = new Map<string | null, ProductCategory[]>();
  for (const category of categories) {
    const key = category.parentId || null;
    const list = byParent.get(key) || [];
    list.push(category);
    byParent.set(key, list);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "mn"));
  }
  const out: ProductCategory[] = [];
  function walk(parentId: string | null, depth: number) {
    for (const category of byParent.get(parentId) || []) {
      out.push({ ...category, depth });
      walk(category.id, depth + 1);
    }
  }
  walk(null, 0);
  const seen = new Set(out.map((c) => c.id));
  for (const category of categories) {
    if (!seen.has(category.id)) out.push({ ...category, depth: 0 });
  }
  return out;
}

export function categoryDescendantSlugs(categories: ProductCategory[], slug: string) {
  const current = categories.find((c) => c.slug === slug);
  if (!current) return [slug];
  const slugs = new Set<string>([current.slug]);
  function walk(id: string) {
    for (const child of categories.filter((c) => c.parentId === id)) {
      slugs.add(child.slug);
      walk(child.id);
    }
  }
  walk(current.id);
  return [...slugs];
}

export function categoryLabel(category: ProductCategory) {
  if (category.depth) return `${"— ".repeat(category.depth)}${category.name}`;
  return category.path && category.path !== category.name ? category.path : category.name;
}

export function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : "Алдаа";
}
