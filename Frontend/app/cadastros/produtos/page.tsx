"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Filter, Package, Settings, Eye, SquarePen, Trash2 } from "lucide-react"
import { TechnicalSheetForm } from "@/components/technical-sheet-form"
import { IntermediateProductTechnicalSheet } from "@/components/intermediate-product-technical-sheet"
import { ProductsFilterModal } from "@/components/products-filter-modal"
import { AlternativeRecipesModal } from "@/components/alternative-recipes-modal"
import { ProductTypeSelectionModal } from "@/components/product-type-selection-modal"
import { AlternativeProductSelectionModal } from "@/components/alternative-product-selection-modal"

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<"final" | "intermediate">("final")
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isTechnicalSheetOpen, setIsTechnicalSheetOpen] = useState(false)
  const [isIntermediateSheetOpen, setIsIntermediateSheetOpen] = useState(false)
  const [isAlternativeModalOpen, setIsAlternativeModalOpen] = useState(false)
  const [isProductTypeSelectionOpen, setIsProductTypeSelectionOpen] = useState(false)
  const [isAlternativeSelectionOpen, setIsAlternativeSelectionOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [technicalSheetMode, setTechnicalSheetMode] = useState<"create" | "edit" | "view">("create")
  const [technicalSheetType, setTechnicalSheetType] = useState<"original" | "alternative">("original")
  const [createdProducts, setCreatedProducts] = useState<any[]>([])

  // Mock data for final products
  const finalProducts = [
    {
      id: 1,
      name: "Torta de Maçã Natal",
      category: "Sobremesas",
      subCategory: "Natal",
      salePrice: "R$ 180,00",
      marginValue: "R$ 129,60",
      marginPercent: "72%",
      alternativeCount: 2,
    },
    {
      id: 2,
      name: "Bolo de Nozes Natal",
      category: "Sobremesas",
      subCategory: "Natal",
      salePrice: "R$ 270,00",
      marginValue: "R$ 170,10",
      marginPercent: "63%",
      alternativeCount: 1,
    },
    {
      id: 3,
      name: "Torta de Morango Natal",
      category: "Sobremesas",
      subCategory: "Natal",
      salePrice: "R$ 250,00",
      marginValue: "R$ 157,50",
      marginPercent: "63%",
      alternativeCount: 3,
    },
    {
      id: 4,
      name: "Torta de Chocolate Intenso Natal",
      category: "Sobremesas",
      subCategory: "Natal",
      salePrice: "R$ 350,00",
      marginValue: "R$ 220,50",
      marginPercent: "63%",
      alternativeCount: 0,
    },
    {
      id: 5,
      name: "Bolo de Milho Cremoso Natal",
      category: "Sobremesas",
      subCategory: "Natal",
      salePrice: "R$ 190,00",
      marginValue: "R$ 119,70",
      marginPercent: "63%",
      alternativeCount: 1,
    },
    {
      id: 6,
      name: "Torta de Maçã",
      category: "Sobremesas",
      subCategory: "-",
      salePrice: "R$ 120,00",
      marginValue: "R$ 75,60",
      marginPercent: "63%",
      alternativeCount: 2,
    },
    {
      id: 7,
      name: "Bolo de Nozes",
      category: "Sobremesas",
      subCategory: "-",
      salePrice: "R$ 210,00",
      marginValue: "R$ 132,30",
      marginPercent: "63%",
      alternativeCount: 0,
    },
    {
      id: 8,
      name: "Torta de Morango",
      category: "Sobremesas",
      subCategory: "-",
      salePrice: "R$ 200,00",
      marginValue: "R$ 126,00",
      marginPercent: "63%",
      alternativeCount: 1,
    },
    {
      id: 9,
      name: "Torta de Chocolate Intenso",
      category: "Sobremesas",
      subCategory: "-",
      salePrice: "R$ 290,00",
      marginValue: "R$ 182,70",
      marginPercent: "63%",
      alternativeCount: 4,
    },
    {
      id: 10,
      name: "Bolo de Milho Cremoso",
      category: "Sobremesas",
      subCategory: "-",
      salePrice: "R$ 120,00",
      marginValue: "R$ 75,60",
      marginPercent: "63%",
      alternativeCount: 0,
    },
  ]

  // Mock data for intermediate products
  const intermediateProducts = [
    {
      id: 1,
      name: "Massa Base para Bolos",
      category: "Base",
      subCategory: "Massas",
      productionCost: "R$ 8,20",
      yield: "2 kg",
      status: "Ativo",
    },
    {
      id: 2,
      name: "Cobertura de Chocolate",
      category: "Complemento",
      subCategory: "Coberturas",
      productionCost: "R$ 12,50",
      yield: "1,5 kg",
      status: "Ativo",
    },
  ]

  const handleCreateProduct = () => {
    if (activeTab === "final") {
      setIsProductTypeSelectionOpen(true)
    } else {
      setSelectedProduct(null)
      setIsIntermediateSheetOpen(true)
    }
  }

  const handleSelectOriginal = () => {
    setIsProductTypeSelectionOpen(false)
    setTechnicalSheetMode("create")
    setTechnicalSheetType("original")
    setSelectedProduct(null)
    setIsTechnicalSheetOpen(true)
  }

  const handleSelectAlternative = () => {
    setIsProductTypeSelectionOpen(false)
    setIsAlternativeSelectionOpen(true)
  }

  const handleAlternativeProductSelect = (product: any) => {
    setIsAlternativeSelectionOpen(false)
    setTechnicalSheetMode("create")
    setTechnicalSheetType("alternative")
    setSelectedProduct(product)
    setIsTechnicalSheetOpen(true)
  }

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product)
    if (activeTab === "final") {
      setTechnicalSheetMode("edit")
      setTechnicalSheetType("original")
      setIsTechnicalSheetOpen(true)
    } else {
      setIsIntermediateSheetOpen(true)
    }
  }

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product)
    if (activeTab === "final") {
      setTechnicalSheetMode("view")
      setTechnicalSheetType("original")
      setIsTechnicalSheetOpen(true)
    } else {
      setIsIntermediateSheetOpen(true)
    }
  }

  const handleViewAlternatives = (product: any) => {
    setSelectedProduct(product)
    setIsAlternativeModalOpen(true)
  }

  const handleProductCreated = (productData: any) => {
    console.log("Produto criado:", productData)

    // Criar novo produto com ID único e dados formatados
    const newProduct = {
      id: Date.now(),
      name: productData.name,
      category: productData.category,
      subCategory: productData.subCategory || "-",
      salePrice: productData.totals?.vendaSugerida
        ? `R$ ${productData.totals.vendaSugerida.toFixed(2).replace(".", ",")}`
        : "R$ 0,00",
      marginValue: productData.totals?.valorMargem
        ? `R$ ${productData.totals.valorMargem.toFixed(2).replace(".", ",")}`
        : "R$ 0,00",
      marginPercent: productData.totals?.margemDesejada ? `${productData.totals.margemDesejada.toFixed(0)}%` : "0%",
      alternativeCount: 0,
      productionCost: productData.totals?.custoTotal
        ? `R$ ${productData.totals.custoTotal.toFixed(2).replace(".", ",")}`
        : "R$ 0,00",
      yield: productData.yield || "1",
      status: "Ativo",
      type: productData.type,
      productType: productData.productType,
      recipeItems: productData.recipeItems,
      intermediateProducts: productData.intermediateProducts,
      recipeName: productData.recipeName,
      ingredients: productData.ingredients,
      instructions: productData.instructions,
      // Salvar valores originais para edição - usar o multiplicador diretamente do formulário
      valorVendaFinal: productData.valorVendaFinal,
      multiplicador: productData.multiplicador, // Usar o valor direto do formulário
      totals: productData.totals,
    }

    if (activeTab === "final") {
      setCreatedProducts((prev) => [...prev, newProduct])
    } else {
      setCreatedProducts((prev) => [...prev, newProduct])
    }
  }

  const handleProductUpdated = (productData: any) => {
    console.log("Produto atualizado:", productData)
  }

  // Combinar produtos criados com produtos existentes
  const allFinalProducts = [...finalProducts, ...createdProducts.filter((p) => p.productType === "final")]
  const allIntermediateProducts = [
    ...intermediateProducts,
    ...createdProducts.filter((p) => p.productType === "intermediate"),
  ]

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
        <h1 className="text-3xl font-bold tracking-tight font-bebas text-gray-900">Produtos</h1>
        <p className="text-muted-foreground font-nunito text-gray-600">
          Área dedicada ao cadastro de Informações para o Sistema.
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between relative z-10">
        <div className="relative">
          <Button variant="outline" onClick={() => setIsFilterModalOpen(true)} className="gap-2 font-nunito">
            <Filter className="h-4 w-4" />
            Filtros e Visualização
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setActiveTab("final")}
            className={`gap-2 font-nunito ${
              activeTab === "final"
                ? "bg-[#322ca7] hover:bg-[#322ca7]/90 text-white"
                : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            Produtos Finais
          </Button>
          <Button onClick={() => setActiveTab("intermediate")} variant="outline" className="gap-2 font-nunito">
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
                {(activeTab === "final" ? allFinalProducts : allIntermediateProducts).map((product) => (
                  <TableRow key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="font-medium font-nunito text-gray-900">{product.name}</TableCell>
                    <TableCell className="font-nunito text-gray-700">{product.category}</TableCell>
                    <TableCell className="font-nunito text-gray-700">{product.subCategory}</TableCell>
                    {activeTab === "final" ? (
                      <>
                        <TableCell className="font-nunito text-gray-700">{(product as any).salePrice}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{(product as any).marginValue}</TableCell>
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
                        <TableCell className="font-nunito text-gray-700">{(product as any).productionCost}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{(product as any).yield}</TableCell>
                        <TableCell className="font-nunito text-gray-700">{(product as any).status}</TableCell>
                      </>
                    )}
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProduct(product)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="h-8 w-8 p-0"
                        >
                          <SquarePen className="h-4 w-4 text-gray-500" />
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
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between relative z-10 mb-8">
        <p className="text-sm text-gray-600 font-nunito">Mostrando 1 à 10 de 10 total</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled className="h-10 w-10 bg-transparent">
            <span className="sr-only">Primeira página</span>
            &lt;&lt;
          </Button>
          <Button variant="outline" size="sm" disabled className="h-10 w-10 bg-transparent">
            <span className="sr-only">Página anterior</span>
            &lt;
          </Button>
          <Button size="sm" className="h-10 w-10 bg-[#322ca7] hover:bg-[#322ca7]/90">
            1
          </Button>
          <Button variant="outline" size="sm" disabled className="h-10 w-10 bg-transparent">
            <span className="sr-only">Próxima página</span>
            &gt;
          </Button>
          <Button variant="outline" size="sm" disabled className="h-10 w-10 bg-transparent">
            <span className="sr-only">Última página</span>
            &gt;&gt;
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ProductsFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        productType={activeTab}
      />

      <ProductTypeSelectionModal
        isOpen={isProductTypeSelectionOpen}
        onClose={() => setIsProductTypeSelectionOpen(false)}
        onSelect
        onSelectOriginal={handleSelectOriginal}
        onSelectAlternative={handleSelectAlternative}
      />

      <AlternativeProductSelectionModal
        isOpen={isAlternativeSelectionOpen}
        onClose={() => setIsAlternativeSelectionOpen(false)}
        onSelectProduct={handleAlternativeProductSelect}
      />

      <TechnicalSheetForm
        isOpen={isTechnicalSheetOpen}
        onClose={() => setIsTechnicalSheetOpen(false)}
        mode={technicalSheetMode}
        type={technicalSheetType}
        originalProduct={selectedProduct}
        productType="final"
        productData={selectedProduct}
        onProductCreated={handleProductCreated}
        onProductUpdated={handleProductUpdated}
      />

      <IntermediateProductTechnicalSheet
        isOpen={isIntermediateSheetOpen}
        onClose={() => setIsIntermediateSheetOpen(false)}
        productData={selectedProduct}
        onProductCreated={handleProductCreated}
        onProductUpdated={handleProductUpdated}
      />

      <AlternativeRecipesModal
        isOpen={isAlternativeModalOpen}
        onClose={() => setIsAlternativeModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  )
}
