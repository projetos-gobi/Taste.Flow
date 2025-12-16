"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Trash2 } from "lucide-react"
import useSession from "../hooks/useSession"
import { useSubCategoryEditModal } from "../hooks/useModal"
import { checkSubCategoriesExist, getSubCategoryById, updateSubCategory } from "../services/sub-category"
import { toast } from "sonner"
import { LoadingOverlay } from "./ui/loading-overlay"

interface EditSubcategoryModalProps {
  isOpen: boolean;
}

interface SubCategory {
  id: string; 
  enterpriseId: string;
  name: string;
}

export function EditSubcategoryModal({ isOpen }: EditSubcategoryModalProps) {
  const session = useSession();
  const subCategoryEditModal = useSubCategoryEditModal();
  
  const initialSubCategory: SubCategory = {
    id: "",
    enterpriseId: "", 
    name: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [subCategory, setSubCategory] = useState<SubCategory>(initialSubCategory);
  const [isExisting, setIsExisting] = useState(false);
  
  const fetchSubCategory = async () => {
    try {
      setIsLoading(true);

      const data = await getSubCategoryById({ id: subCategoryEditModal.subCategoryId });

      setSubCategory({
        id: data.id,
        enterpriseId: data.enterpriseId,
        name: data.name
      });
    } catch (error) {
      console.error("Erro ao buscar sub-categoria:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchSubCategory();
    }
  }, [isOpen]);
  

  const handleChange = (field: keyof SubCategory, value: string | boolean) => {
    setSubCategory((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setSubCategory(initialSubCategory);
  };

  const handleClose = () => {
    resetForm();
    setIsExisting(false);
    subCategoryEditModal.openModal(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true)
    session.setRefresh(false);

    try {
      const checkResponse = await checkSubCategoriesExist({ subCategories: [subCategory.name] });
      
      const existing = checkResponse.find((existing: any) => existing.id !== subCategory.id);

      setIsExisting(existing);

      if (existing) {
        toast.warning(`A sub-categoria "${subCategory.name}" já existe.`);
        return;
      }

      const response = await updateSubCategory(subCategory);

      if(response.updated){
        handleClose();
        toast.success("Sub-categoria atualizada com sucesso!");
      }else{
        toast.error("Falha ao atualizar uma sub-categoria. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao atualizar uma sub-categoria:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Carregando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">
            Cadastro de Sub-Categorias
          </DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Edição das Sub-Categorias dentro do Sistema.</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-10 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Sub-Categoria
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            <div className={`grid grid-cols-12 border-b border-gray-200 last:border-b-0 ${isExisting ? "bg-red-100" : ""}`} >
              <div className="col-span-10 border-r border-gray-300 p-0">
                <input
                  type="text"
                  value={subCategory.name}
                  onChange={(e) => handleChange("name",e.target.value)}
                  className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
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
