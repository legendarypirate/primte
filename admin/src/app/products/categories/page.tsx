import { redirect } from "next/navigation";

export default function ProductCategoriesRedirect() {
  redirect("/products?tab=categories");
}
