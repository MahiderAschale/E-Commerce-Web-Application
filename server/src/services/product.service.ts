import { Prisma, ProductStatus } from "@prisma/client";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { generateSlug } from "../utils/slug.js";

interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  featured?: boolean;
  status?: ProductStatus;
  categoryId: string;
}

export const createProduct = async (data: ProductInput) => {
  // Check category exists
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // Check SKU
  const existingSku = await prisma.product.findUnique({
    where: {
      sku: data.sku,
    },
  });

  if (existingSku) {
    throw new AppError("SKU already exists", 409);
  }

  // Generate slug
  const slug = generateSlug(data.name);

  // Check slug uniqueness
  const existingSlug = await prisma.product.findUnique({
    where: {
      slug,
    },
  });

  if (existingSlug) {
    throw new AppError("A product with this name already exists", 409);
  }

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      price: new Prisma.Decimal(data.price),
    },
    include: {
      category: true,
    },
  });

  return product;
};

export const getProducts = async () => {
  return prisma.product.findMany({
    include: {
      category: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

export const updateProduct = async (
  id: string,
  data: Partial<ProductInput>
) => {
  await getProductById(id);

  const updateData: any = { ...data };

  if (data.name) {
    updateData.slug = generateSlug(data.name);
  }

  if (data.price !== undefined) {
    updateData.price = new Prisma.Decimal(data.price);
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      images: true,
    },
  });
};

export const deleteProduct = async (id: string) => {
  await getProductById(id);

  return prisma.product.delete({
    where: { id },
  });
};