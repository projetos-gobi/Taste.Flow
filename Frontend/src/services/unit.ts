import { ICheckUnitsExistRequest, ICreateUnitsRangeRequest, IGetAllUnitsByEnterpriseIdRequest, IGetUnitByIdRequest, IGetUnitsPagedRequest, ISoftDeleteUnitRequest, IUpdateUnitRequest } from "../types/unit";
import api from "./api";

export const createUnitRange = async (data: ICreateUnitsRangeRequest) => {
    const response = await api.post("/api/Unit/create-units-range", { ...data });

    return response.data.data;
}

export const getUnitsPaged = async (data: IGetUnitsPagedRequest) => {
    const response = await api.post("/api/Unit/get-units-paged", { ...data });

    return response.data.data;
}

export const getUnitById = async (data: IGetUnitByIdRequest) => {
    const response = await api.post("/api/Unit/get-unit-by-id", { ...data });

    return response.data.data;
}

export const updateUnit = async (data: IUpdateUnitRequest) => {
    const response = await api.post("/api/Unit/update-unit", { ...data });

    return response.data.data;
}

export const softDeleteUnit= async (data: ISoftDeleteUnitRequest) => {
    const response = await api.post("/api/Unit/soft-delete-unit", { ...data });

    return response.data.data;
}

export const getAllUnitsByEnterpriseId = async (data: IGetAllUnitsByEnterpriseIdRequest) => {
    const response = await api.post("/api/Unit/get-all-units-by-enterprise-id", { ...data });

    return response.data.data;
}

export const checkUnitsExist = async (data: ICheckUnitsExistRequest) => {
    const response = await api.post("/api/Unit/check-units-exist", { ...data });

    return response.data.data;
}