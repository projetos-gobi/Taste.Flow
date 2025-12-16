"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { Lock } from "lucide-react"
import useSession from "../hooks/useSession"
import { useSupplierEditModal } from "../hooks/useModal"
import { ITab } from "../types/common"
import { Category } from "../types/category"
import { SubCategory } from "../types/sub-category"
import { PaymentType } from "../types/payment-type"
import { toast } from "sonner"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllPaymentTypesByEnterpriseId } from "../services/payment-type"
import { getAllSubCategoriesByEnterpriseId } from "../services/sub-category"
import { maskField } from "../app/utils/utils"
import { MultiSelectField } from "./multi-select-field"
import { checkSupplierExist, getSupplierById, updateSupplier } from "../services/supplier"
import { Supplier } from "../types/supplier"
import { SupplierPaymentType } from "../types/supplier-payment-type"
import { SupplierPaymentDetail } from "../types/supplier-payment-detail"
import { LoadingOverlay } from "./ui/loading-overlay"
import { AutocompleteField } from "./auto-complete-field"

interface EditSupplierModalProps {
  isOpen: boolean;
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

export function EditSupplierModal({ isOpen }: EditSupplierModalProps) {
  const session = useSession();
  const supplierEditModal = useSupplierEditModal();

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
    categoryName: "",
    telephone: "",
    supplierPaymentTypes: [],
    supplierPaymentDetail: {
      id: "",
      agency: '',
      bankAccountNumber: '',
      pixKey: '',
    }
  };

  const [supplier, setSupplier] = useState<Supplier>(initialSupplier);
  const [existingSuppliers, setExistingSuppliers] = useState<Supplier[]>([]);

  const fetchInitialData = async (page: number = 1) => {
    try {
      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSupplier = async () => {
    try {
      const response = await getSupplierById({ id: supplierEditModal.supplierId });

      setSupplier(response);
    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error);
    }
  };

  useEffect(() => {
    if(supplierEditModal.isModalOpen){
      fetchInitialData();
    }
  }, [supplierEditModal.isModalOpen]);

  const handleChange = (field: keyof Supplier, value: string | boolean | string[] | null) => {
    setSupplier((prev) => ({ ...prev, [field]: value }))
  };

  const handlePaymentDetailChange = (field: keyof SupplierPaymentDetail, value: string) => {
    setSupplier((prev) => ({ ...prev, supplierPaymentDetail: { ...prev.supplierPaymentDetail, [field]: value, }, }));
  };

  const handleSupplierPaymentTypesChange = (ids: string[]) => {
    setSupplier((prev) => {
      const mapped: SupplierPaymentType[] = ids.map((id) => {
        const existing = prev.supplierPaymentTypes.find((s) => s.paymentTypeId === id);
        const paymentTypeName = paymentTypes.find((p) => p.id === id)?.name || "";

        return {
          id: existing?.id,
          paymentTypeId: id,
          paymentTypeName
        };
      });

      return {
        ...prev,
        supplierPaymentTypes: mapped
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    session.setRefresh(false);

    try {
      const checkResponse = await checkSupplierExist({ fantasyName: supplier.fantasyName, cnpj: supplier.cnpj });
            
      const existing = checkResponse.find((existing: any) => existing.id !== supplier.id);

      if (existing) {
        setExistingSuppliers([existing]);
        toast.warning("Fornecedor já existe com este Nome ou CNPJ. Corrija-o antes de enviar.");
        return;
      }

      const response = await updateSupplier(supplier);

      if(response.updated){
        toast.success("Fornecedor atualizado com sucesso!");
        handleClose();
      }else{
        toast.error("Falha ao atualizar o fornecedor. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao atualizar o fornecedor:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setExistingSuppliers([]);
    setSupplier(initialSupplier);
    supplierEditModal.openModal(false);
  };

  const isNameInvalid = existingSuppliers.some((ex) => ex.fantasyName.trim().toLowerCase() === supplier.fantasyName.trim().toLowerCase());

  const isCnpjInvalid = existingSuppliers.some((ex) => ex.cnpj.replace(/\D/g, "") === supplier.cnpj.replace(/\D/g, ""));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-6xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Carregando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Editar Fornecedor</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Edição da informação Base de Fornecedores.</p>
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
              <Label htmlFor="name" className="font-nunito font-medium text-gray-900">
                Nome do Fornecedor *
              </Label>
              <Input
                id="name"
                value={supplier.fantasyName}
                onChange={(e) => handleChange("fantasyName", e.target.value)}
                className={`bg-white font-nunito font-light ${isNameInvalid ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj" className="font-nunito font-medium text-gray-900">
                CNPJ *
              </Label>
              <Input
                id="cnpj"
                value={supplier.cnpj}
                onChange={(e) => handleChange("cnpj", maskField(e.target.value, "99.999.999/9999-99"))}
                maxLength={18}
                className={`bg-white font-nunito font-light ${isCnpjInvalid ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-nunito font-medium text-gray-900">
                Telefone *
              </Label>
              <Input
                id="phone"
                value={supplier.telephone}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  const mask = raw.length > 10 ? '(99) 99999-9999' : '(99) 9999-9999';
                  handleChange("telephone", maskField(e.target.value, mask));
                }}
                maxLength={20}
                className="bg-white border-gray-300 font-nunito font-light"
              />
            </div>

            <div className="space-y-2">
              <MultiSelectField
                label="Forma de Pagamento"
                options={paymentTypes.map((pt) => ({ id: pt.id, name: pt.name }))}
                selectedOptions={supplier.supplierPaymentTypes.map((spt) => spt.paymentTypeId)}
                onSelectionChange={handleSupplierPaymentTypesChange}
                placeholder="Selecione a(s) opção(ões)"
                required
              />
            </div>
          </div>

          {/* Dados Bancários - Condicional */}
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
                      onChange={(e) => handlePaymentDetailChange('agency', e.target.value)}
                      placeholder="0000"
                      className="bg-white border-gray-300 font-nunito font-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="font-nunito font-medium text-gray-900">
                      Nº da Conta *
                    </Label>
                    <Input
                      id="bankAccountNumber"
                      value={supplier.supplierPaymentDetail.bankAccountNumber}
                      onChange={(e) => handlePaymentDetailChange('bankAccountNumber', e.target.value)}
                      placeholder="00000-0"
                      className="bg-white border-gray-300 font-nunito font-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pixKey" className="font-nunito font-medium text-gray-900">
                      Chave PIX *
                    </Label>
                    <Input
                      id="pixKey"
                      value={supplier.supplierPaymentDetail.pixKey}
                      onChange={(e) => handlePaymentDetailChange('pixKey', e.target.value)}
                      placeholder="Digite a chave PIX"
                      className="bg-white border-gray-300 font-nunito font-light"
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
                onValueChange={(val) => handleChange("categoryId", val)}
                options={categories.map(c => ({ id: c.id.toString(), name: c.name }))}
                placeholder="Selecione uma opção"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Sub-Categoria</Label>
              <AutocompleteField
                value={supplier.subCategoryId ?? ""}
                onValueChange={(val) => handleChange("subCategoryId", val)}
                options={subCategories.map((s) => ({ id: s.id.toString(), name: s.name }))}
                placeholder="Selecione uma opção"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white h-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
          >
            {isLoading ? "Salvando alterações..." : "Confirmar Edição"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
