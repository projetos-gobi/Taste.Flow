"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Select } from "@/src/components/ui/select"
import { Trash2 } from "lucide-react"
import useSession from "../hooks/useSession"
import { useCategoryEditModal } from "../hooks/useModal"
import { checkCategoriesExist, getCategoryById, updateCategory } from "../services/category"
import { toast } from "sonner"
import { getAllCategoryTypesByEnterpriseId } from "../services/category-type"
import { LoadingOverlay } from "./ui/loading-overlay"
import { AutocompleteField } from "./auto-complete-field"

interface Category {
  id: string;
  enterpriseId: string;
  categoryTypeId: string;
  name: string;
}

interface CategoryType {
  id: string;
  name: string;
}

interface EditCategoryModalProps {
  isOpen: boolean;
}

export function EditCategoryModal({ isOpen }: EditCategoryModalProps) {
  const session = useSession();
  const categoryEditModal = useCategoryEditModal();
  
  const initialCategory: Category = {
    id: "",
    enterpriseId: "", 
    categoryTypeId: "",
    name: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<Category>(initialCategory);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [isExisting, setIsExisting] = useState(false);
  
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);

      const [categoryData, categoryTypesResponse] = await Promise.all([
        getCategoryById({ id: categoryEditModal.categoryId }),
        getAllCategoryTypesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
      ]);

      setCategory({
        id: categoryData.id,
        enterpriseId: categoryData.enterpriseId,
        categoryTypeId: categoryData.categoryTypeId,
        name: categoryData.name,
      });
    
      setCategoryTypes(categoryTypesResponse);
    } catch (error) {
      console.error("Erro ao buscar item:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);
  

  const handleChange = (field: keyof Category, value: string | boolean | null) => {
    setCategory((prev) => ({ ...prev, [field]: value }))
  };

  const resetForm = () => {
    setCategory(initialCategory);
  };

  const handleClose = () => {
    resetForm();
    setIsExisting(false);
    categoryEditModal.openModal(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    session.setRefresh(false);

    try {
      const checkResponse = await checkCategoriesExist({ categories: [category.name] });
      
      const existing = checkResponse.find((existing: any) => existing.id !== category.id);

      setIsExisting(existing);

      if (existing) {
        toast.warning(`A categoria "${category.name}" já existe.`);
        return;
      }

      const response = await updateCategory(category);

      if(response.updated){
        handleClose();
        toast.success("Categoria atualizada com sucesso!");
      }else{
        toast.error("Falha ao atualizar uma categoria. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao atualizar uma categoria:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { handleClose() } }}>
      <DialogContent className="sm:max-w-6xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Carregando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Edição de Categorias</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Edição das Categorias dentro do Sistema.</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-5 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Nome da Categoria
              </div>
              <div className="col-span-5 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Tipo da Categoria
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            <div className={`grid grid-cols-12 border-b border-gray-200 last:border-b-0 ${isExisting ? "bg-red-100" : ""}`} >
              <div className="col-span-5 border-r border-gray-300 p-0">
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                />
              </div>
              <div className="col-span-5 border-r border-gray-300 p-0">
                <AutocompleteField
                  value={category.categoryTypeId ?? ""}
                  onValueChange={(val) => handleChange("categoryTypeId", val)}
                  options={categoryTypes}
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
