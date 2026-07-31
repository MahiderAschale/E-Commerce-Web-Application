import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(3).optional(),

  email: z.email().optional(),

  phone: z.string().min(10).max(15).optional(),
});