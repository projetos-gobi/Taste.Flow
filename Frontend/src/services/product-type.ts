import { ICheckProductTypesExistRequest, ICreateProductTypesRangeRequest, IGetAllProductTypesByEnterpriseIdRequest, IGetProductTypeByIdRequest, IGetProductTypesPagedRequest, ISoftDeleteProductTypeRequest, IUpdateProductTypeRequest } from "../types/product-type";
import api from "./api";

export const createProductTypesRange = async (data: ICreateProductTypesRangeRequest) => {
    const response = await api.post("/ProductType/create-product-types-range", { ...data });

    return response.data.data;
}

export const getProductTypesPaged = async (data: IGetProductTypesPagedRequest) => {
    const response = await api.post("/ProductType/get-product-types-paged", { ...data });

    return response.data.data;
}

export const getProductTypeById = async (data: IGetProductTypeByIdRequest) => {
    const response = await api.post("/ProductType/get-product-type-by-id", { ...data });

    return response.data.data;
}

export const updateProductType = async (data: IUpdateProductTypeRequest) => {
    const response = await api.post("/ProductType/update-product-type", { ...data });

    return response.data.data;
}

export const softDeleteProductType = async (data: ISoftDeleteProductTypeRequest) => {
    const response = await api.post("/ProductType/soft-delete-product-type", { ...data });

    return response.data.data;
}

export const getAllProductTypesByEnterpriseId = async (data: IGetAllProductTypesByEnterpriseIdRequest) => {
    const response = await api.post("/ProductType/get-all-product-types-by-enterprise-id", { ...data });

    return response.data.data;
}


export const checkProductTypesExist = async (data: ICheckProductTypesExistRequest) => {
    const response = await api.post("/ProductType/check-product-types-exist", { ...data });

    return response.data.data;
}