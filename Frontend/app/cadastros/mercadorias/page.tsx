"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Store, Edit, Trash2, Plus, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { CreateMerchandiseModal } from "@/components/create-merchandise-modal"
import { EditMerchandiseModal } from "@/components/edit-merchandise-modal"
import { MerchandiseFilterModal } from "@/components/merchandise-filter-modal"

// Dados simulados dos CRUDs de base
const initialItems = [
  { id: 1, name: "Abacaxi" },
  { id: 2, name: "Cerveja" },
  { id: 3, name: "Limão" },
  { id: 4, name: "Refrigerante" },
  { id: 5, name: "Camarão" },
  { id: 6, name: "Costela" },
  { id: 7, name: "Bife" },
  { id: 8, name: "Cachaça" },
  { id: 9, name: "Água" },
  { id: 10, name: "Morango" },
  { id: 11, name: "Cenoura" },
]

const initialBrands = [
  { id: 1, name: "Coca-Cola" },
  { id: 2, name: "Guaraná" },
  { id: 3, name: "Heineken" },
  { id: 4, name: "Fri Boi" },
  { id: 5, name: "Wessel" },
  { id: 6, name: "Ervas Finas" },
  { id: 7, name: "Serra das Almas" },
]

const initialTypes = [
  { id: 1, name: "Com Gás" },
  { id: 2, name: "Sem Gás" },
  { id: 3, name: "Duplo Malte" },
  { id: 4, name: "Zero" },
  { id: 5, name: "Long Neck" },
  { id: 6, name: "Lata" },
  { id: 7, name: "Prata" },
]

const initialCategories = [
  { id: 1, name: "Geral" },
  { id: 2, name: "Bebidas" },
  { id: 3, name: "Secos" },
  { id: 4, name: "Proteínas" },
  { id: 5, name: "Perecíveis" },
  { id: 6, name: "Hortifruti" },
]

const initialUnits = [
  { id: 1, name: "Quilograma" },
  { id: 2, name: "Litro" },
  { id: 3, name: "Mililitro" },
  { id: 4, name: "Gramas" },
  { id: 5, name: "Mili-litros" },
]

const initialMerchandise = [
  {
    id: 1,
    name: "Cenoura Ervas Finas",
    item: "Cenoura",
    brand: "Ervas Finas",
    type: "-",
    category: "Hortifruti",
    unit: "Gramas",
    itemId: 11,
    brandId: 6,
    typeId: 0,
    categoryId: 6,
    unitId: 4,
  },
  {
    id: 2,
    name: "Cerveja Heineken Long Neck",
    item: "Cerveja",
    brand: "Heineken",
    type: "Long Neck",
    category: "Bebidas",
    unit: "Mili-litros",
    itemId: 2,
    brandId: 3,
    typeId: 5,
    categoryId: 2,
    unitId: 5,
  },
  {
    id: 3,
    name: "Cachaça Serra das Almas Prata",
    item: "Cachaça",
    brand: "Serra das Almas",
    type: "Prata",
    category: "Bebidas",
    unit: "Mili-litros",
    itemId: 8,
    brandId: 7,
    typeId: 7,
    categoryId: 2,
    unitId: 5,
  },
  {
    id: 4,
    name: "Refrigerante Coca-Cola Lata",
    item: "Refrigerante",
    brand: "Coca-Cola",
    type: "Lata",
    category: "Bebidas",
    unit: "Mili-litros",
    itemId: 4,
    brandId: 1,
    typeId: 6,
    categoryId: 2,
    unitId: 5,
  },
  {
    id: 5,
    name: "Refrigerante Guaraná Lata",
    item: "Refrigerante",
    brand: "Guaraná",
    type: "Lata",
    category: "Bebidas",
    unit: "Mili-litros",
    itemId: 4,
    brandId: 2,
    typeId: 6,
    categoryId: 2,
    unitId: 5,
  },
  // Adicionar mais mercadorias para simular paginação
  ...Array.from({ length: 30 }, (_, i) => ({
    id: 6 + i,
    name: "Cenoura Ervas Finas",
    item: "Cenoura",
    brand: "Ervas Finas",
    type: "-",
    category: "Hortifruti",
    unit: "Gramas",
    itemId: 11,
    brandId: 6,
    typeId: 0,
    categoryId: 6,
    unitId: 4,
  })),
]

const ITEMS_PER_PAGE = 10

export default function MercadoriasPage() {
  const [merchandise, setMerchandise] = useState(initialMerchandise)
  const [filteredMerchandise, setFilteredMerchandise] = useState(initialMerchandise)
  const [items] = useState(initialItems)
  const [brands] = useState(initialBrands)
  const [types] = useState(initialTypes)
  const [categories] = useState(initialCategories)
  const [units] = useState(initialUnits)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [editingMerchandise, setEditingMerchandise] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredMerchandise.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentMerchandise = filteredMerchandise.slice(startIndex, endIndex)

  const generateMerchandiseName = (itemName: string, brandName: string, typeName?: string) => {
    if (typeName && typeName !== "-") {
      return `${itemName} ${brandName} ${typeName}`
    }
    return `${itemName} ${brandName}`
  }

  const handleCreateMerchandise = (newItems: any[]) => {
    const merchandiseToAdd = newItems.map((item) => {
      const itemData = items.find((i) => i.id === item.itemId)
      const brandData = brands.find((b) => b.id === item.brandId)
      const typeData = types.find((t) => t.id === item.typeId)
      const categoryData = categories.find((c) => c.id === item.categoryId)
      const unitData = units.find((u) => u.id === item.unitId)

      return {
        id: Date.now() + Math.random(),
        name: generateMerchandiseName(itemData?.name || "", brandData?.name || "", typeData?.name),
        item: itemData?.name || "",
        brand: brandData?.name || "",
        type: typeData?.name || "-",
        category: categoryData?.name || "",
        unit: unitData?.name || "",
        itemId: item.itemId,
        brandId: item.brandId,
        typeId: item.typeId,
        categoryId: item.categoryId,
        unitId: item.unitId,
      }
    })

    const updatedMerchandise = [...merchandise, ...merchandiseToAdd]
    setMerchandise(updatedMerchandise)
    setFilteredMerchandise(updatedMerchandise)
    setShowCreateModal(false)
  }

  const handleEditMerchandise = (id: number, updatedItems: any[]) => {
    if (updatedItems.length > 0) {
      const item = updatedItems[0] // Assumindo que só editamos um item por vez
      const itemData = items.find((i) => i.id === item.itemId)
      const brandData = brands.find((b) => b.id === item.brandId)
      const typeData = types.find((t) => t.id === item.typeId)
      const categoryData = categories.find((c) => c.id === item.categoryId)
      const unitData = units.find((u) => u.id === item.unitId)

      const updatedMerchandise = merchandise.map((merch) =>
        merch.id === id
          ? {
              ...merch,
              name: generateMerchandiseName(itemData?.name || "", brandData?.name || "", typeData?.name),
              item: itemData?.name || "",
              brand: brandData?.name || "",
              type: typeData?.name || "-",
              category: categoryData?.name || "",
              unit: unitData?.name || "",
              itemId: item.itemId,
              brandId: item.brandId,
              typeId: item.typeId,
              categoryId: item.categoryId,
              unitId: item.unitId,
            }
          : merch,
      )

      setMerchandise(updatedMerchandise)
      setFilteredMerchandise(updatedMerchandise)
    }
    setShowEditModal(false)
    setEditingMerchandise(null)
  }

  const handleDeleteMerchandise = (id: number) => {
    const updatedMerchandise = merchandise.filter((merch) => merch.id !== id)
    setMerchandise(updatedMerchandise)
    setFilteredMerchandise(updatedMerchandise)

    const newTotalPages = Math.ceil(updatedMerchandise.length / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  const handleApplyFilters = (filters: { search: string; category: string; unit: string; type: string }) => {
    let filtered = merchandise

    if (filters.search) {
      filtered = filtered.filter(
        (merch) =>
          merch.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          merch.item.toLowerCase().includes(filters.search.toLowerCase()) ||
          merch.brand.toLowerCase().includes(filters.search.toLowerCase()),
      )
    }

    if (filters.category) {
      filtered = filtered.filter((merch) => merch.category === filters.category)
    }

    if (filters.unit) {
      filtered = filtered.filter((merch) => merch.unit === filters.unit)
    }

    if (filters.type) {
      filtered = filtered.filter((merch) => merch.type === filters.type)
    }

    setFilteredMerchandise(filtered)
    setCurrentPage(1)

    // Verificar se há filtros ativos
    const hasFilters = !!(filters.search || filters.category || filters.unit || filters.type)
    setHasActiveFilters(hasFilters)
  }

  const openEditModal = (merch: any) => {
    setEditingMerchandise(merch)
    setShowEditModal(true)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Mercadorias</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Button
                onClick={() => setShowFilterModal(true)}
                variant="outline"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-nunito font-medium flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros e Visualização
              </Button>
              {hasActiveFilters && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  1
                </Badge>
              )}
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              Cadastrar Mercadoria
            </Button>
          </div>
        </div>

        {/* Tabela de Mercadorias */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Mercadoria</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Item</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Marca</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Tipo</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Unidade Técnica</th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentMerchandise.map((merch) => (
                  <tr key={merch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{merch.name}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{merch.item}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{merch.brand}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{merch.type}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{merch.category}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{merch.unit}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(merch)}
                          className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMerchandise(merch.id)}
                          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Estado vazio */}
          {filteredMerchandise.length === 0 && (
            <div className="text-center py-12">
              <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhuma mercadoria encontrada</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">
                {merchandise.length === 0
                  ? "Comece cadastrando sua primeira mercadoria."
                  : "Tente ajustar os filtros ou cadastrar uma nova mercadoria."}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Mercadoria
              </Button>
            </div>
          )}
        </div>

        {/* Paginação */}
        {filteredMerchandise.length > 0 && (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="text-gray-600 hover:text-[#322CA7]"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-gray-600 hover:text-[#322CA7]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getVisiblePages().map((page, index) => (
                <Button
                  key={index}
                  variant={page === currentPage ? "default" : "ghost"}
                  size="sm"
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={page === "..."}
                  className={
                    page === currentPage
                      ? "bg-[#322CA7] text-white hover:bg-[#1C194D]"
                      : "text-gray-600 hover:text-[#322CA7]"
                  }
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-gray-600 hover:text-[#322CA7]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="text-gray-600 hover:text-[#322CA7]"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>

            <p className="font-nunito font-light text-sm text-gray-600">
              Mostrando páginas {Math.min(startIndex + 1, filteredMerchandise.length)} a{" "}
              {Math.min(endIndex, filteredMerchandise.length)} de {filteredMerchandise.length} total
            </p>
          </div>
        )}
      </div>

      {/* Modais */}
      <CreateMerchandiseModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateMerchandise={handleCreateMerchandise}
        items={items}
        brands={brands}
        types={types}
        categories={categories}
        units={units}
      />

      <EditMerchandiseModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        merchandise={editingMerchandise}
        onEditMerchandise={handleEditMerchandise}
        items={items}
        brands={brands}
        types={types}
        categories={categories}
        units={units}
      />

      <MerchandiseFilterModal
        open={showFilterModal}
        onOpenChange={setShowFilterModal}
        onApplyFilters={handleApplyFilters}
        categories={categories}
        units={units}
        types={types}
      />
    </div>
  )
}
