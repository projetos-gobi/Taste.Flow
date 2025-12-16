export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IForgotPasswordRequest {
    email: string;
}

export interface IRecoverPasswordRequest {
    code: string;
    oldPassword: string;
    newPassword: string;
}

export interface IRefreshTokenRequest {
    userId: string;
    refreshToken: string;
}