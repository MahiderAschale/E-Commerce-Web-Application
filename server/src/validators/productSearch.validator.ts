import { ProductStatus } from "@prisma/client";
import { z } from "zod";

export const productSearchSchema = z.object({
  search: z.string().optional(),

  category: z.string().optional(),

  status: z.nativeEnum(ProductStatus).optional(),

  featured: z
    .enum(["true", "false"])
    .optional(),

  minPrice: z.coerce.number().optional(),

  maxPrice: z.coerce.number().optional(),

  sort: z
    .enum([
      "name",
      "price",
      "createdAt",
    ])
    .default("createdAt"),

  order: z
    .enum(["asc", "desc"])
    .default("desc"),

  page: z.coerce.number().default(1),

  limit: z.coerce.number().default(12),
});

export type ProductSearchInput =
  z.infer<typeof productSearchSchema>;