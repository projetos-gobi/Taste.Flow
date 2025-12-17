import { ICreateStockEntryRequest, IGetStockEntriesPagedRequest, IGetStockEntryByIdRequest, ISoftDeleteStockEntryRequest, IUpdateStockEntryRequest } from "../types/stock-entry";
import api from "./api";

export const createStockEntry = async (data: ICreateStockEntryRequest) => {
    const response = await api.post("/api/StockEntry/create-stock-entry", { ...data });

    return response.data.data;
}

export const getStockEntriesPaged = async (data: IGetStockEntriesPagedRequest) => {
    const response = await api.post("/api/StockEntry/get-stock-entries-paged", { ...data });

    return response.data.data;
}

export const getStockEntryById = async (data: IGetStockEntryByIdRequest) => {
    const response = await api.post("/api/StockEntry/get-stock-entry-by-id", { ...data });

    return response.data.data;
}

export const updateStockEntry = async (data: IUpdateStockEntryRequest) => {
    const response = await api.post("/api/StockEntry/update-stock-entry", { ...data });

    return response.data.data;
}

export const softDeleteStockEntry = async (data: ISoftDeleteStockEntryRequest) => {
    const response = await api.post("/api/StockEntry/soft-delete-stock-entry", { ...data });

    return response.data.data;
}

export const getStockValueByEnterpriseId = async () => {
    const response = await api.post("/api/StockEntry/get-stock-value-by-enterprise-id");

    return response.data.data;
}