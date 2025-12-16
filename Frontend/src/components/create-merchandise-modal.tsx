"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Select } from "@/src/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import useSession from "../hooks/useSession"
import { useMerchandiseCreateModal } from "../hooks/useModal"
import { toast } from "sonner"
import { createMerchandisesRange } from "../services/merchandise"
import { Category } from "../types/category"
import { Unit } from "../types/unit"
import { ProductType } from "../types/product-type"
import { Item } from "../types/item"
import { Brand } from "../types/brand"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllBrandsByEnterpriseId } from "../services/brand"
import { getAllItemsByEnterpriseId } from "../services/item"
import { getAllProductTypesByEnterpriseId } from "../services/product-type"
import { getAllUnitsByEnterpriseId } from "../services/unit"
import { LoadingOverlay } from "./ui/loading-overlay"
import { AutocompleteField } from "./auto-complete-field"

interface Merchandise {
  id: string;
  itemId: string;
  brandId?: string | null;
  productTypeId?: string | null;
  categoryId: string;
  unitId: string;
}

interface CreateMerchandiseModalProps {
  isOpen: boolean;
};

export function CreateMerchandiseModal({ isOpen }: CreateMerchandiseModalProps) {
  const session = useSession();
  const merchandiseCreateModal = useMerchandiseCreateModal();

  const [isLoading, setIsLoading] = useState(false);

  const initialMerchandise: Merchandise = { 
    id: crypto.randomUUID(), 
    itemId: "",
    brandId: null,
    productTypeId: null,
    categoryId: "",
    unitId: ""
  }; 

  const [merchandises, setMerchandises] = useState<Merchandise[]>([initialMerchandise]);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const fetchInitialData = async (page: number = 1) => {
    try {
      const [categoriesResponse, brandsResponse, itemsResponse, productTypesResponse, unitsResponse] = await Promise.all([
        getAllCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllBrandsByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllItemsByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllProductTypesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllUnitsByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" })
      ]);

      setCategories(categoriesResponse);
      setBrands(brandsResponse);
      setItems(itemsResponse);
      setProductTypes(productTypesResponse);
      setUnits(unitsResponse);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };
  
  useEffect(() => {
    if(merchandiseCreateModal.isOpen){
      fetchInitialData();
    }
  }, [merchandiseCreateModal.isOpen]);

  const handleAddMerchandise = () => {
    const newItem: Merchandise = {
      id: crypto.randomUUID(),
      itemId: "",
      brandId: null,
      productTypeId: null,
      categoryId: "",
      unitId: ""
    };
    setMerchandises([...merchandises, newItem]);
  };

  const handleDeleteMerchandise = (id: string) => {
    if (merchandises.length > 1) {
      setMerchandises(merchandises.filter((merchandise) => merchandise.id !== id));
    }
  };

  const handleMerchandiseChange = (id: string, field: keyof Merchandise, value: string | null) => {
    setMerchandises(merchandises.map((merchandise) => (merchandise.id === id ? { ...merchandise, [field]: value } : merchandise)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    session.setRefresh(false);

    const newErrors: Record<string, boolean> = {};

    merchandises.forEach((m) => {
      if (!m.itemId || !m.categoryId || !m.unitId) {
        newErrors[m.id] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Preencha os campos obrigatórios (Item, Categoria e Unidade).");
      setIsLoading(false);
      session.setRefresh(true);
      return;
    }

    setErrors({}); 

    try {
      const response = await createMerchandisesRange({ merchandises: merchandises });

      if(response.created){
        toast.success("Mercadorias criadas com sucesso!");
        handleClose();
      }else{
        toast.error("Falha ao criar as mercadorias. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao salvar mercadorias:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setMerchandises([initialMerchandise]);
    merchandiseCreateModal.openModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { handleClose() } }}>
      <DialogContent className="sm:max-w-7xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Salvando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Cadastro de Mercadorias</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            O cadastro acontece a partir dos dados nos Cadastro de Base.
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

            {merchandises.map((merchandise, index) => (
              <div key={merchandise.id} className="grid grid-cols-12 border-b border-gray-200 last:border-b-0">
                <div className="col-span-2 border-r border-gray-300 p-0">
                  <AutocompleteField
                    value={merchandise.itemId}
                    onValueChange={(val) => handleMerchandiseChange(merchandise.id, "itemId", val)}
                    options={items.map(i => ({ id: i.id, name: i.name }))}
                    placeholder="Selecione uma opção"
                    emptyMessage="Nenhuma opção encontrada."
                    className={`w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 hover:bg-transparent ${errors[merchandise.id] && !merchandise.itemId ? "border border-red-500" : ""}`}
                  />
                </div>

                <div className="col-span-2 border-r border-gray-300 p-0">
                  <AutocompleteField
                    value={merchandise.brandId ?? ""}
                    onValueChange={(val) => handleMerchandiseChange(merchandise.id, "brandId", val)}
                    options={brands.map(b => ({ id: b.id.toString(), name: b.name }))}
                    placeholder="Selecione uma opção"
                    emptyMessage="Nenhuma opção encontrada."
                    className={'w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus-border-0 hover:bg-transparent'}
                  />
                </div>

                <div className="col-span-2 border-r border-gray-300 p-0">
                  <AutocompleteField
                    value={merchandise.productTypeId ?? ""}
                    onValueChange={(val) => handleMerchandiseChange(merchandise.id, "productTypeId", val)}
                    options={productTypes.map(pt => ({ id: pt.id.toString(), name: pt.name }))}
                    placeholder="Selecione uma opção"
                    emptyMessage="Nenhuma opção encontrada."
                      className={'w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus-border-0 hover:bg-transparent'}
                  />
                </div>

                <div className="col-span-2 border-r border-gray-300 p-0">
                  <AutocompleteField
                    value={merchandise.categoryId ?? ""}
                    onValueChange={(val) => handleMerchandiseChange(merchandise.id, "categoryId", val)}
                    options={categories.map(c => ({ id: c.id.toString(), name: c.name }))}
                    placeholder="Selecione uma opção"
                    emptyMessage="Nenhuma opção encontrada."
                    className={`w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 hover:bg-transparent ${errors[merchandise.id] && !merchandise.categoryId ? "border border-red-500" : ""}`}
                  />
                </div>

                <div className="col-span-2 border-r border-gray-300 p-0">
                  <AutocompleteField
                    value={merchandise.unitId ?? ""}
                    onValueChange={(val) => handleMerchandiseChange(merchandise.id, "unitId", val)}
                    options={units.map(u => ({ id: u.id.toString(), name: u.name }))}
                    placeholder="Selecione uma opção"
                    emptyMessage="Nenhuma opção encontrada."
                    className={`w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus-border-0 hover:bg-transparent ${errors[merchandise.id] && !merchandise.unitId ? "border border-red-500" : ""}`}
                  />
                </div>

                <div className="col-span-2 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMerchandise(merchandise.id)}
                    disabled={merchandises.length === 1}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleAddMerchandise}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Nova Linha
            </Button>
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
            {isLoading ? "Salvando..." : "Confirmar Cadastro"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
