import { ICreateProductRequest, IGetAllProductsBySearchTermRequest, IGetProductByIdRequest, IGetProductsPagedRequest, ISoftDeleteProductRequest, IUpdateProductRequest } from "../types/product";
import api from "./api";

export const createProduct = async (data: ICreateProductRequest) => {
    const response = await api.post("/api/Product/create-product", { ...data });

    return response.data.data;
}

export const getProductsPaged = async (data: IGetProductsPagedRequest) => {
    const response = await api.post("/api/Product/get-products-paged", { ...data });

    // O endpoint Next.js retorna { success: true, data: { count, items, page, pageSize } }
    return response.data.data;
}

export const getProductById = async (data: IGetProductByIdRequest) => {
    const response = await api.post("/api/Product/get-product-by-id", { ...data });

    return response.data.data;
}

export const updateProduct = async (data: IUpdateProductRequest) => {
    const response = await api.post("/api/Product/update-product", { ...data });

    return response.data.data;
}

export const softDeleteProduct = async (data: ISoftDeleteProductRequest) => {
    const response = await api.post("/api/Product/soft-delete-product", { ...data });

    return response.data.data;
}

export const getAllProductsBySearchTerm = async (data: IGetAllProductsBySearchTermRequest) => {
    const response = await api.post("/api/Product/get-all-product-by-search-term", { ...data });

    return response.data.data;
}