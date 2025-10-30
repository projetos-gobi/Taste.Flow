"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

interface MerchandiseFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: {
    search: string
    category: string
    unit: string
    type: string
  }) => void
  categories: { id: number; name: string }[]
  units: { id: number; name: string }[]
  types: { id: number; name: string }[]
}

export function MerchandiseFilterModal({
  open,
  onOpenChange,
  onApplyFilters,
  categories,
  units,
  types,
}: MerchandiseFilterModalProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [unit, setUnit] = useState("")
  const [type, setType] = useState("")

  const handleConfirm = () => {
    onApplyFilters({
      search,
      category,
      unit,
      type,
    })
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Filtros Mercadorias</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Utilize os filtros abaixo para personalizar e facilitar sua busca.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="font-nunito font-medium text-gray-900">Barra de Pesquisa</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Digite o Nome da Mercadoria, Item ou Marca"
                className="pl-10 bg-white border-gray-300 font-nunito font-light"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white border-gray-300 font-nunito font-light">
                  <SelectValue placeholder="Selecione a Opção" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Unidade Técnica</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="bg-white border-gray-300 font-nunito font-light">
                  <SelectValue placeholder="Selecione a Opção" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.name}>
                      {unit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-white border-gray-300 font-nunito font-light">
                  <SelectValue placeholder="Selecione a Opção" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
