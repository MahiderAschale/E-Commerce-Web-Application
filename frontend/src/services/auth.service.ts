import api from "../api/axios";

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};

export const updateProfile = (data: {
  fullName: string;
  phone: string;
}) => {
  return api.patch("/auth/profile", data);
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};