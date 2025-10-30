"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SupplierFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: {
    search: string
    category: string
    paymentMethod: string
  }) => void
  categories: { id: number; name: string }[]
}

export function SupplierFilterModal({ open, onOpenChange, onApplyFilters, categories }: SupplierFilterModalProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const paymentMethods = ["Pix e Transferência Bancária", "Cartão Crédito/Débito", "Dinheiro", "Boleto", "Cheque"]

  const handleApply = () => {
    onApplyFilters({
      search,
      category,
      paymentMethod,
    })
    onOpenChange(false)
  }

  const handleClear = () => {
    setSearch("")
    setCategory("")
    setPaymentMethod("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Filtros e Visualização</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Configure os filtros para refinar a busca de fornecedores.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="search" className="font-nunito font-medium text-gray-900">
              Barra de Pesquisa
            </Label>
            <Input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por Fornecedor ou CNPJ..."
              className="bg-white border-gray-300 font-nunito font-light"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Categoria de Venda</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white border-gray-300 font-nunito font-light">
                  <SelectValue placeholder="Selecione uma categoria" />
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
              <Label className="font-nunito font-medium text-gray-900">Pagamentos</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-white border-gray-300 font-nunito font-light">
                  <SelectValue placeholder="Selecione forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="bg-white text-gray-600 border-gray-300 hover:bg-gray-50 font-nunito font-medium"
          >
            Limpar Filtros
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
