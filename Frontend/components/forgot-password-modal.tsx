"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ForgotPasswordModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResendEmail: () => void
}

export function ForgotPasswordModal({ open, onOpenChange, onResendEmail }: ForgotPasswordModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-100 border-none">
        {/* Elementos decorativos */}
        <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#322CA7] rounded-lg rotate-12 opacity-80"></div>
        <div className="absolute -top-4 -right-12 w-12 h-12 bg-[#1C194D] rounded-lg rotate-45 opacity-90"></div>
        <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-[#1C194D] rounded-lg -rotate-12 opacity-70"></div>
        <div className="absolute -bottom-4 -left-12 w-14 h-14 bg-[#322CA7] rounded-lg rotate-45 opacity-80"></div>

        <DialogHeader className="space-y-4 pt-4">
          <DialogTitle className="font-bebas text-3xl font-normal text-gray-800 text-left mb-2 tracking-wider">
            ALTERAR SENHA
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="font-nunito font-light text-gray-700 text-base leading-relaxed">
            Por motivos de segurança, solicitamos que você altere sua senha no primeiro acesso.
          </p>

          <div className="space-y-4">
            <div>
              <p className="font-nunito font-medium text-gray-800 mb-3 text-base">Atenção:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="font-nunito font-light">
                    Enviamos um e-mail para o endereço cadastrado com instruções para redefinir sua senha.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="font-nunito font-light">
                    Verifique sua caixa de entrada e também a pasta de spam, se necessário.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-gray-700 font-nunito font-light">
            Após alterar sua senha, volte à plataforma para acessar normalmente.
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
            >
              Cancelar
            </Button>
            <Button onClick={onResendEmail} className="flex-1 bg-[#322CA7] hover:bg-[#1C194D] font-nunito font-medium">
              Reenviar E-Mail
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
