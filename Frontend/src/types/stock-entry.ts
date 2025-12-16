import { PageQuery } from "../services/query";
import { CreateStockEntryAttachment, StockEntryAttachment } from "./stock-entry-attachment";
import { StockEntryItem } from "./stock-entry-item";

export interface ICreateStockEntryRequest {
    supplierId: string; 
    paymentTypeId: string; 
    paymentTermId: string;
    purchaseDate?: string | null;
    expectedDeliveryDate?: string | null;
    receivedBy: string;
    invoiceNumber?: string | null;
    totalAmount: string;
    stockEntryItems: StockEntryItem[];
    stockEntryAttachments: CreateStockEntryAttachment[];
}

export interface IGetStockEntriesPagedRequest {
    query: PageQuery;
    filter: StockEntryFilter;
}

export interface IGetStockEntryByIdRequest {
    id: string;
}

export interface IUpdateStockEntryRequest {
    id: string;
    supplierId: string; 
    paymentTypeId: string; 
    paymentTermId: string;
    purchaseDate?: string | null;
    expectedDeliveryDate?: string | null;
    receivedBy: string;
    invoiceNumber?: string | null;
    totalAmount: string;
    stockEntryItems: StockEntryItem[];
    stockEntryAttachments: StockEntryAttachment[];
}

export interface ISoftDeleteStockEntryRequest {
    id: string;
}

export interface StockEntry {
    id: string;
    supplierId: string; 
    paymentTypeId: string; 
    paymentTermId: string;
    purchaseDate?: string | null;
    expectedDeliveryDate?: string | null;
    receivedBy: string;
    isDeliveryCompleted: boolean;
    invoiceNumber?: string | null;
    totalAmount: string;
    supplierName: string;
    paymentTypeName: string;
    stockEntryAttachmentCount: number;
    stockEntryItems: StockEntryItem[];
    stockEntryAttachments: StockEntryAttachment[];
}

export interface StockEntryFilter {
    purchaseDate?: string | null;
    expectedDeliveryDate?: string | null;
    totalAmount?: string | null;
    searchQuery?: string | null;
}

export interface GetStockValueByEnterpriseIdResponse {
    merchandiseId: string;
    merchandiseName: string;
    averageValue: number;
}
