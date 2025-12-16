import api from "./api";

export const getAllPaymentTerms = async () => {
    const response = await api.post("/PaymentTerm/get-all-payment-terms");

    return response.data.data;
}