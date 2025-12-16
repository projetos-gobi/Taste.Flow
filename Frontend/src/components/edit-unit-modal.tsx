"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Trash2 } from "lucide-react"
import useSession from "../hooks/useSession"
import { useUnitEditModal } from "../hooks/useModal"
import { checkUnitsExist, getUnitById, updateUnit } from "../services/unit"
import { toast } from "sonner"
import { LoadingOverlay } from "./ui/loading-overlay"

interface EditUnitModalProps {
  isOpen: boolean;
}

interface Unit {
  id: string; 
  enterpriseId: string;
  name: string;
  value: number;
}

export function EditUnitModal({ isOpen }: EditUnitModalProps) {
  const session = useSession();
  const unitEditModal = useUnitEditModal();
  
  const initialUnit: Unit = {
    id: "",
    enterpriseId: "", 
    name: "",
    value: 0
  };

  const [isLoading, setIsLoading] = useState(false);
  const [unit, setUnit] = useState<Unit>(initialUnit);
  const [isExisting, setIsExisting] = useState(false);
  
  const fetchUnit = async () => {
    try {
      setIsLoading(true);

      const data = await getUnitById({ id: unitEditModal.unitId });

      setUnit({
        id: data.id,
        enterpriseId: data.enterpriseId,
        name: data.name,
        value: data.value
      });
    } catch (error) {
      console.error("Erro ao buscar unidade:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchUnit();
    }
  }, [isOpen]);
  

  const handleChange = (field: keyof Unit, value: string | boolean) => {
    setUnit((prev) => ({ ...prev, [field]: value }))
  };

  const resetForm = () => {
    setUnit(initialUnit);
  };

  const handleClose = () => {
    resetForm();
    unitEditModal.openModal(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true)
    session.setRefresh(false);

    try {
      const checkResponse = await checkUnitsExist({ units: [unit.name] });
      
      const existing = checkResponse.find((existing: any) => existing.id !== unit.id);

      setIsExisting(existing);

      if (existing) {
        toast.warning(`A unidade "${unit.name}" já existe.`);
        return;
      }

      const response = await updateUnit(unit);

      if(response.updated){
        handleClose();
        toast.success("Unidade atualizada com sucesso!");
      }else{
        toast.error("Falha ao atualizar uma unidade. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao atualizar uma unidade:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { handleClose() } }}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Carregando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">
            Edição de Unidade de Medida
          </DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Edição da informação Base de Unidades de Medidas.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabela de Edição */}
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

            {/* Linha de edição */}
            <div className={`grid grid-cols-12 border-b border-gray-200 ${isExisting ? "bg-red-100" : ""}`} >
              <div className="col-span-5 border-r border-gray-300 p-0">
                <input
                  type="text"
                  value={unit.name}
                  onChange={(e) => handleChange("name",e.target.value)}
                  className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                />
              </div>
              <div className="col-span-5 border-r border-gray-300 p-0">
                <input
                  type="number"
                  step="0.001"
                  value={unit.value}
                  onChange={(e) => handleChange("value", e.target.value)}
                  className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                  style={{ border: "none", outline: "none", boxShadow: "none" }}
                />
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                  disabled
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
            {isLoading ? "Salvando alterações..." : "Confirmar Edição"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
