"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Select } from "@/src/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import useSession from "../hooks/useSession"
import { useCategoryCreateModal } from "../hooks/useModal"
import { checkCategoriesExist, createCategoriesRange } from "../services/category"
import { getAllCategoryTypesByEnterpriseId } from "../services/category-type"
import { LoadingOverlay } from "./ui/loading-overlay"
import { AutocompleteField } from "./auto-complete-field"

interface Category {
  id: string
  categoryTypeId: string
  name: string
}

interface CategoryType {
  id: string
  name: string
}

interface CreateCategoryModalProps {
  isOpen: boolean;
}

export function CreateCategoryModal({ isOpen }: CreateCategoryModalProps) {
  const session = useSession();
  const categoryCreateModal = useCategoryCreateModal();

  const [isLoading, setIsLoading] = useState(false);

  const initialCategory: Category = { id: crypto.randomUUID(), categoryTypeId: "", name: "" };  

  const [categories, setCategories] = useState<Category[]>([initialCategory]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [existingCategories, setExistingCategories] = useState<Category[]>([]);

  const fetchInitialData = async (page: number = 1) => {
    try {
      const response = await getAllCategoryTypesByEnterpriseId({ enterpriseId: session.enterpriseId ?? ""});

      setCategoryTypes(response);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };
    
  useEffect(() => {
    if(categoryCreateModal.isOpen){
      fetchInitialData();
    }
  }, [categoryCreateModal.isOpen]);

  const handleAddCategory= () => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      categoryTypeId: "",
      name: ""
    }
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (id: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter((category) => category.id !== id));
    }
  };

  const handleCategoryChange = (id: string, field: keyof Category, value: string | null) => {
    setCategories(categories.map((category) => (category.id === id ? { ...category, [field]: value } : category)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (categories.some(i => !i.name.trim()) || new Set(categories.map(i => i.name.trim().toLowerCase())).size !== categories.length) {
      toast.warning("Existem itens vazios ou duplicados. Corrija antes de enviar.");
      return;
    }

    setIsLoading(true);
    session.setRefresh(false);

    try {
      const checkResponse = await checkCategoriesExist({ categories: categories.map(i => i.name) });
      
      if (checkResponse.length > 0) {
        setExistingCategories(checkResponse);
        toast.warning("Alguns itens já existem. Corrija-os antes de enviar.");
        return;
      }

      const response = await createCategoriesRange({ categories: categories });

      if(response.created){
        toast.success("Categorias criadas com sucesso!");
        handleClose();
      }else{
        toast.error("Falha ao criar as categorias. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao salvar categorias:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCategories([initialCategory]);
    setExistingCategories([]);
    categoryCreateModal.openModal(false);
  };

  const duplicatedItems = categories.map(i => i.name.trim().toLowerCase()).filter((name, index, arr) => arr.indexOf(name) !== index);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { handleClose() } }}>
      <DialogContent className="sm:max-w-6xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Salvando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Cadastro de Categorias</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Cadastro da informação Base de Categorias</p>
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

            {categories.map((category) => {
              const isInvalid = duplicatedItems.includes(category.name.trim().toLowerCase()) || existingCategories.some(existing => existing.name.trim().toLowerCase() === category.name.trim().toLowerCase());

              return(
                <div key={category.id} className={`grid grid-cols-12 border-b border-gray-200 last:border-b-0 ${isInvalid ? "bg-red-100" : ""}`}>
                  <div className="col-span-5 border-r border-gray-300 p-0">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => handleCategoryChange(category.id, "name", e.target.value)}
                      placeholder="Categoria"
                      className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                      style={{ border: "none", outline: "none", boxShadow: "none" }}
                    />
                  </div>
                  <div className="col-span-5 border-r border-gray-300 p-0">
                    <AutocompleteField
                      value={category.categoryTypeId ?? ""}
                      onValueChange={(val) => handleCategoryChange(category.id, "categoryTypeId", val)}
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
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={categories.length === 1}
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
              onClick={handleAddCategory}
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
