"use client"

import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { useProductAlternativeSelectionModal, useProductModal, useProductTypeSelectionModal } from "../hooks/useModal";

interface ProductTypeSelectionModalProps {
  isOpen: boolean;
}

export function ProductTypeSelectionModal({ isOpen }: ProductTypeSelectionModalProps) {
  const productModal = useProductModal();
  const productTypeSelectionModal = useProductTypeSelectionModal();
  const productAlternativeSelectionModal = useProductAlternativeSelectionModal();
  
  const handleOpenOriginalProductModal = () => {
    handleClose()
    productModal.openModal(true, 'create', 'original');
  };

  const handleClose = () => {
    productTypeSelectionModal.openModal(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl p-0 bg-[#f8f9ff] border-none">
        <div className="p-12 text-center">
          <DialogTitle className="text-2xl font-bold font-bebas text-[#1C194D] mb-12 tracking-wide">
            QUAL TIPO DE FICHA TÉCNICA VOCÊ DESEJA CADASTRAR?
          </DialogTitle>

          <div className="flex items-center justify-center gap-6 mb-16">
            <Button
              onClick={() => handleOpenOriginalProductModal()}
              className="px-8 py-3 bg-[#322ca7] hover:bg-[#322ca7]/90 text-white font-nunito font-medium rounded-md"
            >
              Original
            </Button>

            <Button
              onClick={() => productAlternativeSelectionModal.openModal(true)}
              variant="outline"
              className="px-8 py-3 border-[#322ca7] text-[#322ca7] hover:bg-[#322ca7]/10 font-nunito font-medium rounded-md bg-transparent"
            >
              Alternativa
            </Button>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleClose}
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
