"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Eye, Edit, Trash2, Plus } from "lucide-react"

interface AlternativeRecipesModalProps {
  isOpen: boolean
  onClose: () => void
  product: any
  onCreateAlternative: (product: any) => void
}

export function AlternativeRecipesModal({
  isOpen,
  onClose,
  product,
  onCreateAlternative,
}: AlternativeRecipesModalProps) {
  if (!product) return null

  // Mock alternative recipes data
  const alternatives = [
    {
      id: 1,
      name: `${product.name} - Alternativa 1`,
      description: "Versão com ingredientes mais econômicos",
      costReduction: "15%",
      marginImprovement: "8%",
      createdAt: "2024-01-15",
      status: "Ativa",
    },
    {
      id: 2,
      name: `${product.name} - Alternativa 2`,
      description: "Versão premium com ingredientes especiais",
      costReduction: "-5%",
      marginImprovement: "12%",
      createdAt: "2024-01-20",
      status: "Em Teste",
    },
  ]

  const handleCreateNew = () => {
    onCreateAlternative(product)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bebas text-xl">Fichas Alternativas - {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Original Recipe */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-nunito text-lg">Receita Original</CardTitle>
                <Badge className="bg-green-100 text-green-800">Original</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Preço de Venda:</span>
                  <p className="font-nunito">{product.salePrice}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Margem:</span>
                  <p className="font-nunito">{product.marginPercent}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Status:</span>
                  <p className="font-nunito">Ativa</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Recipes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-nunito text-lg font-semibold">Receitas Alternativas ({alternatives.length})</h3>
              <Button onClick={handleCreateNew} className="bg-[#322ca7] hover:bg-[#322ca7]/90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Alternativa
              </Button>
            </div>

            {alternatives.map((alternative) => (
              <Card key={alternative.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-nunito text-lg">{alternative.name}</CardTitle>
                    <Badge
                      variant={alternative.status === "Ativa" ? "default" : "secondary"}
                      className={
                        alternative.status === "Ativa" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {alternative.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 font-nunito">{alternative.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-600">Redução de Custo:</span>
                      <p
                        className={`font-nunito ${alternative.costReduction.startsWith("-") ? "text-red-600" : "text-green-600"}`}
                      >
                        {alternative.costReduction}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Melhoria na Margem:</span>
                      <p className="font-nunito text-green-600">{alternative.marginImprovement}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Criado em:</span>
                      <p className="font-nunito">{new Date(alternative.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <p className="font-nunito">{alternative.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {alternatives.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 font-nunito mb-4">
                Nenhuma receita alternativa encontrada para este produto.
              </p>
              <Button onClick={handleCreateNew} className="bg-[#322ca7] hover:bg-[#322ca7]/90">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Alternativa
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6">
          <Button variant="outline" onClick={onClose} className="font-nunito bg-transparent">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
