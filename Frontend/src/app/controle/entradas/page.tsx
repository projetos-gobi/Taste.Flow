"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Eye, Edit, Trash2, Filter, Plus, FileText, Loader2, Package } from "lucide-react"
import { EntryControlFilterModal } from "@/src/components/entry-control-filter-modal"
import { CreateEntryControlModal } from "@/src/components/create-entry-control-modal"
import { EditEntryControlModal } from "@/src/components/edit-entry-control-modal"
import { EntryPreviewModal } from "@/src/components/entry-preview-modal"
import useSession from "@/src/hooks/useSession"
import { toast } from "sonner"
import { getStockEntriesPaged, softDeleteStockEntry } from "@/src/services/stock-entry"
import { useStockEntryCreateModal, useStockEntryEditModal, useStockEntryFilterModal, useStockEntryPreviewModal } from "@/src/hooks/useModal"
import { IGetStockEntriesPagedRequest, StockEntry, StockEntryFilter } from "@/src/types/stock-entry"
import { formatCurrencyBRL, formatDate } from "../../utils/utils"
import { Pagination } from "@/src/components/pagination"
import moment from "moment"


export default function EntryControlPage() {
  const session = useSession();
  const stockEntryFilterModal = useStockEntryFilterModal();
  const stockEntryCreateModal = useStockEntryCreateModal();
  const stockEntryEditModal = useStockEntryEditModal();
  const stockEntryPreviewModal = useStockEntryPreviewModal();

  const [activeFilters, setActiveFilters] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState<StockEntryFilter>({});
  const [isLoading, setIsLoading] = useState(false);

  const [stockEntries, setStockEntries] = useState<StockEntry[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10 

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const fetchInitialData = async (page: number = 1, filters: StockEntryFilter = appliedFilters) => {
    try {
      setIsLoading(true);

      const request: IGetStockEntriesPagedRequest = {
        query: { pageSize: itemsPerPage, page },
        filter: filters
      };

      const response = await getStockEntriesPaged(request);

      setStockEntries(response.items);
      setTotalItems(response.count);
      setCurrentPage(response.page);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (session.refresh) {
        fetchInitialData();
    }
  }, [session.refresh]);


  const handleFilterApply = (filters: StockEntryFilter) => {
    setActiveFilters( Object.values(filters).reduce((acc, value) => value !== null && value !== undefined && value !== '' && value !== 0 ? acc + 1 : acc , 0) );
    setAppliedFilters(filters);
    fetchInitialData(1, filters);   
  };

  const handlePageChange = (page: number) => {
    fetchInitialData(page);
  };

  const handleDeleteStockEntry = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esse controle de entrada?")) {
      setIsLoading(true)
      session.setRefresh(false);

      try {
        const response = await softDeleteStockEntry({ id: id});

        if(response.updated){
          toast.success("Controle de entrada deletado com sucesso!");
        }else{
          toast.error("Falha ao deletar um controle de entrada. Tente novamente.");
        } 
      } catch (error) {
        console.error("Erro ao deletar um controle de entrada:", error)
      } finally {
        session.setRefresh(true);
        setIsLoading(false);
      }
    }
  };

  const getStatusBadge = (isDeliveryCompleted: boolean, expectedDeliveryDate?: string | null) => {
    let status: "Recebido" | "Pendente" | "Atrasado";

    if (isDeliveryCompleted) {
      status = "Recebido";
    } else if (expectedDeliveryDate && moment(expectedDeliveryDate).isBefore(moment(), "day")) {
      status = "Atrasado";
    } else {
      status = "Pendente";
    }

    const badgeMap = {
      "Recebido": "bg-green-100 text-green-800",
      "Pendente": "bg-yellow-100 text-yellow-800",
      "Atrasado": "bg-red-100 text-red-800",
    };

    return (
      <Badge variant="secondary" className={`${badgeMap[status]} font-nunito`}>
        {status}
      </Badge>
    );
  };

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
        <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Controle de Entradas</h1>
        <p className="text-muted-foreground font-nunito text-gray-600">
          Gerencie e monitore todas as entradas de mercadorias e produtos.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between relative z-10">
        {/* Botão Filtros à esquerda */}
        <div className="relative">
          <Button variant="outline" onClick={() => stockEntryFilterModal.openModal(true)} className="gap-2 font-nunito">
            <Filter className="h-4 w-4" />
            Filtros e Visualização
          </Button>
          {activeFilters > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {activeFilters}
            </Badge>
          )}
        </div>

        {/* Botão Cadastrar à direita */}
        <Button
          onClick={() => stockEntryCreateModal.openModal(true)}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="px-6 py-12 text-center align-middle">
                      <Loader2 className="h-8 w-8 text-[#322CA7] animate-spin mx-auto" />
                        <span className="block mt-2 text-gray-600 font-nunito font-medium">
                          Carregando registros...
                        </span>
                    </TableCell>
                  </TableRow>
                ) : (
                  stockEntries.map((entry) => (
                    <TableRow key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="font-medium font-nunito text-gray-900">{entry.supplierName}</TableCell>
                      <TableCell className="font-nunito text-gray-700">{formatDate(entry.purchaseDate ?? "-")}</TableCell>
                      <TableCell className="font-nunito text-gray-700">{formatDate(entry.expectedDeliveryDate ?? "-")}</TableCell>
                      <TableCell>{getStatusBadge(entry.isDeliveryCompleted, entry.expectedDeliveryDate)}</TableCell>
                      <TableCell className="font-nunito text-gray-700">{entry.paymentTypeName}</TableCell>
                      <TableCell className="font-nunito text-gray-700">{formatCurrencyBRL(entry.totalAmount.toString())}</TableCell>
                      <TableCell className="font-nunito text-gray-700">
                        {entry.stockEntryAttachmentCount > 0 ? (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span>{entry.stockEntryAttachmentCount}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => stockEntryPreviewModal.openModal(true,  entry.id)}>
                            <Eye className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => stockEntryEditModal.openModal(true, entry.id)}>
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteStockEntry(entry.id)}>
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
          {/* Estado vazio */}
          {!isLoading && stockEntries.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhum controle de entrada cadastrado</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">Comece cadastrando seu primeiro controle de entrada.</p>
              <Button
                onClick={() => stockEntryCreateModal.openModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Controle de Entrada
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {stockEntries.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      <EntryControlFilterModal
        isOpen={stockEntryFilterModal.isOpen}
        onApplyFilters={handleFilterApply}
      />

      <CreateEntryControlModal isOpen={stockEntryCreateModal.isOpen} />

      <EditEntryControlModal isOpen={stockEntryEditModal.isModalOpen} />

      <EntryPreviewModal isOpen={stockEntryPreviewModal.isModalOpen} />
    </div>
  )
}
