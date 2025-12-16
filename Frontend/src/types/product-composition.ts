export interface ProductCompositionRequest {
    merchandiseId?: string | null;
    productIntermediateId?: string | null;
    unitId: string;
    quantity: number;
    yield: number;
}
