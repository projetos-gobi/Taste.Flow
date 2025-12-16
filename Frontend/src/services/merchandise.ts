import { ICreateMerchandisesRangeRequest, IGetAllMerchandisesByEnterpriseId, IGetMerchandiseByIdRequest, IGetMerchandisesPagedRequest, ISoftDeleteMerchandiseRequest, IUpdateMerchandiseRequest } from "../types/merchandise";
import api from "./api";

export const createMerchandisesRange = async (data: ICreateMerchandisesRangeRequest) => {
    const response = await api.post("/Merchandise/create-merchandises-range", { ...data });

    return response.data.data;
}

export const getMerchandisesPaged = async (data: IGetMerchandisesPagedRequest) => {
    const response = await api.post("/Merchandise/get-merchandises-paged", { ...data });

    return response.data.data;
}

export const getMerchandiseById = async (data: IGetMerchandiseByIdRequest) => {
    const response = await api.post("/Merchandise/get-merchandise-by-id", { ...data });

    return response.data.data;
}

export const updateMerchandise = async (data: IUpdateMerchandiseRequest) => {
    const response = await api.post("/Merchandise/update-merchandise", { ...data });

    return response.data.data;
}

export const softDeleteMerchandise = async (data: ISoftDeleteMerchandiseRequest) => {
    const response = await api.post("/Merchandise/soft-delete-merchandise", { ...data });

    return response.data.data;
}

export const getAllMerchandisesByEnterpriseId = async (data: IGetAllMerchandisesByEnterpriseId) => {
    const response = await api.post("/Merchandise/get-all-merchandises-by-enterprise-id", { ...data });

    return response.data.data;
}