"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Search, Check } from "lucide-react"
import { useProductAlternativeSelectionModal, useProductModal, useProductTypeSelectionModal } from "../hooks/useModal"
import useSession from "../hooks/useSession"
import { getAllProductsBySearchTerm } from "../services/product"
import { GetAllProductsBySearchTermResponse } from "../types/product"

interface AlternativeProductSelectionModalProps {
  isOpen: boolean;
}

//AlternativeProductSelectionModal

export function ProductAlternativeSelectionModal({ isOpen }: AlternativeProductSelectionModalProps) {
  const session = useSession();
  const productModal = useProductModal();
  const productTypeSelectionModal = useProductTypeSelectionModal();  
  const productAlternativeSelectionModal = useProductAlternativeSelectionModal();

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productSelected, setProductSelected] = useState<GetAllProductsBySearchTermResponse | null>(null);
  const [products, setProducts] = useState<GetAllProductsBySearchTermResponse[]>([]);
  
   const fetchProducts = async (term: string) => {
    try {
      setIsLoading(true);

      const productsResponse = await getAllProductsBySearchTerm({searchTerm: searchTerm});
      
      setProducts(productsResponse);
    } catch (err: any) {
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.length < 3) {
      setProducts([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSubmit = () => {
    setSearchTerm("");
    productModal.openModal(true, 'create', 'alternative', productSelected?.id);
    handleClose();
    productTypeSelectionModal.openModal(false);
  };

  const handleClose = () => {
    productAlternativeSelectionModal.openModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <div className="p-6">
          <DialogTitle>Selecionar Produto Original</DialogTitle>
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
                {products.length > 0 ? (
                  <div className="p-2">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setProductSelected(product)}
                        className={`p-3 rounded cursor-pointer transition-colors ${
                          productSelected?.id === product.id
                            ? "bg-[#322ca7]/10 border border-[#322ca7]"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-600">
                              {product.categoryName} {product.subCategoryName && `• ${product.subCategoryName}`}
                            </p>
                          </div>
                          {productSelected?.id === product.id && <Check className="h-5 w-5 text-[#322ca7]" />}
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
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!productSelected} className="bg-[#322ca7] hover:bg-[#322ca7]/90">
              Confirmar Seleção
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
