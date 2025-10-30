"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Check } from "lucide-react"

interface AlternativeProduct {
  id: string
  name: string
  category: string
  subcategory?: string
}

interface AlternativeProductSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectProduct: (product: AlternativeProduct) => void
}

export function AlternativeProductSelectionModal({
  isOpen,
  onClose,
  onSelectProduct,
}: AlternativeProductSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<AlternativeProduct | null>(null)

  // Mock products data
  const products: AlternativeProduct[] = [
    { id: "1", name: "Torta de Maçã Natal", category: "Sobremesas", subcategory: "Natal" },
    { id: "2", name: "Bolo de Nozes Natal", category: "Sobremesas", subcategory: "Natal" },
    { id: "3", name: "Torta de Morango Natal", category: "Sobremesas", subcategory: "Natal" },
    { id: "4", name: "Torta de Chocolate Intenso Natal", category: "Sobremesas", subcategory: "Natal" },
    { id: "5", name: "Bolo de Milho Cremoso Natal", category: "Sobremesas", subcategory: "Natal" },
    { id: "6", name: "Torta de Maçã", category: "Sobremesas" },
    { id: "7", name: "Bolo de Nozes", category: "Sobremesas" },
    { id: "8", name: "Torta de Morango", category: "Sobremesas" },
    { id: "9", name: "Torta de Chocolate Intenso", category: "Sobremesas" },
    { id: "10", name: "Bolo de Milho Cremoso", category: "Sobremesas" },
  ]

  const filteredProducts = products.filter(
    (product) => searchTerm.length >= 3 && product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleConfirm = () => {
    if (selectedProduct) {
      onSelectProduct(selectedProduct)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Selecionar Produto Original</h2>
          <p className="text-sm text-gray-600 mb-6">Selecione o produto original para criar uma receita alternativa</p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="search" className="text-sm font-medium">
                Buscar Produto
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Digite pelo menos 3 caracteres para buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {searchTerm.length >= 3 && (
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                  <div className="p-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`p-3 rounded cursor-pointer transition-colors ${
                          selectedProduct?.id === product.id
                            ? "bg-[#322ca7]/10 border border-[#322ca7]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              {product.category} {product.subcategory && `• ${product.subcategory}`}
                            </p>
                          </div>
                          {selectedProduct?.id === product.id && <Check className="h-5 w-5 text-[#322ca7]" />}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">Nenhum produto encontrado</div>
                )}
              </div>
            )}

            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <p className="text-sm text-gray-500">Digite pelo menos 3 caracteres para buscar produtos</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} disabled={!selectedProduct} className="bg-[#322ca7] hover:bg-[#322ca7]/90">
              Confirmar Seleção
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
