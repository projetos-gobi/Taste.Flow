import { IGetFileUrlStockEntryAttachmentRequest } from "../types/stock-entry-attachment";
import api from "./api";

export const getFileUrlStockEntryAttachment = async (data: IGetFileUrlStockEntryAttachmentRequest) => {
    const response = await api.post("/api/StockEntryAttachment/get-file-url-stock-entry-attachment", { ...data });

    return response.data.data;
}
