import { PageQuery } from "../services/query";
import { IProductIntermediateCompositionRequest, ProductIntermediateComposition } from "./product-intermediate-composition";

export interface ICreateProductIntermediateRequest {
    categoryId?: string | null;
    subCategoryId?: string | null;
    unitId?: string | null;
    name: string;
    price?: number | null;
    yield: number;
    preparationTime: string;
    instruction:  string;
    description:  string;
    productIntermediateCompositions: IProductIntermediateCompositionRequest[];
}

export interface IGetProductIntermediatesPagedRequest {
    query: PageQuery;
    filter: ProductIntermediateFilter;
}

export interface ProductIntermediateFilter {
    categoryId?: string | null;     
    subCategoryId?: string | null;
    isActive?: boolean | null;
    searchQuery?: string | null;
}

export interface IGetProductIntermediateByIdRequest {
    id: string;
}

export interface IUpdateProductIntermediateRequest {
    id: string;
    categoryId?: string | null;
    subCategoryId?: string | null;
    unitId?: string | null;
    name: string;
    price?: number | null;
    yield: number;
    preparationTime: string;
    instruction:  string;
    description:  string;
    productIntermediateCompositions: IProductIntermediateCompositionRequest[];
}

export interface ISoftDeleteProductIntermediateRequest {
    id: string;
}

export interface ProductIntermediate {
    id?: string | null;
    categoryId?: string | null;
    subCategoryId?: string | null;
    unitId?: string | null;
    name: string;
    price?: number | null;
    yield: number;
    preparationTime: string;
    instruction:  string;
    description:  string;
    productIntermediateCompositions: ProductIntermediateComposition[];
}

export interface IGetAllProductIntermediatesByEnterpriseIdRequest {
    enterpriseId: string;
}