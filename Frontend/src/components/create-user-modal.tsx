"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { X } from "lucide-react"
import { AutocompleteField } from "./auto-complete-field"

interface User {
  name: string
  company: string
  email: string
  signature: string
  profileType: string
  contact: string
  isActive: boolean
}

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (user: User) => void
}

export function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
  const [formData, setFormData] = useState<User>({
    name: "",
    company: "",
    email: "",
    signature: "",
    profileType: "",
    contact: "",
    isActive: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      name: "",
      company: "",
      email: "",
      signature: "",
      profileType: "",
      contact: "",
      isActive: true,
    })
  }

  const handleChange = (field: keyof User, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-heading font-bold">Cadastrar Novo Usuário</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-body">
                Nome do Usuário *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Digite o nome do usuário"
                required
                className="font-body"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="font-body">
                Empresa *
              </Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="Digite o nome da empresa"
                required
                className="font-body"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">
                E-Mail *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Digite o e-mail"
                required
                className="font-body"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signature" className="font-body">
                Assinatura
              </Label>
              <Input
                id="signature"
                value={formData.signature}
                onChange={(e) => handleChange("signature", e.target.value)}
                placeholder="Digite a assinatura"
                className="font-body"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileType" className="font-body">
                Tipo de Perfil *
              </Label>
              <AutocompleteField
                value={formData.profileType}
                onValueChange={(val) => handleChange("profileType", val)}
                options={[
                  { id: "109ae3c4-17fd-4cf3-a0e2-e781fe457dcf", name: "Administrador" },
                  { id: "b7c9b9d4-4c1f-4f01-a3b3-5ae71f66dabc", name: "Usuário" },
                ]}
                placeholder="Selecione a Opção"
                emptyMessage="Nenhuma opção encontrada."
                className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="font-body">
                Contato
              </Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                placeholder="Digite o contato"
                className="font-body"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="font-body">
              Usuário Ativo
            </Label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="font-body bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-body">
              Cadastrar Usuário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
