"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, X } from "lucide-react"

interface TechnicalSheetFormProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit" | "view"
  type: "original" | "alternative"
  originalProduct?: any
  productType: "final" | "intermediate"
  productData?: any
  onProductCreated: (product: any) => void
  onProductUpdated: (product: any) => void
}

interface RecipeItem {
  id: string
  mercadoria: string
  unidade: string
  qtdeLiquida: string
  custoUnitario: string
  rendimento: string
  qtdeBruta: string
  precoTotal: number
}

interface IntermediateProduct {
  id: string
  produtoIntermediario: string
  mercadoria: string
  unidade: string
  qtdeLiquida: string
  custoUnitario: string
  rendimento: string
  qtdeBruta: string
  preco: number
}

export function TechnicalSheetForm({
  isOpen,
  onClose,
  mode,
  type,
  originalProduct,
  productType,
  productData,
  onProductCreated,
  onProductUpdated,
}: TechnicalSheetFormProps) {
  const [activeTab, setActiveTab] = useState("ficha-tecnica")
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    subCategoria: "",
    valorVendaFinal: "R$000,00",
    rendimentoFinal: "1",
    multiplicador: "0,0",
    nomeReceita: "",
    ingredientes: "",
    passoAPasso: "Digite aqui o modo de preparo da receita...",
  })

  const [recipeItems, setRecipeItems] = useState<RecipeItem[]>([
    {
      id: "1",
      mercadoria: "",
      unidade: "",
      qtdeLiquida: "",
      custoUnitario: "",
      rendimento: "100%",
      qtdeBruta: "",
      precoTotal: 0,
    },
  ])
  const [intermediateProducts, setIntermediateProducts] = useState<IntermediateProduct[]>([])

  const tabs = [
    { id: "ficha-tecnica", label: "Ficha Técnica", icon: "📋" },
    { id: "eventos", label: "Eventos", icon: "🎉" },
    { id: "producao", label: "Produção", icon: "🏭" },
    { id: "nutricional", label: "Nutricional", icon: "🥗" },
    { id: "ofertas", label: "Ofertas", icon: "💰" },
    { id: "lista-precos", label: "Lista de Preços", icon: "📊" },
    { id: "mais-detalhes", label: "Mais Detalhes", icon: "📝" },
    { id: "entrega", label: "Entrega", icon: "🚚" },
  ]

  // Dados de mercadorias com custos médios ponderados dos últimos 3 meses
  const mercadorias = [
    { value: "maca-fuji", label: "Maçã Fuji", unidade: "KG", custoMedio: 3.31 },
    { value: "farinha-trigo", label: "Farinha de Trigo", unidade: "KG", custoMedio: 4.5 },
    { value: "acucar-cristal", label: "Açúcar Cristal", unidade: "KG", custoMedio: 3.2 },
    { value: "ovos", label: "Ovos", unidade: "DZ", custoMedio: 0.5 },
    { value: "manteiga", label: "Manteiga", unidade: "KG", custoMedio: 25.0 },
    { value: "leite", label: "Leite", unidade: "L", custoMedio: 4.8 },
    { value: "fermento", label: "Fermento", unidade: "G", custoMedio: 8.9 },
    { value: "sal", label: "Sal", unidade: "KG", custoMedio: 2.1 },
    { value: "chocolate", label: "Chocolate", unidade: "KG", custoMedio: 18.5 },
  ]

  // Categorias cadastradas
  const categorias = [
    { value: "sobremesas", label: "Sobremesas" },
    { value: "paes", label: "Pães" },
    { value: "salgados", label: "Salgados" },
    { value: "bebidas", label: "Bebidas" },
    { value: "massas", label: "Massas" },
  ]

  // Sub-categorias cadastradas
  const subCategorias = [
    { value: "natal", label: "Natal" },
    { value: "tradicionais", label: "Tradicionais" },
    { value: "especiais", label: "Especiais" },
    { value: "veganos", label: "Veganos" },
    { value: "sem-gluten", label: "Sem Glúten" },
  ]

  // Produtos intermediários cadastrados
  const produtosIntermediarios = [
    {
      value: "massa-base",
      label: "Massa Base",
      mercadoria: "Farinha de Trigo",
      unidade: "KG",
      qtdeLiquida: "1,00",
      custoUnitario: "R$ 4,50",
      rendimento: "95%",
      qtdeBruta: "1,05",
      preco: 4.73,
    },
    {
      value: "creme-confeiteiro",
      label: "Creme de Confeiteiro",
      mercadoria: "Leite",
      unidade: "L",
      qtdeLiquida: "1,00",
      custoUnitario: "R$ 4,19",
      rendimento: "90%",
      qtdeBruta: "1,11",
      preco: 4.65,
    },
  ]

  useEffect(() => {
    if (mode === "create") {
      // Resetar formulário para novo produto
      setFormData({
        nome: type === "alternative" && originalProduct ? `${originalProduct.name} - Alternativa` : "",
        categoria: type === "alternative" && originalProduct ? originalProduct.category || "" : "",
        subCategoria: type === "alternative" && originalProduct ? originalProduct.subCategory || "" : "",
        valorVendaFinal: "R$000,00",
        rendimentoFinal: "1",
        multiplicador: "0,0",
        nomeReceita: "",
        ingredientes: "",
        passoAPasso: "Digite aqui o modo de preparo da receita...",
      })

      // Resetar itens da receita
      setRecipeItems([
        {
          id: "1",
          mercadoria: "",
          unidade: "",
          qtdeLiquida: "",
          custoUnitario: "",
          rendimento: "100%",
          qtdeBruta: "",
          precoTotal: 0,
        },
      ])

      // Resetar produtos intermediários
      setIntermediateProducts([])
    } else if (mode === "edit" || mode === "view") {
      if (productData) {
        // Para edição, usar o multiplicador salvo diretamente, sem recalcular
        const savedMultiplicador = productData.multiplicador || "0,0"

        // Formatar valor de venda final
        const savedValorVenda =
          productData.valorVendaFinal ||
          (productData.totals?.vendaSugerida
            ? `R$${productData.totals.vendaSugerida.toFixed(2).replace(".", ",")}`
            : "R$000,00")

        setFormData({
          nome: productData.name || "",
          categoria: productData.category || "",
          subCategoria: productData.subCategory || "",
          valorVendaFinal: savedValorVenda,
          rendimentoFinal: productData.yield || "1",
          multiplicador: savedMultiplicador, // Usar o valor salvo diretamente
          nomeReceita: productData.recipeName || "",
          ingredientes: productData.ingredients || "",
          passoAPasso: productData.instructions || "Digite aqui o modo de preparo da receita...",
        })

        if (productData.recipeItems) {
          setRecipeItems(productData.recipeItems)
        }
        if (productData.intermediateProducts) {
          setIntermediateProducts(productData.intermediateProducts)
        }
      }
    }
  }, [mode, type, originalProduct, productData, isOpen])

  const addRecipeItem = () => {
    const newItem: RecipeItem = {
      id: Date.now().toString(),
      mercadoria: "",
      unidade: "",
      qtdeLiquida: "",
      custoUnitario: "",
      rendimento: "100%",
      qtdeBruta: "",
      precoTotal: 0,
    }
    setRecipeItems([...recipeItems, newItem])
  }

  const removeRecipeItem = (id: string) => {
    if (recipeItems.length > 1) {
      setRecipeItems(recipeItems.filter((item) => item.id !== id))
    }
  }

  const updateRecipeItem = (id: string, field: keyof RecipeItem, value: string) => {
    setRecipeItems(
      recipeItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }

          // Quando selecionar uma mercadoria, carregar unidade e custo unitário automaticamente
          if (field === "mercadoria") {
            const mercadoria = mercadorias.find((m) => m.value === value)
            if (mercadoria) {
              updated.unidade = mercadoria.unidade
              updated.custoUnitario = `R$ ${mercadoria.custoMedio.toFixed(2).replace(".", ",")}`
            }
          }

          // Calcular qtdeBruta baseado no rendimento e quantidade líquida
          if (field === "qtdeLiquida" || field === "rendimento") {
            // Converter vírgula para ponto para cálculo
            const qtdeLiquidaStr = updated.qtdeLiquida.replace(",", ".")
            const qtdeLiquida = Number.parseFloat(qtdeLiquidaStr) || 0
            const rendimentoStr = updated.rendimento.replace("%", "").replace(",", ".")
            const rendimento = Number.parseFloat(rendimentoStr) || 100
            if (rendimento > 0 && qtdeLiquida > 0) {
              // Quantidade Bruta = Quantidade Líquida / (Rendimento/100)
              const qtdeBruta = qtdeLiquida / (rendimento / 100)
              updated.qtdeBruta = qtdeBruta.toFixed(3).replace(".", ",")
            } else {
              updated.qtdeBruta = ""
            }
          }

          // Calcular precoTotal = custoUnitario x qtdeBruta
          if (
            field === "qtdeLiquida" ||
            field === "custoUnitario" ||
            field === "rendimento" ||
            field === "mercadoria"
          ) {
            const custoStr = updated.custoUnitario.replace("R$", "").replace(" ", "").replace(",", ".")
            const custo = Number.parseFloat(custoStr) || 0
            const qtdeBrutaStr = updated.qtdeBruta.replace(",", ".")
            const qtdeBruta = Number.parseFloat(qtdeBrutaStr) || 0
            updated.precoTotal = custo * qtdeBruta
          }

          return updated
        }
        return item
      }),
    )
  }

  const addIntermediateProduct = () => {
    const newProduct: IntermediateProduct = {
      id: Date.now().toString(),
      produtoIntermediario: "",
      mercadoria: "",
      unidade: "",
      qtdeLiquida: "",
      custoUnitario: "",
      rendimento: "100%",
      qtdeBruta: "",
      preco: 0,
    }
    setIntermediateProducts([...intermediateProducts, newProduct])
  }

  const removeIntermediateProduct = (id: string) => {
    setIntermediateProducts(intermediateProducts.filter((product) => product.id !== id))
  }

  const updateIntermediateProduct = (id: string, field: keyof IntermediateProduct, value: string) => {
    setIntermediateProducts(
      intermediateProducts.map((product) => {
        if (product.id === id) {
          const updated = { ...product, [field]: value }

          // Quando selecionar um produto intermediário, carregar todos os dados automaticamente
          if (field === "produtoIntermediario") {
            const produtoInt = produtosIntermediarios.find((p) => p.value === value)
            if (produtoInt) {
              updated.mercadoria = produtoInt.mercadoria
              updated.unidade = produtoInt.unidade
              updated.qtdeLiquida = produtoInt.qtdeLiquida
              updated.custoUnitario = produtoInt.custoUnitario
              updated.rendimento = produtoInt.rendimento
              updated.qtdeBruta = produtoInt.qtdeBruta
              updated.preco = produtoInt.preco
            }
          }

          return updated
        }
        return product
      }),
    )
  }

  const calculateTotals = () => {
    const recipeTotal = recipeItems.reduce((sum, item) => sum + item.precoTotal, 0)
    const intermediateTotal = intermediateProducts.reduce((sum, product) => sum + product.preco, 0)

    // Custo Total = apenas a soma das mercadorias (sem multiplicador)
    const custoTotal = recipeTotal + intermediateTotal

    const multiplicador = Number.parseFloat(formData.multiplicador.replace(",", ".")) || 0

    // Valor da Venda Sugerida = Custo Total × Multiplicador
    // Se multiplicador for 0, venda sugerida também será 0
    const vendaSugerida = multiplicador === 0 ? 0 : custoTotal * multiplicador

    const rendimentoFinal = Number.parseFloat(formData.rendimentoFinal) || 1
    const custoPortao = custoTotal / rendimentoFinal

    const cmvTeorico = vendaSugerida > 0 ? (custoTotal / vendaSugerida) * 100 : 0
    const valorMargem = vendaSugerida - custoTotal
    const margemDesejada = vendaSugerida > 0 ? (valorMargem / vendaSugerida) * 100 : 0

    return {
      custoTotal,
      custoPortao,
      vendaSugerida,
      valorMargem,
      cmvTeorico: isNaN(cmvTeorico) ? 0 : cmvTeorico,
      margemDesejada: isNaN(margemDesejada) ? 0 : margemDesejada,
    }
  }

  const totals = calculateTotals()

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace(".", ",")}`
  }

  const handleCurrencyInput = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers === "") return "R$000,00"
    const formatted = (Number.parseInt(numbers) / 100).toFixed(2)
    return `R$${formatted.replace(".", ",")}`
  }

  const handleSubmit = () => {
    const productData = {
      name: formData.nome,
      category: formData.categoria,
      subCategory: formData.subCategoria,
      saleValue: formData.valorVendaFinal,
      yield: formData.rendimentoFinal,
      recipeName: formData.nomeReceita,
      ingredients: formData.ingredientes,
      instructions: formData.passoAPasso,
      recipeItems,
      intermediateProducts,
      totals,
      type,
      productType,
      // Incluir valores do formulário
      valorVendaFinal: formData.valorVendaFinal,
      multiplicador: formData.multiplicador,
    }

    if (mode === "create") {
      onProductCreated(productData)
    } else if (mode === "edit") {
      onProductUpdated({ ...productData, id: productData?.id })
    }

    onClose()
  }

  // Determinar o título e badge baseado no tipo
  const getTitle = () => {
    if (type === "original") {
      return "Cadastrando um novo Produto Original"
    } else {
      return "Cadastrando um novo Produto Alternativo"
    }
  }

  const getBadgeText = () => {
    return type === "original" ? "Original" : "Alternativo"
  }

  const getBadgeColor = () => {
    return type === "original" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 bg-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-medium text-gray-900 mb-1">{getTitle()}</h1>
              <p className="text-sm text-gray-600">O cadastro acontece a partir dos dados nos Cadastro de Base.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getBadgeColor()} font-medium px-3 py-1`}>{getBadgeText()}</Badge>
              <Button onClick={onClose} variant="ghost" size="sm" className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 mb-6 border-b border-gray-200">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={index > 0} // Desabilitar todas as abas exceto a primeira
                className={`px-4 py-3 text-sm border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-white"
                    : index === 0
                      ? "border-transparent text-gray-500 hover:text-gray-700"
                      : "border-transparent text-gray-300 cursor-not-allowed"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Form Fields Row */}
            <div className="grid grid-cols-5 gap-4 mb-8">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Nome da Ficha Técnica <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="h-10"
                  disabled={mode === "view"}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Categoria <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoria}
                  onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                  disabled={mode === "view"}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione a Opção" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.value} value={categoria.value}>
                        {categoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Sub-Categoria</Label>
                <Select
                  value={formData.subCategoria}
                  onValueChange={(value) => setFormData({ ...formData, subCategoria: value })}
                  disabled={mode === "view"}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione a Opção" />
                  </SelectTrigger>
                  <SelectContent>
                    {subCategorias.map((subCategoria) => (
                      <SelectItem key={subCategoria.value} value={subCategoria.value}>
                        {subCategoria.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Valor De Venda Final <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.valorVendaFinal}
                  onChange={(e) => setFormData({ ...formData, valorVendaFinal: handleCurrencyInput(e.target.value) })}
                  className="h-10"
                  disabled={mode === "view"}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rendimento Final <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.rendimentoFinal}
                  onChange={(e) => setFormData({ ...formData, rendimentoFinal: e.target.value })}
                  className="h-10"
                  type="number"
                  min="1"
                  disabled={mode === "view"}
                />
              </div>
            </div>

            {/* Conteúdo da Receita */}
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4">Conteúdo da Receita:</h3>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-8 gap-4 p-3 bg-gray-100 border-b text-sm font-medium text-gray-700">
                  <div>Mercadoria</div>
                  <div>Unidade</div>
                  <div>Qtde Líquida</div>
                  <div>Custo Unitário</div>
                  <div>Rendimento</div>
                  <div>Qtde Bruta</div>
                  <div>Preço Total</div>
                  <div>Ações</div>
                </div>

                {/* Table Rows */}
                {recipeItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-8 gap-4 p-3 border-b last:border-b-0 bg-white">
                    <Select
                      value={item.mercadoria}
                      onValueChange={(value) => updateRecipeItem(item.id, "mercadoria", value)}
                      disabled={mode === "view"}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        {mercadorias.map((mercadoria) => (
                          <SelectItem key={mercadoria.value} value={mercadoria.value}>
                            {mercadoria.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input value={item.unidade} className="h-9 text-sm bg-gray-50" disabled placeholder="Unidade" />

                    <Input
                      value={item.qtdeLiquida}
                      onChange={(e) => updateRecipeItem(item.id, "qtdeLiquida", e.target.value)}
                      className="h-9 text-sm"
                      placeholder="0,0"
                      type="number"
                      step="0.001"
                      min="0"
                      disabled={mode === "view"}
                    />

                    <Input value={item.custoUnitario} className="h-9 text-sm bg-gray-50" disabled />

                    <Input
                      value={item.rendimento}
                      onChange={(e) => updateRecipeItem(item.id, "rendimento", e.target.value)}
                      className="h-9 text-sm"
                      placeholder="100%"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      disabled={mode === "view"}
                    />

                    <div className="flex items-center h-9 text-sm text-gray-600 px-3">{item.qtdeBruta || "-"}</div>

                    <div className="flex items-center h-9 text-sm text-gray-900 px-3">
                      {item.precoTotal > 0 ? formatCurrency(item.precoTotal) : "-"}
                    </div>

                    {mode !== "view" && (
                      <Button
                        onClick={() => removeRecipeItem(item.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        disabled={recipeItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {mode !== "view" && (
                <Button onClick={addRecipeItem} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Linha
                </Button>
              )}
            </div>

            {/* Produtos Intermediários */}
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4">Produtos Intermediários da Receita:</h3>

              {mode !== "view" && (
                <Button onClick={addIntermediateProduct} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Linha
                </Button>
              )}

              {intermediateProducts.length > 0 && (
                <div className="space-y-4">
                  {intermediateProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="mb-4">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Produto Intermediário</Label>
                        <Select
                          value={product.produtoIntermediario}
                          onValueChange={(value) =>
                            updateIntermediateProduct(product.id, "produtoIntermediario", value)
                          }
                          disabled={mode === "view"}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Selecione a Opção" />
                          </SelectTrigger>
                          <SelectContent>
                            {produtosIntermediarios.map((produto) => (
                              <SelectItem key={produto.value} value={produto.value}>
                                {produto.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-7 gap-4 p-3 bg-gray-100 border-b text-sm font-medium text-gray-700">
                          <div>Mercadoria</div>
                          <div>Unidade</div>
                          <div>Qtde Líquida</div>
                          <div>Custo Unitário</div>
                          <div>Rendimento</div>
                          <div>Qtde Bruta</div>
                          <div>Preço</div>
                        </div>

                        <div className="grid grid-cols-7 gap-4 p-3 bg-white">
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {product.mercadoria || "-"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {product.unidade || "-"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {product.qtdeLiquida || "0,00"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {product.custoUnitario || "R$ 0,00"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {product.rendimento || "100%"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {product.qtdeBruta || "0,00"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-900 px-3 bg-gray-50 rounded">
                            {product.preco > 0 ? formatCurrency(product.preco) : "R$ 0,00"}
                          </div>
                        </div>
                      </div>

                      {mode !== "view" && (
                        <div className="flex justify-end mt-3">
                          <Button
                            onClick={() => removeIntermediateProduct(product.id)}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Informações Chave */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">Informações Chave:</h3>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Multiplicador <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.multiplicador}
                    onChange={(e) => setFormData({ ...formData, multiplicador: e.target.value })}
                    className="w-20 h-9"
                    type="number"
                    step="0.1"
                    min="0"
                    disabled={mode === "view"}
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 gap-0">
                  <div className="p-3 border-b border-r border-gray-200 bg-gray-50">
                    <div className="text-sm font-medium text-gray-700">Custo Total</div>
                  </div>
                  <div className="p-3 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{formatCurrency(totals.custoTotal)}</div>
                  </div>

                  <div className="p-3 border-b border-r border-gray-200 bg-gray-50">
                    <div className="text-sm font-medium text-gray-700">Custo Porção</div>
                  </div>
                  <div className="p-3 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{formatCurrency(totals.custoPortao)}</div>
                  </div>

                  <div className="p-3 border-b border-r border-gray-200 bg-gray-50">
                    <div className="text-sm font-medium text-gray-700">R$ Venda Sugerida</div>
                  </div>
                  <div className="p-3 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{formatCurrency(totals.vendaSugerida)}</div>
                  </div>

                  <div className="p-3 border-b border-r border-gray-200 bg-gray-50">
                    <div className="text-sm font-medium text-gray-700">% CMV Teórico</div>
                  </div>
                  <div className="p-3 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{totals.cmvTeorico.toFixed(1)}%</div>
                  </div>

                  <div className="p-3 border-b border-r border-gray-200 bg-gray-50">
                    <div className="text-sm font-medium text-gray-700">R$ Margem</div>
                  </div>
                  <div className="p-3 border-b border-gray-200 bg-white">
                    <div className="text-sm text-gray-900">{formatCurrency(totals.valorMargem)}</div>
                  </div>

                  <div className="p-3 border-r border-gray-200 bg-gray-50">
                    <div className="text-sm font-medium text-gray-700">% Margem Desejada</div>
                  </div>
                  <div className="p-3 bg-white">
                    <div className="text-sm text-gray-900">{totals.margemDesejada.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhes da Receita */}
            <div className="mb-6">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                Detalhes da Receita -{" "}
                <span className="text-sm font-normal text-gray-600">
                  Descreva todos os passos que devem ser seguidos para realizar a receita
                </span>
              </h3>

              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                {/* TasteFlow Logo */}
                <div className="flex items-center gap-2 mb-6">
                  <img src="/images/timbre-tasteflow.png" alt="TasteFlow" className="h-6" />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Nome da Receita</Label>
                    <Input value={formData.nome} className="bg-gray-50" disabled />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Ingredientes:</Label>

                    {/* Grid automática de ingredientes */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-3 gap-4 p-3 bg-gray-100 border-b text-sm font-medium text-gray-700">
                        <div>Mercadoria</div>
                        <div>Unidade</div>
                        <div>Qtde Líquida</div>
                      </div>

                      {/* Ingredientes do Conteúdo da Receita */}
                      {recipeItems
                        .filter((item) => item.mercadoria && item.qtdeLiquida)
                        .map((item, index) => (
                          <div key={`recipe-${item.id}`} className="grid grid-cols-3 gap-4 p-3 border-b bg-white">
                            <div className="flex items-center h-9 text-sm text-gray-900 px-3">
                              {mercadorias.find((m) => m.value === item.mercadoria)?.label || item.mercadoria}
                            </div>
                            <div className="flex items-center h-9 text-sm text-gray-600 px-3">{item.unidade}</div>
                            <div className="flex items-center h-9 text-sm text-gray-600 px-3">{item.qtdeLiquida}</div>
                          </div>
                        ))}

                      {/* Ingredientes dos Produtos Intermediários */}
                      {intermediateProducts
                        .filter((product) => product.produtoIntermediario && product.qtdeLiquida)
                        .map((product, index) => (
                          <div
                            key={`intermediate-${product.id}`}
                            className="grid grid-cols-3 gap-4 p-3 border-b bg-white"
                          >
                            <div className="flex items-center h-9 text-sm text-gray-900 px-3">
                              {produtosIntermediarios.find((p) => p.value === product.produtoIntermediario)?.label ||
                                product.produtoIntermediario}
                            </div>
                            <div className="flex items-center h-9 text-sm text-gray-600 px-3">{product.unidade}</div>
                            <div className="flex items-center h-9 text-sm text-gray-600 px-3">
                              {product.qtdeLiquida}
                            </div>
                          </div>
                        ))}

                      {/* Mensagem quando não há ingredientes */}
                      {recipeItems.filter((item) => item.mercadoria && item.qtdeLiquida).length === 0 &&
                        intermediateProducts.filter((product) => product.produtoIntermediario && product.qtdeLiquida)
                          .length === 0 && (
                          <div className="p-6 text-center text-gray-500 text-sm">
                            Os ingredientes aparecerão aqui automaticamente conforme você preenche as grids acima
                          </div>
                        )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Passo a passo:</Label>
                    <Textarea
                      value={formData.passoAPasso}
                      onChange={(e) => setFormData({ ...formData, passoAPasso: e.target.value })}
                      className="min-h-[120px] resize-none"
                      disabled={mode === "view"}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white">
              Confirmar Cadastro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
