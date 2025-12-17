import { ICreateEnterpriseRequest, IGetEnterpriseByIdRequest, IGetEnterprisesPagedRequest, ISoftDeleteEnterpriseRequest, IUpdateEnterpriseRequest } from "../types/enterprise";
import api from "./api";

export const createEnterprise = async (data: ICreateEnterpriseRequest) => {
    const response = await api.post("/api/Enterprise/create-enterprise", { ...data });

    return response.data.data;
}

export const getEnterprisesPaged = async (data: IGetEnterprisesPagedRequest) => {
    const response = await api.post("/api/Enterprise/get-enterprises-paged", { ...data });

    return response.data.data;
}

export const getEnterpriseById = async (data: IGetEnterpriseByIdRequest) => {
    const response = await api.post("/api/Enterprise/get-enterprise-by-id", { ...data });

    return response.data.data;
}

export const updateEnterprise = async (data: IUpdateEnterpriseRequest) => {
    const response = await api.post("/api/Enterprise/update-enterprise", { ...data });

    return response.data.data;
}

export const softDeleteEnterprise = async (data: ISoftDeleteEnterpriseRequest) => {
    const response = await api.post("/api/Enterprise/soft-delete-enterprise", { ...data });

    return response.data.data;
}


export const getAllEnterprisesForUserRegistration = async () => {
    const response = await api.post("/api/Enterprise/get-all-enterprises-for-user-registration");

    return response.data.data;
}

export const getEnterpriseDetailById = async () => {
    const response = await api.post("/api/Enterprise/get-enterprise-detail-by-id");

    return response.data.data;
}