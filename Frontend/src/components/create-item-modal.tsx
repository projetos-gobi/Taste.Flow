"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Loader2, Plus, Trash2 } from "lucide-react"
import useSession from "../hooks/useSession"
import { useItemCreateModal } from "../hooks/useModal"
import { toast } from "sonner"
import { checkItemsExist, createItemsRange } from "../services/item"
import { LoadingOverlay } from "./ui/loading-overlay"

interface Item {
  id: string
  name: string
}

interface CreateItemModalProps {
  isOpen: boolean;
}

export function CreateItemModal({ isOpen }: CreateItemModalProps) {
  const session = useSession();
  const itemCreateModal = useItemCreateModal();

  const [isLoading, setIsLoading] = useState(false);

  const initialItem: Item = { id: crypto.randomUUID(), name: "" };  
  const [items, setItems] = useState<Item[]>([initialItem]);
  const [existingItems, setExistingItems] = useState<Item[]>([]);

  const handleAddItem = () => {
    const newItem: Item = {
      id: crypto.randomUUID(),
      name: ""
    }
    setItems([...items, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof Item, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.some(i => !i.name.trim()) || new Set(items.map(i => i.name.trim().toLowerCase())).size !== items.length) {
      toast.warning("Existem itens vazios ou duplicados. Corrija antes de enviar.");
      return;
    }

    setIsLoading(true);
    session.setRefresh(false);

    try {
      const checkResponse = await checkItemsExist({ items: items.map(i => i.name) });

      if (checkResponse.length > 0) {
        setExistingItems(checkResponse);
        toast.warning("Alguns itens já existem. Corrija-os antes de enviar.");
        return;
      }

      const response = await createItemsRange({ items: items });

      if(response.created){
        toast.success("Itens criados com sucesso!");
        handleClose();
      }else{
        toast.error("Falha ao criar os itens. Tente novamente.");
      } 
    } catch (error) {
      console.error("Erro ao salvar itens:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setExistingItems([]);
    setItems([initialItem]);
    itemCreateModal.openModal(false);
  };

  const duplicatedItems = items.map(i => i.name.trim().toLowerCase()).filter((name, index, arr) => arr.indexOf(name) !== index);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!isLoading) { handleClose() } }}>
      <DialogContent className="sm:max-w-4xl bg-white border border-gray-300 rounded-lg shadow-lg">
        {isLoading && <LoadingOverlay message="Salvando..." />}
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Cadastro de Itens</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Cadastro da informação Base de Itens.</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tabela de Itens */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Header da tabela */}
            <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300">
              <div className="col-span-10 px-4 py-3 font-nunito font-medium text-gray-900 border-r border-gray-300">
                Item
              </div>
              <div className="col-span-2 px-4 py-3 font-nunito font-medium text-gray-900 text-center">Ações</div>
            </div>

            {/* Linhas da tabela */}
            {items.map((item, index) => {
              const isInvalid = duplicatedItems.includes(item.name.trim().toLowerCase()) || existingItems.some(existing => existing.name.trim().toLowerCase() === item.name.trim().toLowerCase());
              
              return (
                <div key={item.id} className={`grid grid-cols-12 border-b border-gray-200 last:border-b-0 ${isInvalid ? "bg-red-100" : ""}`} >
                  <div className="col-span-10 border-r border-gray-300 p-0">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                      placeholder="Morango..."
                      className="w-full h-12 px-4 py-3 bg-transparent font-nunito font-light text-gray-900 placeholder-gray-500 border-0 outline-0 focus:outline-0 focus:ring-0 focus:border-0"
                      style={{ border: "none", outline: "none", boxShadow: "none" }}
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={items.length === 1}
                      className="text-gray-600 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Botão Adicionar Nova Linha */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleAddItem}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Nova Linha
            </Button>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
          >
            {isLoading ? "Salvando..." : "Confirmar Cadastro"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
