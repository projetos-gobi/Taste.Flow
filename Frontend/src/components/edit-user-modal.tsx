"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { useUserEditModal } from "../hooks/useModal"
import { Checkbox } from "./ui/checkbox"
import { getUserById, updateUser } from "../services/user"
import useSession from "../hooks/useSession"
import { toast } from "sonner"
import { AutocompleteField } from "./auto-complete-field"

interface UserFormData {
  id: string;
  accessProfileId: string;
  name: string;
  enterpriseName: string;
  emailAddress: string;
  licenseName: string;
  contact: string;
  accessProfileName: string;
  isActive: boolean;
}

interface EditUserModalProps {
  isOpen: boolean
}

export function EditUserModal({ isOpen }: EditUserModalProps) {
  const userEditModal = useUserEditModal();
  const session = useSession();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const initialFormData: UserFormData = {
    id: '',
    accessProfileId: '',
    name: '',
    enterpriseName: '',
    emailAddress: '',
    licenseName: '',
    contact: '',
    accessProfileName: '',
    isActive: false
  };

  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  const fetchUser = async () => {
    try {
      const data = await getUserById({ id: userEditModal.userId });

      setFormData({
        id: data.id,
        accessProfileId: data.accessProfileId,
        name: data.name,
        enterpriseName: data.enterpriseName,
        emailAddress: data.emailAddress,
        licenseName: data.licenseName,
        contact: data.contact,
        accessProfileName: data.accessProfileName,
        isActive: data.isActive,
      });
    } catch (error) {
      console.error("Erro ao buscar empresa:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUser();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true)
    session.setRefresh(false);

    try {
      const response = await updateUser(formData);

      if(response.updated){
        handleClose();
        toast.success("Usuário atualizado com sucesso!");
      }else{
        toast.error("Falha ao atualizar um usuário. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao atualizar um usuário:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false);
    }
  }

  const handleChange = (field: keyof UserFormData, value: string | boolean | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleClose = () => {
    resetForm();
    userEditModal.openModal(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-heading font-bold">Editar Usuário</DialogTitle>
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
                value={formData.enterpriseName ?? ""}
                disabled={true}
                onChange={(e) => handleChange("enterpriseName", e.target.value)}
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
                value={formData.emailAddress}
                onChange={(e) => handleChange("emailAddress", e.target.value)}
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
                disabled={true}
                value={formData.licenseName ?? ""}
                onChange={(e) => handleChange("licenseName", e.target.value)}
                placeholder="Digite a assinatura"
                className="font-body"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileType" className="font-body">
                Tipo de Perfil *
              </Label>
              <AutocompleteField
                value={formData.accessProfileId}
                onValueChange={(val) => handleChange("accessProfileId", val)}
                options={[
                  { id: "109ae3c4-17fd-4cf3-a0e2-e781fe457dcf", name: "Administrador" },
                  { id: "b7c9b9d4-4c1f-4f01-a3b3-5ae71f66dabc", name: "Usuário" },
                ]}
                placeholder="Selecione o tipo de perfil"
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
            <Checkbox
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange("isActive", (checked === true))}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor="isActive" className="font-body">
              Usuário Ativo
            </Label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="font-body bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-body">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
