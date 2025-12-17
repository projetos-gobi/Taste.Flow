import { ICheckItemsExistRequest, ICreateItemsRangeRequest, IGetAllItemsByEnterpriseIdRequest, IGetItemByIdRequest, IGetItemsPagedRequest, ISoftDeleteItemRequest, IUpdateItemRequest } from "../types/item";
import api from "./api";

export const createItemsRange = async (data: ICreateItemsRangeRequest) => {
    const response = await api.post("/api/Item/create-items-range", { ...data });

    return response.data.data;
}

export const getItemsPaged = async (data: IGetItemsPagedRequest) => {
    const response = await api.post("/api/Item/get-items-paged", { ...data });

    return response.data.data;
}

export const getItemById = async (data: IGetItemByIdRequest) => {
    const response = await api.post("/api/Item/get-item-by-id", { ...data });

    return response.data.data;
}

export const updateItem = async (data: IUpdateItemRequest) => {
    const response = await api.post("/api/Item/update-item", { ...data });

    return response.data.data;
}

export const softDeleteItem = async (data: ISoftDeleteItemRequest) => {
    const response = await api.post("/api/Item/soft-delete-item", { ...data });

    return response.data.data;
}

export const getAllItemsByEnterpriseId = async (data: IGetAllItemsByEnterpriseIdRequest) => {
    const response = await api.post("/api/Item/get-all-items-by-enterprise-id", { ...data });

    return response.data.data;
}

export const checkItemsExist = async (data: ICheckItemsExistRequest) => {
    const response = await api.post("/api/Item/check-items-exist", { ...data });

    return response.data.data;
}