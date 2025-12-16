"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Search } from "lucide-react"

interface CreateProductModalProps {
  isOpen: boolean
  onClose: () => void
  productType: "final" | "intermediate"
  existingProducts: any[]
  onConfirm: (type: "original" | "alternative", originalProduct?: any) => void
}

export function CreateProductModal({
  isOpen,
  onClose,
  productType,
  existingProducts,
  onConfirm,
}: CreateProductModalProps) {
  const [selectedType, setSelectedType] = useState<"original" | "alternative">("original")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Filtrar produtos para autosugestão (mínimo 3 caracteres)
  const filteredProducts = searchTerm.length >= 3 ? existingProducts.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase())) : [];

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
    setSearchTerm(product.name)
    setShowSuggestions(false)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setSelectedProduct(null)
    setShowSuggestions(value.length >= 3)
  }

  const handleConfirm = () => {
    if (selectedType === "alternative" && !selectedProduct) {
      alert("Por favor, selecione um produto original para criar a alternativa.")
      return
    }

    onConfirm(selectedType, selectedProduct)
    handleCancel()
  }

  const handleCancel = () => {
    setSelectedType("original")
    setSearchTerm("")
    setSelectedProduct(null)
    setShowSuggestions(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[500px] bg-[#f8f9ff] border-0">
        <DialogHeader className="pb-8 pt-4">
          <DialogTitle className="font-bebas text-2xl text-[#1C194D] uppercase text-center tracking-wide">
            Qual tipo de ficha técnica você deseja cadastrar?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Botões de seleção */}
          <div className="flex items-center justify-center gap-6">
            <Button
              variant={selectedType === "original" ? "default" : "outline"}
              onClick={() => setSelectedType("original")}
              className={`px-8 py-3 font-nunito text-base ${
                selectedType === "original"
                  ? "bg-[#322ca7] hover:bg-[#322ca7]/90 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
              }`}
            >
              Original
            </Button>
            <Button
              variant={selectedType === "alternative" ? "default" : "outline"}
              onClick={() => setSelectedType("alternative")}
              className={`px-8 py-3 font-nunito text-base ${
                selectedType === "alternative"
                  ? "bg-[#322ca7] hover:bg-[#322ca7]/90 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
              }`}
            >
              Alternativa
            </Button>
          </div>

          {/* Campo de seleção de produto (apenas para alternativo) */}
          {selectedType === "alternative" && (
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Selecione a Opção"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setShowSuggestions(searchTerm.length >= 3)}
                  className="pl-10 font-nunito bg-white"
                />
              </div>

              {/* Lista de sugestões */}
              {showSuggestions && filteredProducts.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 font-nunito text-gray-900 border-b border-gray-100 last:border-b-0"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Botão Cancelar - sempre visível no canto inferior direito */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleCancel}
              className="px-8 py-2 bg-[#322ca7] hover:bg-[#322ca7]/90 text-white font-nunito"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
