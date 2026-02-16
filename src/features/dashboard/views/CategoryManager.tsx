import { getCategories } from "@/features/dashboard/services/categories";
import CategoryManagerComponent from "../components/categories/CategoryManager";

export async function CategoryManager() {
  const categories = await getCategories();

  return <CategoryManagerComponent categories={categories} />;
}
