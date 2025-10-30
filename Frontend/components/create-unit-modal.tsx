"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"

interface Unit {
  id: string
  name: string
  systemValue: string
}

interface CreateUnitModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateUnits: (units: { name: string; systemValue: number }[]) => void
}

export function CreateUnitModal({ open, onOpenChange, onCreateUnits }: CreateUnitModalProps) {
  const [units, setUnits] = useState<Unit[]>([{ id: "1", name: "", systemValue: "" }])

  const addNewLine = () => {
    const newUnit: Unit = {
      id: Date.now().toString(),
      name: "",
      systemValue: "",
    }
    setUnits([...units, newUnit])
  }

  const removeUnit = (id: string) => {
    if (units.length > 1) {
      setUnits(units.filter((unit) => unit.id !== id))
    }
  }

  const updateUnit = (id: string, field: keyof Unit, value: string) => {
    setUnits(units.map((unit) => (unit.id === id ? { ...unit, [field]: value } : unit)))
  }

  const handleConfirm = () => {
    // Validar e criar unidades
    const validUnits = units.filter(
      (unit) => unit.name.trim() && unit.systemValue.trim() && !isNaN(Number(unit.systemValue)),
    )

    if (validUnits.length > 0) {
      // Enviar todas as unidades válidas de uma vez
      const formattedUnits = validUnits.map((unit) => ({
        name: unit.name.trim(),
        systemValue: Number(unit.systemValue),
      }))

      onCreateUnits(formattedUnits)
    }

    // Resetar formulário
    setUnits([{ id: "1", name: "", systemValue: "" }])
    onOpenChange(false)
  }

  const handleCancel = () => {
    setUnits([{ id: "1", name: "", systemValue: "" }])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
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
            {units.map((unit, index) => (
              <div key={unit.id} className="grid grid-cols-12 border-b border-gray-200 last:border-b-0">
                <div className="col-span-5 border-r border-gray-300 p-0">
                  <input
                    type="text"
                    value={unit.name}
                    onChange={(e) => updateUnit(unit.id, "name", e.target.value)}
                    placeholder="Digite o nome da unidade"
                    className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                    style={{ border: "none", outline: "none", boxShadow: "none" }}
                  />
                </div>
                <div className="col-span-5 border-r border-gray-300 p-0">
                  <input
                    type="number"
                    step="0.001"
                    value={unit.systemValue}
                    onChange={(e) => updateUnit(unit.id, "systemValue", e.target.value)}
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
                    onClick={() => removeUnit(unit.id)}
                    disabled={units.length === 1}
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
