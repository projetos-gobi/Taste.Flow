import axios from "axios";
import Cookies from "js-cookie";
import useSession from "@/src/hooks/useSession";

function resolveBaseURL() {
  // Em produção (Vercel), preferimos SAME-ORIGIN para evitar instabilidade mobile/CORS.
  // Isso permite usar rewrites (`vercel.json`) para encaminhar /api/* ao backend no Fly.
  if (typeof window !== "undefined") {
    const host = window.location.host.toLowerCase();
    if (host.includes("vercel.app") || host.includes("taste-flow")) {
      return undefined; // relative
    }
  }

  return process.env.NEXT_PUBLIC_API_URL || undefined;
}

export const api = axios.create({
  baseURL: resolveBaseURL(),
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
    const method = String(originalRequest?.method ?? "get").toLowerCase();

    const isAuthEndpoint =
      url.includes("/api/Authentication/login") ||
      url.includes("/api/Authentication/forgotpassword") ||
      url.includes("/api/Authentication/refresh-token");

    // Retry 1x em timeout/rede (muito comum em mobile).
    // IMPORTANTE: retry automático só para chamadas "seguras" (leitura e auth),
    // para evitar duplicar comandos de escrita (create/update/delete).
    const isTimeout =
      error?.code === "ECONNABORTED" ||
      /timeout/i.test(String(error?.message ?? ""));
    const isNetworkError = !error?.response; // sem status/response

    const isReadLikePost =
      method === "post" && (url.includes("/get-") || url.includes("/get_"));

    const isSafeMethod = method === "get" || method === "head" || method === "options";

    // Auth é seguro para retry em erro de rede/timeout (não em 401).
    const isRetryableAuth =
      url.includes("/api/Authentication/login") ||
      url.includes("/api/Authentication/refresh-token") ||
      url.includes("/api/Authentication/forgotpassword");

    const shouldRetryNetwork = isSafeMethod || isReadLikePost || isRetryableAuth;

    if ((isTimeout || isNetworkError) && originalRequest && !originalRequest._retryNet && shouldRetryNetwork) {
      originalRequest._retryNet = true;
      await new Promise((r) => setTimeout(r, 250));
      return api(originalRequest);
    }

    // Alguns erros 503 no primeiro login são transientes (DB/pool/infra). Retry 1x.
    if (
      status === 503 &&
      url.includes("/api/Authentication/login") &&
      originalRequest &&
      !originalRequest._retry503
    ) {
      originalRequest._retry503 = true;
      await new Promise((r) => setTimeout(r, 300));
      return api(originalRequest);
    }

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
            const resp = await api.post("/api/Authentication/refresh-token", { userId, refreshToken }, { timeout: 15000 });

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
