"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Store, Edit, Trash2, Plus, Filter, Loader2 } from "lucide-react"
import { CreateMerchandiseModal } from "@/src/components/create-merchandise-modal"
import { EditMerchandiseModal } from "@/src/components/edit-merchandise-modal"
import { MerchandiseFilterModal } from "@/src/components/merchandise-filter-modal"
import { toast } from "sonner"
import useSession from "@/src/hooks/useSession"
import { Pagination } from "@/src/components/pagination"
import { useMerchandiseCreateModal, useMerchandiseEditModal, useMerchandiseFilterModal } from "@/src/hooks/useModal"
import { getMerchandisesPaged, softDeleteMerchandise } from "@/src/services/merchandise"
import { Merchandise, MerchandiseFilter } from "@/src/types/merchandise"

export default function MercadoriasPage() {
  const session = useSession();
  const merchandiseCreateModal = useMerchandiseCreateModal();
  const merchandiseFilterModal = useMerchandiseFilterModal();
  const merchandiseEditModal = useMerchandiseEditModal();

  const [appliedFilters, setAppliedFilters] = useState<MerchandiseFilter>({});
  const [activeFilters, setActiveFilters] = useState(0);

  const [merchandises, setMerchandises] = useState<Merchandise[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const fetchInitialData = async (page: number = 1, filters: MerchandiseFilter = appliedFilters) => {
    try {
      setIsLoading(true);

      const data = {
        query: { pageSize: itemsPerPage, page },
        filter: appliedFilters
      };

      const response = await getMerchandisesPaged(data);

      setMerchandises(response.items);
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

  const handleDeleteMerchandise = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir essa mercadoria?")) {
      setIsLoading(true);
      session.setRefresh(false);

      try {
        const response = await softDeleteMerchandise({ id: id});

        if(response.updated){
          toast.success("Mercadoria deletada com sucesso!");
        }else{
          toast.warning(response.message);
        } 
      } catch (error) {
        console.error("Erro ao deletar uma mercadoria:", error)
      } finally {
        session.setRefresh(true);
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Mercadorias</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Button
                onClick={() => merchandiseFilterModal.openModal(true)}
                variant="outline"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-nunito font-medium flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros e Visualização
              </Button>
              {activeFilters > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {activeFilters}
                </Badge>
              )}
            </div>
            <Button
              onClick={() => merchandiseCreateModal.openModal(true)}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              Cadastrar Mercadoria
            </Button>
          </div>
        </div>

        {/* Tabela de Mercadorias */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Mercadoria</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Item</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Marca</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Tipo</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Unidade Técnica</th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 text-[#322CA7] animate-spin mx-auto" />
                      <span className="block mt-2 text-gray-600 font-nunito font-medium">
                        Carregando registros...
                      </span>
                    </td>
                  </tr>
                ) : merchandises.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-nunito font-medium">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  merchandises.map((merchandise) => (
                    <tr key={merchandise.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">{merchandise.name}</td>
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">{merchandise.itemName}</td>
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">{merchandise.brandName || "-"}</td>
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">{merchandise.productTypeName || "-"}</td>
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">{merchandise.categoryName}</td>
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">{merchandise.unitName}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => merchandiseEditModal.openModal(true, merchandise.id)}
                            className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMerchandise(merchandise.id)}
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
          {(!isLoading && merchandises.length === 0) && (
            <div className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhuma mercadoria encontrada</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">
                {merchandises.length === 0
                  ? "Comece cadastrando sua primeira mercadoria."
                  : "Tente ajustar os filtros ou cadastrar uma nova mercadoria."}
              </p>
              <Button
                onClick={() => merchandiseCreateModal.openModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Mercadoria
              </Button>
            </div>
          )}
        </div>

        {/* Paginação */}
        {merchandises.length > 0 && (
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
      <CreateMerchandiseModal isOpen={merchandiseCreateModal.isOpen} />

      <EditMerchandiseModal isOpen={merchandiseEditModal.isModalOpen} />

      <MerchandiseFilterModal
        isOpen={merchandiseFilterModal.isOpen}
        onApplyFilters={(filters) => {
          setActiveFilters(Object.values(filters).filter((v) => v !== null && v !== "").length);
          setAppliedFilters(filters);      
          fetchInitialData(1, filters);    
        }}
      />
    </div>
  )
}
