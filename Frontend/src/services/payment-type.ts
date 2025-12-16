import { IGetAllPaymentTypesByEnterpriseIdRequest } from "../types/payment-type";
import api from "./api";

export const getAllPaymentTypesByEnterpriseId = async (data: IGetAllPaymentTypesByEnterpriseIdRequest) => {
    const response = await api.post("/PaymentType/get-all-payment-types-by-enterprise-id", { ...data });

    return response.data.data;
}