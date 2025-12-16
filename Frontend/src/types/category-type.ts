import { PageQuery } from "../services/query";

export interface ICreateCategoryTypesRangeRequest {
    categoryTypes: ICategoryTypeRequest[];
}

export interface ICategoryTypeRequest {
    name: string;
}

export interface IGetCategoryTypesPagedRequest {
    query: PageQuery;
}

export interface IGetCategoryTypeByIdRequest {
    id: string;
}

export interface IUpdateCategoryTypeRequest {
    id: string;
    name: string;
}

export interface ISoftDeleteCategoryTypeRequest {
    id: string;
}

export interface IGetAllCategoryTypesByEnterpriseIdRequest {
    enterpriseId: string;
}

export interface ICheckCategoryTypesExistRequest {
    categoryTypes: string[];
}