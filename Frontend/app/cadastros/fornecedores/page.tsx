"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Users,
  Edit,
  Trash2,
  Plus,
  Filter,
  Info,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { CreateSupplierModal } from "@/components/create-supplier-modal"
import { EditSupplierModal } from "@/components/edit-supplier-modal"
import { SupplierDetailsModal } from "@/components/supplier-details-modal"
import { SupplierFilterModal } from "@/components/supplier-filter-modal"

// Dados simulados
const initialCategories = [
  { id: 1, name: "Geral" },
  { id: 2, name: "Bebidas" },
  { id: 3, name: "Secos" },
  { id: 4, name: "Proteínas" },
  { id: 5, name: "Perecíveis" },
  { id: 6, name: "Hortifruti" },
]

const initialSubcategories = [
  { id: 1, name: "Orgânico" },
  { id: 2, name: "Industrializado" },
  { id: 3, name: "Natal" },
  { id: 4, name: "Gourmet" },
  { id: 5, name: "Fresco" },
  { id: 6, name: "Cachaças" },
]

interface Supplier {
  id: number
  name: string
  cnpj: string
  phone: string
  paymentMethods: string[]
  categoryId: number
  subcategoryId: number
  category: string
  subcategory: string
  bankData?: {
    agency: string
    accountNumber: string
    pixKey: string
  } | null
}

const initialSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Cachaça Prata Serra das Almas",
    cnpj: "28.281.065/0001-44",
    phone: "11 98833-2121",
    paymentMethods: ["Pix e Transferência Bancária"],
    categoryId: 2,
    subcategoryId: 6,
    category: "Bebidas",
    subcategory: "Cachaças",
    bankData: {
      agency: "1234",
      accountNumber: "12345-6",
      pixKey: "empresa@email.com",
    },
  },
  {
    id: 2,
    name: "Carrefour",
    cnpj: "00.000.000/0000-00",
    phone: "00 00000-0000",
    paymentMethods: ["Pix e Transferência Bancária", "Cartão Crédito/Débito"],
    categoryId: 1,
    subcategoryId: 2,
    category: "Geral",
    subcategory: "Industrializado",
    bankData: null,
  },
  // Adicionar mais fornecedores para simular paginação
  ...Array.from({ length: 33 }, (_, i) => ({
    id: 3 + i,
    name: "Cachaça Prata Serra das Almas",
    cnpj: "00.000.000/0000-00",
    phone: "00 00000-0000",
    paymentMethods: ["Pix e Transferência Bancária"],
    categoryId: 2,
    subcategoryId: 6,
    category: "Bebidas",
    subcategory: "Cachaças",
    bankData: {
      agency: "1234",
      accountNumber: "12345-6",
      pixKey: "empresa@email.com",
    },
  })),
]

const ITEMS_PER_PAGE = 10

export default function FornecedoresPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [filteredSuppliers, setFilteredSuppliers] = useState(initialSuppliers)
  const [categories] = useState(initialCategories)
  const [subcategories] = useState(initialSubcategories)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [detailsSupplier, setDetailsSupplier] = useState<Supplier | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Cálculos de paginação
  const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex)

  const handleCreateSupplier = (newSupplier: any) => {
    const category = categories.find((cat) => cat.id === newSupplier.categoryId)
    const subcategory = subcategories.find((sub) => sub.id === newSupplier.subcategoryId)

    const supplierToAdd: Supplier = {
      id: Date.now() + Math.random(),
      ...newSupplier,
      category: category?.name || "",
      subcategory: subcategory?.name || "",
    }

    const updatedSuppliers = [...suppliers, supplierToAdd]
    setSuppliers(updatedSuppliers)
    setFilteredSuppliers(updatedSuppliers)
    setShowCreateModal(false)
  }

  const handleEditSupplier = (id: number, updatedSupplier: any) => {
    const category = categories.find((cat) => cat.id === updatedSupplier.categoryId)
    const subcategory = subcategories.find((sub) => sub.id === updatedSupplier.subcategoryId)

    const updatedSuppliers = suppliers.map((supplier) =>
      supplier.id === id
        ? {
            ...supplier,
            ...updatedSupplier,
            category: category?.name || "",
            subcategory: subcategory?.name || "",
          }
        : supplier,
    )

    setSuppliers(updatedSuppliers)
    setFilteredSuppliers(updatedSuppliers)
    setShowEditModal(false)
    setEditingSupplier(null)
  }

  const handleDeleteSupplier = (id: number) => {
    const updatedSuppliers = suppliers.filter((supplier) => supplier.id !== id)
    setSuppliers(updatedSuppliers)
    setFilteredSuppliers(updatedSuppliers)

    // Ajustar página atual se necessário
    const newTotalPages = Math.ceil(updatedSuppliers.length / ITEMS_PER_PAGE)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  const handleApplyFilters = (filters: { search: string; category: string; paymentMethod: string }) => {
    let filtered = suppliers

    if (filters.search) {
      filtered = filtered.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(filters.search.toLowerCase()) || supplier.cnpj.includes(filters.search),
      )
    }

    if (filters.category) {
      filtered = filtered.filter((supplier) => supplier.category === filters.category)
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter((supplier) => supplier.paymentMethods.includes(filters.paymentMethod))
    }

    setFilteredSuppliers(filtered)
    setCurrentPage(1)
  }

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setShowEditModal(true)
  }

  const openDetailsModal = (supplier: Supplier) => {
    setDetailsSupplier(supplier)
    setShowDetailsModal(true)
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
            <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Fornecedores</h1>
            <p className="font-nunito font-light text-sm text-gray-600 mt-1">
              Área dedicada ao cadastro de Informações para o Sistema.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setShowFilterModal(true)}
              variant="outline"
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 font-nunito font-medium flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros e Visualização
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Cadastrar Fornecedor
            </Button>
          </div>
        </div>

        {/* Tabela de Fornecedores */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Fornecedor</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">CNPJ</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Categoria</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Telefone</th>
                  <th className="px-6 py-4 text-left font-nunito font-medium text-gray-900">Pagamentos</th>
                  <th className="px-6 py-4 text-right font-nunito font-medium text-gray-900 w-32">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{supplier.name}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{supplier.cnpj}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{supplier.category}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">{supplier.phone}</td>
                    <td className="px-6 py-4 font-nunito font-light text-gray-900">
                      {supplier.paymentMethods.join(", ")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsModal(supplier)}
                          className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(supplier)}
                          className="text-gray-600 hover:text-[#322CA7] hover:bg-[#322CA7]/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSupplier(supplier.id)}
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
          {filteredSuppliers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-nunito font-medium text-lg text-gray-900 mb-2">Nenhum fornecedor encontrado</h3>
              <p className="font-nunito font-light text-gray-600 mb-4">
                {suppliers.length === 0
                  ? "Comece cadastrando seu primeiro fornecedor."
                  : "Tente ajustar os filtros ou cadastrar um novo fornecedor."}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Fornecedor
              </Button>
            </div>
          )}
        </div>

        {/* Paginação */}
        {filteredSuppliers.length > 0 && (
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
              Mostrando páginas {Math.min(startIndex + 1, filteredSuppliers.length)} a{" "}
              {Math.min(endIndex, filteredSuppliers.length)} de {filteredSuppliers.length} total
            </p>
          </div>
        )}
      </div>

      {/* Modais */}
      <CreateSupplierModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateSupplier={handleCreateSupplier}
        categories={categories}
        subcategories={subcategories}
      />

      <EditSupplierModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        supplier={editingSupplier}
        onEditSupplier={handleEditSupplier}
        categories={categories}
        subcategories={subcategories}
      />

      <SupplierDetailsModal open={showDetailsModal} onOpenChange={setShowDetailsModal} supplier={detailsSupplier} />

      <SupplierFilterModal
        open={showFilterModal}
        onOpenChange={setShowFilterModal}
        onApplyFilters={handleApplyFilters}
        categories={categories}
      />
    </div>
  )
}
