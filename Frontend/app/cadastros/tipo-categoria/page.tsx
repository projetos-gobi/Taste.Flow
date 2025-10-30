"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Triangle, Edit, Trash2, Plus } from "lucide-react"
import { CreateCategoryTypeModal } from "@/components/create-category-type-modal"
import { EditCategoryTypeModal } from "@/components/edit-category-type-modal"

const initialCategoryTypes = [
  { id: 1, name: "Insumo" },
  { id: 2, name: "Matéria Prima" },
]

export default function TipoCategoriaPage() {
  const [categoryTypes, setCategoryTypes] = useState(initialCategoryTypes)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCategoryType, setEditingCategoryType] = useState<{ id: number; name: string } | null>(null)

  const handleCreateCategoryTypes = (newCategoryTypes: { name: string }[]) => {
    const categoryTypesToAdd = newCategoryTypes.map((categoryType) => ({
      id: Date.now() + Math.random(),
      name: categoryType.name,
    }))

    setCategoryTypes([...categoryTypes, ...categoryTypesToAdd])
    setShowCreateModal(false)
  }

  const handleEditCategoryType = (id: number, name: string) => {
    setCategoryTypes(
      categoryTypes.map((categoryType) => (categoryType.id === id ? { ...categoryType, name } : categoryType)),
    )
    setShowEditModal(false)
    setEditingCategoryType(null)
  }

  const handleDeleteCategoryType = (id: number) => {
    setCategoryTypes(categoryTypes.filter((categoryType) => categoryType.id !== id))
  }

  const openEditModal = (categoryType: { id: number; name: string }) => {
    setEditingCategoryType(categoryType)
    setShowEditModal(true)
  }

  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Tipos de Categoria</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
          >
            <Triangle className="h-4 w-4" />
            Cadastrar Tipo de Categoria
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900 w-full">
                    Tipo de Categoria
                  </th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categoryTypes.map((categoryType) => (
                  <tr key={categoryType.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{categoryType.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(categoryType)}
                          className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategoryType(categoryType.id)}
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

          {categoryTypes.length === 0 && (
            <div className="text-center py-12">
              <Triangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">
                Nenhum tipo de categoria cadastrado
              </h3>
              <p className="font-nunito font-light text-gray-600 mb-4">
                Comece cadastrando seu primeiro tipo de categoria.
              </p>
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
      </div>

      <CreateCategoryTypeModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateCategoryTypes={handleCreateCategoryTypes}
      />

      <EditCategoryTypeModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        categoryType={editingCategoryType}
        onEditCategoryType={handleEditCategoryType}
      />
    </div>
  )
}
