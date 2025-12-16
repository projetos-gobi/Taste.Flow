"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { ShoppingCart, Edit, Trash2, Plus, Loader2 } from "lucide-react"
import { CreateItemModal } from "@/src/components/create-item-modal"
import { EditItemModal } from "@/src/components/edit-item-modal"
import useSession from "@/src/hooks/useSession"
import { useItemCreateModal, useItemEditModal } from "@/src/hooks/useModal"
import { toast } from "sonner"
import { getItemsPaged, softDeleteItem } from "@/src/services/item"
import { Pagination } from "@/src/components/pagination"
import { Item } from "@/src/types/item"

export default function ItensPage() {
  const session = useSession();
  const itemCreateModal = useItemCreateModal();
  const itemEditModal = useItemEditModal();

  const [items, setItems] = useState<Item[]>([])
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

      const response = await getItemsPaged(data);

      setItems(response.items);
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

  const handleDeleteItem = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esse item?")) {
      setIsLoading(true)
      session.setRefresh(false);

      try {
        const response = await softDeleteItem({ id: id});

        if(response.updated){
          toast.success("Item deletado com sucesso!");
        }else{
          toast.warning(response.message);
        } 
      } catch (error) {
        console.error("Erro ao deletar um item:", error)
      } finally {
        session.setRefresh(true);
        setIsLoading(false)
      }
    }
  };
    
  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      {/* Elementos decorativos */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Itens</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <Button
            onClick={() => itemCreateModal.openModal(true)}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Cadastrar Item
          </Button>
        </div>

        {/* Tabela de Itens */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900 w-full">Item</th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={2} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 text-[#322CA7] animate-spin mx-auto" />
                      <span className="block mt-2 text-gray-600 font-nunito font-medium">Carregando registros...</span>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => itemEditModal.openModal(true, item.id)}
                            className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
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

          {/* Estado vazio */}
          {items.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhum item cadastrado</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">Comece cadastrando seu primeiro item.</p>
              <Button
                onClick={() => itemCreateModal.openModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Item
              </Button>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      

      {/* Modais */}
      <CreateItemModal isOpen={itemCreateModal.isOpen} />

      <EditItemModal isOpen={itemEditModal.isModalOpen} />
    </div>
  )
}
