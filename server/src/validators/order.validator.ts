import { PaymentMethod } from "@prisma/client";
import { z } from "zod";

export const checkoutSchema = z.object({
  cartItemIds: z.array(z.string().uuid()).min(1),
  addressId: z.string().uuid(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});

export const placeOrderSchema = checkoutSchema;

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;