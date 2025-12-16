import { PageQuery } from "../services/query";

export interface ICreateSubCategoriesRangeRequest {
    SubCategories: ISubCategoryRequest[];
}

export interface ISubCategoryRequest {
    name: string;
}

export interface IGetSubCategoriesPagedRequest {
    query: PageQuery;
}

export interface IGetSubCategoryByIdRequest {
    id: string;
}

export interface IUpdateSubCategoryRequest {
    id: string;
    name: string;
}

export interface ISoftDeleteSubCategoryRequest {
    id: string;
}

export interface SubCategory {
  id: string; 
  enterpriseId: string;
  name: string;
}

export interface IGetAllSubCategoriesByEnterpriseIdRequest {
    enterpriseId: string;
}

export interface ICheckSubCategoriesExistRequest {
    subCategories: string[];
}