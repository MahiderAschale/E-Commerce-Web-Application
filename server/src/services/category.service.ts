import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";

interface CategoryInput {
  name: string;
  description?: string;
  image?: string;
}

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// ==========================================
// CREATE CATEGORY
// ==========================================

export const createCategory = async (data: CategoryInput) => {
  const slug = generateSlug(data.name);

  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        { name: data.name },
        { slug },
      ],
    },
  });

  if (existing) {
    throw new AppError("Category already exists", 409);
  }

  return prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      image: data.image,
    },
  });
};

// ==========================================
// GET ALL CATEGORIES
// ==========================================

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// ==========================================
// GET CATEGORY BY ID
// ==========================================

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
};

// ==========================================
// UPDATE CATEGORY
// ==========================================

export const updateCategory = async (
  id: string,
  data: Partial<CategoryInput>
) => {
  await getCategoryById(id);

  const updateData: any = {
    ...data,
  };

  // Generate new slug if name is changed
  if (data.name) {
    updateData.slug = generateSlug(data.name);
  }

  return prisma.category.update({
    where: { id },
    data: updateData,
  });
};

// ==========================================
// DELETE CATEGORY
// ==========================================

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // Prevent deleting category that has products
  if (category.products.length > 0) {
    throw new AppError(
      `Cannot delete category because it contains ${category.products.length} product(s). Move or delete the products first.`,
      400
    );
  }

  return prisma.category.delete({
    where: { id },
  });
};