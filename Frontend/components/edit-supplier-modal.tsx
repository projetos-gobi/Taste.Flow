"use client"

import { useState, useEffect } from "react"
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
  categoryId: number
  subcategoryId: number
  category: string
  subcategory: string
  bankData: {
    agency: string
    accountNumber: string
    pixKey: string
  }
}

interface EditSupplierModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier | null
  onEditSupplier: (
    id: number,
    supplier: {
      name: string
      cnpj: string
      phone: string
      paymentMethods: string[]
      categoryId: number
      subcategoryId: number
      bankData: {
        agency: string
        accountNumber: string
        pixKey: string
      }
    },
  ) => void
  categories: { id: number; name: string }[]
  subcategories: { id: number; name: string }[]
}

export function EditSupplierModal({
  open,
  onOpenChange,
  supplier,
  onEditSupplier,
  categories,
  subcategories,
}: EditSupplierModalProps) {
  const [name, setName] = useState("")
  const [cnpj, setCnpj] = useState("")
  const [phone, setPhone] = useState("")
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])
  const [categoryId, setCategoryId] = useState("")
  const [subcategoryId, setSubcategoryId] = useState("")
  const [bankData, setBankData] = useState({
    agency: "",
    accountNumber: "",
    pixKey: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("")

  const paymentOptions = [
    "PIX",
    "Transferência Bancária",
    "Cartão de Crédito",
    "Cartão de Débito",
    "Dinheiro",
    "Boleto",
    "Cheque",
  ]

  const tabs = [
    { id: "info", label: "Info Geral", active: true },
    { id: "contact", label: "Contato", locked: true },
    { id: "address", label: "Endereço", locked: true },
    { id: "payments", label: "Pagamentos", locked: true },
    { id: "commercial", label: "Condições Comerciais", locked: true },
    { id: "documents", label: "Documentos", locked: true },
    { id: "history", label: "Histórico de Compras", locked: true },
  ]

  useEffect(() => {
    if (supplier) {
      setName(supplier.name)
      setCnpj(supplier.cnpj)
      setPhone(supplier.phone)
      setPaymentMethods(supplier.paymentMethods)
      setCategoryId(supplier.categoryId.toString())
      setSubcategoryId(supplier.subcategoryId.toString())
      setBankData(supplier.bankData || { agency: "", accountNumber: "", pixKey: "" })
      setPaymentMethod(supplier.paymentMethods[0] || "")
    }
  }, [supplier])

  const handleConfirm = () => {
    if (supplier && name.trim() && cnpj.trim() && phone.trim() && paymentMethod.trim() && categoryId && subcategoryId) {
      onEditSupplier(supplier.id, {
        name: name.trim(),
        cnpj: cnpj.trim(),
        phone: phone.trim(),
        paymentMethods: [paymentMethod],
        categoryId: Number(categoryId),
        subcategoryId: Number(subcategoryId),
        bankData,
      })
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    if (supplier) {
      setName(supplier.name)
      setCnpj(supplier.cnpj)
      setPhone(supplier.phone)
      setPaymentMethods(supplier.paymentMethods)
      setCategoryId(supplier.categoryId.toString())
      setSubcategoryId(supplier.subcategoryId.toString())
      setBankData(supplier.bankData || { agency: "", accountNumber: "", pixKey: "" })
      setPaymentMethod(supplier.paymentMethods[0] || "")
    }
    onOpenChange(false)
  }

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "$1 $2-$3")
  }

  if (!supplier) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="font-nunito font-medium text-xl text-gray-900">Editar Fornecedor</DialogTitle>
          <p className="font-nunito font-light text-sm text-gray-600">Edição da informação Base de Fornecedores.</p>
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
              <Label htmlFor="name" className="font-nunito font-medium text-gray-900">
                Nome do Fornecedor *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-gray-300 font-nunito font-light"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cnpj" className="font-nunito font-medium text-gray-900">
                CNPJ *
              </Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                maxLength={18}
                className="bg-white border-gray-300 font-nunito font-light"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-nunito font-medium text-gray-900">
                Telefone *
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                maxLength={13}
                className="bg-white border-gray-300 font-nunito font-light"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Forma de Pagamento *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-white border-gray-300 font-nunito font-light">
                  <SelectValue placeholder="Selecione a Opção" />
                </SelectTrigger>
                <SelectContent>
                  {paymentOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dados Bancários - Condicional */}
          {paymentMethod === "PIX" || paymentMethod === "Transferência Bancária" ? (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-nunito font-medium text-gray-900">Dados para Pagamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agency" className="font-nunito font-medium text-gray-900">
                    Agência *
                  </Label>
                  <Input
                    id="agency"
                    value={bankData.agency}
                    onChange={(e) => setBankData({ ...bankData, agency: e.target.value })}
                    placeholder="0000"
                    className="bg-white border-gray-300 font-nunito font-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="font-nunito font-medium text-gray-900">
                    Nº da Conta *
                  </Label>
                  <Input
                    id="accountNumber"
                    value={bankData.accountNumber}
                    onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                    placeholder="00000-0"
                    className="bg-white border-gray-300 font-nunito font-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pixKey" className="font-nunito font-medium text-gray-900">
                    Chave PIX *
                  </Label>
                  <Input
                    id="pixKey"
                    value={bankData.pixKey}
                    onChange={(e) => setBankData({ ...bankData, pixKey: e.target.value })}
                    placeholder="Digite a chave PIX"
                    className="bg-white border-gray-300 font-nunito font-light"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Categoria de Venda *</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-white border-gray-300 font-nunito font-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-nunito font-medium text-gray-900">Sub-Categoria</Label>
              <Select value={subcategoryId} onValueChange={setSubcategoryId}>
                <SelectTrigger className="bg-white border-gray-300 font-nunito font-light">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="bg-white text-[#322CA7] border-2 border-[#322CA7] hover:bg-[#EDF2FF] font-nunito font-medium"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
          >
            Confirmar Edição
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
