"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Scale, Edit, Trash2, Plus } from "lucide-react"
import { CreateUnitModal } from "@/components/create-unit-modal"
import { EditUnitModal } from "@/components/edit-unit-modal"

// Dados simulados das unidades
const initialUnits = [
  { id: 1, name: "Quilograma", systemValue: 1 },
  { id: 2, name: "Litro", systemValue: 1 },
  { id: 3, name: "Mililitro", systemValue: 0.1 },
  { id: 4, name: "Gramas", systemValue: 0.1 },
]

export default function UnidadesPage() {
  const [units, setUnits] = useState(initialUnits)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUnit, setEditingUnit] = useState<{ id: number; name: string; systemValue: number } | null>(null)

  const handleCreateUnits = (newUnits: { name: string; systemValue: number }[]) => {
    // Criar novas unidades com IDs únicos
    const unitsToAdd = newUnits.map((unit) => ({
      id: Date.now() + Math.random(), // Garante IDs únicos mesmo para múltiplas unidades
      name: unit.name,
      systemValue: unit.systemValue,
    }))

    // Adicionar todas as novas unidades ao estado
    setUnits([...units, ...unitsToAdd])
    setShowCreateModal(false)
  }

  const handleEditUnit = (id: number, name: string, systemValue: number) => {
    setUnits(units.map((unit) => (unit.id === id ? { ...unit, name, systemValue } : unit)))
    setShowEditModal(false)
    setEditingUnit(null)
  }

  const handleDeleteUnit = (id: number) => {
    setUnits(units.filter((unit) => unit.id !== id))
  }

  const openEditModal = (unit: { id: number; name: string; systemValue: number }) => {
    setEditingUnit(unit)
    setShowEditModal(true)
  }

  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      {/* Elementos decorativos */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Unidades</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
          >
            <Scale className="h-4 w-4" />
            Cadastrar Unidade de Medida
          </Button>
        </div>

        {/* Tabela de Unidades */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Unidade</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Valor para o Sistema</th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{unit.name}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{unit.systemValue}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(unit)}
                          className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Estado vazio */}
          {units.length === 0 && (
            <div className="text-center py-12">
              <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhuma unidade cadastrada</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">
                Comece cadastrando sua primeira unidade de medida.
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Unidade
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modais */}
      <CreateUnitModal open={showCreateModal} onOpenChange={setShowCreateModal} onCreateUnits={handleCreateUnits} />

      <EditUnitModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        unit={editingUnit}
        onEditUnit={handleEditUnit}
      />
    </div>
  )
}
