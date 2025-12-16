import { PageQuery } from "../services/query";

export interface ICreateItemsRangeRequest {
    items: IItemRequest[];
}

export interface IItemRequest {
    name: string;
}

export interface IGetItemsPagedRequest {
    query: PageQuery;
}

export interface IGetItemByIdRequest {
    id: string;
}

export interface IUpdateItemRequest {
    id: string;
    name: string;
}

export interface ISoftDeleteItemRequest {
    id: string;
}

export interface IGetAllItemsByEnterpriseIdRequest {
    enterpriseId: string;
}

export interface ICheckItemsExistRequest {
    items: string[];
}

export interface Item {
    id: string; 
    enterpriseId: string;
    name: string;
}