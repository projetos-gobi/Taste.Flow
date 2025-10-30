"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash2, Filter, Plus, FileText } from "lucide-react"
import { EntryControlFilterModal } from "@/components/entry-control-filter-modal"
import { CreateEntryControlModal } from "@/components/create-entry-control-modal"
import { EditEntryControlModal } from "@/components/edit-entry-control-modal"
import { EntryPreviewModal } from "@/components/entry-preview-modal"

// Dados mock para controle de entradas
const entryControlData = [
  {
    id: 1,
    supplier: "Fornecedor A",
    purchaseDate: "2024-01-15",
    expectedReceiptDate: "2024-01-20",
    status: "Pendente",
    paymentMethod: "PIX",
    totalValue: "R$ 1.250,00",
    attachments: ["nota-fiscal-001.pdf", "comprovante-001.jpg"],
  },
  {
    id: 2,
    supplier: "Fornecedor B",
    purchaseDate: "2024-01-16",
    expectedReceiptDate: "2024-01-21",
    status: "Recebido",
    paymentMethod: "Cartão de Crédito",
    totalValue: "R$ 850,00",
    attachments: ["nota-fiscal-002.pdf"],
  },
  {
    id: 3,
    supplier: "Fornecedor C",
    purchaseDate: "2024-01-17",
    expectedReceiptDate: "2024-01-22",
    status: "Atrasado",
    paymentMethod: "Transferência Bancária",
    totalValue: "R$ 2.100,00",
    attachments: ["nota-fiscal-003.pdf", "pedido-003.pdf"],
  },
  {
    id: 4,
    supplier: "Fornecedor D",
    purchaseDate: "2024-01-18",
    expectedReceiptDate: "2024-01-23",
    status: "Pendente",
    paymentMethod: "Boleto",
    totalValue: "R$ 750,00",
    attachments: [],
  },
  {
    id: 5,
    supplier: "Fornecedor E",
    purchaseDate: "2024-01-19",
    expectedReceiptDate: "2024-01-24",
    status: "Recebido",
    paymentMethod: "PIX",
    totalValue: "R$ 1.500,00",
    attachments: ["nota-fiscal-005.pdf"],
  },
]

export default function EntryControlPage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<any>(null)
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    supplier: "",
    status: "",
    paymentMethod: "",
    dateRange: { from: "", to: "" },
  })

  // Função para contar filtros ativos
  const getActiveFiltersCount = () => {
    let count = 0
    if (activeFilters.search && activeFilters.search.trim() !== "") count++
    if (activeFilters.supplier && activeFilters.supplier !== "") count++
    if (activeFilters.status && activeFilters.status !== "") count++
    if (activeFilters.paymentMethod && activeFilters.paymentMethod !== "") count++
    if (activeFilters.dateRange.from && activeFilters.dateRange.to) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()
  const hasActiveFilters = activeFiltersCount > 0

  const handleFilterApply = (filters: any) => {
    setActiveFilters(filters)
    setIsFilterModalOpen(false)
  }

  const handleFilterClear = () => {
    setActiveFilters({
      search: "",
      supplier: "",
      status: "",
      paymentMethod: "",
      dateRange: { from: "", to: "" },
    })
  }

  const handleEdit = (entry: any) => {
    setSelectedEntry(entry)
    setIsEditModalOpen(true)
  }

  const handlePreview = (entry: any) => {
    setSelectedEntry(entry)
    setIsPreviewModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 font-nunito">
            Pendente
          </Badge>
        )
      case "Recebido":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 font-nunito">
            Recebido
          </Badge>
        )
      case "Atrasado":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 font-nunito">
            Atrasado
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="font-nunito">
            {status}
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6 pl-6 pr-6 relative">
      {/* Elemento decorativo como plano de fundo */}
      <div className="absolute top-0 right-0 -z-10 pointer-events-none overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202025-06-26%20a%CC%80s%2019.30.49-LmbGdht0HFXAfYms3pJLBjOISw6faF.png"
          alt="Decorative background"
          className="w-96 h-64 object-contain opacity-40"
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-bebas text-gray-900">Controle de Entradas</h1>
        <p className="text-muted-foreground font-nunito text-gray-600">
          Gerencie e monitore todas as entradas de mercadorias e produtos.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between relative z-10">
        {/* Botão Filtros à esquerda */}
        <div className="relative">
          <Button variant="outline" onClick={() => setIsFilterModalOpen(true)} className="gap-2 font-nunito">
            <Filter className="h-4 w-4" />
            Filtros e Visualização
          </Button>
          {hasActiveFilters && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </div>

        {/* Botão Cadastrar à direita */}
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 bg-[#322ca7] hover:bg-[#322ca7]/90 font-nunito"
        >
          <Plus className="h-4 w-4" />
          Nova Entrada
        </Button>
      </div>

      {/* Table com bordas arredondadas */}
      <Card className="rounded-lg relative z-10">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-gray-50">
                <TableHead className="font-nunito font-semibold text-gray-900">Fornecedor</TableHead>
                <TableHead className="font-nunito font-semibold text-gray-900">Data da Compra</TableHead>
                <TableHead className="font-nunito font-semibold text-gray-900">Data Prevista Recebimento</TableHead>
                <TableHead className="font-nunito font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-nunito font-semibold text-gray-900">Forma de Pagamento</TableHead>
                <TableHead className="font-nunito font-semibold text-gray-900">Valor Total</TableHead>
                <TableHead className="font-nunito font-semibold text-gray-900">Anexos</TableHead>
                <TableHead className="text-center font-nunito font-semibold text-gray-900">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entryControlData.map((entry) => (
                <TableRow key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium font-nunito text-gray-900">{entry.supplier}</TableCell>
                  <TableCell className="font-nunito text-gray-700">{formatDate(entry.purchaseDate)}</TableCell>
                  <TableCell className="font-nunito text-gray-700">{formatDate(entry.expectedReceiptDate)}</TableCell>
                  <TableCell>{getStatusBadge(entry.status)}</TableCell>
                  <TableCell className="font-nunito text-gray-700">{entry.paymentMethod}</TableCell>
                  <TableCell className="font-nunito text-gray-700">{entry.totalValue}</TableCell>
                  <TableCell className="font-nunito text-gray-700">
                    {entry.attachments.length > 0 ? (
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span>{entry.attachments.length}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handlePreview(entry)}>
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(entry)}>
                        <Edit className="h-4 w-4 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between relative z-10">
        <p className="text-sm text-gray-600 font-nunito">Mostrando páginas 1 à 1 de 5 total</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <span className="sr-only">Primeira página</span>
            {"<<"}
          </Button>
          <Button variant="outline" size="icon" disabled>
            <span className="sr-only">Página anterior</span>
            {"<"}
          </Button>
          <Button variant="default" size="icon" className="bg-[#322ca7] hover:bg-[#322ca7]/90">
            1
          </Button>
          <Button variant="outline" size="icon">
            2
          </Button>
          <Button variant="outline" size="icon">
            3
          </Button>
          <Button variant="outline" size="icon">
            4
          </Button>
          <Button variant="outline" size="icon">
            5
          </Button>
          <Button variant="outline" size="icon">
            <span className="sr-only">Próxima página</span>
            {">"}
          </Button>
          <Button variant="outline" size="icon">
            <span className="sr-only">Última página</span>
            {">>"}
          </Button>
        </div>
      </div>

      {/* Modals */}
      <EntryControlFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
        currentFilters={activeFilters}
      />

      <CreateEntryControlModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      {selectedEntry && (
        <>
          <EditEntryControlModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false)
              setSelectedEntry(null)
            }}
            entry={selectedEntry}
          />

          <EntryPreviewModal
            isOpen={isPreviewModalOpen}
            onClose={() => {
              setIsPreviewModalOpen(false)
              setSelectedEntry(null)
            }}
            entry={selectedEntry}
          />
        </>
      )}
    </div>
  )
}
