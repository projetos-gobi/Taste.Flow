"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Triangle, Edit, Trash2, Plus } from "lucide-react"
import { CreateCategoryModal } from "@/components/create-category-modal"
import { EditCategoryModal } from "@/components/edit-category-modal"

const initialCategoryTypes = [
  { id: 1, name: "Insumo" },
  { id: 2, name: "Matéria Prima" },
]

const initialCategories = [
  { id: 1, name: "Geral", categoryTypeId: 2, categoryTypeName: "Matéria Prima" },
  { id: 2, name: "Bebidas", categoryTypeId: 2, categoryTypeName: "Matéria Prima" },
  { id: 3, name: "Secos", categoryTypeId: 2, categoryTypeName: "Matéria Prima" },
  { id: 4, name: "Proteínas", categoryTypeId: 2, categoryTypeName: "Matéria Prima" },
  { id: 5, name: "Perecíveis", categoryTypeId: 2, categoryTypeName: "Matéria Prima" },
  { id: 6, name: "Hortifruti", categoryTypeId: 2, categoryTypeName: "Matéria Prima" },
]

export default function CategoriasPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [categoryTypes] = useState(initialCategoryTypes)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{
    id: number
    name: string
    categoryTypeId: number
    categoryTypeName: string
  } | null>(null)

  const handleCreateCategories = (newCategories: { name: string; categoryTypeId: number }[]) => {
    const categoriesToAdd = newCategories.map((category) => {
      const categoryType = categoryTypes.find((type) => type.id === category.categoryTypeId)
      return {
        id: Date.now() + Math.random(),
        name: category.name,
        categoryTypeId: category.categoryTypeId,
        categoryTypeName: categoryType?.name || "",
      }
    })

    setCategories([...categories, ...categoriesToAdd])
    setShowCreateModal(false)
  }

  const handleEditCategory = (id: number, name: string, categoryTypeId: number) => {
    const categoryType = categoryTypes.find((type) => type.id === categoryTypeId)
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, name, categoryTypeId, categoryTypeName: categoryType?.name || "" }
          : category,
      ),
    )
    setShowEditModal(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id))
  }

  const openEditModal = (category: { id: number; name: string; categoryTypeId: number; categoryTypeName: string }) => {
    setEditingCategory(category)
    setShowEditModal(true)
  }

  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Categorias</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
          >
            <Triangle className="h-4 w-4" />
            Cadastrar Categorias
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Tipo da Categoria</th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{category.name}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{category.categoryTypeName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(category)}
                          className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
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

          {categories.length === 0 && (
            <div className="text-center py-12">
              <Triangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhuma categoria cadastrada</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">Comece cadastrando sua primeira categoria.</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Categoria
              </Button>
            </div>
          )}
        </div>
      </div>

      <CreateCategoryModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateCategories={handleCreateCategories}
        categoryTypes={categoryTypes}
      />

      <EditCategoryModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        category={editingCategory}
        onEditCategory={handleEditCategory}
        categoryTypes={categoryTypes}
      />
    </div>
  )
}
