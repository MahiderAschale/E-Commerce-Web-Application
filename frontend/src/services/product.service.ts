import api from "../api/axios";

export const getProducts = async (params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);

  return response.data;
};


