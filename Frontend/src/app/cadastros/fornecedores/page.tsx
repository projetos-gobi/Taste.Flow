"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Users, Edit, Trash2, Plus, Filter, Info, Loader2 } from "lucide-react"
import { CreateSupplierModal } from "@/src/components/create-supplier-modal"
import { EditSupplierModal } from "@/src/components/edit-supplier-modal"
import { SupplierDetailsModal } from "@/src/components/supplier-details-modal"
import { SupplierFilterModal } from "@/src/components/supplier-filter-modal"
import { toast } from "sonner"
import useSession from "@/src/hooks/useSession"
import { useSupplierCreateModal, useSupplierDetailModal, useSupplierEditModal, useSupplierFilterModal } from "@/src/hooks/useModal"
import { getSuppliersPaged, softDeleteSupplier } from "@/src/services/supplier"
import { Pagination } from "@/src/components/pagination"
import { Supplier, SupplierFilter } from "@/src/types/supplier"

export default function FornecedoresPage() {
  const session = useSession();
  const supplierCreateModal = useSupplierCreateModal();
  const supplierFilterModal = useSupplierFilterModal();
  const supplierEditModal = useSupplierEditModal();
  const supplierDetailModal = useSupplierDetailModal();

  const [appliedFilters, setAppliedFilters] = useState<SupplierFilter>({});

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10; 

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchInitialData = async (page: number = 1, filters: SupplierFilter = appliedFilters) => {
    try {
      setIsLoading(true);

      const data = {
        query: { pageSize: itemsPerPage, page },
        filter: filters,
      };

      const response = await getSuppliersPaged(data);

      setSuppliers(response.items);
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
    setCurrentPage(page)
  }

  const handleDeleteSupplier = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esse fornecedor?")) {
      //setIsLoading(true)
      session.setRefresh(false);

      try {
        const response = await softDeleteSupplier({ id: id});

        if(response.updated){
          toast.success("Fornecedor deletado com sucesso!");
        }else{
          toast.error("Falha ao deletar um fornecedor. Tente novamente.");
        } 
      } catch (error) {
        console.error("Erro ao deletar um fornecedor:", error)
      } finally {
        session.setRefresh(true);
        //setIsLoading(false)
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
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Fornecedores</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => supplierFilterModal.openModal(true)}
              variant="outline"
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-nunito font-medium flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros e Visualização
            </Button>
            <Button
              onClick={() => supplierCreateModal.openModal(true)}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Cadastrar Fornecedor
            </Button>
          </div>
        </div>

        {/* Tabela de Fornecedores */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Fornecedor</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">CNPJ</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Telefone</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Pagamentos</th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 text-[#322CA7] animate-spin mx-auto" />
                      <span className="block mt-2 text-gray-600 font-nunito font-medium">
                        Carregando registros...
                      </span>
                    </td>
                  </tr>
                ) : (
                  suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">
                        {supplier.fantasyName}
                      </td>
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">
                        {supplier.cnpj}
                      </td>
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">
                        {supplier.categoryName}
                      </td>
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">
                        {supplier.telephone}
                      </td>
                      <td className="px-6 py-4 font-nunito font-light text-gray-900">
                        {supplier.supplierPaymentTypes.map((pt) => pt.paymentTypeName).join(", ")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => supplierDetailModal.openModal(true, supplier.id)}
                            className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => supplierEditModal.openModal(true, supplier.id)}
                            className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSupplier(supplier.id)}
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
          {!isLoading && suppliers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhum fornecedor encontrado</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">
                {suppliers.length === 0
                  ? "Comece cadastrando seu primeiro fornecedor."
                  : "Tente ajustar os filtros ou cadastrar um novo fornecedor."}
              </p>
              <Button
                onClick={() => supplierCreateModal.openModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Fornecedor
              </Button>
            </div>
          )}
        </div>

        {/* Paginação */}
        {suppliers.length > 0 && (
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
      <CreateSupplierModal isOpen={supplierCreateModal.isOpen} />

      <EditSupplierModal isOpen={supplierEditModal.isModalOpen} />

      <SupplierDetailsModal isOpen={supplierDetailModal.isModalOpen} />

      <SupplierFilterModal 
        isOpen={supplierFilterModal.isOpen}
        onApplyFilters={(filters) => {
          // setActiveFilters(Object.values(filters).filter((v) => v !== undefined && v !== "" && v !== "all").length);
          setAppliedFilters(filters);      
          fetchInitialData(1, filters);   
        }} 
      />
    </div>
  )
}
