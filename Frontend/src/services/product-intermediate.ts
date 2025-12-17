import { ICreateProductIntermediateRequest, IGetAllProductIntermediatesByEnterpriseIdRequest, IGetProductIntermediateByIdRequest, IGetProductIntermediatesPagedRequest, ISoftDeleteProductIntermediateRequest, IUpdateProductIntermediateRequest } from "../types/product-intermediate";
import api from "./api";

export const createProductIntermediate = async (data: ICreateProductIntermediateRequest) => {
    const response = await api.post("/api/ProductIntermediate/create-product-intermediate", { ...data });

    return response.data.data;
}

export const getProductIntermediatesPaged = async (data: IGetProductIntermediatesPagedRequest) => {
    const response = await api.post("/api/ProductIntermediate/get-product-intermediates-paged", { ...data });

    return response.data.data;
}

export const getProductIntermediateById = async (data: IGetProductIntermediateByIdRequest) => {
    const response = await api.post("/api/ProductIntermediate/get-product-intermediate-by-id", { ...data });

    return response.data.data;
}

export const updateProductIntermediate = async (data: IUpdateProductIntermediateRequest) => {
    const response = await api.post("/api/ProductIntermediate/update-product-intermediate", { ...data });

    return response.data.data;
}

export const softDeleteProductIntermediate = async (data: ISoftDeleteProductIntermediateRequest) => {
    const response = await api.post("/api/ProductIntermediate/soft-delete-product-intermediate", { ...data });

    return response.data.data;
}

export const getAllProductIntermediatesByEnterpriseId = async (data: IGetAllProductIntermediatesByEnterpriseIdRequest) => {
    const response = await api.post("/api/ProductIntermediate/get-all-product-intermediates-by-enterprise-id", { ...data });

    return response.data.data;
}