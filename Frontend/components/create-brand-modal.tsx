"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"

interface Brand {
  id: string
  name: string
}

interface CreateBrandModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateBrands: (brands: { name: string }[]) => void
}

export function CreateBrandModal({ open, onOpenChange, onCreateBrands }: CreateBrandModalProps) {
  const [brands, setBrands] = useState<Brand[]>([{ id: "1", name: "" }])

  const addNewLine = () => {
    const newBrand: Brand = {
      id: Date.now().toString(),
      name: "",
    }
    setBrands([...brands, newBrand])
  }

  const removeBrand = (id: string) => {
    if (brands.length > 1) {
      setBrands(brands.filter((brand) => brand.id !== id))
    }
  }

  const updateBrand = (id: string, value: string) => {
    setBrands(brands.map((brand) => (brand.id === id ? { ...brand, name: value } : brand)))
  }

  const handleConfirm = () => {
    // Validar e criar marcas
    const validBrands = brands.filter((brand) => brand.name.trim())

    if (validBrands.length > 0) {
      // Enviar todas as marcas válidas de uma vez
      const formattedBrands = validBrands.map((brand) => ({
        name: brand.name.trim(),
      }))

      onCreateBrands(formattedBrands)
    }

    // Resetar formulário
    setBrands([{ id: "1", name: "" }])
    onOpenChange(false)
  }

  const handleCancel = () => {
    setBrands([{ id: "1", name: "" }])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Cadastro de Marca</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Cadastro da informação Base de Marca.</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabela de Marcas */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Header da tabela */}
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-10 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Marca
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            {/* Linhas da tabela */}
            {brands.map((brand, index) => (
              <div key={brand.id} className="grid grid-cols-12 border-b border-gray-200 last:border-b-0">
                <div className="col-span-10 border-r border-gray-300 p-0">
                  <input
                    type="text"
                    value={brand.name}
                    onChange={(e) => updateBrand(brand.id, e.target.value)}
                    placeholder="Heineken..."
                    className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                    style={{ border: "none", outline: "none", boxShadow: "none" }}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBrand(brand.id)}
                    disabled={brands.length === 1}
                    className="text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Botão Adicionar Nova Linha */}
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

        {/* Botões de Ação */}
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
