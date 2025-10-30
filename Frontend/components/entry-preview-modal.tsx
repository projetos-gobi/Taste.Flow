"use client"

import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, ImageIcon } from "lucide-react"

interface EntryPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  entry: any
}

export function EntryPreviewModal({ isOpen, onClose, entry }: EntryPreviewModalProps) {
  if (!entry) return null

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png"].includes(extension || "")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  // Simular objetos File para arquivos existentes
  const simulateExistingFiles = (attachedFiles: any[]) => {
    return attachedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      isExisting: true,
    }))
  }

  const existingFiles = entry.attachedFiles ? simulateExistingFiles(entry.attachedFiles) : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bebas text-gray-900">Visualizar Entrada</DialogTitle>
          <p className="font-nunito text-gray-600">Detalhes completos da entrada de mercadorias.</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Primeira linha - Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Fornecedor</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{entry.supplier}</span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Forma de Pagamento</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <Badge variant="secondary" className="text-xs">
                  {entry.paymentMethod}
                </Badge>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Prazo</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{entry.paymentTerm}</span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Data da Compra</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{entry.purchaseDate}</span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Data Prevista de Receb.</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{entry.expectedReceiptDate}</span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Nº NF</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{entry.nfNumber}</span>
              </div>
            </div>
          </div>

          {/* Segunda linha - Responsável e Valor Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-nunito font-medium text-gray-700">Responsável pela Entrada</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{entry.responsible}</span>
              </div>
            </div>

            <div>
              <Label className="font-nunito font-medium text-gray-700">Valor Total da Nota Fiscal</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{entry.totalNfValue || "R$ 0,00"}</span>
              </div>
            </div>
          </div>

          {/* Mercadorias Adquiridas */}
          <div className="space-y-4">
            <h3 className="font-nunito font-semibold text-gray-900">Mercadorias Adquiridas:</h3>
            <div className="bg-white rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-nunito font-semibold text-gray-900">Mercadoria</TableHead>
                    <TableHead className="font-nunito font-semibold text-gray-900">Categoria</TableHead>
                    <TableHead className="font-nunito font-semibold text-gray-900">Unidade de Compra</TableHead>
                    <TableHead className="font-nunito font-semibold text-gray-900">Qntd.</TableHead>
                    <TableHead className="font-nunito font-semibold text-gray-900">Custo Total Merc.</TableHead>
                    <TableHead className="font-nunito font-semibold text-gray-900">Custo Unitário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entry.merchandiseItems && entry.merchandiseItems.length > 0 ? (
                    entry.merchandiseItems.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-nunito font-medium text-gray-900">{item.merchandise}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{item.category}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{item.unit}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{item.quantity}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{item.totalCost}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{item.unitCost}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                        Nenhuma mercadoria cadastrada
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Informações Gerais */}
          <div className="space-y-4">
            <h3 className="font-nunito font-semibold text-gray-900">Informações Gerais:</h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-nunito font-medium text-gray-900">Valor Total Lançado</span>
                <Badge variant="secondary" className="font-nunito font-semibold">
                  {entry.totalLaunchedValue || "R$ 0,00"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-nunito font-medium text-gray-900">Quantidade de Itens/Mercadorias</span>
                <Badge variant="secondary" className="font-nunito font-semibold">
                  {entry.totalItems || 0}
                </Badge>
              </div>
            </div>
          </div>

          {/* Anexos */}
          {existingFiles && existingFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-nunito font-semibold text-gray-900">Documentos Anexados:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingFiles.map((file: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.name)}
                      <div className="flex-1 min-w-0">
                        <p className="font-nunito text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="font-nunito text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Preview para imagens */}
                    {["jpg", "jpeg", "png"].includes(file.name.split(".").pop()?.toLowerCase() || "") && (
                      <div className="mt-3">
                        <div className="w-full h-32 bg-gray-100 rounded border flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Preview não disponível</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botão de Fechar */}
        <div className="flex justify-end pt-6 border-t">
          <Button onClick={onClose} className="px-6 py-2">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
