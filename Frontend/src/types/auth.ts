export interface ILoginRequest {
    Email: string;
    Password: string;
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