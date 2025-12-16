"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Filter, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2, User2 } from "lucide-react"
import { UserFilterModal } from "@/src/components/user-filter-modal"
import { EditUserModal } from "@/src/components/edit-user-modal"
import useSession from "@/src/hooks/useSession"
import { getUsersPaged, softDeleteUser } from "@/src/services/user"
import { UserFilter } from "@/src/types/user"
import { toast } from "sonner"
import { useUserEditModal, useUserFilterModal } from "@/src/hooks/useModal"
import { Pagination } from "@/src/components/pagination"

interface User {
  id: string;
  accessProfileId: string;
  name: string;
  enterpriseName: string;
  emailAddress: string;
  licenseName: string;
  contact: string;
  accessProfileName: string;
  isActive: boolean;
}

export default function UsersPage() {
  const router = useRouter()
  const session = useSession();
  const userEditModal = useUserEditModal();
  const userFilterModal = useUserFilterModal();

  const [appliedFilters, setAppliedFilters] = useState<UserFilter>({});
  const [activeFilters, setActiveFilters] = useState(0);

  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);  
  const itemsPerPage = 10; 

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchInitialData = async (page: number = 1, filters: UserFilter = appliedFilters) => {
    try {
      setIsLoading(true);

      const data = {
        query: {
          pageSize: itemsPerPage,
          page,
        },
        filter: filters,
      }

      const result = await getUsersPaged(data);
      
      setUsers(result.items);
      setTotalItems(result.count);
      setCurrentPage(result.page);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [])

  useEffect(() => {
    if (session.refresh) {
        fetchInitialData();
    }
  }, [session.refresh]);

  const handleCreateUser = () => {
    router.push("/admin/usuarios/cadastrar")
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta usuário?")) {
      //setIsLoading(true)
      session.setRefresh(false);

      try {
        const response = await softDeleteUser({ id: id});

        if(response.updated){
          toast.success("Usuário deletada com sucesso!");
        }else{
          toast.error("Falha ao deletar um usuário. Tente novamente.");
        } 
      } catch (error) {
        console.error("Erro ao deletar um usuário:", error)
      } finally {
        session.setRefresh(true);
        //setIsLoading(false)
      }
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-heading font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-600 font-body">Área dedicada à administração dos Usuários cadastrados no Sistema</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          variant="outline"
          onClick={() => userFilterModal.openModal(true)}
          className="flex items-center gap-2 font-body bg-transparent"
        >
          <Filter className="h-4 w-4" />
          Filtros e Visualização
        </Button>

        <Button
          onClick={handleCreateUser}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 font-body"
        >
          <Plus className="h-4 w-4" />
          Cadastrar Novo Usuário
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-heading font-semibold text-gray-900">Usuários Cadastrados</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">Nome do Usuário</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">Empresa</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">E-Mail</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">Assinatura</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">Tipo de Perfil</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 font-body">Contato</th>
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
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-body">{user.name || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-body">{user.enterpriseName || "-"}</td>
                      <td className="px-4 py-3 text-sm text-blue-600 font-body">{user.emailAddress || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-body">{user.licenseName || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-body">{user.accessProfileName || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-body">{user.contact || "-"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => userEditModal.openModal(true, user.id)}
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
                          disabled={true}
                          className="h-8 w-8 p-0"
                        >
                          {user.isActive ? (
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
          {users.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <User2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhum usuário cadastrado</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">Comece cadastrando seu primeiro usuário.</p>
              <Button
                onClick={handleCreateUser}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Usuário
              </Button>
            </div>
          )}
      </div>
      {/* Pagination */}
      {users.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      <UserFilterModal
        isOpen={userFilterModal.isOpen}
        onApplyFilters={(filters) => {
            setActiveFilters(Object.values(filters).filter((v) => v !== undefined && v !== "" && v !== "all").length);
            setAppliedFilters(filters);      
            fetchInitialData(1, filters);   
        }}
      />

      <EditUserModal isOpen={userEditModal.isModalOpen} />
    </div>
  )
}
