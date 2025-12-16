"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { Search } from "lucide-react"
import { MerchandiseFilter } from "../types/merchandise"
import { useMerchandiseFilterModal } from "../hooks/useModal"
import { Category } from "../types/category"
import { Unit } from "../types/unit"
import { ProductType } from "../types/product-type"
import { toast } from "sonner"
import useSession from "../hooks/useSession"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllUnitsByEnterpriseId } from "../services/unit"
import { getAllProductTypesByEnterpriseId } from "../services/product-type"
import { AutocompleteField } from "./auto-complete-field"

interface MerchandiseFilterModalProps {
    isOpen: boolean;
    onApplyFilters: (filters: MerchandiseFilter) => void;
};

export function MerchandiseFilterModal({ isOpen, onApplyFilters }: MerchandiseFilterModalProps) {
  const session = useSession();
  const merchandiseFilterModal = useMerchandiseFilterModal();
  
  const initialFilter: MerchandiseFilter = {
    categoryId: null,
    productTypeId: null,
    unitId: null,
    searchQuery: null
  };
  
  const [filter, setFilter] = useState<MerchandiseFilter>(initialFilter);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const fetchInitialData = async (page: number = 1) => {
    try {
      const [categoriesResponse, unitsResponse, productTypesResponse] = await Promise.all([
        getAllCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllUnitsByEnterpriseId({ enterpriseId: session.enterpriseId ?? ""}),
        getAllProductTypesByEnterpriseId({ enterpriseId: session.enterpriseId ?? ""})
      ]);

      setCategories(categoriesResponse);
      setUnits(unitsResponse);
      setProductTypes(productTypesResponse);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };
  
  useEffect(() => {
    if(merchandiseFilterModal.isOpen){
      fetchInitialData();
    }
  }, [merchandiseFilterModal.isOpen]);

  const handleChange = (field: keyof MerchandiseFilter, value: string | boolean | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }))
  };

  const handleApply = () => {
    onApplyFilters({
      categoryId: filter.categoryId,
      productTypeId: filter.productTypeId,
      unitId: filter.unitId,
      searchQuery: filter.searchQuery
    });

    handleClose();  
  };

  const handleClear = () => {
    setFilter(initialFilter);           
    onApplyFilters(initialFilter);
    handleClose();  
  };

  const handleClose = () => {
    merchandiseFilterModal.openModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Filtros Mercadorias</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Utilize os filtros abaixo para personalizar e facilitar sua busca.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="font-nunito font-medium text-gray-900">Barra de Pesquisa</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={filter.searchQuery ?? ""}
                onChange={(e) => handleChange("searchQuery", e.target.value)}
                placeholder="Digite o Nome da Mercadoria, Item ou Marca"
                className="w-full h-12 border border-gray-300 rounded-md bg-white font-nunito font-light text-gray-900 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Categoria</Label>
              <AutocompleteField
                options={categories.map(c => ({ id: c.id.toString(), name: c.name }))}
                value={filter.categoryId ?? ""}
                onValueChange={(val) => handleChange("categoryId", val)}
                placeholder="Selecione a opção"
                emptyMessage="Nenhuma opção encontrada."
                className="w-full h-12 border border-gray-300 rounded-md bg-white font-nunito font-light text-gray-900 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Unidade Técnica</Label>
              <AutocompleteField
                options={units.map(u => ({ id: u.id.toString(), name: u.name }))}
                value={filter.unitId ?? ""}
                onValueChange={(val) => handleChange("unitId", val)}
                placeholder="Selecione a opção"
                emptyMessage="Nenhuma opção encontrada."
                className="w-full h-12 border border-gray-300 rounded-md bg-white font-nunito font-light text-gray-900 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Tipo</Label>
              <AutocompleteField
                options={productTypes.map(pt => ({ id: pt.id.toString(), name: pt.name }))}
                value={filter.productTypeId ?? ""}
                onValueChange={(val) => handleChange("productTypeId", val)}
                placeholder="Selecione a opção"
                emptyMessage="Nenhuma opção encontrada."
                className="w-full h-12 border border-gray-300 rounded-md bg-white font-nunito font-light text-gray-900 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
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
              onClick={handleClose}
              className="bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
