import { PageQuery } from "../services/query";
import { SupplierPaymentDetail } from "./supplier-payment-detail";
import { SupplierPaymentType } from "./supplier-payment-type";

export interface ICreateSupplierRequest {
    categoryId: string;
    subCategoryId: string;
    fantasyName: string;
    cnpj: string;
    telephone: string;
    supplierPaymentDetail?: SupplierPaymentDetailRequest | null;
    supplierPaymentTypes: SupplierPaymentTypeRequest[];
}

export interface SupplierPaymentDetailRequest {
    agency: string;
    bankAccountNumber: string;
    pixKey: string;
}

export interface SupplierPaymentTypeRequest {
  paymentTypeId: string;
}

export interface SupplierFilter {
    categoryId?: string | null;
    paymentTypeId?: string | null;
    searchQuery?: string | null;
};

export interface IGetSuppliersPagedRequest {
    query: PageQuery;
    filter: SupplierFilter;
}

export interface IGetSupplierByIdRequest {
    id: string;
}

export interface IUpdateSupplierRequest {
    id: string;
    categoryId: string;
    subCategoryId: string;
    fantasyName: string;
    cnpj: string;
    telephone: string;
}

export interface ISoftDeleteSupplierRequest {
    id: string;
}

export interface Supplier {
  id: string;
  categoryId: string;
  subCategoryId: string;
  fantasyName: string;
  cnpj: string;
  telephone: string;
  categoryName: string;
  supplierPaymentTypes: SupplierPaymentType[];
  supplierPaymentDetail: SupplierPaymentDetail;
}

export interface IGetAllSuppliersByEnterpriseIdRequest {
    enterpriseId: string;
}

export interface ICheckSupplierExistRequest {
    fantasyName: string;
    cnpj: string;
}