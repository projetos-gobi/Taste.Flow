"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { EnterpriseFilter } from "../types/enterprise"
import { useEnterpriseFilterModal } from "../hooks/useModal"
import { AutocompleteField } from "./auto-complete-field"

interface CompanyFilterModalProps {
  isOpen: boolean
  onApplyFilters: (filters: EnterpriseFilter) => void
}

export function CompanyFilterModal({ isOpen, onApplyFilters }: CompanyFilterModalProps) {
  const enterpriseFilterModal = useEnterpriseFilterModal();
  
  const [filters, setFilters] = useState<EnterpriseFilter>({
    fantasyName: "",
    licenseId: "all",
    isActive: null,
    cnpj: "",
    city: "",
  })

  const handleFilterChange = (field: keyof EnterpriseFilter, value: string | null) => {
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
    const cleanedFilters: EnterpriseFilter = {
      ...filters,
      licenseId: filters.licenseId === "all" ? null : filters.licenseId,
    }
    onApplyFilters(cleanedFilters);
    handleClose();
  }

  const handleClearFilters = () => {
    const emptyFilters: EnterpriseFilter = {
      fantasyName: "",
      licenseId: null,
      isActive: null,
      cnpj: "",
      city: "",
    }

    setFilters(emptyFilters);

    const cleanedFilters: EnterpriseFilter = Object.fromEntries(
      Object.entries(emptyFilters).filter(
        ([_, value]) => value !== "" && value !== null && value !== "all"
      )
    ) as EnterpriseFilter;

    onApplyFilters(cleanedFilters);
    handleClose();
  };

  const handleClose = () => {
    enterpriseFilterModal.openModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-heading font-bold">
            Filtros e Visualização
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fantasyName" className="font-body text-gray-700">
                Nome da Empresa
              </Label>
              <Input
                id="fantasyName"
                placeholder="Filtrar por nome"
                value={filters.fantasyName}
                onChange={(e) =>
                  handleFilterChange("fantasyName", e.target.value)
                }
                className="font-body"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseId" className="font-body text-gray-700">
                Plano/Assinatura
              </Label>
              <AutocompleteField
                value={filters.licenseId ?? "all"}
                onValueChange={(val) => handleFilterChange("licenseId", val)}
                options={[
                  { id: "all", name: "Todos os planos" },
                  { id: "db2ab708-60ba-4944-9b82-50b892b5c1bd", name: "Básico" },
                  { id: "cc74adbb-a4b6-4a0e-bfba-7fe14dedd5c7", name: "Completo (Estoque + Conta.)" },
                  { id: "951a8b8f-f303-483e-93d7-3019421af62c", name: "Premium" },
                ]}
                placeholder="Todos os planos"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive" className="font-body text-gray-700">
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

            <div className="space-y-2">
              <Label htmlFor="cnpj" className="font-body text-gray-700">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                placeholder="Filtrar por CNPJ"
                value={filters.cnpj}
                onChange={(e) => handleFilterChange("cnpj", e.target.value)}
                className="font-body"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="city" className="font-body text-gray-700">
                Cidade
              </Label>
              <Input
                id="city"
                placeholder="Filtrar por cidade"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
                className="font-body"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              className="font-body bg-transparent"
            >
              Limpar Filtros
            </Button>
            <Button
              onClick={handleApplyFilters}
              className="bg-purple-600 hover:bg-purple-700 text-white font-body"
            >
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}