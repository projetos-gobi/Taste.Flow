"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Search } from "lucide-react"
import { useStockEntryFilterModal } from "../hooks/useModal"
import { StockEntryFilter } from "../types/stock-entry"
import { currency, removeCurrencyMask } from "../app/utils/utils"

interface EntryControlFilterModalProps {
  isOpen: boolean
  onApplyFilters: (filters: StockEntryFilter) => void
}

export function EntryControlFilterModal({ isOpen, onApplyFilters }: EntryControlFilterModalProps) {
  const stockEntryFilterModal = useStockEntryFilterModal();
  
  const initialFilter: StockEntryFilter = {
    searchQuery: null,
    purchaseDate: null,
    expectedDeliveryDate: null,
    totalAmount: null
  };

  const [filter, setFilter] = useState<StockEntryFilter>(initialFilter);
  
  const handleChange = (field: keyof StockEntryFilter, value: string | boolean) => {
    setFilter((prev) => ({ ...prev, [field]: value }))
  };

  const handleApplyFilters = () => {
    const updatedFilter: StockEntryFilter = {
      ...filter,
      totalAmount: filter.totalAmount ? removeCurrencyMask(filter.totalAmount) : null
    };
    onApplyFilters(updatedFilter);
    handleClose();
  };

  const handleClear = () => {
    setFilter(initialFilter);           
    onApplyFilters(initialFilter);
  };

  const handleClose = () => {
    stockEntryFilterModal.openModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                value={filter.searchQuery ?? ""}
                onChange={(e) => handleChange("searchQuery", e.target.value)}
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
                  value={filter.purchaseDate ?? ""}
                onChange={(e) => handleChange("purchaseDate", e.target.value)}
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
                  value={filter.expectedDeliveryDate ?? ""}
                  onChange={(e) => handleChange("expectedDeliveryDate", e.target.value)}
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
                placeholder="R$ 0,00"
                value={filter.totalAmount ?? ""}
                onChange={(e) => handleChange("totalAmount", currency(e.target.value))}
                className="h-12 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-between pt-6 border-t">
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
              onClick={handleClose}
              className="bg-white text-gray-600 border-gray-300 hover:bg-gray-50 font-nunito font-medium"
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
