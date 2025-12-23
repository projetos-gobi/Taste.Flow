"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Filter, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, Building2 } from "lucide-react"
import { EditEnterpriseModal } from "@/src/components/edit-company-modal"
import { CompanyFilterModal } from "@/src/components/company-filter-modal"
import { getEnterprisesPaged, softDeleteEnterprise } from "@/src/services/enterprise"
import { EnterpriseFilter } from "@/src/types/enterprise"
import { useEnterpriseEditModal, useEnterpriseFilterModal } from "@/src/hooks/useModal"
import useSession from "@/src/hooks/useSession"
import { Pagination } from "@/src/components/pagination"
import { toast } from "sonner"

interface Enterpise {
  id: string;                  
  licenseId?: string;           
  fantasyName?: string;
  licenseName?: string;
  cnpj?: string;
  emailAddress?: string;
  contact?: string;
  address?: string;
  licenseQuantity?: number;
  isActive?: boolean;
}

export default function CompaniesPage() {
  const router = useRouter();
  const session = useSession();
  const enterpriseEditModal = useEnterpriseEditModal();
  const enterpriseFilterModal = useEnterpriseFilterModal();

  const [appliedFilters, setAppliedFilters] = useState<EnterpriseFilter>({});
  const [activeFilters, setActiveFilters] = useState(0);

  const [companies, setCompanies] = useState<Enterpise[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);  
  const itemsPerPage = 10;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchEnterprises = async (page: number = 1, filters: EnterpriseFilter = appliedFilters) => {
    try {
      setIsLoading(true);

      const data = {
        query: { pageSize: itemsPerPage, page },
        filter: filters,
      }

      const result = await getEnterprisesPaged(data);
      
      setCompanies(result.items);
      setTotalItems(result.count);
      setCurrentPage(result.page);
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      toast.error("Não foi possível carregar as empresas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchEnterprises(page);
  };

  useEffect(() => {
    fetchEnterprises();
  }, [])

  useEffect(() => {
    if (session.refresh) {
        fetchEnterprises();
    }
  }, [session.refresh]);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta empresa?")) {
      //setIsLoading(true)
      session.setRefresh(false);

      try {
        const response = await softDeleteEnterprise({ id: id});

        if(response.updated){
          toast.success("Empresa deletada com sucesso!");
        }else{
          toast.warning(response.message);
        } 
      } catch (error) {
        console.error("Erro ao salvar empresa:", error)
      } finally {
        session.setRefresh(true);
        //setIsLoading(false)
      }
    }
  };

  const handleToggleActive = (id: string) => {
    setCompanies(companies.map((c) => (c.id === id ? { ...c, active: !c.isActive } : c)))
  };

  const handleCreateCompany = () => {
    router.push("/admin/empresas/cadastrar")
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Empresas</h1>
        <p className="text-gray-600 font-body">Área dedicada à administração das Empresas cadastradas no Sistema</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          variant="outline"
          onClick={() => enterpriseFilterModal.openModal(true)}
          className="flex items-center gap-2 font-body bg-transparent"
        >
          <Filter className="h-4 w-4" />
          Filtros e Visualização
          {activeFilters > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{activeFilters}</span>
          )}
        </Button>

        <Button
          onClick={handleCreateCompany}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 font-body"
        >
          <Plus className="h-4 w-4" />
          Cadastrar Nova Empresa
        </Button>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-heading font-semibold text-gray-900">Empresas Cadastradas</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">Nome da Empresa</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">Contato</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">Endereço</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">Plano/Assinatura</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">CNPJ</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">
                  Quantidade de Licenças
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 font-body">Ações</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 font-body">Ativo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 text-[#322CA7] animate-spin mx-auto" />
                      <span className="block mt-2 text-gray-600 font-nunito font-medium">Carregando registros...</span>
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr key={company.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-body">{company.fantasyName}</td>
                      <td className="px-4 py-3 text-sm text-blue-600 font-body">{company.contact}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-body">{company.address}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-body">{company.licenseName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-body">{company.cnpj}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-body">{company.licenseQuantity} Licenças</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(company.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => enterpriseEditModal.openModal(true, company.id)}
                            className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(company.id)}
                          className="h-8 w-8 p-0"
                        >
                          {company.isActive ? (
                            <div className="w-6 h-6 bg-blue-600 rounded border-2 border-blue-600"></div>
                          ) : (
                            <div className="w-6 h-6 bg-white rounded border-2 border-gray-300"></div>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>
        </div>
        {/* Estado vazio */}
          {companies.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhuma empresa cadastrada</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">Comece cadastrando sua primeira empresa.</p>
              <Button
                onClick={handleCreateCompany}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Sua Primeira Empresa
              </Button>
            </div>
          )}
      </div>
      {/* Pagination */}
      {companies.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      <EditEnterpriseModal isOpen={enterpriseEditModal.isModalOpen} /> 

      <CompanyFilterModal
        isOpen={enterpriseFilterModal.isOpen}
        onApplyFilters={(filters) => {
            setActiveFilters(Object.values(filters).filter((v) => v !== undefined && v !== "" && v !== "all").length);
            setAppliedFilters(filters);      
            fetchEnterprises(1, filters);    
        }}
      />
    </div>
  )
}
