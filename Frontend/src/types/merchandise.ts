import { PageQuery } from "../services/query";

export interface ICreateMerchandisesRangeRequest {
    merchandises: IMerchandiseRequest[];
}

export interface IMerchandiseRequest {
    itemId: string;
    brandId?: string | null;
    productTypeId?: string | null;
    categoryId: string;
    unitId: string;
}

export interface MerchandiseFilter {
  categoryId?: string | null;     
  unitId?: string | null;         
  productTypeId?: string | null;   
  searchQuery?: string | null;
}

export interface IGetMerchandisesPagedRequest {
    query: PageQuery;
    filter: MerchandiseFilter;
}

export interface IGetMerchandiseByIdRequest {
    id: string;
}

export interface IUpdateMerchandiseRequest {
    id: string;
    itemId: string
    brandId: string
    productTypeId: string
    categoryId: string
    unitId: string
}

export interface ISoftDeleteMerchandiseRequest {
    id: string;
}

export interface IGetAllMerchandisesByEnterpriseId {
    enterpriseId: string;
}

export interface Merchandise {
    id: string; 
    enterpriseId: string;
    itemId: string;
    unitId: string;
    categoryId: string;
    brandId?: string | null;
    productTypeId?: string | null;
    itemName: string;
    brandName: string;
    productTypeName: string;
    categoryName: string;
    unitName: string;
    name: string;
}