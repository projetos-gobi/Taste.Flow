"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock } from "lucide-react"

interface Supplier {
  id: number
  name: string
  cnpj: string
  phone: string
  paymentMethods: string[]
  category: string
  subcategory: string
}

interface SupplierDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
}

export function SupplierDetailsModal({ open, onOpenChange, supplier }: SupplierDetailsModalProps) {
  if (!supplier) return null

  const tabs = [
    { id: "info", label: "Info Geral", active: true },
    { id: "contact", label: "Contato", locked: true },
    { id: "address", label: "Endereço", locked: true },
    { id: "payments", label: "Pagamentos", locked: true },
    { id: "commercial", label: "Condições Comerciais", locked: true },
    { id: "documents", label: "Documentos", locked: true },
    { id: "history", label: "Histórico de Compras", locked: true },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Detalhes do Fornecedor</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">
            Sessão designada para ver os detalhes do fornecedor cadastrado.
          </p>
        </DialogHeader>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-nunito font-medium text-sm ${
                  tab.active ? "border-[#322CA7] text-[#322CA7]" : "border-transparent text-gray-500 cursor-not-allowed"
                }`}
                disabled={tab.locked}
              >
                {tab.locked && <Lock className="h-4 w-4" />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Nome do Fornecedor *</Label>
              <Input
                value={supplier.name}
                disabled
                className="bg-gray-50 border-gray-300 font-nunito font-light text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">CNPJ *</Label>
              <Input
                value={supplier.cnpj}
                disabled
                className="bg-gray-50 border-gray-300 font-nunito font-light text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Telefone *</Label>
              <Input
                value={supplier.phone}
                disabled
                className="bg-gray-50 border-gray-300 font-nunito font-light text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Formas de Pagamento *</Label>
              <Select value={supplier.paymentMethods.join(", ")} disabled>
                <SelectTrigger className="bg-gray-50 border-gray-300 font-nunito font-light text-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={supplier.paymentMethods.join(", ")}>
                    {supplier.paymentMethods.join(", ")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Categoria de Venda *</Label>
              <Select value={supplier.category} disabled>
                <SelectTrigger className="bg-gray-50 border-gray-300 font-nunito font-light text-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={supplier.category}>{supplier.category}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Sub-Categoria</Label>
              <Select value={supplier.subcategory} disabled>
                <SelectTrigger className="bg-gray-50 border-gray-300 font-nunito font-light text-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={supplier.subcategory}>{supplier.subcategory}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
