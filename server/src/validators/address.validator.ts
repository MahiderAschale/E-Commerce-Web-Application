import { z } from "zod";

export const createAddressSchema = z.object({
  fullName: z.string().min(3).max(100),

  phone: z.string().min(10).max(20),

  country: z.string().min(2),

  city: z.string().min(2),

  subCity: z.string().min(2),

  woreda: z.string().optional(),

  houseNumber: z.string().optional(),

  isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;