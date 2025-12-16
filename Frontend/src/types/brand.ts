import { PageQuery } from "../services/query";

export interface ICreateBrandsRangeRequest {
    brands: IBrandRequest[];
}

export interface IBrandRequest {
    name: string;
}

export interface IGetBrandsPagedRequest {
    query: PageQuery;
}

export interface IGetBrandByIdRequest {
    id: string;
}

export interface IUpdateBrandRequest {
    id: string;
    name: string;
}

export interface ISoftDeleteBrandRequest {
    id: string;
}

export interface IGetAllBrandsByEnterpriseIdRequest {
    enterpriseId: string;
}

export interface ICheckBrandsExistRequest {
    brands: string[];
}

export interface Brand {
    id: string; 
    enterpriseId: string;
    name: string;
}