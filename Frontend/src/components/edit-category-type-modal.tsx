"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import useSession from "../hooks/useSession"
import { useCategoryTypeEditModal } from "../hooks/useModal"
import { checkCategoryTypesExist, getCategoryTypeById, updateCategoryType } from "../services/category-type"
import { LoadingOverlay } from "./ui/loading-overlay"

interface EditCategoryTypeModalProps {
  isOpen: boolean;
}

interface CategoryType {
  id: string
  enterpriseId: string;
  name: string
}

export function EditCategoryTypeModal({ isOpen }: EditCategoryTypeModalProps) {
  const session = useSession();
  const categoryTypeEditModal = useCategoryTypeEditModal();
  
  const initialCategoryType: CategoryType = {
    id: "",
    enterpriseId: "", 
    name: "",
  };

  const [isLoading, setIsLoading] = useState(false);
  const [categoryType, setCategoryType] = useState<CategoryType>(initialCategoryType);
  const [isExisting, setIsExisting] = useState(false);

  const fetchCategoryType = async () => {
    try {
      setIsLoading(true);

      const data = await getCategoryTypeById({ id: categoryTypeEditModal.categoryTypeId });

      setCategoryType({
        id: data.id,
        enterpriseId: data.enterpriseId,
        name: data.name
      });
    } catch (error) {
      console.error("Erro ao buscar item:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchCategoryType();
    }
  }, [isOpen]);
  
  const handleChange = (field: keyof CategoryType, value: string | boolean) => {
    setCategoryType((prev) => ({ ...prev, [field]: value }))
  };

  const resetForm = () => {
    setCategoryType(initialCategoryType);
  };

  const handleClose = () => {
    resetForm();
    setIsExisting(false);
    categoryTypeEditModal.openModal(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true)
    session.setRefresh(false);

    try {
      const checkResponse = await checkCategoryTypesExist({ categoryTypes: [categoryType.name] });
      
      const existing = checkResponse.find((existing: any) => existing.id !== categoryType.id);

      setIsExisting(existing);

      if (existing) {
        toast.warning(`O tipo de categoria "${categoryType.name}" já existe.`);
        return;
      }

      const response = await updateCategoryType(categoryType);

      if(response.updated){
        handleClose();
        toast.success("Tipo de categoria atualizado com sucesso!");
      }else{
        toast.error("Falha ao atualizar um tipo de categoria. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao atualizar um tipo de categoria:", error)
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
            Edição de Tipo de Categoria
          </DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Edição dos Tipos de Categoria dentro do Sistema.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-10 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Tipo da Categoria
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            <div className={`grid grid-cols-12 border-b border-gray-200 last:border-b-0 ${isExisting ? "bg-red-100" : ""}`} >
              <div className="col-span-10 border-r border-gray-300 p-0">
                <input
                  type="text"
                  value={categoryType.name}
                  onChange={(e) => handleChange('name', e.target.value)}
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
            Confirmar Edição
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
