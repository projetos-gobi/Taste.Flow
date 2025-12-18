import axios from "axios";
import Cookies from "js-cookie";
import useSession from "@/src/hooks/useSession";

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

let refreshInFlight: Promise<string | null> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    const url = originalRequest?.url ?? "";

    const isAuthEndpoint =
      url.includes("/api/Authentication/login") ||
      url.includes("/api/Authentication/forgotpassword") ||
      url.includes("/api/Authentication/refresh-token");

    if (status !== 401 || isAuthEndpoint || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const session = useSession.getState();
    const userId = session.userId;
    const refreshToken = session.refreshToken;

    if (!userId || !refreshToken) {
      session.onLogout();
      Cookies.remove("token");
      Cookies.remove("role");
      if (typeof window !== "undefined") window.location.href = "/";
      return Promise.reject(error);
    }

    try {
      if (!refreshInFlight) {
        refreshInFlight = (async () => {
          try {
            const resp = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/api/Authentication/refresh-token`,
              { userId, refreshToken },
              { timeout: 15000, headers: { "Content-Type": "application/json" } }
            );

            const newToken = resp?.data?.data?.token as string | undefined;
            if (!newToken) return null;

            Cookies.set("token", newToken);
            api.defaults.headers.Authorization = `Bearer ${newToken}`;
            session.setToken(newToken);

            return newToken;
          } finally {
            refreshInFlight = null;
          }
        })();
      }

      const newToken = await refreshInFlight;
      if (!newToken) {
        session.onLogout();
        Cookies.remove("token");
        Cookies.remove("role");
        if (typeof window !== "undefined") window.location.href = "/";
        return Promise.reject(error);
      }

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (e) {
      refreshInFlight = null;
      session.onLogout();
      Cookies.remove("token");
      Cookies.remove("role");
      if (typeof window !== "undefined") window.location.href = "/";
      return Promise.reject(error);
    }
  }
);

export default api;
