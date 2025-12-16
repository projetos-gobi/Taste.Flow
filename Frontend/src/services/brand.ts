import { ICheckBrandsExistRequest, ICreateBrandsRangeRequest, IGetAllBrandsByEnterpriseIdRequest, IGetBrandByIdRequest, IGetBrandsPagedRequest, ISoftDeleteBrandRequest, IUpdateBrandRequest } from "../types/brand";
import api from "./api";

export const createBrandsRange = async (data: ICreateBrandsRangeRequest) => {
    const response = await api.post("/Brand/create-brands-range", { ...data });

    return response.data.data;
}

export const getBrandsPaged = async (data: IGetBrandsPagedRequest) => {
    const response = await api.post("/Brand/get-brands-paged", { ...data });

    return response.data.data;
}

export const getBrandById = async (data: IGetBrandByIdRequest) => {
    const response = await api.post("/Brand/get-brand-by-id", { ...data });

    return response.data.data;
}

export const updateBrand = async (data: IUpdateBrandRequest) => {
    const response = await api.post("/Brand/update-brand", { ...data });

    return response.data.data;
}

export const softDeleteBrand = async (data: ISoftDeleteBrandRequest) => {
    const response = await api.post("/Brand/soft-delete-brand", { ...data });

    return response.data.data;
}

export const getAllBrandsByEnterpriseId = async (data: IGetAllBrandsByEnterpriseIdRequest) => {
    const response = await api.post("/Brand/get-all-brands-by-enterprise-id", { ...data });

    return response.data.data;
}

export const checkBrandsExist = async (data: ICheckBrandsExistRequest) => {
    const response = await api.post("/Brand/check-brands-exist", { ...data });

    return response.data.data;
}