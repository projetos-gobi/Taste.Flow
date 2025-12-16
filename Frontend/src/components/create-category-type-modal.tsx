"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import useSession from "../hooks/useSession"
import { useCategoryTypeCreateModal } from "../hooks/useModal"
import { checkCategoryTypesExist, createCategoryTypesRange } from "../services/category-type"
import { LoadingOverlay } from "./ui/loading-overlay"

interface CategoryType {
  id: string;
  name: string;
}

interface CreateCategoryTypeModalProps {
  isOpen: boolean;
}

export function CreateCategoryTypeModal({ isOpen }: CreateCategoryTypeModalProps) {
  const session = useSession();
  const categoryTypeCreateModal = useCategoryTypeCreateModal();

  const [isLoading, setIsLoading] = useState(false);

  const initialCategoryType: CategoryType = { id: crypto.randomUUID(), name: "" };  
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([initialCategoryType]);
  const [existingCategoryTypes, setExistingCategoryTypes] = useState<CategoryType[]>([]);

  const handleAddCategoryType = () => {
    const newCategoryType: CategoryType = {
      id: crypto.randomUUID(),
      name: ""
    }
    setCategoryTypes([...categoryTypes, newCategoryType]);
  };

  const handleDeleteCategoryType = (id: string) => {
    if (categoryTypes.length > 1) {
      setCategoryTypes(categoryTypes.filter((categoryType) => categoryType.id !== id));
    }
  };

  const handleCategoryTypeChange = (id: string, field: keyof CategoryType, value: string) => {
    setCategoryTypes(categoryTypes.map((categoryType) => (categoryType.id === id ? { ...categoryType, [field]: value } : categoryType)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (categoryTypes.some(i => !i.name.trim()) || new Set(categoryTypes.map(i => i.name.trim().toLowerCase())).size !== categoryTypes.length) {
      toast.warning("Existem itens vazios ou duplicados. Corrija antes de enviar.");
      return;
    }

    setIsLoading(true);
    session.setRefresh(false);

    try {
      const checkResponse = await checkCategoryTypesExist({ categoryTypes: categoryTypes.map(i => i.name) });
      
      if (checkResponse.length > 0) {
        setExistingCategoryTypes(checkResponse);
        toast.warning("Alguns itens já existem. Corrija-os antes de enviar.");
        return;
      }

      const response = await createCategoryTypesRange({ categoryTypes: categoryTypes});

      if(response.created){
        toast.success("Tipos de categorias criados com sucesso!");
        handleClose();
      }else{
        toast.error("Falha ao criar os tipos de categorias. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao salvar tipos de categorias:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setExistingCategoryTypes([]);
    setCategoryTypes([initialCategoryType]);
    categoryTypeCreateModal.openModal(false);
  };

  const duplicatedItems = categoryTypes.map(i => i.name.trim().toLowerCase()).filter((name, index, arr) => arr.indexOf(name) !== index);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { handleClose() } }}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Salvando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">
            Cadastro de Tipo de Categoria
          </DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Cadastro dos Tipos de Categoria dentro do Sistema.
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

            {categoryTypes.map((categoryType) => {
              const isInvalid = duplicatedItems.includes(categoryType.name.trim().toLowerCase()) || existingCategoryTypes.some(existing => existing.name.trim().toLowerCase() === categoryType.name.trim().toLowerCase());

              return (
                <div key={categoryType.id} className={`grid grid-cols-12 border-b border-gray-200 last:border-b-0 ${isInvalid ? "bg-red-100" : ""}`} >
                  <div className="col-span-10 border-r border-gray-300 p-0">
                    <input
                      type="text"
                      value={categoryType.name}
                      onChange={(e) => handleCategoryTypeChange(categoryType.id, "name", e.target.value)}
                      placeholder="Matéria Prima..."
                      className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                      style={{ border: "none", outline: "none", boxShadow: "none" }}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCategoryType(categoryType.id)}
                      disabled={categoryTypes.length === 1}
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleAddCategoryType}
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
