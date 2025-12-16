"use client";

import { useEffect, useRef } from "react";
import api from "../services/api";
import { decodeToken } from "../app/utils/storageUtils";
import { refreshToken as refreshTokenApi } from "../services/auth";
import useSession from "./useSession";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function useTokenRefresh() {
  const session = useSession();
  const router = useRouter();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  const clearRefreshTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const refreshNow = async () => {
    if (isRefreshingRef.current) {
      return;
    }
    isRefreshingRef.current = true;

    try {
      const response = await refreshTokenApi({ userId: session.userId, refreshToken: session.refreshToken });

      session.setToken(response.token);

      Cookies.set("token", response.token);

      api.defaults.headers.Authorization = `Bearer ${response.token}`;     

      scheduleRefresh(response.token);
    } catch (err: any) {
      console.error("[TokenRefresh] Erro no refresh:", err?.response?.status);

      session.onLogout();
      router.push("/");
    } finally {
      isRefreshingRef.current = false;
    }
  };

  const scheduleRefresh = (token: string) => {
    try {
      const payload = decodeToken<any>(token);
      if (!payload?.exp) return;

      const exp = payload.exp * 1000;
      const now = Date.now();
      const expiresIn = exp - now;

      const refreshTime = Math.max(expiresIn - 30 * 1000, 5 * 1000);

      clearRefreshTimeout();
      timeoutRef.current = setTimeout(refreshNow, refreshTime);
    } catch (err) {
      console.error("[TokenRefresh] Erro ao calcular refresh:", err);
    }
  };

  useEffect(() => {
    if (!session.userId || !session.token || !session.refreshToken) return;

    scheduleRefresh(session.token);

    return () => {
      clearRefreshTimeout();
    };
  }, [session.token, session.refreshToken, session.userId]);
}
