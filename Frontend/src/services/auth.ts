import { IForgotPasswordRequest, ILoginRequest, IRecoverPasswordRequest, IRefreshTokenRequest } from "@/src/types/auth";
import api from "./api";

export const login = async (data: ILoginRequest) => {
    const response = await api.post("/api/Authentication/login", { ...data });

    return response.data.data;
}

export const forgotPassword = async (data: IForgotPasswordRequest) => {
    const response = await api.post("/api/Authentication/forgotpassword", { ...data });

    return response.data.data;
}

export const recoverPassword = async (data: IRecoverPasswordRequest) => {
    const response = await api.post("/api/Authentication/recoverpassword", { ...data });

    // O endpoint Next.js retorna { success: true, message: "..." } diretamente em response.data
    // Não há um campo "data" aninhado como nos endpoints do backend .NET
    return response.data;
}

export const refreshToken = async (data: IRefreshTokenRequest) => {
    const response = await api.post("/api/Authentication/refresh-token", { ...data });

    return response.data.data;
}