import { PageQuery } from "../services/query";

export interface UserRequest {
  accessProfileId: string;       
  enterpriseId?: string | null;  
  name: string;
  emailAddress: string;
  contact: string;
}

export interface ICreateUsersRangeRequest {
  users: UserRequest[];
  enterpriseId?: string | null;  
}

export interface UserFilter {
  accessProfileId?: string | null;
  name?: string;
  fantasyName?: string;
  emailAddress?: string;
  isActive?: boolean | null;
}

export interface IGetUsersPagedRequest {
  query: PageQuery;
  filter: UserFilter;
}

export interface IGetUserByIdRequest {
  id: string;
}

export interface IUpdateUserRequest {
  id: string;
  accessProfileId: string;
  name: string;
  emailAddress: string; 
  contact: string;
  isActive: boolean;
}

export interface ISoftDeleteUserRequest {
  id: string;
}