export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryLabel?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  inStock: boolean;
  imageUrl?: string;
  images?: string[];
  relatedIds?: string[];
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  productCount: number;
};

export function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : "Алдаа";
}
