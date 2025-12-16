import { PageQuery } from "../services/query";

export interface ICreateCategoriesRangeRequest {
    categories: ICategoryRequest[];
}

export interface ICategoryRequest {
    categoryTypeId: string;
    name: string;
}

export interface IGetCategoriesPagedRequest {
    query: PageQuery;
}

export interface IGetCategoryByIdRequest {
    id: string;
}

export interface IUpdateCategoryRequest {
    id: string;
    categoryTypeId: string;
    name: string;
}

export interface ISoftDeleteCategoryRequest {
    id: string;
}

export interface IGetAllCategoriesByEnterpriseIdRequest {
    enterpriseId: string;
}

export interface ICheckCategoriesExistRequest {
    categories: string[];
}

export interface Category {
  id: string; 
  enterpriseId: string;
  name: string;
}
