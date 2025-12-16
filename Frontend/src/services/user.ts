import { ICreateUsersRangeRequest, IGetUserByIdRequest, IGetUsersPagedRequest, ISoftDeleteUserRequest, IUpdateUserRequest } from "../types/user";
import api from "./api";

export const createUsersRange = async (data: ICreateUsersRangeRequest) => {
    const response = await api.post("/User/create-users-range", { ...data });

    return response.data.data;
}

export const getUsersPaged = async (data: IGetUsersPagedRequest) => {
    const response = await api.post("/User/get-users-paged", { ...data });

    return response.data.data;
}

export const getUserById = async (data: IGetUserByIdRequest) => {
    const response = await api.post("/User/get-user-by-id", { ...data });

    return response.data.data;
}

export const updateUser = async (data: IUpdateUserRequest) => {
    const response = await api.post("/User/update-user", { ...data });

    return response.data.data;
}

export const softDeleteUser = async (data: ISoftDeleteUserRequest) => {
    const response = await api.post("/User/soft-delete-user", { ...data });

    return response.data.data;
}