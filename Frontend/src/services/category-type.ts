import { ICheckCategoryTypesExistRequest, ICreateCategoryTypesRangeRequest, IGetAllCategoryTypesByEnterpriseIdRequest, IGetCategoryTypeByIdRequest, IGetCategoryTypesPagedRequest, ISoftDeleteCategoryTypeRequest, IUpdateCategoryTypeRequest } from "../types/category-type";
import api from "./api";

export const createCategoryTypesRange = async (data: ICreateCategoryTypesRangeRequest) => {
    const response = await api.post("/api/CategoryType/create-category-types-range", { ...data });

    return response.data.data;
}

export const getCategoryTypesPaged = async (data: IGetCategoryTypesPagedRequest) => {
    const response = await api.post("/api/CategoryType/get-category-types-paged", { ...data });

    return response.data.data;
}

export const getCategoryTypeById = async (data: IGetCategoryTypeByIdRequest) => {
    const response = await api.post("/api/CategoryType/get-category-type-by-id", { ...data });

    return response.data.data;
}

export const updateCategoryType = async (data: IUpdateCategoryTypeRequest) => {
    const response = await api.post("/api/CategoryType/update-category-type", { ...data });

    return response.data.data;
}

export const softDeleteCategoryType= async (data: ISoftDeleteCategoryTypeRequest) => {
    const response = await api.post("/api/CategoryType/soft-delete-category-type", { ...data });

    return response.data.data;
}

export const getAllCategoryTypesByEnterpriseId = async (data: IGetAllCategoryTypesByEnterpriseIdRequest) => {
    const response = await api.post("/api/CategoryType/get-all-category-types-by-enterprise-id", { ...data });

    return response.data.data;
}

export const checkCategoryTypesExist = async (data: ICheckCategoryTypesExistRequest) => {
    const response = await api.post("/api/CategoryType/check-category-types-exist", { ...data });

    return response.data.data;
}