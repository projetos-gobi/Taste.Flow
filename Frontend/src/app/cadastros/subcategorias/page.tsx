"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Triangle, Edit, Trash2, Plus, Loader2 } from "lucide-react"
import { CreateSubcategoryModal } from "@/src/components/create-subcategory-modal"
import { EditSubcategoryModal } from "@/src/components/edit-subcategory-modal"
import { toast } from "sonner"
import { getSubCategoriesPaged, softDeleteSubCategory } from "@/src/services/sub-category"
import useSession from "@/src/hooks/useSession"
import { useSubCategoryCreateModal, useSubCategoryEditModal } from "@/src/hooks/useModal"
import { Pagination } from "@/src/components/pagination"

interface SubCategory {
  id: string; 
  enterpriseId: string;
  name: string;
}

export default function SubcategoriasPage() {
  const session = useSession();
  const subCategoryCreateModal = useSubCategoryCreateModal();
  const subCategoryEditModal = useSubCategoryEditModal();

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchInitialData = async (page: number = 1) => {
    try {
      setIsLoading(true);

      const data = {
        query: { pageSize: itemsPerPage, page }
      };

      const response = await getSubCategoriesPaged(data);

      setSubCategories(response.items);
      setTotalItems(response.count);
      setCurrentPage(response.page);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (session.refresh) {
        fetchInitialData();
    }
  }, [session.refresh]);


  const handlePageChange = (page: number) => {
    fetchInitialData(page);
  };

  const handleDeleteSubCategory = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir está sub-categoria?")) {
      setIsLoading(true);
      session.setRefresh(false);

      try {
        const response = await softDeleteSubCategory({ id: id});

        if(response.updated){
          toast.success("Sub-categoria deletada com sucesso!");
        }else{
          toast.warning(response.message);
        } 
      } catch (error) {
        console.error("Erro ao deletar uma sub-categoria:", error)
      } finally {
        session.setRefresh(true);
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Sub-Categorias</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <Button
            onClick={() => subCategoryCreateModal.openModal(true)}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
          >
            <Triangle className="h-4 w-4" />
            Cadastrar Sub-Categorias
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900 w-full">Sub-Categoria</th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 text-[#322CA7] animate-spin mx-auto" />
                      <span className="block mt-2 text-gray-600 font-nunito font-medium">
                        Carregando registros...
                      </span>
                    </td>
                  </tr>
                ) : (
                  subCategories.map((subCategory) => (
                    <tr key={subCategory.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">
                        {subCategory.name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => subCategoryEditModal.openModal(true, subCategory.id)}
                            className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSubCategory(subCategory.id)}
                            className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && subCategories.length === 0 && (
            <div className="text-center py-12">
              <Triangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhuma sub-categoria cadastrada</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">
                Comece cadastrando sua primeira sub-categoria.
              </p>
              <Button
                onClick={() => subCategoryCreateModal.openModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Sub-Categoria
              </Button>
            </div>
          )}

        </div>
          {subCategories.length > 0 && (
            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               itemsPerPage={itemsPerPage}
               totalItems={totalItems}
               onPageChange={handlePageChange}
             />
          )}
      </div>

      <CreateSubcategoryModal isOpen={subCategoryCreateModal.isOpen} />

      <EditSubcategoryModal isOpen={subCategoryEditModal.isModalOpen} />
    </div>
  )
}
