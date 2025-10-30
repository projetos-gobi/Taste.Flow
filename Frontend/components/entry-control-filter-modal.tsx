"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

interface EntryControlFilterModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: any) => void
}

export function EntryControlFilterModal({ isOpen, onClose, onApplyFilters }: EntryControlFilterModalProps) {
  const [filters, setFilters] = useState({
    search: "",
    purchaseDate: "",
    expectedReceiptDate: "",
    purchaseValue: "",
  })

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      purchaseDate: "",
      expectedReceiptDate: "",
      purchaseValue: "",
    }
    setFilters(clearedFilters)
    onApplyFilters(clearedFilters)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">Filtros Controle de Entradas</DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Utilize os filtros abaixo para personalizar e facilitar sua busca.
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Barra de Pesquisa */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium text-gray-900">
              Barra de Pesquisa
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Digite a Mercadoria, Nº NF, Fornecedor."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 h-12 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Campos de Data e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate" className="text-sm font-medium text-gray-900">
                Data de Compra
              </Label>
              <div className="relative">
                <Input
                  id="purchaseDate"
                  type="date"
                  value={filters.purchaseDate}
                  onChange={(e) => setFilters({ ...filters, purchaseDate: e.target.value })}
                  className="h-12 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedReceiptDate" className="text-sm font-medium text-gray-900">
                Data Prevista de Recebimento
              </Label>
              <div className="relative">
                <Input
                  id="expectedReceiptDate"
                  type="date"
                  value={filters.expectedReceiptDate}
                  onChange={(e) => setFilters({ ...filters, expectedReceiptDate: e.target.value })}
                  className="h-12 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseValue" className="text-sm font-medium text-gray-900">
                Valor da Compra
              </Label>
              <Input
                id="purchaseValue"
                placeholder="R$000,00"
                value={filters.purchaseValue}
                onChange={(e) => setFilters({ ...filters, purchaseValue: e.target.value })}
                className="h-12 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600"
          >
            Limpar Filtros
          </Button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600"
            >
              Cancelar
            </Button>
            <Button onClick={handleApplyFilters} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700">
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
