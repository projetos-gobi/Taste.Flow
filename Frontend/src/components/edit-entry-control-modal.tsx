"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Select } from "@/src/components/ui/select"
import { Plus, Trash2, Paperclip, Check, ChevronsUpDown, Calendar, Eye, X, Download } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { IUpdateStockEntryRequest, StockEntry } from "../types/stock-entry"
import useSession from "../hooks/useSession"
import { Unit } from "../types/unit"
import { Category } from "../types/category"
import { Merchandise } from "../types/merchandise"
import { PaymentType } from "../types/payment-type"
import { Supplier } from "../types/supplier"
import { PaymentTerm } from "../types/payment-term"
import { useStockEntryEditModal } from "../hooks/useModal"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllUnitsByEnterpriseId } from "../services/unit"
import { getAllMerchandisesByEnterpriseId } from "../services/merchandise"
import { getAllPaymentTypesByEnterpriseId } from "../services/payment-type"
import { getAllSuppliersByEnterpriseId } from "../services/supplier"
import { getAllPaymentTerms } from "../services/payment-term"
import { StockEntryItem } from "../types/stock-entry-item"
import { currency, formatCurrencyBRL, parseCurrency, removeCurrencyMask } from "../app/utils/utils"
import { AutocompleteField } from "./auto-complete-field"
import { FilePreviewModal } from "./file-preview-modal"
import { getStockEntryById, updateStockEntry } from "../services/stock-entry"
import moment from "moment"
import { Checkbox } from "./ui/checkbox"
import { StockEntryAttachment } from "../types/stock-entry-attachment"

interface EditEntryControlModalProps {
  isOpen: boolean;
}

export function EditEntryControlModal({ isOpen }: EditEntryControlModalProps) {
  const session = useSession();
  const stockEntryEditModal = useStockEntryEditModal();

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
        getStockEntryById({ id: stockEntryEditModal.stockEntryId })
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
    if(stockEntryEditModal.isModalOpen){
      fetchInitialData();
    }
  }, [stockEntryEditModal.isModalOpen]);

  const handleChange = (field: keyof StockEntry, value: string | boolean | string[] | null) => {
    setStockEntry((prev) => ({ ...prev, [field]: value }))
  };

  const handleAddStockEntryItem = () => {
    const newItem: StockEntryItem = {
      id: crypto.randomUUID(), 
      merchandiseId: "",
      categoryId: "",
      unitId: "",
      quantity: "",
      totalAmount: "",
    };
    setStockEntry((prev) => ({ ...prev, stockEntryItems: [...prev.stockEntryItems, newItem], }));
  };

  const handleDeleteStockEntryItem = (id: string) => {
    setStockEntry((prev) => {
      if (prev.stockEntryItems.length <= 1) return prev; 

      return {
        ...prev,
        stockEntryItems: prev.stockEntryItems.filter((item) => item.id !== id),
      };
    });
  };

  const handleStockEntryItemChange = (id: string, field: keyof StockEntryItem, value: string) => {
    setStockEntry((prev) => ({
      ...prev,
      stockEntryItems: prev.stockEntryItems.map((item) => {
        if (item.id !== id) return item;

        let updatedItem: StockEntryItem = {
          ...item,
          [field]: value,
        };

        if (field === "merchandiseId") {
          const merchandise = merchandises.find((m) => m.id === value);
          if (merchandise) {
            updatedItem.unitId = merchandise.unitId;
            updatedItem.categoryId = merchandise.categoryId;
          }
        }

        return updatedItem;
      }),
    }));
  };

  // Calcular custo unitário
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

  // Calcular valor total lançado
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

  // Configuração do dropzone para upload de arquivos
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAttachedFiles((prev) => [...prev, ...acceptedFiles])
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    multiple: true,
  });

  const fileToStockEntryAttachment = async (file: File): Promise<StockEntryAttachment> => {
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return {
      id: null, 
      fileName: file.name,
      fileExtension: file.type,
      fileSize: file.size,
      file: base64 as any,
      isDeleted: false,
    };
  };


  // Remover arquivo anexado
  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index))
  };

  // Abrir preview do arquivo
  const openFilePreview = async (file: StockEntryAttachment | File) => {
    if (file instanceof File) {
      var attachment = await fileToStockEntryAttachment(file);
      setPreviewFile(attachment);
    }else{
      setPreviewFile(file);
    }
    setIsPreviewOpen(true);
  };

  const handleDeleteAttachment = (id: string) => {
    setStockEntry((prev) => ({
      ...prev,
      stockEntryAttachments: prev.stockEntryAttachments.map((attachment) =>
        attachment.id === id
          ? { ...attachment, isDeleted: true }
          : attachment
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    session.setRefresh(false);

    try {
      const newAttachments = await Promise.all(
        attachedFiles.map(fileToStockEntryAttachment)
      );

      const allAttachments: StockEntryAttachment[] = [
        ...stockEntry.stockEntryAttachments,
        ...newAttachments
      ];

      const request: IUpdateStockEntryRequest = {
        ...stockEntry,
        totalAmount: removeCurrencyMask(stockEntry.totalAmount),
        stockEntryItems: stockEntry.stockEntryItems.map(item => ({
          ...item,
          totalAmount: removeCurrencyMask(item.totalAmount)
        })),
        stockEntryAttachments: allAttachments
      };

      const response = await updateStockEntry(request);

      if(response.updated){
        toast.success("Controle de entrada criado com sucesso!");
        handleClose();
      }else{
        toast.error("Falha ao criar o controle de entrada. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao salvar controle de entrada:", error)
    } finally {
      session.setRefresh(true);
      setIsLoading(false)
    }
  };

  const handleClose = () => {
    setStockEntry(initialStockEntry);
    setAttachedFiles([]);
    stockEntryEditModal.openModal(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <p className="font-bebas text-3xl text-gray-900 tracking-wide">Editar Entrada</p>
            <DialogTitle className="hidden"></DialogTitle>
            <p className="font-nunito text-gray-600">Editando entrada de Mercadoria.</p>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Campos principais */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDeliveryCompleted"
                  checked={stockEntry.isDeliveryCompleted}
                  onCheckedChange={(checked) => handleChange("isDeliveryCompleted", checked as boolean)}
                />
                <Label htmlFor="isDeliveryCompleted" className="font-body">Mercadoria recebida</Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Fornecedor */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Fornecedor <span className="text-red-500">*</span>
                </Label>
                <AutocompleteField
                  value={stockEntry.supplierId ?? ""}
                  onValueChange={(value) => handleChange("supplierId", value)}
                  options={suppliers.map(s => ({
                    id: s.id,
                    name: s.fantasyName,
                  }))}
                  placeholder="Selecione a Opção"
                  emptyMessage="Nenhum fornecedor encontrado."
                />
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Forma de Pagamento <span className="text-red-500">*</span>
                </Label>
                <AutocompleteField
                  value={stockEntry.paymentTypeId ?? ""}
                  onValueChange={(val) => handleChange("paymentTypeId", val)}
                  options={paymentTypes.map((p) => ({ id: p.id.toString(), name: p.name }))}
                  placeholder="Selecione a forma"
                  emptyMessage="Nenhuma opção encontrada."
                  className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-12"
                />
              </div>

              {/* Prazo */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Prazo <span className="text-red-500">*</span>
                </Label>
                <AutocompleteField
                  value={stockEntry.paymentTermId ?? ""}
                  onValueChange={(val) => handleChange("paymentTermId", val)}
                  options={paymentTerms
                    .sort((a, b) => a.order - b.order)
                    .map((term) => ({ id: term.id.toString(), name: term.name }))}
                  placeholder="Selecione o prazo"
                  emptyMessage="Nenhuma opção encontrada."
                  className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-12"
                />
              </div>

              {/* Data da Compra */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Data da Compra <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={stockEntry.purchaseDate ?? ""}
                  onChange={(e) => handleChange("purchaseDate", e.target.value)}
                  placeholder="dd/mm/aaaa"
                />
              </div>

              {/* Data Prevista de Recebimento */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Data Prevista de Receb. <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  value={stockEntry.expectedDeliveryDate ?? ""}
                  onChange={(e) => handleChange("expectedDeliveryDate", e.target.value)}
                  placeholder="dd/mm/aaaa"
                />
              </div>

              {/* Nº NF */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">Nº NF</Label>
                <Input
                  placeholder="0000"
                  value={stockEntry.invoiceNumber ?? ""}
                  onChange={(e) => handleChange("invoiceNumber", e.target.value)}
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
                  value={stockEntry.receivedBy}
                  onChange={(e) => handleChange("receivedBy", e.target.value)}
                  className="h-12 bg-white border-gray-200"
                />
              </div>

              {/* Valor Total da Nota Fiscal */}
              <div className="space-y-2">
                <Label className="font-nunito font-medium text-gray-900">
                  Valor Total da Nota Fiscal <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={stockEntry.totalAmount ?? 0}
                  onChange={(e) => handleChange("totalAmount", currency(e.target.value))}
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
                    {stockEntry.stockEntryItems.map((item, index) => (
                      <TableRow key={item.id} className="border-b border-gray-100">
                        <TableCell className="w-1/5 border-r border-gray-100">
                          <AutocompleteField
                            value={item.merchandiseId}
                            onValueChange={(value) => handleStockEntryItemChange(item.id, "merchandiseId", value)}
                            options={merchandises.map(m => ({
                              id: m.id,
                              name: m.name,
                            }))}
                            placeholder="Selecione uma opção"
                            emptyMessage="Nenhuma mercadoria encontrada."
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <Input
                            value={categories.find((c) => c.id === item.categoryId)?.name || ""}
                            disabled
                            className="bg-gray-100 text-gray-600"
                            placeholder="Categoria"
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <Input
                            value={units.find((u) => u.id === item.unitId)?.name || ""}
                            disabled
                            className="bg-gray-100 text-gray-600"
                            placeholder="Unidade"
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleStockEntryItemChange(item.id, "quantity", e.target.value)}
                            className="bg-white"
                            placeholder="-"
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <Input
                            value={item.totalAmount ?? ""}
                            onChange={(e) => handleStockEntryItemChange(item.id, "totalAmount", currency(e.target.value))}
                            placeholder="R$ 0,00"
                            className="bg-white"
                          />
                        </TableCell>
                        <TableCell className="border-r border-gray-100">
                          <Input value={calculateUnitCost(item.totalAmount, item.quantity)} disabled className="bg-gray-100 text-gray-600" placeholder="-" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteStockEntryItem(item.id)}
                            disabled={stockEntry.stockEntryItems.length === 1}
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
                onClick={handleAddStockEntryItem}
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
              {(attachedFiles.length > 0 || stockEntry.stockEntryAttachments.length > 0) && (
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

                    {stockEntry.stockEntryAttachments.filter((file) => !file.isDeleted).map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Paperclip className="h-4 w-4 text-gray-500 flex-shrink-0" />
                          <span className="font-nunito text-sm text-gray-700 truncate">{file.fileName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openFilePreview(file)} className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAttachment(file.id ?? "")} className="h-6 w-6 p-0">
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
            <Button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700">
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Preview */}
      <FilePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} file={previewFile} />
    </>
  )
}
