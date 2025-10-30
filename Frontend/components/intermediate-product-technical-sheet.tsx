"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Calculator } from "lucide-react"
import { calculateWeightedAverage } from "@/services/weighted-average"

interface IntermediateProductTechnicalSheetProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit" | "view"
  productData?: any
  onProductCreated: (data: any) => void
  onProductUpdated: (data: any) => void
}

interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  unitCost: number
  totalCost: number
}

export function IntermediateProductTechnicalSheet({
  isOpen,
  onClose,
  mode,
  productData,
  onProductCreated,
  onProductUpdated,
}: IntermediateProductTechnicalSheetProps) {
  const [formData, setFormData] = useState({
    name: productData?.name || "",
    description: productData?.description || "",
    category: productData?.category || "",
    subCategory: productData?.subCategory || "",
    yield: productData?.yield || "",
    yieldUnit: productData?.yieldUnit || "kg",
    preparationTime: productData?.preparationTime || "",
    instructions: productData?.instructions || "",
  })

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    productData?.ingredients || [
      {
        id: "1",
        name: "",
        quantity: 0,
        unit: "kg",
        unitCost: 0,
        totalCost: 0,
      },
    ],
  )

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: "",
      quantity: 0,
      unit: "kg",
      unitCost: 0,
      totalCost: 0,
    }
    setIngredients([...ingredients, newIngredient])
  }

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id))
  }

  const updateIngredient = (id: string, field: keyof Ingredient, value: any) => {
    setIngredients(
      ingredients.map((ing) => {
        if (ing.id === id) {
          const updated = { ...ing, [field]: value }
          if (field === "quantity" || field === "unitCost") {
            updated.totalCost = updated.quantity * updated.unitCost
          }
          return updated
        }
        return ing
      }),
    )
  }

  const calculateWeightedAverageCost = async (ingredientName: string) => {
    try {
      const result = await calculateWeightedAverage(ingredientName)
      return result.weightedAverage
    } catch (error) {
      console.error("Erro ao calcular média ponderada:", error)
      return 0
    }
  }

  const handleCalculateWeightedAverage = async (ingredientId: string, ingredientName: string) => {
    if (!ingredientName.trim()) {
      alert("Por favor, insira o nome do ingrediente primeiro")
      return
    }

    const weightedAverage = await calculateWeightedAverageCost(ingredientName)
    updateIngredient(ingredientId, "unitCost", weightedAverage)
  }

  const totalCost = ingredients.reduce((sum, ing) => sum + ing.totalCost, 0)
  const costPerUnit = formData.yield ? totalCost / Number.parseFloat(formData.yield) : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      ...formData,
      ingredients,
      totalCost,
      costPerUnit,
      createdAt: new Date().toISOString(),
    }

    if (mode === "create") {
      onProductCreated(productData)
    } else {
      onProductUpdated(productData)
    }

    onClose()
  }

  const isReadOnly = mode === "view"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bebas text-xl">
            {mode === "create" && "Cadastrar Produto Intermediário"}
            {mode === "edit" && "Editar Produto Intermediário"}
            {mode === "view" && "Visualizar Produto Intermediário"}
          </DialogTitle>
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
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger className="font-nunito">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Base" className="font-nunito">
                        Base
                      </SelectItem>
                      <SelectItem value="Complemento" className="font-nunito">
                        Complemento
                      </SelectItem>
                      <SelectItem value="Cobertura" className="font-nunito">
                        Cobertura
                      </SelectItem>
                      <SelectItem value="Recheio" className="font-nunito">
                        Recheio
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="subCategory" className="font-nunito font-medium">
                    Sub-categoria
                  </Label>
                  <Select
                    value={formData.subCategory}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, subCategory: value }))}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger className="font-nunito">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Massas" className="font-nunito">
                        Massas
                      </SelectItem>
                      <SelectItem value="Coberturas" className="font-nunito">
                        Coberturas
                      </SelectItem>
                      <SelectItem value="Recheios" className="font-nunito">
                        Recheios
                      </SelectItem>
                      <SelectItem value="Molhos" className="font-nunito">
                        Molhos
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="preparationTime" className="font-nunito font-medium">
                    Tempo de Preparo (minutos)
                  </Label>
                  <Input
                    id="preparationTime"
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, preparationTime: e.target.value }))}
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
                    value={formData.yield}
                    onChange={(e) => setFormData((prev) => ({ ...prev, yield: e.target.value }))}
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
                  <Select
                    value={formData.yieldUnit}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, yieldUnit: value }))}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger className="font-nunito">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg" className="font-nunito">
                        kg
                      </SelectItem>
                      <SelectItem value="g" className="font-nunito">
                        g
                      </SelectItem>
                      <SelectItem value="L" className="font-nunito">
                        L
                      </SelectItem>
                      <SelectItem value="ml" className="font-nunito">
                        ml
                      </SelectItem>
                      <SelectItem value="unidades" className="font-nunito">
                        unidades
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-nunito font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
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
                    onClick={addIngredient}
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
                  {ingredients.map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>
                        <Input
                          value={ingredient.name}
                          onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                          placeholder="Nome do ingrediente"
                          disabled={isReadOnly}
                          className="font-nunito"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={ingredient.quantity}
                          onChange={(e) =>
                            updateIngredient(ingredient.id, "quantity", Number.parseFloat(e.target.value) || 0)
                          }
                          disabled={isReadOnly}
                          className="font-nunito"
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={ingredient.unit}
                          onValueChange={(value) => updateIngredient(ingredient.id, "unit", value)}
                          disabled={isReadOnly}
                        >
                          <SelectTrigger className="font-nunito">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg" className="font-nunito">
                              kg
                            </SelectItem>
                            <SelectItem value="g" className="font-nunito">
                              g
                            </SelectItem>
                            <SelectItem value="L" className="font-nunito">
                              L
                            </SelectItem>
                            <SelectItem value="ml" className="font-nunito">
                              ml
                            </SelectItem>
                            <SelectItem value="unidades" className="font-nunito">
                              unidades
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={ingredient.unitCost}
                            onChange={(e) =>
                              updateIngredient(ingredient.id, "unitCost", Number.parseFloat(e.target.value) || 0)
                            }
                            disabled={isReadOnly}
                            className="font-nunito"
                          />
                          {!isReadOnly && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleCalculateWeightedAverage(ingredient.id, ingredient.name)}
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
                            onClick={() => removeIngredient(ingredient.id)}
                            disabled={ingredients.length === 1}
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
                      {formData.yield} {formData.yieldUnit}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Custo por {formData.yieldUnit}:</span>
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
                value={formData.instructions}
                onChange={(e) => setFormData((prev) => ({ ...prev, instructions: e.target.value }))}
                placeholder="Descreva o modo de preparo do produto intermediário..."
                rows={6}
                disabled={isReadOnly}
                className="font-nunito"
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="font-nunito bg-transparent">
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
