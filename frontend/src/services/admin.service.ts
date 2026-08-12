import api from "../api/axios";

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};