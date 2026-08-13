import api from "../api/axios";

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  featured?: boolean;
  status?: "ACTIVE" | "OUT_OF_STOCK" | "DRAFT";
  categoryId: string;
}

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

export const createProduct = async (
  data: CreateProductInput
) => {
  const response = await api.post("/products", data);

  return response.data;
};

export const updateProduct = async (
  id: string,
  data: Partial<CreateProductInput>
) => {
  const response = await api.patch(
    `/products/${id}`,
    data
  );

  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};

export const uploadProductImages = async (
  productId: string,
  files: File[]
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("image", file);
  });

  const response = await api.post(
    `/products/${productId}/images`,
    formData
  );

  return response.data;
};