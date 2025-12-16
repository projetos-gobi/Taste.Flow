export interface IProductIntermediateCompositionRequest {
    merchandiseId: string; 
    unitId: string;        
    quantity: number;
    yield: number;
}


export interface ProductIntermediateComposition {
    id: string;
    merchandiseId: string;
    unitId: string;
    quantity: number;
    unitCost: number;
    totalCost: number;
    yield: number;
}