"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface MerchandiseItem {
  id: string
  itemId: string
  brandId: string
  typeId: string
  categoryId: string
  unitId: string
}

interface CreateMerchandiseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateMerchandise: (
    items: {
      itemId: number
      brandId: number
      typeId: number
      categoryId: number
      unitId: number
    }[],
  ) => void
  items: { id: number; name: string }[]
  brands: { id: number; name: string }[]
  types: { id: number; name: string }[]
  categories: { id: number; name: string }[]
  units: { id: number; name: string }[]
}

export function CreateMerchandiseModal({
  open,
  onOpenChange,
  onCreateMerchandise,
  items,
  brands,
  types,
  categories,
  units,
}: CreateMerchandiseModalProps) {
  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>([
    { id: "1", itemId: "", brandId: "", typeId: "", categoryId: "", unitId: "" },
  ])

  const addNewLine = () => {
    const newItem: MerchandiseItem = {
      id: Date.now().toString(),
      itemId: "",
      brandId: "",
      typeId: "",
      categoryId: "",
      unitId: "",
    }
    setMerchandiseItems([...merchandiseItems, newItem])
  }

  const removeItem = (id: string) => {
    if (merchandiseItems.length > 1) {
      setMerchandiseItems(merchandiseItems.filter((item) => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof MerchandiseItem, value: string) => {
    setMerchandiseItems(merchandiseItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleConfirm = () => {
    const validItems = merchandiseItems.filter((item) => item.itemId && item.brandId && item.categoryId && item.unitId)

    if (validItems.length > 0) {
      const formattedItems = validItems.map((item) => ({
        itemId: Number(item.itemId),
        brandId: Number(item.brandId),
        typeId: item.typeId ? Number(item.typeId) : 0,
        categoryId: Number(item.categoryId),
        unitId: Number(item.unitId),
      }))

      onCreateMerchandise(formattedItems)
    }

    setMerchandiseItems([{ id: "1", itemId: "", brandId: "", typeId: "", categoryId: "", unitId: "" }])
    onOpenChange(false)
  }

  const handleCancel = () => {
    setMerchandiseItems([{ id: "1", itemId: "", brandId: "", typeId: "", categoryId: "", unitId: "" }])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Cadastro de Mercadorias</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            O cadastro acontece a partir dos dados nos Cadastro de Base.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Item
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Marca
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Tipo
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Categoria
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Unidade Técnica
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            {merchandiseItems.map((item) => (
              <div key={item.id} className="grid grid-cols-12 border-b border-gray-200 last:border-b-0">
                <div className="col-span-2 border-r border-gray-300 p-0">
                  <Select value={item.itemId} onValueChange={(value) => updateItem(item.id, "itemId", value)}>
                    <SelectTrigger className="w-full h-12 border-0 rounded-none bg-transparent font-nunito font-light text-gray-900 focus:ring-0 focus:border-0">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((itemOption) => (
                        <SelectItem key={itemOption.id} value={itemOption.id.toString()}>
                          {itemOption.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 border-r border-gray-300 p-0">
                  <Select value={item.brandId} onValueChange={(value) => updateItem(item.id, "brandId", value)}>
                    <SelectTrigger className="w-full h-12 border-0 rounded-none bg-transparent font-nunito font-light text-gray-900 focus:ring-0 focus:border-0">
                      <SelectValue placeholder="Selecione uma opção" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 border-r border-gray-300 p-0">
                  <Select value={item.typeId} onValueChange={(value) => updateItem(item.id, "typeId", value)}>
                    <SelectTrigger className="w-full h-12 border-0 rounded-none bg-transparent font-nunito font-light text-gray-900 focus:ring-0 focus:border-0">
                      <SelectValue placeholder="Selecione uma op..." />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 border-r border-gray-300 p-0">
                  <Select value={item.categoryId} onValueChange={(value) => updateItem(item.id, "categoryId", value)}>
                    <SelectTrigger className="w-full h-12 border-0 rounded-none bg-transparent font-nunito font-light text-gray-900 focus:ring-0 focus:border-0">
                      <SelectValue placeholder="Selecione uma op..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 border-r border-gray-300 p-0">
                  <Select value={item.unitId} onValueChange={(value) => updateItem(item.id, "unitId", value)}>
                    <SelectTrigger className="w-full h-12 border-0 rounded-none bg-transparent font-nunito font-light text-gray-900 focus:ring-0 focus:border-0">
                      <SelectValue placeholder="Selecione uma o..." />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id.toString()}>
                          {unit.name}
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
                    onClick={() => removeItem(item.id)}
                    disabled={merchandiseItems.length === 1}
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
