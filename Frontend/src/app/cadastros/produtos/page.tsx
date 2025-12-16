"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Filter, Package, Settings, Eye, SquarePen, Trash2 } from "lucide-react"
import { TechnicalSheetForm } from "@/src/components/technical-sheet-form"
import { IntermediateProductTechnicalSheet } from "@/src/components/intermediate-product-technical-sheet"
import { ProductsFilterModal } from "@/src/components/products-filter-modal"
import { AlternativeRecipesModal } from "@/src/components/alternative-recipes-modal"
import { ProductTypeSelectionModal } from "@/src/components/product-type-selection-modal"
import { ProductAlternativeSelectionModal } from "@/src/components/alternative-product-selection-modal"
import { useProductAlternativeSelectionModal, useProductFilterModal, useProductIntermediateModal, useProductModal, useProductTypeSelectionModal } from "@/src/hooks/useModal"
import useSession from "@/src/hooks/useSession"
import { toast } from "sonner"
import { ProductIntermediateFilter } from "@/src/types/product-intermediate"
import { getProductIntermediatesPaged, softDeleteProductIntermediate } from "@/src/services/product-intermediate"
import { getProductsPaged, softDeleteProduct } from "@/src/services/product"
import { formatCurrencyNumber, parseCurrency } from "../../utils/utils"
import { Pagination } from "@/src/components/pagination"
import { ProductFilter } from "@/src/types/product"

export default function ProductsPage() {
  const session = useSession();
  const productModal = useProductModal();
  const productIntermediateModal = useProductIntermediateModal();
  const productTypeSelectionModal = useProductTypeSelectionModal();
  const productFilterModal = useProductFilterModal();
  const productAlternativeSelectionModal = useProductAlternativeSelectionModal();

  const [activeTab, setActiveTab] = useState<"final" | "intermediate">("final")
  const [isTechnicalSheetOpen, setIsTechnicalSheetOpen] = useState(false)
  const [isAlternativeModalOpen, setIsAlternativeModalOpen] = useState(false)
  const [isAlternativeSelectionOpen, setIsAlternativeSelectionOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [technicalSheetMode, setTechnicalSheetMode] = useState<"create" | "edit" | "view">("create")
  const [technicalSheetType, setTechnicalSheetType] = useState<"original" | "alternative">("original")

  
  const [appliedFilters, setAppliedFilters] = useState<ProductIntermediateFilter>({});
  const [activeFilters, setActiveFilters] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [products, setProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10 

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = products.slice(startIndex, endIndex)

  const fetchInitialData = async (page: number = 1, filters: ProductFilter = appliedFilters) => {
    try {
      const data = {
        query: { pageSize: itemsPerPage, page },
        filter: {
          ...filters,
          minPrice: filters.minPrice ? parseCurrency(filters.minPrice).toString() : null,
          maxPrice: filters.maxPrice ? parseCurrency(filters.maxPrice).toString() : null,
        }
      };

      let response;

      if (activeTab === "intermediate") {
        response = await getProductIntermediatesPaged(data);
      } else if (activeTab === "final") {
        response = await getProductsPaged(data);
      }

      setProducts(response.items);
      setTotalItems(response.count);
      setCurrentPage(response.page);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchInitialData(1);
  }, [activeTab]);

  useEffect(() => {
    if (session.refresh) {
        fetchInitialData();
    }
  }, [session.refresh]);

  const handleCreateProduct = async () => {
    if (activeTab === "final") {
      productTypeSelectionModal.openModal(true);
    } else {
      productIntermediateModal.openModal(true, 'create');
    }
  };

  const handleAlternativeProductSelect = (product: any) => {
    setIsAlternativeSelectionOpen(false)
    setTechnicalSheetMode("create")
    setTechnicalSheetType("alternative")
    setSelectedProduct(product)
    setIsTechnicalSheetOpen(true)
  };

  const handleEditProduct = (id: string) => {
    if (activeTab === "final") {
      productModal.openModal(true, 'edit', "original", id);
    } else {
      productIntermediateModal.openModal(true, 'edit', id);
    }
  };

  const handleViewProduct = (id: string) => {
    if (activeTab === "final") {
      productModal.openModal(true, 'view', "original", id);
    } else {
      productIntermediateModal.openModal(true, 'view', id);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (activeTab === "final") {
      if (confirm("Tem certeza que deseja excluir esse produto final?")) {
        session.setRefresh(false);

        try {
          const response = await softDeleteProduct({ id: id});
  
          if(response.updated){
            toast.success("Produto deletado com sucesso!");
          }else{
            toast.error("Falha ao deletar um produto. Tente novamente.");
          } 
        } catch (error) {
          console.error("Erro ao deletar produto final:", error);
        } finally {
          session.setRefresh(true);
        }
      }
    } else {
      if (confirm("Tem certeza que deseja excluir esse produto intermediário?")) {
        setIsLoading(true)
        session.setRefresh(false);
  
        try {
          const response = await softDeleteProductIntermediate({ id: id});
  
          if(response.updated){
            toast.success("Produto intermediário deletado com sucesso!");
          }else{
            toast.error("Falha ao deletar um produto intermediário. Tente novamente.");
          } 
        } catch (error) {
          console.error("Erro ao deletar um produto intermediário:", error)
        } finally {
          session.setRefresh(true);
          setIsLoading(false)
        }
      }
    }
  };

  const handleTabChange = async (tab: "final" | "intermediate") => {
    setActiveTab(tab);
  };

  const handleViewAlternatives = (product: any) => {
    setSelectedProduct(product)
    setIsAlternativeModalOpen(true)
  };

  const handlePageChange = (page: number) => {
    fetchInitialData(page);
  };

  return (
    <div className="space-y-6 pl-6 pr-6 relative">
      {/* Background decorative image */}
      <div className="absolute top-0 right-0 -z-10 pointer-events-none overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20Tela%202025-06-26%20a%CC%80s%2019.30.49-LmbGdht0HFXAfYms3pJLBjOISw6faF.png"
          alt="Decorative background"
          className="w-96 h-64 object-contain opacity-40"
        />
      </div>

      {/* Header */}
      <div>
        <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Produtos</h1>
        <p className="text-muted-foreground font-nunito text-gray-600">
          Área dedicada ao cadastro de Informações para o Sistema.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between relative z-10">
        <div className="relative">
          <Button variant="outline" onClick={() => productFilterModal.openModal(true, activeTab)} className="gap-2 font-nunito">
            <Filter className="h-4 w-4" />
            Filtros e Visualização
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleTabChange("final")}
            variant={activeTab === "final" ? "default" : "outline"}
            className={`gap-2 font-nunito ${
              activeTab === "final" ? "bg-[#322ca7] hover:bg-[#322ca7]/90 text-white" : ""
            }`}
          >
            <Package className="h-4 w-4" />
            Produtos Finais
          </Button>

          <Button
            onClick={() => handleTabChange("intermediate")}
            variant={activeTab === "intermediate" ? "default" : "outline"}
            className={`gap-2 font-nunito ${
              activeTab === "intermediate" ? "bg-[#322ca7] hover:bg-[#322ca7]/90 text-white" : ""
            }`}
          >
            <Settings className="h-4 w-4" />
            Produtos Intermediários
          </Button>
        </div>

        <Button onClick={handleCreateProduct} className="gap-2 bg-[#322ca7] hover:bg-[#322ca7]/90 font-nunito">
          <Package className="h-4 w-4" />
          {activeTab === "final" ? "Cadastrar Produto Final" : "Cadastrar Produto Intermediário"}
        </Button>
      </div>

      {/* Products Table */}
      <Card className="relative z-10">
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gray-50">
                  <TableHead className="font-nunito font-semibold text-gray-900">Nome do Produto</TableHead>
                  <TableHead className="font-nunito font-semibold text-gray-900">Categoria</TableHead>
                  <TableHead className="font-nunito font-semibold text-gray-900">Sub-Categoria</TableHead>
                  {activeTab === "final" ? (
                    <>
                      <TableHead className="font-nunito font-semibold text-gray-900">Valor de Venda</TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900">Margem em R$</TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900">% Margem</TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900 text-center">
                        Fch. Alternativas
                      </TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="font-nunito font-semibold text-gray-900">Custo de Produção</TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900">Rendimento</TableHead>
                      <TableHead className="font-nunito font-semibold text-gray-900">Status</TableHead>
                    </>
                  )}
                  <TableHead className="text-center font-nunito font-semibold text-gray-900">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.map((product) => (
                  <TableRow key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium font-nunito text-gray-900">{product.name}</TableCell>
                    <TableCell className="font-nunito text-gray-700">{product.categoryName}</TableCell>
                    <TableCell className="font-nunito text-gray-700">{product.subCategoryName}</TableCell>
                    {activeTab === "final" ? (
                      <>
                        <TableCell className="font-nunito text-gray-700">{formatCurrencyNumber(product.price || 0)}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{formatCurrencyNumber(product.marginValue || 0)}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{(product as any).marginPercent}</TableCell>
                        <TableCell className="text-center">
                          {(product as any).alternativeCount > 0 ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAlternatives(product)}
                              className="h-8 w-8 p-0 font-nunito font-semibold text-[#322ca7] hover:text-[#322ca7]/80 hover:bg-[#322ca7]/10"
                            >
                              {(product as any).alternativeCount}
                            </Button>
                          ) : (
                            <span className="font-nunito text-gray-400">0</span>
                          )}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-nunito text-gray-700">{formatCurrencyNumber(product.price || 0)}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{(product as any).yield}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{(product as any).isActive ? "Ativo" : "Inativo"}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProduct(product.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product.id)}
                          className="h-8 w-8 p-0"
                        >
                          <SquarePen className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}

      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      )}

      {/* Modals */}
      <ProductsFilterModal 
        isOpen={productFilterModal.isModalOpen}
        onApplyFilters={(filters) => {
          setAppliedFilters(filters);      
          fetchInitialData(1, filters);   
        }} 
      />

      <ProductTypeSelectionModal isOpen={productTypeSelectionModal.isOpen} />

      <ProductAlternativeSelectionModal isOpen={productAlternativeSelectionModal.isOpen} />

      <TechnicalSheetForm isOpen={productModal.isModalOpen} />

      <IntermediateProductTechnicalSheet isOpen={productIntermediateModal.isModalOpen} />

      {/* <AlternativeRecipesModal
        isOpen={isAlternativeModalOpen}
        onClose={() => setIsAlternativeModalOpen(false)}
        product={selectedProduct}
      /> */}
    </div>
  )
}
