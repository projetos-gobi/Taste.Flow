import { IForgotPasswordRequest, ILoginRequest, IRecoverPasswordRequest, IRefreshTokenRequest } from "@/src/types/auth";
import api from "./api";

export const login = async (data: ILoginRequest) => {
    const response = await api.post("/Authentication/login", { ...data });

    return response.data.data;
}

export const forgotPassword = async (data: IForgotPasswordRequest) => {
    const response = await api.post("/Authentication/forgotpassword", { ...data });

    return response.data.data;
}

export const recoverPassword = async (data: IRecoverPasswordRequest) => {
    const response = await api.post("/Authentication/recoverpassword", { ...data });

    return response.data.data;
}

export const refreshToken = async (data: IRefreshTokenRequest) => {
    const response = await api.post("/Authentication/refresh-token", { ...data });

    return response.data.data;
}