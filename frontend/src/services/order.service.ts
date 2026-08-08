
import api from "../api/axios";

export type PaymentMethod =
  | "CHAPA";

export interface CheckoutRequest {
  cartItemIds: string[];
  addressId: string;
  paymentMethod: PaymentMethod;
}

export const initializeChapaPayment = async (orderId: string) => {
  const response = await api.post("/payments/chapa/initialize", {
    orderId,
  });

  return response.data;
};
export const checkoutOrder = async (data: CheckoutRequest) => {
  const res = await api.post("/orders/checkout", data);
  return res.data;
};

export const placeOrder = async (data: CheckoutRequest) => {
  const res = await api.post("/orders", data);
  return res.data;
};

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const getOrder = async (id: string) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const cancelOrder = async (id: string) => {
  const res = await api.patch(`/orders/${id}/cancel`);
  return res.data;
};

