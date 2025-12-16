"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { Checkbox } from "@/src/components/ui/checkbox"
import useSession from "../hooks/useSession"
import { useProductFilterModal } from "../hooks/useModal"
import { SubCategory } from "../types/sub-category"
import { Category } from "../types/category"
import { toast } from "sonner"
import { getAllSubCategoriesByEnterpriseId } from "../services/sub-category"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { ProductFilter } from "../types/product"
import { currency } from "../app/utils/utils"
import { AutocompleteField } from "./auto-complete-field"

interface ProductsFilterModalProps {
  isOpen: boolean;
  onApplyFilters: (filters: ProductFilter) => void;
}

export function ProductsFilterModal({ isOpen, onApplyFilters }: ProductsFilterModalProps) {
  const session = useSession();
  const productFilterModal = useProductFilterModal();
  
  const initialFilter: ProductFilter = {
    categoryId: null,
    subCategoryId: null,
    isActive: null,
    searchQuery: null,
    minPrice: null,
    maxPrice: null,
    minMargin: null,
    maxMargin: null
  };

  const [filter, setFilter] = useState<ProductFilter>(initialFilter);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  
  const fetchInitialData = async (page: number = 1) => {
    try {
      const [categories, subCategories] = await Promise.all([
        getAllCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllSubCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
      ]);

      setCategories(categories);
      setSubCategories(subCategories);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };

  useEffect(() => {
    if(productFilterModal.isModalOpen){
      fetchInitialData();
    }
  }, [productFilterModal.isModalOpen]);

  const statusOptions = ["Ativo", "Inativo", "Em Desenvolvimento"]

  const handleApplyFilters = () => {
    onApplyFilters({
      searchQuery: filter.searchQuery,
      categoryId: filter.categoryId,
      subCategoryId: filter.subCategoryId,
      isActive: filter.isActive,
      minPrice: filter.minPrice,
      maxPrice: filter.maxPrice,
      minMargin: filter.minMargin,
      maxMargin: filter.maxMargin
    });
    handleClose();
  };

  const handleClearFilters = () => {
    setFilter(initialFilter);
    onApplyFilters(initialFilter);
  };

  const handleChange = (field: keyof ProductFilter, value: string | boolean | null) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (status: string, checked: boolean) => {

  };

  const handleClose = () => {
    productFilterModal.openModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bebas text-xl">
            Filtros - {productFilterModal.filterType === "final" ? "Produtos Finais" : "Produtos Intermediários"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <Label htmlFor="search" className="font-nunito font-medium">
              Buscar por nome
            </Label>
            <Input
              id="search"
              value={filter.searchQuery ?? ""}
              onChange={(e) => handleChange("searchQuery", e.target.value)}
              placeholder="Digite o nome do produto..."
              className="font-nunito"
            />
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-nunito font-medium">Categoria</Label>
              <AutocompleteField
                value={filter.categoryId ?? ""}
                onValueChange={(val) => handleChange("categoryId", val)}
                options={categories.map((category) => ({ id: category.id.toString(), name: category.name }))}
                placeholder="Selecione..."
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white h-10"
              />
            </div>

            <div>
              <Label className="font-nunito font-medium">Sub-categoria</Label>
              <AutocompleteField
                value={filter.subCategoryId ?? ""}
                onValueChange={(val) => handleChange("subCategoryId", val)}
                options={subCategories.map((s) => ({ id: s.id.toString(), name: s.name }))}
                placeholder="Selecione uma opção"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white h-10"
              />
            </div>
          </div>

          {/* Price Range */}
          {productFilterModal.filterType === "final" && (
            <div>
              <Label className="font-nunito font-medium">Faixa de Preço</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={filter.minPrice ?? ""}
                  onChange={(e) => handleChange("minPrice", currency(e.target.value))}
                  placeholder="Preço mínimo"
                  className="font-nunito"
                />
                <Input
                  value={filter.maxPrice ?? ""}
                  onChange={(e) => handleChange("maxPrice", currency(e.target.value))}
                  placeholder="Preço máximo"
                  className="font-nunito"
                />
              </div>
            </div>
          )}

          {/* Margin Range */}
          {productFilterModal.filterType === "final"  && (
            <div>
              <Label className="font-nunito font-medium">Faixa de Margem (%)</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={filter.minMargin ?? ""}
                  onChange={(e) => handleChange("minMargin", e.target.value)}
                  placeholder="Margem mínima"
                  className="font-nunito"
                />
                <Input
                  value={filter.maxMargin ?? ""}
                  onChange={(e) => handleChange("maxMargin", e.target.value)}
                  placeholder="Margem máxima"
                  className="font-nunito"
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <Label className="font-nunito font-medium">Status</Label>
            <div className="space-y-2 mt-2">
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={status}
                    checked={false}
                    onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                  />
                  <Label htmlFor={status} className="font-nunito text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Has Alternatives */}
          {productFilterModal.filterType === "final" && (
            <div>
              <Label className="font-nunito font-medium">Fichas Alternativas</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAlternatives"
                    checked={false}
                    onCheckedChange={(checked) => {}}
                  />
                  <Label htmlFor="hasAlternatives" className="font-nunito text-sm">
                    Possui fichas alternativas
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noAlternatives"
                    checked={false}
                    onCheckedChange={(checked) => {}}
                  />
                  <Label htmlFor="noAlternatives" className="font-nunito text-sm">
                    Não possui fichas alternativas
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleClearFilters} className="font-nunito bg-transparent">
            Limpar Filtros
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleClose} className="font-nunito bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleApplyFilters} className="bg-[#322ca7] hover:bg-[#322ca7]/90 font-nunito">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
