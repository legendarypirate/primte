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

export function categoryDescendantIds(categories: ProductCategory[], id: string) {
  const ids: string[] = [];
  function walk(parentId: string) {
    for (const child of categories.filter((c) => c.parentId === parentId)) {
      ids.push(child.id);
      walk(child.id);
    }
  }
  walk(id);
  return ids;
}

export function moveCategoryAfter(categories: ProductCategory[], activeId: string, overId: string) {
  if (activeId === overId) return categories;
  const tree = flattenCategoryTree(categories);
  const descendants = categoryDescendantIds(categories, activeId);
  if (descendants.includes(overId)) return categories;
  const active = tree.find((c) => c.id === activeId);
  const over = tree.find((c) => c.id === overId);
  if (!active || !over) return categories;

  const movingIds = new Set([activeId, ...descendants]);
  const rest = tree.filter((c) => !movingIds.has(c.id));
  const overIndex = rest.findIndex((c) => c.id === overId);
  if (overIndex < 0) return categories;

  const overDescendants = new Set(categoryDescendantIds(rest, overId));
  let insertAt = overIndex + 1;
  while (insertAt < rest.length && overDescendants.has(rest[insertAt].id)) insertAt += 1;

  const next = [
    ...rest.slice(0, insertAt),
    { ...active, parentId: over.parentId || null },
    ...tree.filter((c) => descendants.includes(c.id)),
    ...rest.slice(insertAt),
  ];
  const counts = new Map<string | null, number>();
  const byId = Object.fromEntries(next.map((c) => [c.id, c]));
  const parentOf = new Map(next.map((c) => [c.id, c.parentId || null]));
  function depthOf(id: string) {
    let depth = 0;
    let cur = parentOf.get(id);
    const seen = new Set<string>();
    while (cur && !seen.has(cur)) {
      seen.add(cur);
      depth += 1;
      cur = parentOf.get(cur) || null;
    }
    return depth;
  }
  return next.map((c) => {
    const parentId = c.parentId || null;
    const n = (counts.get(parentId) || 0) + 1;
    counts.set(parentId, n);
    const parent = parentId ? byId[parentId] : null;
    return {
      ...c,
      sortOrder: n,
      parentId,
      parentName: parent?.name || null,
      depth: depthOf(c.id),
    };
  });
}

export function categoryLabel(category: ProductCategory) {
  if (category.depth) return `${"— ".repeat(category.depth)}${category.name}`;
  return category.path && category.path !== category.name ? category.path : category.name;
}

export function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : "Алдаа";
}
