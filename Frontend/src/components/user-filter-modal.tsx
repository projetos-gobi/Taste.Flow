"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select} from "@/src/components/ui/select"
import { UserFilter } from "../types/user"
import { useUserFilterModal } from "../hooks/useModal"
import { AutocompleteField } from "./auto-complete-field"

interface UserFilterModalProps {
  isOpen: boolean
  onApplyFilters: (filters: UserFilter) => void
}

export function UserFilterModal({ isOpen, onApplyFilters }: UserFilterModalProps) {
  const userFilterModal = useUserFilterModal();
  
  const [filters, setFilters] = useState<UserFilter>({
    accessProfileId: null,
    name: '',
    fantasyName: '',
    emailAddress: '',
    isActive: null,
  })

  const handleFilterChange = (field: keyof UserFilter, value: string | null) => {
    setFilters((prev) => {
      if (field === "isActive") {
        return {
          ...prev,
          isActive: value === "all" ? null : value === "true",
        }
      }
      return { ...prev, [field]: value }
    })
  };
  
    const handleApplyFilters = () => {
      const cleanedFilters: UserFilter = {
        ...filters,
        accessProfileId: filters.accessProfileId === "all" ? null : filters.accessProfileId,
      }
      onApplyFilters(cleanedFilters);
      handleClose();
    };
  
    const handleClearFilters = () => {
      const emptyFilters: UserFilter = {
        accessProfileId: null,
        name: '',
        fantasyName: '',
        emailAddress: '',
        isActive: null,
      }
  
      setFilters(emptyFilters);
  
      const cleanedFilters: UserFilter = Object.fromEntries(
        Object.entries(emptyFilters).filter(
          ([_, value]) => value !== "" && value !== null && value !== "all"
        )
      ) as UserFilter;
  
      onApplyFilters(cleanedFilters);
      handleClose();
    }

  const handleClose = () => {
    userFilterModal.openModal(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-heading font-bold">Filtros e Visualização</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-body">
              Nome do Usuário
            </Label>
            <Input
              id="name"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              placeholder="Filtrar por nome"
              className="font-body"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="font-body">
              Empresa
            </Label>
            <Input
              id="company"
              value={filters.fantasyName}
              onChange={(e) => handleFilterChange("fantasyName", e.target.value)}
              placeholder="Filtrar por empresa"
              className="font-body"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-body">
              E-Mail
            </Label>
            <Input
              id="email"
              value={filters.emailAddress}
              onChange={(e) => handleFilterChange("emailAddress", e.target.value)}
              placeholder="Filtrar por e-mail"
              className="font-body"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileType" className="font-body">
              Tipo de Perfil
            </Label>
            <AutocompleteField
              value={filters.accessProfileId ?? ""}
              onValueChange={(val) => handleFilterChange("accessProfileId", val)}
              options={[
                { id: "all", name: "Todos os tipos" },
                { id: "109ae3c4-17fd-4cf3-a0e2-e781fe457dcf", name: "Administrador" },
                { id: "b7c9b9d4-4c1f-4f01-a3b3-5ae71f66dabc", name: "Usuário" },
              ]}
              placeholder="Todos os tipos"
              emptyMessage="Nenhuma opção encontrada."
              className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="font-body">
              Status
            </Label>
            <AutocompleteField
              value={filters.isActive === null ? "all" : filters.isActive ? "true" : "false"}
              onValueChange={(val) => handleFilterChange("isActive", val)}
              options={[
                { id: "all", name: "Todos os status" },
                { id: "true", name: "Ativo" },
                { id: "false", name: "Inativo" },
              ]}
              placeholder="Todos os status"
              emptyMessage="Nenhuma opção encontrada."
              className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={handleClearFilters} className="font-body bg-transparent">
            Limpar Filtros
          </Button>
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={handleClose} className="font-body bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleApplyFilters} className="bg-purple-600 hover:bg-purple-700 text-white font-body">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
