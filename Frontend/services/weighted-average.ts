// Simulação de dados do CONTROLE DE ENTRADAS dos últimos 3 meses
interface EntryControlData {
  id: string
  date: string
  merchandise: string
  quantity: number
  unitCost: number
  supplier: string
}

interface EntryItem {
  id: string
  merchandise: string
  quantity: number
  unitCost: number
  totalCost: number
  date: string
}

interface WeightedAverageResult {
  weightedAverage: number
  totalQuantity: number
  totalCost: number
  entriesCount: number
  period: string
}

export interface WeightedAverageItem {
  quantity: number
  unitCost: number
  totalCost: number
}

export interface MerchandiseWithCost {
  id: string
  name: string
  unit: string
  weightedAverageCost: number
  lastEntries: Array<{
    quantity: number
    unitCost: number
    date: Date
  }>
}

export interface PurchaseEntry {
  date: string
  quantity: number
  unitCost: number
  supplier: string
}

// Dados mock para entradas de mercadorias dos últimos 3 meses
const mockEntries = [
  // Farinha de Trigo
  { merchandise: "Farinha de Trigo", date: "2025-04-15", quantity: 50, unitCost: 3.2 },
  { merchandise: "Farinha de Trigo", date: "2025-05-10", quantity: 75, unitCost: 3.15 },
  { merchandise: "Farinha de Trigo", date: "2025-06-05", quantity: 60, unitCost: 3.25 },

  // Açúcar Cristal
  { merchandise: "Açúcar Cristal", date: "2025-04-20", quantity: 40, unitCost: 4.5 },
  { merchandise: "Açúcar Cristal", date: "2025-05-15", quantity: 55, unitCost: 4.35 },
  { merchandise: "Açúcar Cristal", date: "2025-06-08", quantity: 45, unitCost: 4.6 },

  // Ovos
  { merchandise: "Ovos", date: "2025-04-12", quantity: 20, unitCost: 8.5 },
  { merchandise: "Ovos", date: "2025-05-18", quantity: 25, unitCost: 8.75 },
  { merchandise: "Ovos", date: "2025-06-02", quantity: 30, unitCost: 8.4 },

  // Leite Integral
  { merchandise: "Leite Integral", date: "2025-04-25", quantity: 100, unitCost: 5.2 },
  { merchandise: "Leite Integral", date: "2025-05-20", quantity: 80, unitCost: 5.35 },
  { merchandise: "Leite Integral", date: "2025-06-10", quantity: 90, unitCost: 5.15 },

  // Manteiga
  { merchandise: "Manteiga", date: "2025-04-08", quantity: 15, unitCost: 12.8 },
  { merchandise: "Manteiga", date: "2025-05-12", quantity: 20, unitCost: 13.2 },
  { merchandise: "Manteiga", date: "2025-06-15", quantity: 18, unitCost: 12.95 },

  // Fermento Biológico
  { merchandise: "Fermento Biológico", date: "2025-04-30", quantity: 5, unitCost: 25.0 },
  { merchandise: "Fermento Biológico", date: "2025-05-25", quantity: 8, unitCost: 24.5 },
  { merchandise: "Fermento Biológico", date: "2025-06-12", quantity: 6, unitCost: 25.8 },
]

export class WeightedAverageService {
  private static entries: EntryItem[] = [
    {
      id: "1",
      merchandise: "Farinha de Trigo",
      quantity: 50,
      unitCost: 0.008,
      totalCost: 0.4,
      date: "2024-03-01",
    },
    {
      id: "2",
      merchandise: "Farinha de Trigo",
      quantity: 100,
      unitCost: 0.009,
      totalCost: 0.9,
      date: "2024-03-05",
    },
    {
      id: "3",
      merchandise: "Açúcar Cristal",
      quantity: 25,
      unitCost: 0.006,
      totalCost: 0.15,
      date: "2024-03-02",
    },
    {
      id: "4",
      merchandise: "Açúcar Cristal",
      quantity: 75,
      unitCost: 0.007,
      totalCost: 0.525,
      date: "2024-03-06",
    },
  ]

  static calculateWeightedAverage(items: WeightedAverageItem[]): number {
    if (items.length === 0) return 0

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalValue = items.reduce((sum, item) => sum + item.totalCost, 0)

    if (totalQuantity === 0) return 0

    return totalValue / totalQuantity
  }

  static calculateTotalCost(items: WeightedAverageItem[]): number {
    return items.reduce((sum, item) => sum + item.totalCost, 0)
  }

  static calculateAverageCostPerUnit(items: WeightedAverageItem[]): number {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalCost = this.calculateTotalCost(items)

    if (totalQuantity === 0) return 0

    return totalCost / totalQuantity
  }

  static formatCurrency(value: number): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  static parseCurrency(value: string): number {
    return Number.parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0
  }

  static calculateWeightedAverageFromControlData(merchandiseId: string): number {
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    // Filtrar entradas dos últimos 3 meses para a mercadoria específica
    const relevantEntries = this.getControlDataEntries().filter(
      (entry) => entry.merchandise === merchandiseId && new Date(entry.date) >= threeMonthsAgo,
    )

    if (relevantEntries.length === 0) {
      console.warn(`Nenhuma entrada encontrada para mercadoria ${merchandiseId} nos últimos 3 meses`)
      return 0
    }

    // Aplicar a fórmula da média ponderada: Σ(Quantidade × Custo Unitário) / Σ(Quantidade)
    const totalWeightedCost = relevantEntries.reduce((sum, entry) => sum + entry.quantity * entry.unitCost, 0)
    const totalQuantity = relevantEntries.reduce((sum, entry) => sum + entry.quantity, 0)

    const weightedAverage = totalWeightedCost / totalQuantity

    console.log(`Média ponderada para ${relevantEntries[0]?.merchandise}:`, {
      entries: relevantEntries.length,
      totalWeightedCost: totalWeightedCost.toFixed(2),
      totalQuantity,
      weightedAverage: weightedAverage.toFixed(4),
    })

    return weightedAverage
  }

  static getControlDataEntries(): EntryControlData[] {
    return [
      // Farinha de Trigo
      {
        id: "1",
        date: "2025-04-02",
        merchandise: "Farinha de Trigo",
        quantity: 100,
        unitCost: 3.0,
        supplier: "Fornecedor A",
      },
      {
        id: "2",
        date: "2025-05-15",
        merchandise: "Farinha de Trigo",
        quantity: 80,
        unitCost: 3.5,
        supplier: "Fornecedor B",
      },
      {
        id: "3",
        date: "2025-06-01",
        merchandise: "Farinha de Trigo",
        quantity: 120,
        unitCost: 3.2,
        supplier: "Fornecedor A",
      },
      {
        id: "4",
        date: "2025-06-10",
        merchandise: "Farinha de Trigo",
        quantity: 60,
        unitCost: 3.8,
        supplier: "Fornecedor C",
      },

      // Açúcar Cristal
      {
        id: "5",
        date: "2025-04-05",
        merchandise: "Açúcar Cristal",
        quantity: 50,
        unitCost: 4.2,
        supplier: "Fornecedor A",
      },
      {
        id: "6",
        date: "2025-05-20",
        merchandise: "Açúcar Cristal",
        quantity: 75,
        unitCost: 4.5,
        supplier: "Fornecedor B",
      },
      {
        id: "7",
        date: "2025-06-15",
        merchandise: "Açúcar Cristal",
        quantity: 40,
        unitCost: 4.8,
        supplier: "Fornecedor A",
      },

      // Ovos
      { id: "8", date: "2025-04-10", merchandise: "Ovos", quantity: 20, unitCost: 8.0, supplier: "Fornecedor D" },
      { id: "9", date: "2025-05-25", merchandise: "Ovos", quantity: 30, unitCost: 8.5, supplier: "Fornecedor D" },
      { id: "10", date: "2025-06-20", merchandise: "Ovos", quantity: 25, unitCost: 9.0, supplier: "Fornecedor E" },

      // Leite Integral
      {
        id: "11",
        date: "2025-04-15",
        merchandise: "Leite Integral",
        quantity: 100,
        unitCost: 4.5,
        supplier: "Fornecedor F",
      },
      {
        id: "12",
        date: "2025-05-30",
        merchandise: "Leite Integral",
        quantity: 80,
        unitCost: 4.8,
        supplier: "Fornecedor F",
      },
      {
        id: "13",
        date: "2025-06-25",
        merchandise: "Leite Integral",
        quantity: 60,
        unitCost: 5.0,
        supplier: "Fornecedor G",
      },

      // Manteiga
      { id: "14", date: "2025-04-20", merchandise: "Manteiga", quantity: 30, unitCost: 12.0, supplier: "Fornecedor H" },
      { id: "15", date: "2025-06-05", merchandise: "Manteiga", quantity: 25, unitCost: 13.5, supplier: "Fornecedor H" },

      // Chocolate em Pó
      {
        id: "16",
        date: "2025-05-10",
        merchandise: "Chocolate em Pó",
        quantity: 15,
        unitCost: 18.0,
        supplier: "Fornecedor I",
      },
      {
        id: "17",
        date: "2025-06-12",
        merchandise: "Chocolate em Pó",
        quantity: 20,
        unitCost: 19.5,
        supplier: "Fornecedor I",
      },

      // Fermento em Pó
      {
        id: "18",
        date: "2025-04-25",
        merchandise: "Fermento em Pó",
        quantity: 10,
        unitCost: 25.0,
        supplier: "Fornecedor J",
      },
      {
        id: "19",
        date: "2025-06-18",
        merchandise: "Fermento em Pó",
        quantity: 8,
        unitCost: 27.0,
        supplier: "Fornecedor J",
      },
    ]
  }

  static calculateWeightedAverageFromEntries(entries: EntryItem[]): number {
    if (entries.length === 0) return 0

    const totalQuantity = entries.reduce((sum, entry) => sum + entry.quantity, 0)
    const totalValue = entries.reduce((sum, entry) => sum + entry.totalCost, 0)

    if (totalQuantity === 0) return 0

    return totalValue / totalQuantity
  }

  static getAllMerchandise(): string[] {
    const uniqueMerchandise = [...new Set(this.entries.map((entry) => entry.merchandise))]
    return uniqueMerchandise
  }

  static addEntry(entry: Omit<EntryItem, "id">): void {
    const newEntry: EntryItem = {
      ...entry,
      id: Date.now().toString(),
    }
    this.entries.push(newEntry)
  }

  // Função para obter todas as mercadorias com seus custos médios ponderados
  static getMerchandisesWithWeightedCostFromControlData(): MerchandiseWithCost[] {
    const merchandises = [
      { id: "1", name: "Farinha de Trigo", unit: "KG" },
      { id: "2", name: "Açúcar Cristal", unit: "KG" },
      { id: "3", name: "Ovos", unit: "UN" },
      { id: "4", name: "Leite Integral", unit: "L" },
      { id: "5", name: "Manteiga", unit: "KG" },
      { id: "6", name: "Chocolate em Pó", unit: "KG" },
      { id: "7", name: "Fermento em Pó", unit: "KG" },
      { id: "8", name: "Fermento Biológico", unit: "UN" },
    ]

    return merchandises.map((merchandise) => {
      const weightedAverageCost = this.calculateWeightedAverageFromControlData(merchandise.id)
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      const lastEntries = this.getControlDataEntries()
        .filter((entry) => entry.merchandise === merchandise.id && new Date(entry.date) >= threeMonthsAgo)
        .map((entry) => ({
          quantity: entry.quantity,
          unitCost: entry.unitCost,
          date: new Date(entry.date),
        }))
        .sort((a, b) => b.date.getTime() - a.date.getTime())

      return {
        id: merchandise.id,
        name: merchandise.name,
        unit: merchandise.unit,
        weightedAverageCost,
        lastEntries,
      }
    })
  }

  // Função para obter o preço médio ponderado de uma mercadoria específica
  static async getWeightedAveragePriceFromControlData(merchandiseId: string): Promise<number> {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 500))

    return this.calculateWeightedAverageFromControlData(merchandiseId)
  }
}

// Mock data for demonstration - in a real app, this would come from your database
const mockPurchaseData: Record<string, PurchaseEntry[]> = {
  "farinha de trigo": [
    { date: "2024-03-15", quantity: 50, unitCost: 3.2, supplier: "Fornecedor A" },
    { date: "2024-02-28", quantity: 25, unitCost: 3.15, supplier: "Fornecedor B" },
    { date: "2024-02-10", quantity: 30, unitCost: 3.25, supplier: "Fornecedor A" },
    { date: "2024-01-20", quantity: 40, unitCost: 3.1, supplier: "Fornecedor C" },
  ],
  "açúcar cristal": [
    { date: "2024-03-10", quantity: 20, unitCost: 4.5, supplier: "Fornecedor A" },
    { date: "2024-02-25", quantity: 15, unitCost: 4.4, supplier: "Fornecedor B" },
    { date: "2024-01-15", quantity: 25, unitCost: 4.6, supplier: "Fornecedor A" },
  ],
  ovos: [
    { date: "2024-03-20", quantity: 100, unitCost: 0.45, supplier: "Fornecedor D" },
    { date: "2024-03-05", quantity: 80, unitCost: 0.42, supplier: "Fornecedor D" },
    { date: "2024-02-20", quantity: 120, unitCost: 0.48, supplier: "Fornecedor E" },
    { date: "2024-01-25", quantity: 90, unitCost: 0.4, supplier: "Fornecedor D" },
  ],
  manteiga: [
    { date: "2024-03-12", quantity: 10, unitCost: 12.5, supplier: "Fornecedor F" },
    { date: "2024-02-18", quantity: 8, unitCost: 12.2, supplier: "Fornecedor F" },
    { date: "2024-01-30", quantity: 12, unitCost: 12.8, supplier: "Fornecedor G" },
  ],
}

export async function calculateWeightedAverage(ingredientName: string): Promise<WeightedAverageResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const normalizedName = ingredientName.toLowerCase().trim()
  const purchaseEntries = mockPurchaseData[normalizedName] || []

  if (purchaseEntries.length === 0) {
    // If no data found, return a default/estimated value
    console.warn(`No purchase data found for ingredient: ${ingredientName}`)
    return {
      weightedAverage: 0,
      totalQuantity: 0,
      totalCost: 0,
      entriesCount: 0,
      period: "Últimos 3 meses",
    }
  }

  // Filter entries from the last 3 months
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

  const recentEntries = purchaseEntries.filter((entry) => {
    const entryDate = new Date(entry.date)
    return entryDate >= threeMonthsAgo
  })

  if (recentEntries.length === 0) {
    console.warn(`No recent purchase data found for ingredient: ${ingredientName}`)
    return {
      weightedAverage: 0,
      totalQuantity: 0,
      totalCost: 0,
      entriesCount: 0,
      period: "Últimos 3 meses",
    }
  }

  // Calculate weighted average: Σ(quantity × unitCost) / Σ(quantity)
  let totalWeightedCost = 0
  let totalQuantity = 0

  recentEntries.forEach((entry) => {
    totalWeightedCost += entry.quantity * entry.unitCost
    totalQuantity += entry.quantity
  })

  const weightedAverage = totalQuantity > 0 ? totalWeightedCost / totalQuantity : 0

  return {
    weightedAverage: Math.round(weightedAverage * 100) / 100, // Round to 2 decimal places
    totalQuantity,
    totalCost: totalWeightedCost,
    entriesCount: recentEntries.length,
    period: "Últimos 3 meses",
  }
}

// Helper function to get available ingredients for autocomplete
export function getAvailableIngredients(): string[] {
  return Object.keys(mockPurchaseData).map((ingredient) => ingredient.charAt(0).toUpperCase() + ingredient.slice(1))
}

// Helper function to get purchase history for an ingredient
export async function getPurchaseHistory(ingredientName: string): Promise<PurchaseEntry[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const normalizedName = ingredientName.toLowerCase().trim()
  return mockPurchaseData[normalizedName] || []
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}
