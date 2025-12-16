"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Select } from "@/src/components/ui/select"
import { Trash2 } from "lucide-react"
import useSession from "../hooks/useSession"
import { useMerchandiseEditModal } from "../hooks/useModal"
import { getMerchandiseById, updateMerchandise } from "../services/merchandise"
import { toast } from "sonner"
import { Item } from "../types/item"
import { Category } from "../types/category"
import { Unit } from "../types/unit"
import { ProductType } from "../types/product-type"
import { Brand } from "../types/brand"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllBrandsByEnterpriseId } from "../services/brand"
import { getAllItemsByEnterpriseId } from "../services/item"
import { getAllProductTypesByEnterpriseId } from "../services/product-type"
import { getAllUnitsByEnterpriseId } from "../services/unit"
import { LoadingOverlay } from "./ui/loading-overlay"
import { AutocompleteField } from "./auto-complete-field"

interface Merchandise {
  id: string
  enterpriseId: string
  itemId: string
  brandId: string
  productTypeId: string
  categoryId: string
  unitId: string
}

interface EditMerchandiseModalProps {
  isOpen: boolean;
}

export function EditMerchandiseModal({ isOpen }: EditMerchandiseModalProps) {
  const session = useSession();
  const merchandiseEditModal = useMerchandiseEditModal();
  
  const initialMerchandise: Merchandise = {
    id: "",
    enterpriseId: "", 
    itemId: "", 
    brandId: "", 
    productTypeId: "",
    categoryId: "",
    unitId: ""
  };

  const [isLoading, setIsLoading] = useState(false);
  const [merchandise, setMerchandise] = useState<Merchandise>(initialMerchandise);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  const fetchMerchandise = async () => {
    try {
      setIsLoading(true);

      const [categoriesResponse, brandsResponse, itemsResponse, productTypesResponse, unitsResponse, merchandiseResponse] = await Promise.all([
        getAllCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllBrandsByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllItemsByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllProductTypesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllUnitsByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getMerchandiseById({ id: merchandiseEditModal.merchandiseId })
      ]);

      setCategories(categoriesResponse);
      setBrands(brandsResponse);
      setItems(itemsResponse);
      setProductTypes(productTypesResponse);
      setUnits(unitsResponse);
      setMerchandise(merchandiseResponse);
    } catch (error) {
      console.error("Erro ao buscar item:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchMerchandise();
    }
  }, [isOpen]);
  

  const handleChange = (field: keyof Merchandise, value: string | boolean | null) => {
    setMerchandise((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setMerchandise(initialMerchandise);
  };

  const handleClose = () => {
    resetForm();
    merchandiseEditModal.openModal(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    session.setRefresh(false);

    try {
      const response = await updateMerchandise(merchandise);

      if(response.updated){
        handleClose();
        toast.success("Mercadoria atualizada com sucesso!");
      }else{
        toast.error("Falha ao atualizar uma mercadoria. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao atualizar uma mercadoria:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { handleClose() } }}>
      <DialogContent className="sm:max-w-7xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Carregando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Editar Mercadoria</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            A edição acontece a partir dos dados Cadastrados.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Item
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Marca
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Tipo
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Categoria
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Unidade Técnica
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            <div className="grid grid-cols-12 border-b border-gray-200 last:border-b-0">
              <div className="col-span-2 border-r border-gray-300 p-0">
                <AutocompleteField
                  value={merchandise.itemId ?? ""}
                  onValueChange={(val) => handleChange("itemId", val)}
                  options={items.map(i => ({ id: i.id.toString(), name: i.name }))}
                  placeholder="Selecione uma opção"
                  emptyMessage="Nenhuma opção encontrada."
                  className="w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 hover:bg-transparent"
                />
              </div>

              <div className="col-span-2 border-r border-gray-300 p-0">
                <AutocompleteField
                  value={merchandise.brandId ?? ""}
                  onValueChange={(val) => handleChange("brandId", val)}
                  options={brands.map(b => ({ id: b.id.toString(), name: b.name }))}
                  placeholder="Selecione uma opção"
                  emptyMessage="Nenhuma opção encontrada."
                  className="w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 hover:bg-transparent"
                />
              </div>

              <div className="col-span-2 border-r border-gray-300 p-0">
                <AutocompleteField
                  value={merchandise.productTypeId ?? ""}
                  onValueChange={(val) => handleChange("productTypeId", val)}
                  options={productTypes.map(pt => ({ id: pt.id.toString(), name: pt.name }))}
                  placeholder="Selecione uma opção"
                  emptyMessage="Nenhuma opção encontrada."
                  className="w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 hover:bg-transparent"
                />
              </div>

              <div className="col-span-2 border-r border-gray-300 p-0">
                <AutocompleteField
                  value={merchandise.categoryId ?? ""}
                  onValueChange={(val) => handleChange("categoryId", val)}
                  options={categories.map(c => ({ id: c.id.toString(), name: c.name }))}
                  placeholder="Selecione uma opção"
                  emptyMessage="Nenhuma opção encontrada."
                  className="w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 hover:bg-transparent"
                />
              </div>

              <div className="col-span-2 border-r border-gray-300 p-0">
                <AutocompleteField
                  value={merchandise.unitId ?? ""}
                  onValueChange={(val) => handleChange("unitId", val)}
                  options={units.map(u => ({ id: u.id.toString(), name: u.name }))}
                  placeholder="Selecione uma opção"
                  emptyMessage="Nenhuma opção encontrada."
                  className="w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 hover:bg-transparent"
                />
              </div>


              <div className="col-span-2 flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  disabled
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
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
