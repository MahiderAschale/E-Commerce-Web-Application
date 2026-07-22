import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

interface CategoryInput {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export const createCategory = async (data: CategoryInput) => {
  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        { name: data.name },
        { slug: data.slug }
      ]
    }
  });

  if (existing) {
    throw new AppError("Category already exists", 409);
  }

  return prisma.category.create({
    data,
  });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

export const updateCategory = async (
  id: string,
  data: Partial<CategoryInput>
) => {
  await getCategoryById(id);

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  await getCategoryById(id);

  return prisma.category.delete({
    where: { id },
  });
};