import api from "../api/axios";

export interface CategoryInput {
  name: string;
  description?: string;
  image?: string;
}

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

// Admin: create category
export const createCategory = async (data: CategoryInput) => {
  const response = await api.post("/categories", data);
  return response.data;
};

// Admin: update category
export const updateCategory = async (
  id: string,
  data: Partial<CategoryInput>
) => {
  const response = await api.patch(`/categories/${id}`, data);
  return response.data;
};

// Admin: delete category
export const deleteCategory = async (id: string) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};