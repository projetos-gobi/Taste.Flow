"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProductTypeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectOriginal: () => void
  onSelectAlternative: () => void
}

export function ProductTypeSelectionModal({
  isOpen,
  onClose,
  onSelectOriginal,
  onSelectAlternative,
}: ProductTypeSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-[#f8f9ff] border-none">
        <div className="p-12 text-center">
          <h1 className="text-2xl font-bold font-bebas text-[#1C194D] mb-12 tracking-wide">
            QUAL TIPO DE FICHA TÉCNICA VOCÊ DESEJA CADASTRAR?
          </h1>

          <div className="flex items-center justify-center gap-6 mb-16">
            <Button
              onClick={onSelectOriginal}
              className="px-8 py-3 bg-[#322ca7] hover:bg-[#322ca7]/90 text-white font-nunito font-medium rounded-md"
            >
              Original
            </Button>

            <Button
              onClick={onSelectAlternative}
              variant="outline"
              className="px-8 py-3 border-[#322ca7] text-[#322ca7] hover:bg-[#322ca7]/10 font-nunito font-medium rounded-md bg-transparent"
            >
              Alternativa
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="px-6 py-2 bg-[#322ca7] hover:bg-[#322ca7]/90 text-white font-nunito rounded-md"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
