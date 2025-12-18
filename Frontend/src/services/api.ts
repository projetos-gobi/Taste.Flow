import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  const url = config.url ?? "";
  const isAuthEndpoint =
    url.includes("/api/Authentication/login") ||
    url.includes("/api/Authentication/forgotpassword") ||
    url.includes("/api/Authentication/refresh-token");

  if (token) {
    // Não enviar Bearer no login/refresh: evita validação desnecessária e pode reduzir latência.
    if (!isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete (config.headers as any).Authorization;
    }
  }
  return config;
});

export default api;
