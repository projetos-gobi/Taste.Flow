"use client"

import { useState, useEffect } from "react"
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

interface Merchandise {
  id: number
  name: string
  item: string
  brand: string
  type: string
  category: string
  unit: string
  itemId: number
  brandId: number
  typeId: number
  categoryId: number
  unitId: number
}

interface EditMerchandiseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  merchandise: Merchandise | null
  onEditMerchandise: (
    id: number,
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

export function EditMerchandiseModal({
  open,
  onOpenChange,
  merchandise,
  onEditMerchandise,
  items,
  brands,
  types,
  categories,
  units,
}: EditMerchandiseModalProps) {
  const [merchandiseItems, setMerchandiseItems] = useState<MerchandiseItem[]>([
    { id: "1", itemId: "0", brandId: "0", typeId: "0", categoryId: "0", unitId: "0" },
  ])

  useEffect(() => {
    if (merchandise) {
      setMerchandiseItems([
        {
          id: "1",
          itemId: merchandise.itemId.toString(),
          brandId: merchandise.brandId.toString(),
          typeId: merchandise.typeId.toString(),
          categoryId: merchandise.categoryId.toString(),
          unitId: merchandise.unitId.toString(),
        },
      ])
    }
  }, [merchandise])

  const addNewLine = () => {
    const newItem: MerchandiseItem = {
      id: Date.now().toString(),
      itemId: "0",
      brandId: "0",
      typeId: "0",
      categoryId: "0",
      unitId: "0",
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
    if (!merchandise) return

    const validItems = merchandiseItems.filter((item) => item.itemId && item.brandId && item.categoryId && item.unitId)

    if (validItems.length > 0) {
      const formattedItems = validItems.map((item) => ({
        itemId: Number(item.itemId),
        brandId: Number(item.brandId),
        typeId: item.typeId ? Number(item.typeId) : 0,
        categoryId: Number(item.categoryId),
        unitId: Number(item.unitId),
      }))

      onEditMerchandise(merchandise.id, formattedItems)
    }

    onOpenChange(false)
  }

  const handleCancel = () => {
    if (merchandise) {
      setMerchandiseItems([
        {
          id: "1",
          itemId: merchandise.itemId.toString(),
          brandId: merchandise.brandId.toString(),
          typeId: merchandise.typeId.toString(),
          categoryId: merchandise.categoryId.toString(),
          unitId: merchandise.unitId.toString(),
        },
      ])
    }
    onOpenChange(false)
  }

  if (!merchandise) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-7xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Editar Mercadoria</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            A edição acontece a partir dos dados Cadastrados.
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
                      <SelectValue />
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
                      <SelectValue />
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
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">-</SelectItem>
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
                      <SelectValue />
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
                      <SelectValue />
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
            Confirmar Edição
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
