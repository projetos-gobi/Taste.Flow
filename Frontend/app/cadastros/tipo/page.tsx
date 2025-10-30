"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Package, Edit, Trash2, Plus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { CreateTypeModal } from "@/components/create-type-modal"
import { EditTypeModal } from "@/components/edit-type-modal"

// Dados simulados dos tipos
const initialTypes = [
  { id: 1, name: "Com Gás" },
  { id: 2, name: "Sem Gás" },
  { id: 3, name: "Duplo Malte" },
  { id: 4, name: "Zero" },
  { id: 5, name: "Long Neck" },
  { id: 6, name: "Lata" },
  { id: 7, name: "Com Gás" },
  { id: 8, name: "Com Gás" },
  { id: 9, name: "Com Gás" },
  { id: 10, name: "Com Gás" },
  // Adicionar mais tipos para simular paginação
  ...Array.from({ length: 25 }, (_, i) => ({
    id: 11 + i,
    name: `Tipo ${11 + i}`,
  })),
]

const ITEMS_PER_PAGE = 10

export default function TipoPage() {
  const [types, setTypes] = useState(initialTypes)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingType, setEditingType] = useState<{ id: number; name: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Cálculos de paginação
  const totalPages = Math.ceil(types.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTypes = types.slice(startIndex, endIndex)

  const handleCreateTypes = (newTypes: { name: string }[]) => {
    // Criar novos tipos com IDs únicos
    const typesToAdd = newTypes.map((type) => ({
      id: Date.now() + Math.random(),
      name: type.name,
    }))

    // Adicionar todos os novos tipos ao estado
    setTypes([...types, ...typesToAdd])
    setShowCreateModal(false)
  }

  const handleEditType = (id: number, name: string) => {
    setTypes(types.map((type) => (type.id === id ? { ...type, name } : type)))
    setShowEditModal(false)
    setEditingType(null)
  }

  const handleDeleteType = (id: number) => {
    setTypes(types.filter((type) => type.id !== id))
    // Ajustar página atual se necessário
    const newTotalPages = Math.ceil((types.length - 1) / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  const openEditModal = (type: { id: number; name: string }) => {
    setEditingType(type)
    setShowEditModal(true)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      {/* Elementos decorativos */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Tipo</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
          >
            <Package className="h-4 w-4" />
            Cadastrar Tipo
          </Button>
        </div>

        {/* Tabela de Tipos */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900 w-full">Tipo</th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentTypes.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{type.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(type)}
                          className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteType(type.id)}
                          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Estado vazio */}
          {types.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhum tipo cadastrado</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">Comece cadastrando seu primeiro tipo.</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Tipo
              </Button>
            </div>
          )}
        </div>

        {/* Paginação */}
        {types.length > 0 && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="text-gray-600 hover:text-[#322CA7]"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-gray-600 hover:text-[#322CA7]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getVisiblePages().map((page, index) => (
                <Button
                  key={index}
                  variant={page === currentPage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={page === "..."}
                  className={
                    page === currentPage
                      ? "bg-[#322CA7] text-white hover:bg-[#1C194D]"
                      : "text-gray-600 hover:text-[#322CA7]"
                  }
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-gray-600 hover:text-[#322CA7]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="text-gray-600 hover:text-[#322CA7]"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="font-nunito font-light text-sm text-gray-600">
              Mostrando páginas {Math.min(startIndex + 1, types.length)} a {Math.min(endIndex, types.length)} de{" "}
              {types.length} total
            </p>
          </div>
        )}
      </div>

      {/* Modais */}
      <CreateTypeModal open={showCreateModal} onOpenChange={setShowCreateModal} onCreateTypes={handleCreateTypes} />

      <EditTypeModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        type={editingType}
        onEditType={handleEditType}
      />
    </div>
  )
}
