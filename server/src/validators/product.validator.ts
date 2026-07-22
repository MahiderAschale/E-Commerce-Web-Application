import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(200),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  price: z
    .number()
    .positive("Price must be greater than zero"),

  stock: z
    .number()
    .int()
    .min(0, "Stock cannot be negative"),

  sku: z
    .string()
    .min(3)
    .max(50),

  featured: z
    .boolean()
    .optional(),

  status: z
    .enum(["ACTIVE", "OUT_OF_STOCK", "DRAFT", ])
    .optional(),

  categoryId: z
    .string()
    .uuid("Invalid category ID"),
});

export const updateProductSchema =
  createProductSchema.partial();