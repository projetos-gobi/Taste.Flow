"use client"

import { Label } from "@/src/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Download, Eye, FileText, ImageIcon, Paperclip } from "lucide-react"
import { useStockEntryPreviewModal } from "../hooks/useModal"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import moment from "moment"
import { currency, formatCurrencyBRL, parseCurrency } from "../app/utils/utils"
import { Unit } from "../types/unit"
import { Category } from "../types/category"
import { Merchandise } from "../types/merchandise"
import { PaymentType } from "../types/payment-type"
import { Supplier } from "../types/supplier"
import { PaymentTerm } from "../types/payment-term"
import { StockEntry } from "../types/stock-entry"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllUnitsByEnterpriseId } from "../services/unit"
import { getAllMerchandisesByEnterpriseId } from "../services/merchandise"
import { getAllPaymentTypesByEnterpriseId } from "../services/payment-type"
import { getAllSuppliersByEnterpriseId } from "../services/supplier"
import { getAllPaymentTerms } from "../services/payment-term"
import { getStockEntryById } from "../services/stock-entry"
import useSession from "../hooks/useSession"
import { FilePreviewModal } from "./file-preview-modal"
import { StockEntryAttachment } from "../types/stock-entry-attachment"
import { getFileUrlStockEntryAttachment } from "../services/stock-entry-attachment"

interface EntryPreviewModalProps {
  isOpen: boolean;
}

export function EntryPreviewModal({ isOpen }: EntryPreviewModalProps) {
  const session = useSession();
  const stockEntryPreviewModal = useStockEntryPreviewModal();

  const initialStockEntry: StockEntry = {
    id: '',                     
    supplierId: '',
    paymentTypeId: '',
    paymentTermId: '',
    purchaseDate: null,
    expectedDeliveryDate: null,
    receivedBy: '',
    isDeliveryCompleted: false,
    invoiceNumber: null,
    totalAmount: '',
    supplierName: '',
    paymentTypeName: '',
    stockEntryAttachmentCount: 0,
    stockEntryAttachments: [],
    stockEntryItems: [
      {
        id: crypto.randomUUID(),
        merchandiseId: '',
        categoryId: '',
        unitId: '',
        quantity: "",
        totalAmount: "",
      }
    ]
  };

  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [merchandises, setMerchandises] = useState<Merchandise[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stockEntry, setStockEntry] = useState<StockEntry>(initialStockEntry);
  
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [previewFile, setPreviewFile] = useState<StockEntryAttachment | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fetchInitialData = async (page: number = 1) => {
    try {
      const [categoriesResponse, unitsResponse, merchandisesResponse, paymentTypesResponse, suppliersResponse, paymentTermsResponse, stockEntryResponse] = await Promise.all([
        getAllCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllUnitsByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllMerchandisesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllPaymentTypesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllSuppliersByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllPaymentTerms(),
        getStockEntryById({ id: stockEntryPreviewModal.stockEntryId })
      ]);

      setPaymentTypes(paymentTypesResponse);
      setMerchandises(merchandisesResponse);
      setCategories(categoriesResponse);
      setUnits(unitsResponse);
      setSuppliers(suppliersResponse);
      setPaymentTerms(paymentTermsResponse);

      if (stockEntryResponse) {
        setStockEntry({
          id: stockEntryResponse.id,
          supplierId: stockEntryResponse.supplierId,
          paymentTypeId: stockEntryResponse.paymentTypeId,
          paymentTermId: stockEntryResponse.paymentTermId,
          purchaseDate: stockEntryResponse.purchaseDate ? moment(stockEntryResponse.purchaseDate).format("YYYY-MM-DD") : null,
          expectedDeliveryDate: stockEntryResponse.expectedDeliveryDate ? moment(stockEntryResponse.expectedDeliveryDate).format("YYYY-MM-DD") : null,
          receivedBy: stockEntryResponse.receivedBy ?? '',
          isDeliveryCompleted: stockEntryResponse.isDeliveryCompleted ?? false,
          invoiceNumber: stockEntryResponse.invoiceNumber ?? '',
          totalAmount: formatCurrencyBRL(stockEntryResponse.totalAmount.toString()) ?? '',
          supplierName: stockEntryResponse.supplierName ?? '',
          paymentTypeName: stockEntryResponse.paymentTypeName ?? '',
          stockEntryAttachmentCount: stockEntryResponse.attachmentsCount ?? 0,
          stockEntryAttachments: stockEntryResponse.stockEntryAttachments?.map((item: any) => ({
            id: item.id,
            stockEntryId: item.stockEntryId,
            fileName: item.fileName,
            filePath: item.filePath,
            fileExtension: item.fileExtension,
          })) ?? [],
          stockEntryItems: stockEntryResponse.stockEntryItems?.map((item: any) => ({
            id: item.id,
            merchandiseId: item.merchandiseId,
            categoryId: item.categoryId,
            unitId: item.unitId,
            quantity: item.quantity?.toString() ?? '',
            totalAmount: formatCurrencyBRL(item.totalAmount?.toString()) ?? '',
          })) ?? []
        });
      }
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };
  
  useEffect(() => {
    if(stockEntryPreviewModal.isModalOpen){
      fetchInitialData();
    }
  }, [stockEntryPreviewModal.isModalOpen]);

  const handleDownload = async (id: string) => {
    try {
      setIsLoading(true);

      const response = await getFileUrlStockEntryAttachment({ id: id });
            
      if(response.fileUrl){
        window.location.href = response.fileUrl;
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false);
    }
  };

  const openFilePreview = async (file: StockEntryAttachment) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const calculateUnitCost = (totalCost: string, quantity: string) => {
    const total = parseCurrency(totalCost)
    const qty = Number.parseFloat(quantity) || 0
    if (qty > 0) {
      return (total / qty).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    }
    return "R$ 0,00"
  };

  const calculateTotalLaunchedValue = () => {
    const total = stockEntry.stockEntryItems.reduce((acc, item) => {
    const itemTotal = parseCurrency(item.totalAmount) || 0
      return acc + itemTotal
    }, 0);

    return total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Calcular quantidade de itens
  const calculateTotalItems = () => {
    return stockEntry.stockEntryItems.filter( (item) => item.merchandiseId && item.merchandiseId.trim() !== "" ).length;
  };

  const handleClose = () => {
    setStockEntry(initialStockEntry);
    stockEntryPreviewModal.openModal(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <p className="font-bebas text-3xl text-gray-900 tracking-wide">Visualizar Entrada</p>
          <DialogTitle className="hidden"></DialogTitle>
          <p className="font-nunito text-gray-600">Detalhes completos da entrada de mercadorias.</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Primeira linha - Informações principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Fornecedor</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{suppliers.find((s) => s.id === stockEntry.supplierId)?.fantasyName || ""}</span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Forma de Pagamento</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <Badge variant="secondary" className="text-xs">
                  {paymentTypes.find((p) => p.id === stockEntry.paymentTypeId)?.name || ""}
                </Badge>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Prazo</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{paymentTerms.find((p) => p.id === stockEntry.paymentTermId)?.name || ""}</span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Data da Compra</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{moment(stockEntry.purchaseDate).format("DD/MM/YYYY")}</span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Data Prevista de Receb.</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{moment(stockEntry.expectedDeliveryDate).format("DD/MM/YYYY")}</span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Label className="font-nunito font-medium text-gray-700">Nº NF</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{stockEntry.invoiceNumber}</span>
              </div>
            </div>
          </div>

          {/* Segunda linha - Responsável e Valor Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-nunito font-medium text-gray-700">Responsável pela Entrada</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{stockEntry.receivedBy}</span>
              </div>
            </div>

            <div>
              <Label className="font-nunito font-medium text-gray-700">Valor Total da Nota Fiscal</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md border">
                <span className="font-nunito text-gray-900">{stockEntry.totalAmount}</span>
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
                  {stockEntry.stockEntryItems && stockEntry.stockEntryItems.length > 0 ? (
                    stockEntry.stockEntryItems.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-nunito font-medium text-gray-900">{merchandises.find((m) => m.id === item.merchandiseId)?.name || ""}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{categories.find((c) => c.id === item.categoryId)?.name || ""}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{units.find((u) => u.id === item.unitId)?.name || ""}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{item.quantity}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{item.totalAmount}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{calculateUnitCost(item.totalAmount, item.quantity)}</TableCell>
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
                  {calculateTotalLaunchedValue()}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-nunito font-medium text-gray-900">Quantidade de Itens/Mercadorias</span>
                <Badge variant="secondary" className="font-nunito font-semibold">
                  {calculateTotalItems()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Anexos */}
          {stockEntry.stockEntryAttachments.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-nunito font-semibold text-gray-900">Documentos Anexados:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stockEntry.stockEntryAttachments.map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Paperclip className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="font-nunito text-sm text-gray-700 truncate">{file.fileName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openFilePreview(file)} className="h-6 w-6 p-0">
                        <Eye className="h-3 w-3 text-gray-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownload(file.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal de Preview */}
        <FilePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} file={previewFile} />

        {/* Botão de Fechar */}
        <div className="flex justify-end pt-6 border-t">
          <Button onClick={handleClose} className="px-6 py-2">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
