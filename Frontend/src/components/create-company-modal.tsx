"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select} from "@/src/components/ui/select"
import { X } from "lucide-react"
import { AutocompleteField } from "./auto-complete-field"

interface CreateCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function CreateCompanyModal({ isOpen, onClose, onSubmit }: CreateCompanyModalProps) {
  const [formData, setFormData] = useState({
    active: true,
    name: "",
    email: "",
    cnpj: "",
    contact: "",
    plan: "",
    licenses: "",
    zipCode: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  })

  const handleInputChange = (field: string, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCnpjChange = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Apply CNPJ mask: XX.XXX.XXX/XXXX-XX
    let formatted = digits
    if (digits.length > 2) {
      formatted = digits.slice(0, 2) + "." + digits.slice(2)
    }
    if (digits.length > 5) {
      formatted = digits.slice(0, 2) + "." + digits.slice(2, 5) + "." + digits.slice(5)
    }
    if (digits.length > 8) {
      formatted = digits.slice(0, 2) + "." + digits.slice(2, 5) + "." + digits.slice(5, 8) + "/" + digits.slice(8)
    }
    if (digits.length > 12) {
      formatted =
        digits.slice(0, 2) +
        "." +
        digits.slice(2, 5) +
        "." +
        digits.slice(5, 8) +
        "/" +
        digits.slice(8, 12) +
        "-" +
        digits.slice(12, 14)
    }

    handleInputChange("cnpj", formatted)
  }

  const handleZipCodeChange = async (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Apply ZIP code mask: XXXXX-XXX
    let formatted = digits
    if (digits.length > 5) {
      formatted = digits.slice(0, 5) + "-" + digits.slice(5, 8)
    }

    handleInputChange("zipCode", formatted)

    // Fetch address data when ZIP code is complete
    if (digits.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
        const data = await response.json()

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            zipCode: formatted,
            street: data.logradouro || "",
            neighborhood: data.bairro || "",
            city: data.localidade || "",
            state: data.uf || "",
          }))
        }
      } catch (error) {
        console.error("Error fetching ZIP code data:", error)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      active: true,
      name: "",
      email: "",
      cnpj: "",
      contact: "",
      plan: "",
      licenses: "",
      zipCode: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-heading font-bold">Cadastrar Nova Empresa</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-gray-900">Dados Básicos</h3>

            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => handleInputChange("active", e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="active" className="font-body text-gray-700">
                Ativo
              </Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-body text-gray-700">
                  Nome da Empresa *
                </Label>
                <Input
                  id="name"
                  placeholder="Restaurante X"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="font-body"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-gray-700">
                  E-Mail de Login *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@gmail.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="font-body"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj" className="font-body text-gray-700">
                  CNPJ *
                </Label>
                <Input
                  id="cnpj"
                  placeholder="00.0000.0000-00"
                  value={formData.cnpj}
                  onChange={(e) => handleCnpjChange(e.target.value)}
                  className="font-body"
                  maxLength={18}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact" className="font-body text-gray-700">
                  Contato (Email ou Celular) *
                </Label>
                <Input
                  id="contact"
                  placeholder="+00 00 00000-0000"
                  value={formData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  className="font-body"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan" className="font-body text-gray-700">
                  Plano/Assinatura *
                </Label>
                <AutocompleteField
                  value={formData.licenses ?? ""}
                  onValueChange={(val) => handleInputChange("licenseId", val)}
                  options={[
                    { id: "db2ab708-60ba-4944-9b82-50b892b5c1bd", name: "Básico" },
                    { id: "cc74adbb-a4b6-4a0e-bfba-7fe14dedd5c7", name: "Completo (Estoque + Conta.)" },
                    { id: "951a8b8f-f303-483e-93d7-3019421af62c", name: "Premium" },
                  ]}
                  placeholder="Selecione a Opção"
                  emptyMessage="Nenhuma opção encontrada."
                  className="w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 hover:bg-transparent"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenses" className="font-body text-gray-700">
                  Quantidade de Licenças *
                </Label>
                <AutocompleteField
                  value={formData.licenses}
                  onValueChange={(val) => handleInputChange("licenseQuantity", val)}
                  options={[
                    { id: "1", name: "1 Licença" },
                    { id: "3", name: "3 Licenças" },
                    { id: "5", name: "5 Licenças" },
                    { id: "10", name: "10 Licenças" },
                    { id: "unlimited", name: "Ilimitadas" },
                  ]}
                  placeholder="3 Licenças"
                  emptyMessage="Nenhuma opção encontrada."
                  className="w-full h-12 bg-transparent border-0 rounded-none font-nunito font-light text-gray-900 focus:ring-0 focus:border-0 hover:bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-semibold text-gray-900">Endereço</h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="font-body text-gray-700">
                  CEP *
                </Label>
                <Input
                  id="zipCode"
                  placeholder="00.000-000"
                  value={formData.zipCode}
                  onChange={(e) => handleZipCodeChange(e.target.value)}
                  className="font-body"
                  maxLength={9}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-5 space-y-2">
                <Label htmlFor="street" className="font-body text-gray-700">
                  Logradouro *
                </Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className="font-body"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number" className="font-body text-gray-700">
                  Nº *
                </Label>
                <Input
                  id="number"
                  value={formData.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                  className="font-body"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="neighborhood" className="font-body text-gray-700">
                  Bairro *
                </Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  className="font-body"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="font-body text-gray-700">
                  Cidade *
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="font-body"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="font-body text-gray-700">
                  Estado *
                </Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="font-body"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="font-body bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-body">
              Confirmar Cadastro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
