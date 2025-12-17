import { ICheckCategoriesExistRequest, ICreateCategoriesRangeRequest, IGetAllCategoriesByEnterpriseIdRequest, IGetCategoriesPagedRequest, IGetCategoryByIdRequest, ISoftDeleteCategoryRequest, IUpdateCategoryRequest } from "../types/category";
import api from "./api";

export const createCategoriesRange = async (data: ICreateCategoriesRangeRequest) => {
    const response = await api.post("/api/Category/create-categories-range", { ...data });

    return response.data.data;
}

export const getCategoriesPaged = async (data: IGetCategoriesPagedRequest) => {
    const response = await api.post("/api/Category/get-categories-paged", { ...data });

    return response.data.data;
}

export const getCategoryById = async (data: IGetCategoryByIdRequest) => {
    const response = await api.post("/api/Category/get-category-by-id", { ...data });

    return response.data.data;
}

export const updateCategory = async (data: IUpdateCategoryRequest) => {
    const response = await api.post("/api/Category/update-category", { ...data });

    return response.data.data;
}

export const softDeleteCategory= async (data: ISoftDeleteCategoryRequest) => {
    const response = await api.post("/api/Category/soft-delete-category", { ...data });

    return response.data.data;
}

export const getAllCategoriesByEnterpriseId = async (data: IGetAllCategoriesByEnterpriseIdRequest) => {
    const response = await api.post("/api/Category/get-all-categories-by-enterprise-id", { ...data });

    return response.data.data;
}

export const checkCategoriesExist = async (data: ICheckCategoriesExistRequest) => {
    const response = await api.post("/api/Category/check-categories-exist", { ...data });

    return response.data.data;
}