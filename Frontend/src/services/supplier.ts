import { ICheckSupplierExistRequest, ICreateSupplierRequest, IGetAllSuppliersByEnterpriseIdRequest, IGetSupplierByIdRequest, IGetSuppliersPagedRequest, ISoftDeleteSupplierRequest, IUpdateSupplierRequest } from "../types/supplier";
import api from "./api";

export const createSupplier = async (data: ICreateSupplierRequest) => {
    const response = await api.post("/Supplier/create-supplier", { ...data });

    return response.data.data;
}

export const getSuppliersPaged = async (data: IGetSuppliersPagedRequest) => {
    const response = await api.post("/Supplier/get-suppliers-paged", { ...data });

    return response.data.data;
}

export const getSupplierById = async (data: IGetSupplierByIdRequest) => {
    const response = await api.post("/Supplier/get-supplier-by-id", { ...data });

    return response.data.data;
}

export const updateSupplier = async (data: IUpdateSupplierRequest) => {
    const response = await api.post("/Supplier/update-supplier", { ...data });

    return response.data.data;
}

export const softDeleteSupplier = async (data: ISoftDeleteSupplierRequest) => {
    const response = await api.post("/Supplier/soft-delete-supplier", { ...data });

    return response.data.data;
}

export const getAllSuppliersByEnterpriseId = async (data: IGetAllSuppliersByEnterpriseIdRequest) => {
    const response = await api.post("/Supplier/get-all-suppliers-by-enterprise-id", { ...data });

    return response.data.data;
}

export const checkSupplierExist = async (data: ICheckSupplierExistRequest) => {
    const response = await api.post("/Supplier/check-supplier-exist", { ...data });

    return response.data.data;
}