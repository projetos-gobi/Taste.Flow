"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select } from "@/src/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Plus, Trash2, Calculator } from "lucide-react"
import { calculateWeightedAverage } from "@/src/services/weighted-average"
import { useProductIntermediateModal } from "../hooks/useModal"
import useSession from "../hooks/useSession"
import { toast } from "sonner"
import { Unit } from "../types/unit"
import { Category } from "../types/category"
import { getAllCategoriesByEnterpriseId } from "../services/category"
import { getAllUnitsByEnterpriseId } from "../services/unit"
import { getAllSubCategoriesByEnterpriseId } from "../services/sub-category"
import { SubCategory } from "../types/sub-category"
import { getAllMerchandisesByEnterpriseId } from "../services/merchandise"
import { Merchandise } from "../types/merchandise"
import { createProductIntermediate, getProductIntermediateById, updateProductIntermediate } from "../services/product-intermediate"
import { ICreateProductIntermediateRequest, IUpdateProductIntermediateRequest, ProductIntermediate } from "../types/product-intermediate"
import { ProductIntermediateComposition } from "../types/product-intermediate-composition"
import { GetStockValueByEnterpriseIdResponse } from "../types/stock-entry"
import { getStockValueByEnterpriseId } from "../services/stock-entry"
import { handleSanitizeQuantity, parseCurrency } from "../app/utils/utils"
import { AutocompleteField } from "./auto-complete-field"

interface IntermediateProductTechnicalSheetProps {
  isOpen: boolean;
}

export function IntermediateProductTechnicalSheet({ isOpen }: IntermediateProductTechnicalSheetProps) {
  const session = useSession();
  const productIntermediateModal = useProductIntermediateModal();

  const initialProductIntermediateComposition: ProductIntermediateComposition = {
    id: crypto.randomUUID(),
    merchandiseId: "",
    unitId: "",
    quantity: 0,
    unitCost: 0,
    totalCost: 0,
    yield: 0
  };

  const initialProductIntermediate: ProductIntermediate = {
    categoryId: null,
    subCategoryId: null,
    unitId: null,
    name: "",
    price: null,
    yield: 0,
    preparationTime: "",
    instruction: "",
    description: "",
    productIntermediateCompositions: [initialProductIntermediateComposition]
  };

  const [productIntermediate, setProductIntermediate] = useState<ProductIntermediate>(initialProductIntermediate);
  const [units, setUnits] = useState<Unit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [merchandises, setMerchandises] = useState<Merchandise[]>([]);
  const [stockValues, setStockValues] = useState<GetStockValueByEnterpriseIdResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInitialData = async (page: number = 1) => {
    try {
      const [categoriesResponse, unitsResponse, subCategoriesResponse, merchandisesResponse, stockValuesResponse] = await Promise.all([
        getAllCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllUnitsByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllSubCategoriesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getAllMerchandisesByEnterpriseId({ enterpriseId: session.enterpriseId ?? "" }),
        getStockValueByEnterpriseId()
      ]);

      setMerchandises(merchandisesResponse);
      setCategories(categoriesResponse);
      setUnits(unitsResponse);
      setSubCategories(subCategoriesResponse);
      setStockValues(stockValuesResponse);

      if(mode !== 'create'){
        const productIntermediateResponse = await getProductIntermediateById({id: productIntermediateModal.productIntermediateId});

        const adjustedCompositions = productIntermediateResponse.productIntermediateCompositions.map((item: any) => {
        const updated = { ...item };

        if (!updated.unitCost && updated.merchandiseId) {
          const stockValue = stockValues.find((s) => s.merchandiseId === updated.merchandiseId);
          updated.unitCost = stockValue ? stockValue.averageValue : 0;
        }

        const rendimento = updated.yield ?? 100;
        const qtdeBruta = updated.quantity ?? 0;
        updated.totalQuantity = Number((qtdeBruta * (rendimento / 100)).toFixed(3));

        updated.totalCost = Number(((updated.unitCost ?? 0) * (updated.quantity ?? 0)).toFixed(2));

          return updated;
        });

        setProductIntermediate({
          ...productIntermediateResponse,
          productIntermediateCompositions: adjustedCompositions,
        });
      }
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };
  
  useEffect(() => {
    if(productIntermediateModal.isModalOpen){
      fetchInitialData();
    }
  }, [productIntermediateModal.isModalOpen]);

  const handleChange = (field: keyof ProductIntermediate, value: string | boolean | string[] | null) => {
    setProductIntermediate((prev) => ({ ...prev, [field]: value }))
  };

  const handleAddProductIntermediateComposition = () => {
    const newItem: ProductIntermediateComposition = {
      id: crypto.randomUUID(),
      merchandiseId: "",
      quantity: 0,
      unitId: "",
      unitCost: 0,
      totalCost: 0,
      yield: 0
    };
    setProductIntermediate(prev => ({ ...prev, productIntermediateCompositions: [ ...prev.productIntermediateCompositions, newItem ] }));
  };

  const handleDeleteProductIntermediateComposition = (id: string) => {
    if (productIntermediate.productIntermediateCompositions.length > 1) {
      setProductIntermediate(prev => ({ ...prev, productIntermediateCompositions: prev.productIntermediateCompositions.length > 1 ? prev.productIntermediateCompositions.filter(item => item.id !== id) : prev.productIntermediateCompositions }));
    }
  };

  const handleProductIntermediateCompositionChange = (id: string, field: keyof ProductIntermediateComposition, value: string | number | null) => {
    setProductIntermediate(prev => ({
        ...prev,
        productIntermediateCompositions: prev.productIntermediateCompositions.map(item => {
          if (item.id !== id) return item;

          const updated = { ...item, [field]: value };

          if (field === "merchandiseId" && value) {
            const mercadoria = merchandises.find(m => m.id === value);
            if (mercadoria) {
              updated.unitId = mercadoria.unitId;
              const stockValue = stockValues.find(s => s.merchandiseId === value);
              updated.unitCost = stockValue ? stockValue.averageValue : 0;
            }
          }

          const quantity = parseFloat(String(updated.quantity).replace(',', '.')) || 0;
          const unitCost = updated.unitCost ?? 0;
          updated.totalCost = Number((quantity * unitCost).toFixed(2));

          return updated;
        }),
      }));  
  };

  const calculateWeightedAverageCost = async (ingredientName: string) => {
    try {
      const result = await calculateWeightedAverage(ingredientName)
      return result.weightedAverage
    } catch (error) {
      console.error("Erro ao calcular média ponderada:", error)
      return 0
    }
  };

  const handleCalculateWeightedAverage = async (ingredientId: string, ingredientName: string) => {
    if (!ingredientName.trim()) {
      alert("Por favor, insira o nome do ingrediente primeiro")
      return
    }

    const weightedAverage = await calculateWeightedAverageCost(ingredientName)
    //updateIngredient(ingredientId, "unitCost", weightedAverage)
  };

  const totalCost = productIntermediate.productIntermediateCompositions.reduce((sum, ing) => sum + ing.totalCost, 0);

  const costPerUnit = productIntermediate.yield ? totalCost / productIntermediate.yield : 0;

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
        const request: ICreateProductIntermediateRequest = {
          ...productIntermediate,
          price: parseCurrency(totalCost)
        };

        const response = await createProductIntermediate(request);

        if (response.created) {
          toast.success("Produto intermediário criado com sucesso!");
          handleClose();
        } else {
          toast.error("Falha ao criar o produto intermediário. Tente novamente.");
        }
      } else {
        const request: IUpdateProductIntermediateRequest = {
          ...productIntermediate,
          id: productIntermediate.id ?? "",
          price: parseCurrency(totalCost)
        };

        const response = await updateProductIntermediate(request);

        if (response.updated) {
          toast.success("Produto intermediário atualizado com sucesso!");
          handleClose();
        } else {
          toast.error("Falha ao atualizar o produto intermediário. Tente novamente.");
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

  const handleClose = () => {
    setProductIntermediate(initialProductIntermediate);
    productIntermediateModal.openModal(false);
  };

  const isReadOnly = productIntermediateModal.mode === "view";
  const mode = productIntermediateModal.mode;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <p className="font-bebas text-3xl text-gray-900 tracking-wide">
            {mode === "create" && "Cadastrar Produto Intermediário"}
            {mode === "edit" && "Editar Produto Intermediário"}
            {mode === "view" && "Visualizar Produto Intermediário"}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="font-nunito text-lg">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="font-nunito font-medium">
                    Nome do Produto *
                  </Label>
                  <Input
                    id="name"
                    value={productIntermediate.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Ex: Massa Base para Bolos"
                    required
                    disabled={isReadOnly}
                    className="font-nunito"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="font-nunito font-medium">
                    Categoria *
                  </Label>
                  <AutocompleteField
                    value={productIntermediate.categoryId ?? ""}
                    onValueChange={(val) => handleChange("categoryId", val)}
                    options={categories.map((c) => ({ id: c.id.toString(), name: c.name }))}
                    placeholder="Selecione..."
                    emptyMessage="Nenhuma opção encontrada."
                    className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subCategory" className="font-nunito font-medium">
                    Sub-categoria
                  </Label>
                  <AutocompleteField
                    value={productIntermediate.subCategoryId ?? ""}
                    onValueChange={(val) => handleChange("subCategoryId", val)}
                    options={subCategories.map((s) => ({ id: s.id.toString(), name: s.name }))}
                    placeholder="Selecione..."
                    emptyMessage="Nenhuma opção encontrada."
                    className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
                    disabled={isReadOnly}
                  />
                </div>
                <div>
                  <Label htmlFor="preparationTime" className="font-nunito font-medium">
                    Tempo de Preparo (minutos)
                  </Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    value={productIntermediate.preparationTime}
                    onChange={(e) => handleChange("preparationTime", e.target.value)}
                    placeholder="Ex: 60"
                    disabled={isReadOnly}
                    className="font-nunito"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yield" className="font-nunito font-medium">
                    Rendimento *
                  </Label>
                  <Input
                    id="yield"
                    type="number"
                    step="0.01"
                    value={productIntermediate.yield}
                    onChange={(e) => handleChange("yield", e.target.value)}
                    placeholder="Ex: 2.5"
                    required
                    disabled={isReadOnly}
                    className="font-nunito"
                  />
                </div>
                <div>
                  <Label htmlFor="yieldUnit" className="font-nunito font-medium">
                    Unidade de Rendimento *
                  </Label>
                  <AutocompleteField
                    value={productIntermediate.unitId ?? ""}
                    onValueChange={(val) => handleChange("unitId", val)}
                    options={units.map((u) => ({ id: u.id.toString(), name: u.name }))}
                    placeholder="Selecione..."
                    emptyMessage="Nenhuma opção encontrada."
                    className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
                    disabled={isReadOnly}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-nunito font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={productIntermediate.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Descreva o produto intermediário..."
                  disabled={isReadOnly}
                  className="font-nunito"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-nunito text-lg">Ingredientes</CardTitle>
                {!isReadOnly && (
                  <Button
                    type="button"
                    onClick={handleAddProductIntermediateComposition}
                    size="sm"
                    className="bg-[#322ca7] hover:bg-[#322ca7]/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Ingrediente
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-nunito font-semibold">Ingrediente</TableHead>
                    <TableHead className="font-nunito font-semibold">Quantidade</TableHead>
                    <TableHead className="font-nunito font-semibold">Unidade</TableHead>
                    <TableHead className="font-nunito font-semibold">Custo Unitário</TableHead>
                    <TableHead className="font-nunito font-semibold">Custo Total</TableHead>
                    {!isReadOnly && <TableHead className="font-nunito font-semibold">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productIntermediate.productIntermediateCompositions.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>
                      <AutocompleteField
                        value={ingredient.merchandiseId ?? ""}
                        onValueChange={(val) => handleProductIntermediateCompositionChange(ingredient.id, "merchandiseId", val)}
                        options={merchandises}
                        placeholder="Selecione..."
                        emptyMessage="Nenhuma opção encontrada."
                        className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
                        disabled={isReadOnly}
                      />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          value={ingredient.quantity}
                          onChange={(e) => {
                            const sanitized = handleSanitizeQuantity(e.target.value);
                            handleProductIntermediateCompositionChange(ingredient.id, "quantity", sanitized);
                          }}
                          disabled={isReadOnly}
                          className="font-nunito"
                        />
                      </TableCell>
                      <TableCell>
                        <AutocompleteField
                          value={ingredient.unitId ?? ""}
                          onValueChange={(val) => handleProductIntermediateCompositionChange(ingredient.id, "unitId", val)}
                          options={units}
                          placeholder="Selecione..."
                          emptyMessage="Nenhuma opção encontrada."
                          className="border border-gray-300 rounded-md bg-white font-nunito font-medium h-10"
                          disabled
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            step="0.01"
                            value={ingredient.unitCost}
                            onChange={(e) => handleProductIntermediateCompositionChange(ingredient.id, "unitCost", handleCurrencyInput(e.target.value))}
                            disabled={isReadOnly}
                            className="font-nunito"
                          />
                          {!isReadOnly && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleCalculateWeightedAverage(ingredient.id, ingredient.merchandiseId)}
                              title="Calcular média ponderada"
                            >
                              <Calculator className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-nunito">R$ {ingredient.totalCost.toFixed(2)}</span>
                      </TableCell>
                      {!isReadOnly && (
                        <TableCell>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProductIntermediateComposition(ingredient.id)}
                            disabled={productIntermediate.productIntermediateCompositions.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Cost Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Custo Total:</span>
                    <p className="font-nunito text-lg font-semibold">R$ {totalCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Rendimento:</span>
                    <p className="font-nunito text-lg font-semibold">
                      {productIntermediate.yield}
                      {/* {productIntermediate.yieldUnit} */}
                    </p>
                  </div>
                  <div>
                    {/* <span className="font-medium text-gray-600">Custo por {formData.yieldUnit}:</span> */}
                    <p className="font-nunito text-lg font-semibold">R$ {costPerUnit.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-nunito text-lg">Modo de Preparo</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={productIntermediate.instruction}
                onChange={(e) => handleChange("instruction", e.target.value)}
                placeholder="Descreva o modo de preparo do produto intermediário..."
                rows={6}
                disabled={isReadOnly}
                className="font-nunito"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={handleClose} className="font-nunito bg-transparent">
              {isReadOnly ? "Fechar" : "Cancelar"}
            </Button>
            {!isReadOnly && (
              <Button type="submit" className="bg-[#322ca7] hover:bg-[#322ca7]/90 font-nunito">
                {mode === "create" ? "Cadastrar Produto" : "Salvar Alterações"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
