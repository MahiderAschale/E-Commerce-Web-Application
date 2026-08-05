import api from "../api/axios";

export const addToCart = async (
  productId: string,
  quantity: number
) => {
  const res = await api.post("/cart", {
    productId,
    quantity,
  });

  return res.data;
};

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const updateCart = async (
  itemId: string,
  quantity: number
) => {
  const res = await api.patch(`/cart/${itemId}`, {
    quantity,
  });

  return res.data;
};

export const removeCartItem = async (itemId: string) => {
  const res = await api.delete(`/cart/${itemId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete("/cart");
  return res.data;
};