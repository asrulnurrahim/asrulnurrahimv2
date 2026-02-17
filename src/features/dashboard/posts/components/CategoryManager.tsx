import { getCategories } from "@/features/dashboard/posts/services/categories";
import CategoryManagerComponent from "./categories/CategoryManager";

export async function CategoryManager() {
  const categories = await getCategories();

  return <CategoryManagerComponent categories={categories} />;
}
