import { PageQuery } from "../services/query";

export interface ICreateUnitsRangeRequest {
    units: IUnitRequest[];
}

export interface IUnitRequest {
    name: string;
    value: number;
}

export interface IGetUnitsPagedRequest {
    query: PageQuery;
}

export interface IGetUnitByIdRequest {
    id: string;
}

export interface IUpdateUnitRequest {
    id: string;
    name: string;
    value: number;
}

export interface ISoftDeleteUnitRequest {
    id: string;
}

export interface IGetAllUnitsByEnterpriseIdRequest {
    enterpriseId: string;
}

export interface ICheckUnitsExistRequest {
    units: string[];
}

export interface Unit {
  id: string; 
  enterpriseId: string;
  name: string;
  value: number;
}
