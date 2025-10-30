"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  categoryTypeId: string
}

interface CreateCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateCategories: (categories: { name: string; categoryTypeId: number }[]) => void
  categoryTypes: { id: number; name: string }[]
}

export function CreateCategoryModal({
  open,
  onOpenChange,
  onCreateCategories,
  categoryTypes,
}: CreateCategoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([{ id: "1", name: "", categoryTypeId: "" }])

  const addNewLine = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: "",
      categoryTypeId: "",
    }
    setCategories([...categories, newCategory])
  }

  const removeCategory = (id: string) => {
    if (categories.length > 1) {
      setCategories(categories.filter((category) => category.id !== id))
    }
  }

  const updateCategory = (id: string, field: keyof Category, value: string) => {
    setCategories(categories.map((category) => (category.id === id ? { ...category, [field]: value } : category)))
  }

  const handleConfirm = () => {
    const validCategories = categories.filter((category) => category.name.trim() && category.categoryTypeId)

    if (validCategories.length > 0) {
      const formattedCategories = validCategories.map((category) => ({
        name: category.name.trim(),
        categoryTypeId: Number(category.categoryTypeId),
      }))

      onCreateCategories(formattedCategories)
    }

    setCategories([{ id: "1", name: "", categoryTypeId: "" }])
    onOpenChange(false)
  }

  const handleCancel = () => {
    setCategories([{ id: "1", name: "", categoryTypeId: "" }])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Cadastro de Categorias</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Cadastro da informação Base de Categorias</p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-5 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Nome da Categoria
              </div>
              <div className="col-span-5 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Tipo da Categoria
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            {categories.map((category) => (
              <div key={category.id} className="grid grid-cols-12 border-b border-gray-200 last:border-b-0">
                <div className="col-span-5 border-r border-gray-300 p-0">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => updateCategory(category.id, "name", e.target.value)}
                    placeholder="Categoria"
                    className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                    style={{ border: "none", outline: "none", boxShadow: "none" }}
                  />
                </div>
                <div className="col-span-5 border-r border-gray-300 p-0">
                  <Select
                    value={category.categoryTypeId}
                    onValueChange={(value) => updateCategory(category.id, "categoryTypeId", value)}
                  >
                    <SelectTrigger className="w-full h-12 border-0 rounded-none bg-transparent font-nunito font-light text-gray-900 focus:ring-0 focus:border-0">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCategory(category.id)}
                    disabled={categories.length === 1}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={addNewLine}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Nova Linha
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
          >
            Confirmar Cadastro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
