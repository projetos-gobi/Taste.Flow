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

function resolveFallbackOrigin() {
  // Para quando o proxy/rewrite da Vercel falhar (timeout/rede), tentamos falar direto com o backend.
  // Precisa existir em env (ex.: https://tasteflow-backend.fly.dev)
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
  const method = String(config.method ?? "get").toLowerCase();
  const isAuthEndpoint =
    url.includes("/api/Authentication/login") ||
    url.includes("/api/Authentication/forgotpassword") ||
    url.includes("/api/Authentication/refresh-token");

  // Para endpoints de leitura (nossos POST /get-*), preferimos timeouts menores + retries.
  // Isso reduz o “travão” de 15s no mobile quando a conexão fica presa.
  const isReadLikePost =
    method === "post" && (url.includes("/get-") || url.includes("/get_"));

  if (isReadLikePost) {
    config.timeout = 6000;
  }

  // Login: timeout menor + chamar direto no Fly (bypass proxy) para reduzir latência
  if (url.includes("/api/Authentication/login")) {
    config.timeout = 6000;
    // Bypass proxy: chamar Fly.io direto para login (elimina 1 hop)
    const directBackend = process.env.NEXT_PUBLIC_API_URL;
    if (directBackend && typeof window !== "undefined") {
      const host = window.location.host.toLowerCase();
      if (host.includes("vercel.app") || host.includes("taste-flow")) {
        config.baseURL = directBackend;
      }
    }
  }

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

    // Retry até 2x (principalmente em mobile)
    const retryCount = Number(originalRequest?._retryNetCount ?? 0);
    if ((isTimeout || isNetworkError) && originalRequest && shouldRetryNetwork && retryCount < 2) {
      originalRequest._retryNetCount = retryCount + 1;
      const delay = retryCount === 0 ? 250 : 600;
      await new Promise((r) => setTimeout(r, delay));

      // Se estamos usando SAME-ORIGIN (proxy da Vercel) e mesmo assim falhou,
      // no último retry tentamos rota alternativa direto no backend (Fly).
      // Isso reduz casos em que a Vercel fica “presa” mas o Fly está ok.
      if (
        retryCount === 1 && // ou seja, este será o 2º retry (último)
        !originalRequest.baseURL &&
        typeof originalRequest.url === "string" &&
        originalRequest.url.startsWith("/api/")
      ) {
        const fallback = resolveFallbackOrigin();
        if (fallback) {
          originalRequest.baseURL = fallback;
        }
      }

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

    // Se o proxy /api (Next) retornar 5xx, tenta 1x direto no backend (Fly).
    if (
      status >= 500 &&
      typeof url === "string" &&
      url.startsWith("/api/") &&
      originalRequest &&
      !originalRequest.baseURL &&
      !originalRequest._retryProxy5xx
    ) {
      const fallback = resolveFallbackOrigin();
      if (fallback) {
        originalRequest._retryProxy5xx = true;
        originalRequest.baseURL = fallback;
        return api(originalRequest);
      }
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
