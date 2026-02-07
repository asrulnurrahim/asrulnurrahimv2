"use server";

import {
  getCategories as dbGetCategories,
  createCategory as dbCreateCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
} from "@/services/db";
import { Category } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  return await dbGetCategories();
}

export async function createCategory(category: Partial<Category>) {
  const result = await dbCreateCategory(category);
  revalidatePath("/dashboard/categories");
  revalidatePath("/blog");
  return result;
}

export async function updateCategory(id: string, category: Partial<Category>) {
  const result = await dbUpdateCategory(id, category);
  revalidatePath("/dashboard/categories");
  revalidatePath("/blog");
  return result;
}

export async function deleteCategory(id: string) {
  await dbDeleteCategory(id);
  revalidatePath("/dashboard/categories");
  revalidatePath("/blog");
}
