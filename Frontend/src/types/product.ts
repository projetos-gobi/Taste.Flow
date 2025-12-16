import { PageQuery } from "../services/query";
import { ProductCompositionRequest } from "./product-composition";

export interface ICreateProductRequest {
    productCategoryTypeId: string;
    categoryId?: string | null;
    subCategoryId?: string | null;
    name: string;
    instruction:  string;
    price?: number | null;
    yield: number;
    multiplier: number;
    productCompositions: ProductCompositionRequest[];
}

export interface IGetProductsPagedRequest {
    query: PageQuery;
    filter: ProductFilter;
}

export interface ProductFilter {
    categoryId?: string | null;     
    subCategoryId?: string | null;
    isActive?: boolean | null;
    searchQuery?: string | null;
    minPrice?: string | null;
    maxPrice?: string | null;
    minMargin?: string | null;
    maxMargin?: string | null;
   // status?: string[];
    //hasAlternatives?: boolean | null;
}

export interface IGetProductByIdRequest {
    id: string;
}

export interface IUpdateProductRequest {
    id: string;
    categoryId: string;
    subCategoryId: string;
    name: string;
    instruction:  string;
    price: number;
    yield: number;
    multiplier: number;
    productCompositions: ProductCompositionRequest[];
}

export interface ISoftDeleteProductRequest {
    id: string;
}

export interface IGetAllProductsBySearchTermRequest {
    searchTerm: string;
}

export interface GetAllProductsBySearchTermResponse {
    id: string;
    name: string;
    categoryName: string;
    subCategoryName: string;
}