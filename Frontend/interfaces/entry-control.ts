export interface EntryControl {
  id?: string
  description: string
  value: number
  date: string
  categoryId: string
  paymentMethod: string
  type: "income" | "expense"
}
