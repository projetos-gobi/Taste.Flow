"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Trash2 } from "lucide-react"

interface Type {
  id: string
  name: string
}

interface CreateTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTypes: (types: { name: string }[]) => void
}

export function CreateTypeModal({ open, onOpenChange, onCreateTypes }: CreateTypeModalProps) {
  const [types, setTypes] = useState<Type[]>([{ id: "1", name: "" }])

  const addNewLine = () => {
    const newType: Type = {
      id: Date.now().toString(),
      name: "",
    }
    setTypes([...types, newType])
  }

  const removeType = (id: string) => {
    if (types.length > 1) {
      setTypes(types.filter((type) => type.id !== id))
    }
  }

  const updateType = (id: string, value: string) => {
    setTypes(types.map((type) => (type.id === id ? { ...type, name: value } : type)))
  }

  const handleConfirm = () => {
    // Validar e criar tipos
    const validTypes = types.filter((type) => type.name.trim())

    if (validTypes.length > 0) {
      // Enviar todos os tipos válidos de uma vez
      const formattedTypes = validTypes.map((type) => ({
        name: type.name.trim(),
      }))

      onCreateTypes(formattedTypes)
    }

    // Resetar formulário
    setTypes([{ id: "1", name: "" }])
    onOpenChange(false)
  }

  const handleCancel = () => {
    setTypes([{ id: "1", name: "" }])
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Cadastro de Tipo</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Cadastro da informação Base de Tipo.</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabela de Tipos */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Header da tabela */}
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-10 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Tipo
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            {/* Linhas da tabela */}
            {types.map((type, index) => (
              <div key={type.id} className="grid grid-cols-12 border-b border-gray-200 last:border-b-0">
                <div className="col-span-10 border-r border-gray-300 p-0">
                  <input
                    type="text"
                    value={type.name}
                    onChange={(e) => updateType(type.id, e.target.value)}
                    placeholder="Com Gás..."
                    className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                    style={{ border: "none", outline: "none", boxShadow: "none" }}
                  />
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeType(type.id)}
                    disabled={types.length === 1}
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
