export interface StockEntryAttachment {
    id?: string | null;
    fileName: string;
    fileExtension: string;
    filePath?: string | null;
    fileSize: number 
    file: Uint8Array;
    isDeleted?: boolean | null;
}


export interface CreateStockEntryAttachment {
    id?: string | null;
    fileName: string;
    fileExtension: string;
    fileSize: number 
    file: Uint8Array;
    isDeleted?: boolean | null;
}

export interface IGetFileUrlStockEntryAttachmentRequest {
    id: string;
}
