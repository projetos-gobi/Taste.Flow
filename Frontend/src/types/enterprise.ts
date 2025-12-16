import { PageQuery } from "../services/query";

export interface ICreateEnterpriseRequest {
  licenceId?: string | null;
  fantasyName: string;
  socialReason: string;
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  observation: string;
  licenseQuantity: number;
  isActive: boolean;
  enterpriseAddresses: EnterpriseAddressRequest[];
  enterpriseContacts: EnterpriseContactRequest[];
}

export interface EnterpriseAddressRequest {
  postalCode: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
}

export interface EnterpriseContactRequest {
  telephone: string;
  emailAddress: string;
  responsible: string;
}

export interface EnterpriseFilter {
  licenseId?: string | null;     
  fantasyName?: string;
  cnpj?: string;
  city?: string;
  isActive?: boolean | null;
}

export interface IGetEnterprisesPagedRequest {
  query: PageQuery;
  filter: EnterpriseFilter;
}

export interface IGetEnterpriseByIdRequest {
  id: string;
}

export interface IUpdateEnterpriseRequest {
  id: string;
  licenceId?: string | null;
  fantasyName: string;
  socialReason: string;
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
  observation: string;
  licenseQuantity: number;
  isActive: boolean;
  enterpriseAddresses: EnterpriseAddressRequest[];
  enterpriseContacts: EnterpriseContactRequest[];
}

export interface ISoftDeleteEnterpriseRequest {
  id: string;
}

export interface IEnterpriseForUserRegistration {
  id: string;
  licenseId: string;
  fantasyName: string;
  socialReason: string;
  cnpj: string;
  licenseQuantity: number;
  hasUnlimitedLicenses: boolean;
}
