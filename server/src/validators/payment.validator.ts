import { z } from "zod";

export const initializePaymentSchema = z.object({
  orderId: z.string().uuid(),
});

export type InitializePaymentInput =
  z.infer<typeof initializePaymentSchema>;