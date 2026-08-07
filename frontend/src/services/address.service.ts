import api from "../api/axios";

export const getAddresses = async () => {
  const res = await api.get("/address");
  return res.data;
};

export const getAddress = async (id: string) => {
  const res = await api.get(`/address/${id}`);
  return res.data;
};

export const createAddress = async (data: any) => {
  const res = await api.post("/address", data);
  return res.data;
};

export const updateAddress = async (
  id: string,
  data: any
) => {
  const res = await api.patch(`/address/${id}`, data);
  return res.data;
};

export const deleteAddress = async (id: string) => {
  const res = await api.delete(`/address/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id: string) => {
  const res = await api.patch(`/address/${id}/default`);
  return res.data;
};