"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select } from "@/src/components/ui/select"
import { Textarea } from "@/src/components/ui/textarea"
import { Badge } from "@/src/components/ui/badge"
import { Plus, Trash2, X } from "lucide-react"
import { useProductModal } from "../hooks/useModal"
import useSession from "../hooks/useSession"
import { Unit } from "../types/unit"
import { Category } from "../types/category"
import { SubCategory } from "../types/sub-category"
import { Merchandise } from "../types/merchandise"
import { toast } from "sonner"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllUnitsByEnterpriseId } from "../services/unit"
import { getAllSubCategoriesByEnterpriseId } from "../services/sub-category"
import { getAllMerchandisesByEnterpriseId } from "../services/merchandise"
import { ProductIntermediate } from "../types/product-intermediate"
import { getAllProductIntermediatesByEnterpriseId } from "../services/product-intermediate"
import { createProduct, getProductById, updateProduct } from "../services/product"
import { ICreateProductRequest, IUpdateProductRequest } from "../types/product"
import { parseCurrency } from "../app/utils/utils"
import { getStockValueByEnterpriseId } from "../services/stock-entry"
import { GetStockValueByEnterpriseIdResponse } from "../types/stock-entry"
import { AutocompleteField } from "./auto-complete-field"

interface Product {
  id?: string | null;
  productCategoryTypeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  instruction: string;
  price: number;
  yield: number;
  multiplier: number;
  marginValue:  number;
  marginPercent:  number;
  productCompositions: ProductComposition[];
}

interface ProductComposition {
  id: string;
  merchandiseId?: string | null;
  productIntermediateId?: string | null;
  unitId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  yield: number;
  price: number;
  totalQuantity: number;
  productCompositionType: 'merchandise' | 'productIntermediate';
}

interface TechnicalSheetFormProps {
  isOpen: boolean;
}

const tabs = [
  { id: "ficha-tecnica", label: "Ficha Técnica", icon: "📋" },
  { id: "eventos", label: "Eventos", icon: "🎉" },
  { id: "producao", label: "Produção", icon: "🏭" },
  { id: "nutricional", label: "Nutricional", icon: "🥗" },
  { id: "ofertas", label: "Ofertas", icon: "💰" },
  { id: "lista-precos", label: "Lista de Preços", icon: "📊" },
  { id: "mais-detalhes", label: "Mais Detalhes", icon: "📝" },
  { id: "entrega", label: "Entrega", icon: "🚚" },
];

export function TechnicalSheetForm({ isOpen }: TechnicalSheetFormProps) {
  const session = useSession();
  const productModal = useProductModal();

  const [activeTab, setActiveTab] = useState("ficha-tecnica");

  const initialProductComposition: ProductComposition = {
    id: crypto.randomUUID(),
    merchandiseId: null,
    productIntermediateId: null,
    unitId: "",
    quantity: 0,
    unitCost: 0,
    totalCost: 0,
    yield: 0,
    price: 0,
    totalQuantity: 0,
    productCompositionType: "merchandise"
  };

  const initialProduct: Product = {
    name: "",
    productCategoryTypeId: "",
    categoryId: "",
    subCategoryId: "",
    price: 0,
    yield: 0,
    multiplier: 0,
    marginPercent: 0,
    marginValue: 0,
    instruction: "",
    productCompositions: [initialProductComposition]
  };

  const [product, setProduct] = useState<Product>(initialProduct);
  
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [merchandises, setMerchandises] = useState<Merchandise[]>([]);
  const [productIntermediates, setProductIntermediates] = useState<ProductIntermediate[]>([]);
  const [stockValues, setStockValues] = useState<GetStockValueByEnterpriseIdResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInitialData = async (page: number = 1) => {
    try {
      const [categoriesResponse, unitsResponse, subCategoriesResponse, merchandisesResponse, productIntermediatesResponse, stockValuesResponse] = await Promise.all([
        getAllCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllUnitsByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllSubCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllMerchandisesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllProductIntermediatesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getStockValueByEnterpriseId()
      ]);

      setMerchandises(merchandisesResponse);
      setCategories(categoriesResponse);
      setUnits(unitsResponse);
      setSubCategories(subCategoriesResponse);
      setProductIntermediates(productIntermediatesResponse);
      setStockValues(stockValuesResponse);

      if(mode !== 'create' || (mode === 'create' && productModal.formType === 'alternative')){
        const productResponse = await getProductById({id: productModal.productId});
        const adjustedCompositions = productResponse.productCompositions.map((item: any) => {
        const updated = { ...item };

        if (!updated.unitCost && updated.merchandiseId) {
          const mercadoria = merchandises.find((m) => m.id === updated.merchandiseId);
          const stockValue = stockValues.find((s) => s.merchandiseId === updated.merchandiseId);
          updated.unitCost = stockValue ? stockValue.averageValue : 0;
          updated.unitId = mercadoria?.unitId ?? updated.unitId;
        }

        const rendimento = updated.yield ?? 100;
        const qtdeBruta = updated.quantity ?? 0;
        updated.totalQuantity = Number((qtdeBruta * (rendimento / 100)).toFixed(3));

        updated.totalCost = Number(((updated.unitCost ?? 0) * (updated.quantity ?? 0)).toFixed(2));

          return updated;
        });

        setProduct({
          ...productResponse,
          productCompositions: adjustedCompositions,
        });
      }
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };
  
  useEffect(() => {
    if(productModal.isModalOpen){
      fetchInitialData();
    }
  }, [productModal.isModalOpen]);

  const handleChange = (field: keyof Product, value: string | boolean | string[] | null | number) => {
    setProduct(prev => {
      const updated = { ...prev, [field]: value }

      const totals = calculateTotals();

      return {
        ...updated,
        marginValue: parseCurrency(totals.valorMargem),
        marginPercent: Number(totals.margemDesejada.toFixed(4)),
      }
    })
  };
  
  const handleAddProductComposition = (productCompositionType: "merchandise" | "productIntermediate") => {
    const newItem: ProductComposition = {
      id: crypto.randomUUID(),
      productIntermediateId: null,
      merchandiseId: null,
      unitId: "",
      quantity: 0,
      unitCost: 0,
      totalCost: 0,
      yield: 0,
      price: 0,
      totalQuantity: 0,
      productCompositionType: productCompositionType
    };

    setProduct(prev => ({ ...prev, productCompositions: [ ...prev.productCompositions, newItem ] }));
  };

  const handleDeleteProductComposition = (id: string) => {
    if (product.productCompositions.length > 1) {
      setProduct(prev => ({ ...prev, productCompositions: prev.productCompositions.length > 1 ? prev.productCompositions.filter(item => item.id !== id) : prev.productCompositions }));
    }
  };

  const handleProductCompositionChange = (id: string, field: keyof ProductComposition, value: string | null) => {
    setProduct({
      ...product,
      productCompositions: product.productCompositions.map((item) => {
        if (item.id !== id) return item;
        
        let updated: ProductComposition = { ...item, [field]: value as any };

        // Quando selecionar uma mercadoria, carregar unidade e custo unitário automaticamente
        if (field === "merchandiseId" && value) {
          const mercadoria = merchandises.find((m) => m.id === value);
          if (mercadoria) {
            updated.unitId = mercadoria.unitId;
            const stockValue = stockValues.find((s) => s.merchandiseId === value);
            updated.unitCost = stockValue ? stockValue.averageValue : 0;
          }
        }

        // Quando selecionar um produto intermediário, carregar seus dados automaticamente
        if (field === "productIntermediateId" && value) {
          const intermediate = productIntermediates.find((pi) => pi.id === value);
          if (intermediate) {
            updated.unitId = intermediate.unitId ?? "";
            updated.quantity = intermediate.yield ?? 0;
            updated.unitCost = intermediate.price ?? 0;
            updated.yield = intermediate.yield ?? 100;
            updated.price = intermediate.price ?? 0;

            const qtdeBruta = intermediate.yield > 0 ? intermediate.yield / (intermediate.yield / 100) : 0;
            updated.totalQuantity = qtdeBruta;

            // totalCost = unitCost * quantidade bruta
            updated.totalCost = Number((updated.unitCost * qtdeBruta).toFixed(2));
          }
        }

        // Calcular qtdeBruta baseado no rendimento e quantidade líquida
        if (field === "quantity" || field === "yield") {
          const qtdeBruta = updated.quantity || 0; 
          const rendimento = updated.yield || 100;

          if (rendimento > 0 && qtdeBruta > 0) {
            const qtdeLiquida = qtdeBruta * (rendimento / 100);
            updated.totalQuantity = Number(qtdeLiquida.toFixed(3));
          } else {
            updated.totalQuantity = 0;
          }
        }

        const quantity = updated.quantity ?? 0;
        const unitCost = updated.unitCost ?? 0;
        updated.totalCost = Number((quantity * unitCost).toFixed(2));

        return updated;
      }),
    });
  };

  const calculateTotals = () => {
  // Recalcula o total de cada item considerando rendimento
  product.productCompositions.forEach(item => {
    const rendimento = item.yield / 100 || 1; // transforma 50% em 0.5
    // Quantidade bruta = Quantidade líquida / Rendimento
    item.totalQuantity = item.quantity / rendimento;
    // Preço total = Quantidade bruta * Preço unitário
    item.totalCost = item.totalQuantity * item.unitCost;
  });

  // Soma o custo de todos os itens
  const custoTotal = product.productCompositions.reduce((sum, item) => sum + item.totalCost, 0);

  const multiplicador = Number.parseFloat(product.multiplier.toString().replace(",", ".")) || 0;
  // Valor da Venda Sugerida = Custo Total × Multiplicador
  const vendaSugerida = multiplicador === 0 ? 0 : custoTotal * multiplicador;

  const rendimentoFinal = product.yield || 1;
  const custoPortao = custoTotal / rendimentoFinal;

  const cmvTeorico = vendaSugerida > 0 ? (custoTotal / vendaSugerida) * 100 : 0;
  const valorMargem = vendaSugerida - custoTotal;
  const margemDesejada = vendaSugerida > 0 ? (valorMargem / vendaSugerida) * 100 : 0;

  return {
    custoTotal,
    custoPortao,
    vendaSugerida,
    valorMargem,
    cmvTeorico: isNaN(cmvTeorico) ? 0 : cmvTeorico,
    margemDesejada: isNaN(margemDesejada) ? 0 : margemDesejada,
  };
};

  const totals = calculateTotals()

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace(".", ",")}`
  }

  const handleCurrencyInput = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers === "") return "R$0,00"
    const formatted = (Number.parseInt(numbers) / 100).toFixed(2)
    return `R$${formatted.replace(".", ",")}`
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    session.setRefresh(false);

    try {
      const isCreate = mode === "create";

      if (isCreate) {
        const request: ICreateProductRequest = {
          ...product,
          price: parseCurrency(product.price),
          productCategoryTypeId: productModal.formType === "original" ? "8199CC7C-7E2F-4EBE-B094-9DEBD78C79FF" : "BD0C9315-33AA-47B6-9FBF-40B4C91C1D02"
        };
 
        const response = await createProduct(request);

        if (response.created) {
          toast.success("Produto criado com sucesso!");
          handleClose();
        } else {
          toast.error("Falha ao criar o produto. Tente novamente.");
        }
      } else {
        const request: IUpdateProductRequest = {
          ...product,
          id: product.id ?? "",
          price: parseCurrency(product.price)
        };

        const response = await updateProduct(request);

        if (response.updated) {
          toast.success("Produto atualizado com sucesso!");
          handleClose();
        } else {
          toast.error("Falha ao atualizar o produto. Tente novamente.");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar o produto intermediário:", error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      session.setRefresh(true);
      setIsLoading(false);
    }
  };

  // Determinar o título e badge baseado no tipo
  const getTitle = () => {
    if (formType === "original") {
      return "Cadastrando um novo Produto Original"
    } else {
      return "Cadastrando um novo Produto Alternativo"
    }
  }

  const getBadgeText = () => {
    return formType === "original" ? "Original" : "Alternativo"
  }

  const getBadgeColor = () => {
    return formType === "original" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
  }

  const handleClose = () => {
    setProduct(initialProduct);
    productModal.openModal(false);
  };

  const isReadOnly = productModal.mode === "view";
  const mode = productModal.mode;
  const formType = productModal.formType;

  return (
    <Dialog open={isOpen}  onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 bg-gray-50">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <DialogTitle className="text-xl font-medium text-gray-900 mb-1">{getTitle()}</DialogTitle>
              <p className="text-sm text-gray-600">O cadastro acontece a partir dos dados nos Cadastro de Base.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${getBadgeColor()} font-medium px-5 py-1`}>{getBadgeText()}</Badge>
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
                  value={product.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-10"
                  disabled={mode === "view"}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Categoria <span className="text-red-500">*</span>
                </Label>
                <AutocompleteField
                  value={product.categoryId ?? ""}
                  onValueChange={(val) => handleChange("categoryId", val)}
                  options={categories.map((c) => ({ id: c.id.toString(), name: c.name }))}
                  placeholder="Selecione a Opção"
                  emptyMessage="Nenhuma opção encontrada."
                  className="border border-gray-300 rounded-md bg-white h-10"
                  disabled={mode === "view"}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Sub-Categoria</Label>
                <AutocompleteField
                  value={product.subCategoryId ?? ""}
                  onValueChange={(val) => handleChange("subCategoryId", val)}
                  options={subCategories.map((s) => ({ id: s.id.toString(), name: s.name }))}
                  placeholder="Selecione a Opção"
                  emptyMessage="Nenhuma opção encontrada."
                  className="border border-gray-300 rounded-md bg-white h-10"
                  disabled={mode === "view"}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Valor De Venda Final <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={product.price}
                  onChange={(e) => handleChange("price", handleCurrencyInput(e.target.value))}
                  className="h-10"
                  disabled={mode === "view"}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Rendimento Final <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={product.yield}
                  onChange={(e) => handleChange("yield", e.target.value)}
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
                {product.productCompositions.filter(pc => (pc.productCompositionType === "merchandise" || pc.merchandiseId) ).map((item) => (
                  <div key={item.id} className="grid grid-cols-8 gap-4 p-3 border-b last:border-b-0 bg-white">
                    <AutocompleteField
                      value={item.merchandiseId ?? ""}
                      onValueChange={(val) => handleProductCompositionChange(item.id, "merchandiseId", val)}
                      options={merchandises}
                      placeholder="Selecione uma opção"
                      emptyMessage="Nenhuma opção encontrada."
                      className="border border-gray-300 rounded-md bg-white h-9"
                      disabled={mode === "view"}
                    />

                    <Input value={units.find(u => u.id === item.unitId)?.name || ""} className="h-9 text-sm bg-gray-50" disabled placeholder="Unidade" />

                    <Input
                      value={item.quantity}
                      onChange={(e) => handleProductCompositionChange(item.id, "quantity", e.target.value)}
                      className="h-9 text-sm"
                      placeholder="0,0"
                      type="number"
                      step="0.001"
                      min="0"
                      disabled={mode === "view"}
                    />

                    <Input value={item.unitCost} className="h-9 text-sm bg-gray-50" disabled />

                    <Input
                      value={item.yield}
                      onChange={(e) => handleProductCompositionChange(item.id, "yield", e.target.value)}
                      className="h-9 text-sm"
                      placeholder="100%"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      disabled={mode === "view"}
                    />

                    <div className="flex items-center h-9 text-sm text-gray-600 px-3">{(item.totalQuantity ?? 0).toFixed(3) || "-"}</div>

                    <div className="flex items-center h-9 text-sm text-gray-900 px-3">
                      {item.totalCost > 0 ? formatCurrency(item.totalCost) : "-"}
                    </div>

                    {mode !== "view" && (
                      <Button
                        onClick={() => handleDeleteProductComposition(item.id)}
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        disabled={product.productCompositions.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {mode !== "view" && (
                <Button onClick={() => handleAddProductComposition("merchandise")} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Linha
                </Button>
              )}
            </div>

            {/* Produtos Intermediários */}
            <div className="mb-8">
              <h3 className="text-base font-medium text-gray-900 mb-4">Produtos Intermediários da Receita:</h3>

              {mode !== "view" && (
                <Button onClick={() => handleAddProductComposition("productIntermediate")} className="mb-4 bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Nova Linha
                </Button>
              )}

              {product.productCompositions.length > 0 && (
                <div className="space-y-4">
                  {product.productCompositions.filter(pc => (pc.productCompositionType === "productIntermediate" || pc.productIntermediateId)).map((productComposition) => (
                    <div key={productComposition.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="mb-4">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Produto Intermediário</Label>
                        <AutocompleteField
                          value={productComposition.productIntermediateId ?? ""}
                          onValueChange={(val) => handleProductCompositionChange(productComposition.id, "productIntermediateId", val)}
                          options={productIntermediates.filter((p) => p.id != null).map((p) => ({ id: p.id!.toString(), name: p.name }))}
                          placeholder="Selecione uma opção"
                          emptyMessage="Nenhuma opção encontrada."
                          className="border border-gray-300 rounded-md bg-white h-10"
                          disabled={mode === "view"}
                        />
                      </div>

                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="grid grid-cols-6 gap-4 p-3 bg-gray-100 border-b text-sm font-medium text-gray-700">
                          <div>Unidade</div>
                          <div>Qtde Líquida</div>
                          <div>Custo Unitário</div>
                          <div>Rendimento</div>
                          <div>Qtde Bruta</div>
                          <div>Preço</div>
                        </div>

                        <div className="grid grid-cols-6 gap-4 p-3 bg-white">
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {units.find(u => u.id === productComposition.unitId)?.name || "-"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {productComposition.quantity || "0,00"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {productComposition.price > 0 ? formatCurrency(productComposition.price) : "R$ 0,00"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {productComposition.yield || "100%"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-600 px-3 bg-gray-50 rounded">
                            {productComposition.totalQuantity || "0,00"}
                          </div>
                          <div className="flex items-center h-9 text-sm text-gray-900 px-3 bg-gray-50 rounded">
                            {productComposition.price > 0 ? formatCurrency(productComposition.price) : "R$ 0,00"}
                          </div>
                        </div>
                      </div>

                      {mode !== "view" && (
                        <div className="flex justify-end mt-3">
                          <Button
                            onClick={() => handleDeleteProductComposition(productComposition.id)}
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
                    value={product.multiplier}
                    onChange={(e) => handleChange("multiplier", e.target.value)}
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
                    <Input value={product.name} placeholder="Nome da Receita" className="bg-gray-50" disabled />
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
                      {product.productCompositions
                        .filter((item) => (item.merchandiseId || item.productIntermediateId) && item.quantity)
                        .map((item, index) => (
                          <div key={`recipe-${item.id}`} className="grid grid-cols-3 gap-4 p-3 border-b bg-white">
                            <div className="flex items-center h-9 text-sm text-gray-900 px-3">
                              {(merchandises.find(m => m.id === item.merchandiseId)?.itemName) ?? (productIntermediates.find(pi => pi.id === item.productIntermediateId)?.name) ?? "" }
                            </div>
                            <div className="flex items-center h-9 text-sm text-gray-600 px-3">{units.find(u => u.id === item.unitId)?.name || "-"}</div>
                            <div className="flex items-center h-9 text-sm text-gray-600 px-3">{item.quantity}</div>
                          </div>
                        ))}

                      {/* Mensagem quando não há ingredientes */}
                      {product.productCompositions.filter((item) => item.merchandiseId && item.quantity).length === 0 &&
                        product.productCompositions.filter((product) => product.productIntermediateId && product.quantity)
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
                      value={product.instruction}
                      onChange={(e) => handleChange("instruction", e.target.value)}
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
              onClick={handleClose}
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
