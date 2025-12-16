"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import useSession from "../hooks/useSession"
import { useSubCategoryCreateModal } from "../hooks/useModal"
import { checkSubCategoriesExist, createSubCategoriesRange } from "../services/sub-category"
import { toast } from "sonner"
import { LoadingOverlay } from "./ui/loading-overlay"

interface SubCategory {
  id: string
  name: string
}

interface CreateSubcategoryModalProps {
  isOpen: boolean
}

export function CreateSubcategoryModal({ isOpen }: CreateSubcategoryModalProps) {
  const session = useSession();
  const subCategoryCreateModal = useSubCategoryCreateModal();

  const [isLoading, setIsLoading] = useState(false);

  const initialSubCategory: SubCategory = { id: crypto.randomUUID(), name: "" };  
  const [subCategories, setSubCategories] = useState<SubCategory[]>([initialSubCategory]);
  const [existingSubCategories, setExistingSubCategories] = useState<SubCategory[]>([]);

  const handleAddSubCategory = () => {
    const newSubCategory: SubCategory = {
      id: crypto.randomUUID(),
      name: ""
    }
    setSubCategories([...subCategories, newSubCategory]);
  };

  const handleDeleteSubCategory = (id: string) => {
    if (subCategories.length > 1) {
      setSubCategories(subCategories.filter((subCategory) => subCategory.id !== id));
    }
  };

  const handleSubCategoryChange = (id: string, field: keyof SubCategory, value: string) => {
    setSubCategories(subCategories.map((category) => (category.id === id ? { ...category, [field]: value } : category)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (subCategories.some(i => !i.name.trim()) || new Set(subCategories.map(i => i.name.trim().toLowerCase())).size !== subCategories.length) {
      toast.warning("Existem itens vazios ou duplicados. Corrija antes de enviar.");
      return;
    }

    setIsLoading(true);
    session.setRefresh(false);

    try {
      const checkResponse = await checkSubCategoriesExist({ subCategories: subCategories.map(i => i.name) });
      
      if (checkResponse.length > 0) {
        setExistingSubCategories(checkResponse);
        toast.warning("Alguns itens já existem. Corrija-os antes de enviar.");
        return;
      }

      const response = await createSubCategoriesRange({ SubCategories: subCategories });

      if(response.created){
        toast.success("Sub-categorias criadas com sucesso!");
        handleClose();
      }else{
        toast.error("Falha ao criar as sub-categorias. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao salvar unidades:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setSubCategories([initialSubCategory]);
    subCategoryCreateModal.openModal(false);
  };

  const duplicatedItems = subCategories.map(i => i.name.trim().toLowerCase()).filter((name, index, arr) => arr.indexOf(name) !== index);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { handleClose() } }}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Salvando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">
            Cadastro de Sub-Categorias
          </DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Cadastro das Sub-Categorias dentro do Sistema.</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-10 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Sub-Categoria
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            {subCategories.map((subcategory) => {
              const isInvalid = duplicatedItems.includes(subcategory.name.trim().toLowerCase()) || existingSubCategories.some(existing => existing.name.trim().toLowerCase() === subcategory.name.trim().toLowerCase());

              return(
                <div key={subcategory.id} className={`grid grid-cols-12 border-b border-gray-200 last:border-b-0 ${isInvalid ? "bg-red-100" : ""}`} >
                  <div className="col-span-10 border-r border-gray-300 p-0">
                    <input
                      type="text"
                      value={subcategory.name}
                      onChange={(e) => handleSubCategoryChange(subcategory.id, "name" ,e.target.value)}
                      placeholder="Orgânico..."
                      className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                      style={{ border: "none", outline: "none", boxShadow: "none" }}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSubCategory(subcategory.id)}
                      disabled={subCategories.length === 1}
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
              onClick={handleAddSubCategory}
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
            Confirmar Cadastro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
