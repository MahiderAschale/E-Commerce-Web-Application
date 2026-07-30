import { Prisma, ProductStatus } from "@prisma/client";
import prisma from "../config/prisma.js";
import { AppError } from "../utils/AppError.js";
import { generateSlug } from "../utils/slug.js";
import { ProductSearchInput } from "../validators/productSearch.validator.js";

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

export const getProducts = async (query: ProductSearchInput) => {
  const {
    search,
    category,
    status,
    featured,
    minPrice,
    maxPrice,
    sort,
    order,
    page,
    limit,
  } = query;

  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = {};

  // Search by product name
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Filter by category slug
  if (category) {
    where.category = {
      slug: category,
    };
  }

  // Filter by status
  if (status) {
    where.status = status;
  }

  // Filter featured
  if (featured !== undefined) {
    where.featured = featured === "true";
  }

  // Price filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};

    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,

      include: {
        category: true,

        images: {
          where: {
            isPrimary: true,
          },
        },
      },

      orderBy: {
        [sort]: order,
      },

      skip,

      take: limit,
    }),

    prisma.product.count({
      where,
    }),
  ]);

  return {
    products,

    pagination: {
      total,

      page,

      limit,

      totalPages: Math.ceil(total / limit),

      hasNextPage: page < Math.ceil(total / limit),

      hasPreviousPage: page > 1,
    },
  };
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