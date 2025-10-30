"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ProductsFilterModalProps {
  isOpen: boolean
  onClose: () => void
  productType: "final" | "intermediate"
}

interface FilterState {
  search: string
  category: string
  subCategory: string
  priceRange: {
    min: string
    max: string
  }
  marginRange: {
    min: string
    max: string
  }
  status: string[]
  hasAlternatives: boolean | null
}

export function ProductsFilterModal({ isOpen, onClose, productType }: ProductsFilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "",
    subCategory: "",
    priceRange: { min: "", max: "" },
    marginRange: { min: "", max: "" },
    status: [],
    hasAlternatives: null,
  })

  const categories = ["Sobremesas", "Pães", "Salgados", "Bebidas"]
  const subCategories = ["Natal", "Tradicionais", "Especiais", "Artesanais"]
  const statusOptions = ["Ativo", "Inativo", "Em Desenvolvimento"]

  const handleApplyFilters = () => {
    console.log("Aplicando filtros:", filters)
    onClose()
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      category: "",
      subCategory: "",
      priceRange: { min: "", max: "" },
      marginRange: { min: "", max: "" },
      status: [],
      hasAlternatives: null,
    })
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      status: checked ? [...prev.status, status] : prev.status.filter((s) => s !== status),
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bebas text-xl">
            Filtros - {productType === "final" ? "Produtos Finais" : "Produtos Intermediários"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search */}
          <div>
            <Label htmlFor="search" className="font-nunito font-medium">
              Buscar por nome
            </Label>
            <Input
              id="search"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Digite o nome do produto..."
              className="font-nunito"
            />
          </div>

          {/* Category and Subcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-nunito font-medium">Categoria</Label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="font-nunito">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="font-nunito">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="font-nunito font-medium">Sub-categoria</Label>
              <Select
                value={filters.subCategory}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, subCategory: value }))}
              >
                <SelectTrigger className="font-nunito">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map((subCategory) => (
                    <SelectItem key={subCategory} value={subCategory} className="font-nunito">
                      {subCategory}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price Range */}
          {productType === "final" && (
            <div>
              <Label className="font-nunito font-medium">Faixa de Preço</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={filters.priceRange.min}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, min: e.target.value },
                    }))
                  }
                  placeholder="Preço mínimo"
                  className="font-nunito"
                />
                <Input
                  value={filters.priceRange.max}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: e.target.value },
                    }))
                  }
                  placeholder="Preço máximo"
                  className="font-nunito"
                />
              </div>
            </div>
          )}

          {/* Margin Range */}
          {productType === "final" && (
            <div>
              <Label className="font-nunito font-medium">Faixa de Margem (%)</Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  value={filters.marginRange.min}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      marginRange: { ...prev.marginRange, min: e.target.value },
                    }))
                  }
                  placeholder="Margem mínima"
                  className="font-nunito"
                />
                <Input
                  value={filters.marginRange.max}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      marginRange: { ...prev.marginRange, max: e.target.value },
                    }))
                  }
                  placeholder="Margem máxima"
                  className="font-nunito"
                />
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <Label className="font-nunito font-medium">Status</Label>
            <div className="space-y-2 mt-2">
              {statusOptions.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={status}
                    checked={filters.status.includes(status)}
                    onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
                  />
                  <Label htmlFor={status} className="font-nunito text-sm">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Has Alternatives */}
          {productType === "final" && (
            <div>
              <Label className="font-nunito font-medium">Fichas Alternativas</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAlternatives"
                    checked={filters.hasAlternatives === true}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasAlternatives: checked ? true : null,
                      }))
                    }
                  />
                  <Label htmlFor="hasAlternatives" className="font-nunito text-sm">
                    Possui fichas alternativas
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noAlternatives"
                    checked={filters.hasAlternatives === false}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasAlternatives: checked ? false : null,
                      }))
                    }
                  />
                  <Label htmlFor="noAlternatives" className="font-nunito text-sm">
                    Não possui fichas alternativas
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleClearFilters} className="font-nunito bg-transparent">
            Limpar Filtros
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose} className="font-nunito bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleApplyFilters} className="bg-[#322ca7] hover:bg-[#322ca7]/90 font-nunito">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
