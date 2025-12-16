"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"
import useSession from "../hooks/useSession"
import { useUnitCreateModal } from "../hooks/useModal"
import { toast } from "sonner"
import { checkUnitsExist, createUnitRange } from "../services/unit"
import { LoadingOverlay } from "./ui/loading-overlay"

interface Unit {
  id: string
  name: string
  value: number
}

interface CreateUnitModalProps {
  open: boolean
}

export function CreateUnitModal({ open }: CreateUnitModalProps) {
  const session = useSession();
  const unitCreateModal = useUnitCreateModal();

  const [isLoading, setIsLoading] = useState(false);

  const initialUnit: Unit = { id: crypto.randomUUID(), name: "", value: 0 };  
  const [units, setUnits] = useState<Unit[]>([initialUnit]);
  const [existingUnits, setExistingUnits] = useState<Unit[]>([]);
  

  const handleAddUnit = () => {
    const newUnit: Unit = {
      id: crypto.randomUUID(),
      name: "",
      value: 0,
    }
    setUnits([...units, newUnit]);
  }

  const handleDeleteUnit = (id: string) => {
    if (units.length > 1) {
      setUnits(units.filter((unit) => unit.id !== id));
    }
  }

  const handleUnitChange = (id: string, field: keyof Unit, value: string) => {
    setUnits(units.map((unit) => (unit.id === id ? { ...unit, [field]: value } : unit)));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (units.some(i => !i.name.trim()) || new Set(units.map(i => i.name.trim().toLowerCase())).size !== units.length) {
      toast.warning("Existem itens vazios ou duplicados. Corrija antes de enviar.");
      return;
    }

    setIsLoading(true);

    session.setRefresh(false);

    try {
      const checkResponse = await checkUnitsExist({ units: units.map(i => i.name) });
      
      if (checkResponse.length > 0) {
        setExistingUnits(checkResponse);
        toast.warning("Algumas unidades já existem. Corrija-os antes de enviar.");
        return;
      }

      const response = await createUnitRange({ units: units });

      if(response.created){
        toast.success("Unidades criadas com sucesso!");
        handleClose();
      }else{
        toast.error("Falha ao criar as unidades. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao salvar unidades:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setUnits([initialUnit]);
    unitCreateModal.openModal(false);
  };

  const duplicatedItems = units.map(i => i.name.trim().toLowerCase()).filter((name, index, arr) => arr.indexOf(name) !== index);

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!isLoading) {handleClose()}}}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Salvando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">
            Cadastro de Unidade de Medida
          </DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Cadastro da informação Base de Unidades de Medidas.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabela de Unidades */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Header da tabela */}
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-5 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Nome da Unidade
              </div>
              <div className="col-span-5 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Valor para o Sistema
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            {/* Linhas da tabela */}
            {units.map((unit, index) => {
              const isInvalid = duplicatedItems.includes(unit.name.trim().toLowerCase()) || existingUnits.some(existing => existing.name.toLowerCase() === unit.name.trim().toLowerCase());

              return(
                <div key={unit.id} className={`grid grid-cols-12 border-b border-gray-200 last:border-b-0 ${isInvalid ? "bg-red-100" : ""}`} >
                  <div className="col-span-5 border-r border-gray-300 p-0">
                    <input
                      type="text"
                      value={unit.name}
                      onChange={(e) => handleUnitChange(unit.id, "name", e.target.value)}
                      placeholder="Digite o nome da unidade"
                      className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                      style={{ border: "none", outline: "none", boxShadow: "none" }}
                    />
                  </div>
                  <div className="col-span-5 border-r border-gray-300 p-0">
                    <input
                      type="number"
                      step="0.001"
                      value={unit.value}
                      onChange={(e) => handleUnitChange(unit.id, "value", e.target.value)}
                      placeholder="Digite o valor (ex: 1, 0.1, 0.001)"
                      className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                      style={{ border: "none", outline: "none", boxShadow: "none" }}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUnit(unit.id)}
                      disabled={units.length === 1}
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
              onClick={handleAddUnit}
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
            {isLoading ? "Salvando..." : "Confirmar Cadastro"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
