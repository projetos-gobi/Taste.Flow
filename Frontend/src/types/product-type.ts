import { PageQuery } from "../services/query";

export interface ICreateProductTypesRangeRequest {
    productTypes: IProductTypeRequest[];
}

export interface IProductTypeRequest {
    name: string;
}

export interface IGetProductTypesPagedRequest {
    query: PageQuery;
}

export interface IGetProductTypeByIdRequest {
    id: string;
}

export interface IUpdateProductTypeRequest {
    id: string;
    name: string;
}

export interface ISoftDeleteProductTypeRequest {
    id: string;
}

export interface IGetAllProductTypesByEnterpriseIdRequest {
    enterpriseId: string;
}

export interface ICheckProductTypesExistRequest {
    productTypes: string[];
}

export interface ProductType {
  id: string; 
  enterpriseId: string;
  name: string;
}