"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Triangle, Edit, Trash2, Plus } from "lucide-react"
import { CreateSubcategoryModal } from "@/components/create-subcategory-modal"
import { EditSubcategoryModal } from "@/components/edit-subcategory-modal"

const initialSubcategories = [
  { id: 1, name: "Orgânico" },
  { id: 2, name: "Industrializado" },
  { id: 3, name: "Natal" },
  { id: 4, name: "Gourmet" },
  { id: 5, name: "Fresco" },
]

export default function SubcategoriasPage() {
  const [subcategories, setSubcategories] = useState(initialSubcategories)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSubcategory, setEditingSubcategory] = useState<{ id: number; name: string } | null>(null)

  const handleCreateSubcategories = (newSubcategories: { name: string }[]) => {
    const subcategoriesToAdd = newSubcategories.map((subcategory) => ({
      id: Date.now() + Math.random(),
      name: subcategory.name,
    }))

    setSubcategories([...subcategories, ...subcategoriesToAdd])
    setShowCreateModal(false)
  }

  const handleEditSubcategory = (id: number, name: string) => {
    setSubcategories(
      subcategories.map((subcategory) => (subcategory.id === id ? { ...subcategory, name } : subcategory)),
    )
    setShowEditModal(false)
    setEditingSubcategory(null)
  }

  const handleDeleteSubcategory = (id: number) => {
    setSubcategories(subcategories.filter((subcategory) => subcategory.id !== id))
  }

  const openEditModal = (subcategory: { id: number; name: string }) => {
    setEditingSubcategory(subcategory)
    setShowEditModal(true)
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
            onClick={() => setShowCreateModal(true)}
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
                {subcategories.map((subcategory) => (
                  <tr key={subcategory.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{subcategory.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(subcategory)}
                          className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubcategory(subcategory.id)}
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

          {subcategories.length === 0 && (
            <div className="text-center py-12">
              <Triangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhuma sub-categoria cadastrada</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">
                Comece cadastrando sua primeira sub-categoria.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Sub-Categoria
              </Button>
            </div>
          )}
        </div>
      </div>

      <CreateSubcategoryModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateSubcategories={handleCreateSubcategories}
      />

      <EditSubcategoryModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        subcategory={editingSubcategory}
        onEditSubcategory={handleEditSubcategory}
      />
    </div>
  )
}
