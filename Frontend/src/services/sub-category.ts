import { ICheckSubCategoriesExistRequest, ICreateSubCategoriesRangeRequest, IGetAllSubCategoriesByEnterpriseIdRequest, IGetSubCategoriesPagedRequest, IGetSubCategoryByIdRequest, ISoftDeleteSubCategoryRequest, IUpdateSubCategoryRequest } from "../types/sub-category";
import api from "./api";

export const createSubCategoriesRange = async (data: ICreateSubCategoriesRangeRequest) => {
    const response = await api.post("/api/SubCategory/create-sub-categories-range", { ...data });

    return response.data.data;
}

export const getSubCategoriesPaged = async (data: IGetSubCategoriesPagedRequest) => {
    const response = await api.post("/api/SubCategory/get-sub-categories-paged", { ...data });

    return response.data.data;
}

export const getSubCategoryById = async (data: IGetSubCategoryByIdRequest) => {
    const response = await api.post("/api/SubCategory/get-sub-category-by-id", { ...data });

    return response.data.data;
}

export const updateSubCategory = async (data: IUpdateSubCategoryRequest) => {
    const response = await api.post("/api/SubCategory/update-sub-category", { ...data });

    return response.data.data;
}

export const softDeleteSubCategory= async (data: ISoftDeleteSubCategoryRequest) => {
    const response = await api.post("/api/SubCategory/soft-delete-sub-category", { ...data });

    return response.data.data;
}

export const getAllSubCategoriesByEnterpriseId = async (data: IGetAllSubCategoriesByEnterpriseIdRequest) => {
    const response = await api.post("/api/SubCategory/get-all-sub-categories-by-enterprise-id", { ...data });

    return response.data.data;
}

export const checkSubCategoriesExist = async (data: ICheckSubCategoriesExistRequest) => {
    const response = await api.post("/api/SubCategory/check-sub-categories-exist", { ...data });

    return response.data.data;
}