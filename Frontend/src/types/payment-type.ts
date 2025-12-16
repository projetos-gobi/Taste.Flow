export interface IGetAllPaymentTypesByEnterpriseIdRequest {
    enterpriseId: string;
}

export interface PaymentType {
  id: string; 
  enterpriseId: string;
  name: string;
}