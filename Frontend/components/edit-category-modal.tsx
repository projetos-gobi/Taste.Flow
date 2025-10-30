"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: { id: number; name: string; categoryTypeId: number; categoryTypeName: string } | null
  onEditCategory: (id: number, name: string, categoryTypeId: number) => void
  categoryTypes: { id: number; name: string }[]
}

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
  onEditCategory,
  categoryTypes,
}: EditCategoryModalProps) {
  const [name, setName] = useState("")
  const [categoryTypeId, setCategoryTypeId] = useState("")

  useEffect(() => {
    if (category) {
      setName(category.name)
      setCategoryTypeId(category.categoryTypeId.toString())
    }
  }, [category])

  const handleConfirm = () => {
    if (category && name.trim() && categoryTypeId) {
      onEditCategory(category.id, name.trim(), Number(categoryTypeId))
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    if (category) {
      setName(category.name)
      setCategoryTypeId(category.categoryTypeId.toString())
    }
    onOpenChange(false)
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Edição de Categorias</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Edição das Categorias dentro do Sistema.</p>
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

            <div className="grid grid-cols-12 border-b border-gray-200">
              <div className="col-span-5 border-r border-gray-300 p-0">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                />
              </div>
              <div className="col-span-5 border-r border-gray-300 p-0">
                <Select value={categoryTypeId} onValueChange={setCategoryTypeId}>
                  <SelectTrigger className="w-full h-12 border-0 rounded-none bg-transparent font-nunito font-light text-gray-900 focus:ring-0 focus:border-0">
                    <SelectValue />
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
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  disabled
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
            Confirmar Edição
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
