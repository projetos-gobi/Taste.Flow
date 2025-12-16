"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { SupplierFilter } from "../types/supplier"
import { useSupplierFilterModal } from "../hooks/useModal"
import { toast } from "sonner"
import useSession from "../hooks/useSession"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllPaymentTypesByEnterpriseId } from "../services/payment-type"
import { Category } from "../types/category"
import { PaymentType } from "../types/payment-type"
import { AutocompleteField } from "./auto-complete-field"

interface SupplierFilterModalProps {
  isOpen: boolean
  onApplyFilters: (filters: SupplierFilter) => void
}

export function SupplierFilterModal({ isOpen, onApplyFilters }: SupplierFilterModalProps) {
  const session = useSession();
  const supplierFilterModal = useSupplierFilterModal();
  
  const initialFilter: SupplierFilter = {
    categoryId: null,
    paymentTypeId: null,
    searchQuery: null,
  };

  const [filter, setFilter] = useState<SupplierFilter>(initialFilter);
  const [categories, setCategories] = useState<Category[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  
  const fetchInitialData = async (page: number = 1) => {
    try {
      const [categories, paymentTypes] = await Promise.all([
        getAllCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllPaymentTypesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
      ]);

      setCategories(categories);
      setPaymentTypes(paymentTypes);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };

  useEffect(() => {
    if(supplierFilterModal.isOpen){
      fetchInitialData();
    }
  }, [supplierFilterModal.isOpen]);

  const handleChange = (field: keyof SupplierFilter, value: string | boolean | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }))
  }
  
  const handleApply = () => {
    onApplyFilters({
      searchQuery: filter.searchQuery,
      categoryId: filter.categoryId,
      paymentTypeId: filter.paymentTypeId,
    });

    handleClose();  
  }

  const handleClear = () => {
    setFilter(initialFilter);           
    onApplyFilters(initialFilter);
    handleClose();  
  };

  const handleClose = () => {
    supplierFilterModal.openModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Filtros e Visualização</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Configure os filtros para refinar a busca de fornecedores.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search" className="font-nunito font-medium text-gray-900">
              Barra de Pesquisa
            </Label>
            <Input
              id="search"
              type="text"
              value={filter.searchQuery ?? ""}
              onChange={(e) => handleChange("searchQuery", e.target.value)}
              placeholder="Pesquisar por Fornecedor ou CNPJ..."
              className="bg-white border-gray-300 font-nunito font-light"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Categoria de Venda</Label>
              <AutocompleteField
                value={filter.categoryId ?? ""}
                onValueChange={(val) => handleChange("categoryId", val)}
                options={categories.map((cat) => ({ id: cat.id.toString(), name: cat.name }))}
                placeholder="Selecione uma categoria"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white font-nunito font-light text-gray-900 h-10"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Pagamentos</Label>
              <AutocompleteField
                value={filter.paymentTypeId ?? ""}
                onValueChange={(val) => handleChange("paymentTypeId", val)}
                options={paymentTypes.map((pt) => ({ id: pt.id.toString(), name: pt.name }))}
                placeholder="Selecione forma de pagamento"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white font-nunito font-light text-gray-900 h-10"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="bg-white text-gray-600 border-gray-300 hover:bg-gray-50 font-nunito font-medium"
          >
            Limpar Filtros
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => supplierFilterModal.openModal(false)}
              className="bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
