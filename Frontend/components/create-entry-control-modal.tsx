"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Paperclip, Check, ChevronsUpDown, Calendar, Eye, X, Download } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"

interface CreateEntryControlModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

// Função para aplicar máscara de data DD/MM/AAAA
const applyDateMask = (value: string) => {
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
}

// Função para aplicar máscara monetária
const applyCurrencyMask = (value: string) => {
  const numbers = value.replace(/\D/g, "")
  const amount = Number(numbers) / 100
  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

// Função para remover máscara monetária
const removeCurrencyMask = (value: string) => {
  return value.replace(/[R$\s.]/g, "").replace(",", ".")
}

// Componente para campo de data com calendário direto
const DateField: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder: string
}> = ({ value, onChange, placeholder }) => {
  const handleInputChange = (inputValue: string) => {
    const maskedValue = applyDateMask(inputValue)
    onChange(maskedValue)
  }

  const handleCalendarClick = () => {
    const tempInput = document.createElement("input")
    tempInput.type = "date"
    tempInput.style.position = "absolute"
    tempInput.style.left = "-9999px"

    if (value && value.includes("/")) {
      const [day, month, year] = value.split("/")
      if (day && month && year && year.length === 4) {
        tempInput.value = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
      }
    }

    tempInput.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.value) {
        const [year, month, day] = target.value.split("-")
        const formattedDate = `${day}/${month}/${year}`
        onChange(formattedDate)
      }
      document.body.removeChild(tempInput)
    }

    document.body.appendChild(tempInput)
    tempInput.showPicker()
  }

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 bg-white border-gray-200 pr-10"
        maxLength={10}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCalendarClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
      >
        <Calendar className="h-4 w-4 text-gray-500" />
      </Button>
    </div>
  )
}

// Componente para campo monetário
const CurrencyField: React.FC<{
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}> = ({ value, onChange, placeholder, className }) => {
  const handleChange = (inputValue: string) => {
    const maskedValue = applyCurrencyMask(inputValue)
    onChange(maskedValue)
  }

  return (
    <Input
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  )
}

// Modal de preview de arquivo
const FilePreviewModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  file: File | null
}> = ({ isOpen, onClose, file }) => {
  if (!file) return null

  const isImage = ["jpg", "jpeg", "png"].includes(file.name.split(".").pop()?.toLowerCase() || "")

  const handleDownload = () => {
    const url = URL.createObjectURL(file)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-bebas text-gray-900">Preview do Arquivo</DialogTitle>
              <p className="font-nunito text-gray-600">{file.name}</p>
              <p className="font-nunito text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogHeader>
        <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
          {isImage ? (
            <img
              src={URL.createObjectURL(file) || "/placeholder.svg"}
              alt={file.name}
              className="max-w-full max-h-[500px] object-contain rounded"
            />
          ) : (
            <div className="text-center">
              <Paperclip className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="font-nunito text-gray-600">Preview não disponível para este tipo de arquivo</p>
              <p className="font-nunito text-sm text-gray-500">{file.name}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Dados mockados dos fornecedores
const suppliers = [
  { id: 1, name: "Serra das Almas" },
  { id: 2, name: "Carrefour" },
  { id: 3, name: "Atacadão" },
  { id: 4, name: "Makro" },
  { id: 5, name: "Marcos Silva Bebidas" },
  { id: 6, name: "Maria Santos Distribuidora" },
  { id: 7, name: "Martins & Cia" },
]

// Dados mockados das mercadorias com categorias
const merchandises = [
  { id: 1, name: "Cachaça Prata Serra das Almas", unit: "Litros", category: "Bebidas Alcoólicas" },
  { id: 2, name: "Limão Taiti", unit: "QuiloGramas", category: "Frutas e Verduras" },
  { id: 3, name: "Tomilho", unit: "QuiloGramas", category: "Temperos e Condimentos" },
  { id: 4, name: "Cerveja Heineken Long Neck", unit: "Litros", category: "Bebidas Alcoólicas" },
  { id: 5, name: "Cenoura", unit: "QuiloGramas", category: "Frutas e Verduras" },
  { id: 6, name: "Batata", unit: "QuiloGramas", category: "Frutas e Verduras" },
  { id: 7, name: "Carne Bovina", unit: "QuiloGramas", category: "Carnes e Aves" },
  { id: 8, name: "Camarão", unit: "QuiloGramas", category: "Frutos do Mar" },
]

// Opções de forma de pagamento
const paymentMethodOptions = [
  "PIX",
  "Transferência Bancária",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Boleto",
  "Cheque",
  "Dinheiro",
]

// Opções de prazo
const paymentTermOptions = ["À vista", "30 dias", "60 dias", "90 dias"]

// Componente de Autocomplete customizado
function AutocompleteField({
  value,
  onValueChange,
  options,
  placeholder,
  emptyMessage = "Nenhum item encontrado.",
}: {
  value: string
  onValueChange: (value: string) => void
  options: { id: number; name: string }[]
  placeholder: string
  emptyMessage?: string
}) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")

  const filteredOptions = options.filter((option) => option.name.toLowerCase().includes(searchValue.toLowerCase()))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-12 bg-white border-gray-200 justify-between font-nunito font-normal text-left"
        >
          <span className={cn("truncate", value ? "text-gray-900" : "text-gray-500")}>{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Digite para buscar..." value={searchValue} onValueChange={setSearchValue} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    setSearchValue("")
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.name ? "opacity-100" : "opacity-0")} />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function CreateEntryControlModal({ isOpen, onClose, onSave }: CreateEntryControlModalProps) {
  const [formData, setFormData] = useState({
    supplier: "",
    purchaseDate: "",
    expectedReceiptDate: "",
    responsible: "",
    nfNumber: "",
    paymentMethod: "" as string,
    paymentTerm: "",
    totalNfValue: "",
  })

  const [merchandiseItems, setMerchandiseItems] = useState([
    {
      id: 1,
      merchandise: "",
      category: "",
      unit: "",
      quantity: "",
      totalCost: "",
      unitCost: "",
    },
  ])

  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Calcular custo unitário
  const calculateUnitCost = (totalCost: string, quantity: string) => {
    const total = Number.parseFloat(removeCurrencyMask(totalCost)) || 0
    const qty = Number.parseFloat(quantity) || 0
    if (qty > 0) {
      return (total / qty).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    }
    return "R$ 0,00"
  }

  // Atualizar item da mercadoria
  const updateMerchandiseItem = (index: number, field: string, value: string) => {
    const updatedItems = [...merchandiseItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // Se mudou mercadoria, atualizar unidade e categoria
    if (field === "merchandise") {
      const selectedMerchandise = merchandises.find((m) => m.name === value)
      if (selectedMerchandise) {
        updatedItems[index].unit = selectedMerchandise.unit
        updatedItems[index].category = selectedMerchandise.category
      }
    }

    // Se mudou quantidade ou custo total, recalcular custo unitário
    if (field === "quantity" || field === "totalCost") {
      updatedItems[index].unitCost = calculateUnitCost(updatedItems[index].totalCost, updatedItems[index].quantity)
    }

    setMerchandiseItems(updatedItems)
  }

  // Adicionar nova linha de mercadoria
  const addMerchandiseItem = () => {
    setMerchandiseItems([
      ...merchandiseItems,
      {
        id: merchandiseItems.length + 1,
        merchandise: "",
        category: "",
        unit: "",
        quantity: "",
        totalCost: "",
        unitCost: "",
      },
    ])
  }

  // Remover linha de mercadoria
  const removeMerchandiseItem = (index: number) => {
    if (merchandiseItems.length > 1) {
      setMerchandiseItems(merchandiseItems.filter((_, i) => i !== index))
    }
  }

  // Calcular valor total lançado
  const calculateTotalLaunchedValue = () => {
    return merchandiseItems
      .reduce((total, item) => {
        const itemTotal = Number.parseFloat(removeCurrencyMask(item.totalCost)) || 0
        return total + itemTotal
      }, 0)
      .toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
  }

  // Calcular quantidade de itens
  const calculateTotalItems = () => {
    return merchandiseItems.filter((item) => item.merchandise).length
  }

  // Configuração do dropzone para upload de arquivos
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAttachedFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: true,
  })

  // Remover arquivo anexado
  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Abrir preview do arquivo
  const openFilePreview = (file: File) => {
    setPreviewFile(file)
    setIsPreviewOpen(true)
  }

  const handleSave = () => {
    const entryData = {
      ...formData,
      merchandiseItems: merchandiseItems.filter((item) => item.merchandise),
      attachedFiles,
      totalLaunchedValue: calculateTotalLaunchedValue(),
      totalItems: calculateTotalItems(),
    }
    onSave(entryData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      supplier: "",
      purchaseDate: "",
      expectedReceiptDate: "",
      responsible: "",
      nfNumber: "",
      paymentMethod: "",
      paymentTerm: "",
      totalNfValue: "",
    })
    setMerchandiseItems([
      {
        id: 1,
        merchandise: "",
        category: "",
        unit: "",
        quantity: "",
        totalCost: "",
        unitCost: "",
      },
    ])
    setAttachedFiles([])
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bebas text-gray-900">Cadastro de Entradas</DialogTitle>
            <p className="font-nunito text-gray-600">Cadastrando uma nova leva de entradas de Mercadoria.</p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Campos principais */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Fornecedor */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Fornecedor <span className="text-red-500">*</span>
                </Label>
                <AutocompleteField
                  value={formData.supplier}
                  onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                  options={suppliers}
                  placeholder="Selecione a Opção"
                  emptyMessage="Nenhum fornecedor encontrado."
                />
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Forma de Pagamento <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger className="h-12 bg-white border-gray-200">
                    <SelectValue placeholder="Selecione a forma" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Prazo */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Prazo <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.paymentTerm}
                  onValueChange={(value) => setFormData({ ...formData, paymentTerm: value })}
                >
                  <SelectTrigger className="h-12 bg-white border-gray-200">
                    <SelectValue placeholder="Selecione o prazo" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTermOptions.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Data da Compra */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Data da Compra <span className="text-red-500">*</span>
                </Label>
                <DateField
                  value={formData.purchaseDate}
                  onChange={(value) => setFormData({ ...formData, purchaseDate: value })}
                  placeholder="dd/mm/aaaa"
                />
              </div>

              {/* Data Prevista de Recebimento */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Data Prevista de Receb. <span className="text-red-500">*</span>
                </Label>
                <DateField
                  value={formData.expectedReceiptDate}
                  onChange={(value) => setFormData({ ...formData, expectedReceiptDate: value })}
                  placeholder="dd/mm/aaaa"
                />
              </div>

              {/* Nº NF */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">Nº NF</Label>
                <Input
                  placeholder="0000"
                  value={formData.nfNumber}
                  onChange={(e) => setFormData({ ...formData, nfNumber: e.target.value })}
                  className="h-12 bg-white border-gray-200"
                />
              </div>
            </div>

            {/* Segunda linha de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Responsável pela Entrada */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Responsável pela Entrada <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Digite o nome do responsável"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  className="h-12 bg-white border-gray-200"
                />
              </div>

              {/* Valor Total da Nota Fiscal */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Valor Total da Nota Fiscal <span className="text-red-500">*</span>
                </Label>
                <CurrencyField
                  value={formData.totalNfValue}
                  onChange={(value) => setFormData({ ...formData, totalNfValue: value })}
                  placeholder="R$ 0,00"
                  className="h-12 bg-white border-gray-200"
                />
              </div>
            </div>

            {/* Grid Mercadorias Adquiridas - Fundo Branco */}
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
              <h3 className="font-nunito font-semibold text-gray-900">Mercadorias Adquiridas:</h3>

              <div className="bg-white rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                      <TableHead className="font-nunito font-semibold text-gray-900 border-r border-gray-200">
                        Mercadoria
                      </TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900 border-r border-gray-200">
                        Categoria
                      </TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900 border-r border-gray-200">
                        Unidade de Compra
                      </TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900 border-r border-gray-200">
                        Qntd.
                      </TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900 border-r border-gray-200">
                        Custo Total Merc.
                      </TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900 border-r border-gray-200">
                        Custo Unitário
                      </TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900 text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {merchandiseItems.map((item, index) => (
                      <TableRow key={item.id} className="border-b border-gray-100">
                        <TableCell className="w-1/5 border-r border-gray-100">
                          <AutocompleteField
                            value={item.merchandise}
                            onValueChange={(value) => updateMerchandiseItem(index, "merchandise", value)}
                            options={merchandises}
                            placeholder="Selecione uma opção"
                            emptyMessage="Nenhuma mercadoria encontrada."
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <Input
                            value={item.category}
                            disabled
                            className="bg-gray-100 text-gray-600"
                            placeholder="Categoria"
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <Input
                            value={item.unit}
                            disabled
                            className="bg-gray-100 text-gray-600"
                            placeholder="Unidade"
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateMerchandiseItem(index, "quantity", e.target.value)}
                            className="bg-white"
                            placeholder="-"
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <CurrencyField
                            value={item.totalCost}
                            onChange={(value) => updateMerchandiseItem(index, "totalCost", value)}
                            placeholder="R$ 0,00"
                            className="bg-white"
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <Input value={item.unitCost} disabled className="bg-gray-100 text-gray-600" placeholder="-" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMerchandiseItem(index)}
                            disabled={merchandiseItems.length === 1}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button
                onClick={addMerchandiseItem}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Adicionar Nova Linha
              </Button>
            </div>

            {/* Informações Gerais */}
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-nunito font-semibold text-gray-900">Informações Gerais:</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="font-nunito font-medium text-gray-900">Valor Total Lançado</span>
                  <span className="font-nunito font-semibold text-gray-900">{calculateTotalLaunchedValue()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="font-nunito font-medium text-gray-900">Quantidade de Itens/Mercadorias</span>
                  <span className="font-nunito font-semibold text-gray-900">{calculateTotalItems()}</span>
                </div>
              </div>
            </div>

            {/* Área de Anexo com Preview */}
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 bg-gray-50"
                }`}
              >
                <input {...getInputProps()} />
                <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="font-nunito text-gray-600">
                  {isDragActive ? "Solte os arquivos aqui..." : "Arraste ou clique para anexar um arquivo."}
                </p>
                <p className="font-nunito text-sm text-gray-500 mt-1">PDF, PNG, JPG, JPEG</p>
              </div>

              {/* Lista de arquivos anexados com preview */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-nunito font-medium text-gray-900">Arquivos Anexados:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Paperclip className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="font-nunito text-sm text-gray-700 truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openFilePreview(file)}
                            className="h-6 w-6 p-0"
                          >
                            <Eye className="h-3 w-3 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                            <X className="h-3 w-3 text-gray-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={handleClose} className="px-6 py-2">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700">
              Confirmar Cadastro
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Preview */}
      <FilePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} file={previewFile} />
    </>
  )
}
