"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import useSession from "../hooks/useSession"
import { useBrandCreateModal } from "../hooks/useModal"
import { checkBrandsExist, createBrandsRange } from "../services/brand"
import { toast } from "sonner"
import { LoadingOverlay } from "./ui/loading-overlay"

interface Brand {
  id: string
  name: string
}

interface CreateBrandModalProps {
  isOpen: boolean
}

export function CreateBrandModal({ isOpen }: CreateBrandModalProps) {
  const session = useSession();
  const brandCreateModal = useBrandCreateModal();

  const [isLoading, setIsLoading] = useState(false);

  const initialBrand: Brand = { id: crypto.randomUUID(), name: "" };  

  const [brands, setBrands] = useState<Brand[]>([initialBrand]);
  const [existingBrands, setExistingBrands] = useState<Brand[]>([]);
  
  const handleAddBrand = () => {
    const newItem: Brand = {
      id: crypto.randomUUID(),
      name: ""
    }

    setBrands([...brands, newItem]);
  };

  const handleDeleteBrand = (id: string) => {
    if (brands.length > 1) {
      setBrands(brands.filter((brand) => brand.id !== id));
    }
  };

  const handleBrandChange = (id: string, field: keyof Brand, value: string) => {
    setBrands(brands.map((brand) => (brand.id === id ? { ...brand, [field]: value } : brand)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (brands.some(i => !i.name.trim()) || new Set(brands.map(i => i.name.trim().toLowerCase())).size !== brands.length) {
      toast.warning("Existem itens vazios ou duplicados. Corrija antes de enviar.");
      return;
    }

    setIsLoading(true);
    session.setRefresh(false);

    try {
      const checkResponse = await checkBrandsExist({ brands: brands.map(i => i.name) });
      
      if (checkResponse.length > 0) {
        setExistingBrands(checkResponse);
        toast.warning("Algumas marcas já existem. Corrija-os antes de enviar.");
        return;
      }

      const response = await createBrandsRange({ brands: brands });

      if(response.created){
        toast.success("Marcas criadas com sucesso!");
        handleClose();
      }else{
        toast.error("Falha ao criar as marcas. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao salvar marcas:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setBrands([initialBrand]);
    brandCreateModal.openModal(false);
  };

  const duplicatedItems = brands.map(i => i.name.trim().toLowerCase()).filter((name, index, arr) => arr.indexOf(name) !== index);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { handleClose() } }}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Salvando..." />}
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
            {brands.map((brand, index) => {
              const isInvalid = duplicatedItems.includes(brand.name.trim().toLowerCase()) || existingBrands.some(existing => existing.name.toLowerCase() === brand.name.trim().toLowerCase());

              return(
                <div key={brand.id} className={`grid grid-cols-12 border-b border-gray-200 last:border-b-0 ${isInvalid ? "bg-red-100" : ""}`} >
                  <div className="col-span-10 border-r border-gray-300 p-0">
                    <input
                      type="text"
                      value={brand.name}
                      onChange={(e) => handleBrandChange(brand.id, "name", e.target.value)}
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
                      onClick={() => handleDeleteBrand(brand.id)}
                      disabled={brands.length === 1}
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Botão Adicionar Nova Linha */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleAddBrand}
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
            onClick={handleClose}
            className="bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
          >
            Confirmar Cadastro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
