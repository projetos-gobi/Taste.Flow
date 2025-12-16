"use client"

import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { Lock } from "lucide-react"
import { ITab } from "../types/common"
import { useSupplierDetailModal } from "../hooks/useModal"
import { useEffect, useState } from "react"
import { Category } from "../types/category"
import { SubCategory } from "../types/sub-category"
import { PaymentType } from "../types/payment-type"
import { Supplier } from "../types/supplier"
import { MultiSelectField } from "./multi-select-field"
import { toast } from "sonner"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllPaymentTypesByEnterpriseId } from "../services/payment-type"
import { getAllSubCategoriesByEnterpriseId } from "../services/sub-category"
import useSession from "../hooks/useSession"
import { getSupplierById } from "../services/supplier"
import { AutocompleteField } from "./auto-complete-field"

interface SupplierDetailsModalProps {
  isOpen: boolean
}

const initialTabs: ITab[] = [
  { id: "info", label: "Info Geral", active: true, locked: false },
  { id: "contact", label: "Contato", active: false, locked: true },
  { id: "address", label: "Endereço", active: false, locked: true },
  { id: "payments", label: "Pagamentos", active: false, locked: true },
  { id: "commercial", label: "Condições Comerciais", active: false, locked: true },
  { id: "documents", label: "Documentos", active: false, locked: true },
  { id: "history", label: "Histórico de Compras", active: false, locked: true },
];

export function SupplierDetailsModal({ isOpen }: SupplierDetailsModalProps) {
  const session = useSession();
  const supplierDetailModal = useSupplierDetailModal();

  const [isLoading, setIsLoading] = useState(false);
  const [tabs, setTabs] = useState<ITab[]>(initialTabs);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  
  const initialSupplier: Supplier = {
    id: "",
    categoryId: "",
    subCategoryId: "",
    fantasyName: "",
    cnpj: "",
    telephone: "",
    categoryName: "",
    supplierPaymentTypes: [],
    supplierPaymentDetail: {
      id: "",
      agency: '',
      bankAccountNumber: '',
      pixKey: '',
    }
  };
  
  const [supplier, setSupplier] = useState<Supplier>(initialSupplier);

  const fetchInitialData = async (page: number = 1) => {
    try {
      const [categories, paymentTypes, subCategories] = await Promise.all([
        getAllCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllPaymentTypesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllSubCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" })
      ]);

      await fetchSupplier();

      setCategories(categories);
      setPaymentTypes(paymentTypes);
      setSubCategories(subCategories);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };

  const fetchSupplier = async () => {
    try {
      const response = await getSupplierById({ id: supplierDetailModal.supplierId });

      setSupplier(response);
    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error);
    }
  };

  useEffect(() => {
    if(supplierDetailModal.supplierId){
      fetchInitialData();
    }
  }, [supplierDetailModal.supplierId]);

  const handleClose = () => {
    supplierDetailModal.openModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-6xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Detalhes do Fornecedor</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Sessão designada para ver os detalhes do fornecedor cadastrado.
          </p>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-nunito font-medium text-sm ${
                  tab.active ? "border-[#322CA7] text-[#322CA7]" : "border-transparent text-gray-500 cursor-not-allowed"
                }`}
                disabled={tab.locked}
              >
                {tab.locked && <Lock className="h-4 w-4" />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Nome do Fornecedor *</Label>
              <Input
                value={supplier.fantasyName}
                disabled
                className="bg-gray-50 border-gray-300 font-nunito font-light text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">CNPJ *</Label>
              <Input
                value={supplier.cnpj}
                disabled
                className="bg-gray-50 border-gray-300 font-nunito font-light text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Telefone *</Label>
              <Input
                value={supplier.telephone}
                disabled
                className="bg-gray-50 border-gray-300 font-nunito font-light text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <MultiSelectField
                label="Forma de Pagamento"
                options={paymentTypes.map((pt) => ({ id: pt.id, name: pt.name }))}
                selectedOptions={supplier.supplierPaymentTypes.map((spt) => spt.paymentTypeId)}
                onSelectionChange={() => {}}
                placeholder="Selecione a(s) opção(ões)"
                disabled={true}
                required
              />
            </div>
          </div>

          {(supplier.supplierPaymentTypes.map(p => p.paymentTypeId.toUpperCase()).includes("FDE325CE-E7E2-4940-B28E-D53B524772A8")|| 
            supplier.supplierPaymentTypes.map(p => p.paymentTypeId.toUpperCase()).includes("9F36D458-6F19-4AE0-BEE0-D637B77CDDE5")) && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-nunito font-medium text-gray-900">Dados para Pagamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="agency" className="font-nunito font-medium text-gray-900">
                      Agência *
                    </Label>
                    <Input
                      id="agency"
                      value={supplier.supplierPaymentDetail.agency}
                      className="bg-white border-gray-300 font-nunito font-light"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="font-nunito font-medium text-gray-900">
                      Nº da Conta *
                    </Label>
                    <Input
                      id="bankAccountNumber"
                      value={supplier.supplierPaymentDetail.bankAccountNumber}
                      className="bg-white border-gray-300 font-nunito font-light"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pixKey" className="font-nunito font-medium text-gray-900">
                      Chave PIX *
                    </Label>
                    <Input
                      id="pixKey"
                      value={supplier.supplierPaymentDetail.pixKey}
                      className="bg-white border-gray-300 font-nunito font-light"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Categoria de Venda *</Label>
              <AutocompleteField
                value={supplier.categoryId ?? ""}
                onValueChange={() => {}}
                options={categories.map((c) => ({ id: c.id.toString(), name: c.name }))}
                placeholder="Selecione uma opção"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-gray-50 font-nunito font-light text-gray-700 h-10"
                disabled={true}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Sub-Categoria</Label>
              <AutocompleteField
                value={supplier.subCategoryId ?? ""}
                onValueChange={() => {}}
                options={subCategories.map((s) => ({ id: s.id.toString(), name: s.name }))}
                placeholder="Selecione uma opção"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-gray-50 font-nunito font-light text-gray-700 h-10"
                disabled={true}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            type="button"
            onClick={handleClose}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
