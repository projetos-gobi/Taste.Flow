"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useChangePasswordModal } from "../hooks/useModal"
import { IRecoverPasswordRequest } from "../types/auth"
import { toast } from "sonner"
import { recoverPassword } from "../services/auth"

interface ChangePasswordModalProps {
  open: boolean;
}

export function ChangePasswordModal({ open }: ChangePasswordModalProps) {
  const changePasswordModal = useChangePasswordModal();
  
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const request: IRecoverPasswordRequest = {
        code: changePasswordModal.code,
        oldPassword: currentPassword,
        newPassword: confirmPassword
      };
      
      const response = await recoverPassword(request);

      if (response && response.success !== false) {
        toast.success("Senha alterada com sucesso!");
        handleClose();
        // Recarregar a página para atualizar o token e permitir acesso completo
        window.location.reload();
      } else {
        toast.error(response?.message || "Não foi possível alterar a senha. Verifique os dados e tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao alterar a senha:", error);
      toast.error("Erro inesperado. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("");
    changePasswordModal.openModal(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl bg-gray-100 border-none">
        {/* Elementos decorativos */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#322CA7] rounded-lg rotate-12 opacity-80"></div>
        <div className="absolute -top-4 -right-12 w-12 h-12 bg-[#1C194D] rounded-lg rotate-45 opacity-90"></div>
        <div className="absolute top-4 -right-16 w-20 h-20 bg-[#322CA7] rounded-lg -rotate-12 opacity-70"></div>
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-[#1C194D] rounded-lg -rotate-12 opacity-70"></div>
        <div className="absolute -bottom-4 -left-12 w-14 h-14 bg-[#322CA7] rounded-lg rotate-45 opacity-80"></div>

        <DialogHeader className="space-y-4 pt-4">
          <DialogTitle className="font-bebas text-3xl font-normal text-gray-800 text-left mb-2 tracking-wider">
            ALTERANDO SENHA
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
          {/* Lado esquerdo - Formulário */}
          <div className="space-y-6">
            <p className="font-nunito font-light text-gray-700 text-base leading-relaxed">
              Por motivos de segurança, solicitamos que você altere sua senha no primeiro acesso.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="font-nunito font-light text-gray-800 text-base">
                  Senha Atual *
                </Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="**********"
                    className="pr-10 bg-white border-gray-300 font-nunito font-light"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="font-nunito font-light text-gray-800 text-base">
                  Nova Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="**********"
                    className="pr-10 bg-white border-gray-300 font-nunito font-light"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="font-nunito font-light text-gray-800 text-base">
                  Confirmação de Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="**********"
                    className="pr-10 bg-white border-gray-300 font-nunito font-light"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Lado direito - Requisitos */}
          <div className="space-y-4">
            <h3 className="font-nunito font-medium text-gray-800 text-lg">Requisitos para a nova senha:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="font-nunito font-light">Deve ter pelo menos 8 caracteres.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="font-nunito font-light">Deve incluir:</span>
              </li>
              <li className="ml-6 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="font-nunito font-light">Letras maiúsculas (A-Z)</span>
              </li>
              <li className="ml-6 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="font-nunito font-light">Letras minúsculas (a-z)</span>
              </li>
              <li className="ml-6 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="font-nunito font-light">Pelo menos um número (0-9)</span>
              </li>
              <li className="ml-6 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                <span className="font-nunito font-light">
                  (Opcional, mas recomendado) Caracteres especiais (#, @, &, etc.)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="flex-1 bg-[#322CA7] hover:bg-[#1C194D] font-nunito font-medium">
            Alterar Senha
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
