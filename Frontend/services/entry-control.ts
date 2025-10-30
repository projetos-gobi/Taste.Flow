// Mock service for entry control operations
export interface EntryControl {
  id?: string
  description: string
  value: number
  date: string
  categoryId: string
  paymentMethod: string
  type: "income" | "expense"
}

// Mock data for demonstration
const mockEntries: EntryControl[] = [
  {
    id: "1",
    description: "Venda de produtos",
    value: 1500.0,
    date: "2024-01-15",
    categoryId: "1",
    paymentMethod: "pix",
    type: "income",
  },
  {
    id: "2",
    description: "Compra de ingredientes",
    value: 800.0,
    date: "2024-01-14",
    categoryId: "2",
    paymentMethod: "credit_card",
    type: "expense",
  },
]

export const listEntryControls = async (): Promise<EntryControl[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockEntries
}

export const getEntryControlById = async (id: string): Promise<EntryControl> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  const entry = mockEntries.find((entry) => entry.id === id)
  if (!entry) {
    throw new Error("Entry not found")
  }
  return entry
}

export const createEntryControl = async (entry: Omit<EntryControl, "id">): Promise<EntryControl> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newEntry = {
    ...entry,
    id: (mockEntries.length + 1).toString(),
  }
  mockEntries.push(newEntry)
  return newEntry
}

export const updateEntryControl = async (id: string, entry: Partial<EntryControl>): Promise<EntryControl> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockEntries.findIndex((e) => e.id === id)
  if (index === -1) {
    throw new Error("Entry not found")
  }
  mockEntries[index] = { ...mockEntries[index], ...entry }
  return mockEntries[index]
}

export const deleteEntryControl = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  const index = mockEntries.findIndex((e) => e.id === id)
  if (index === -1) {
    throw new Error("Entry not found")
  }
  mockEntries.splice(index, 1)
}
