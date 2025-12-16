"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"

const metrics = [
  {
    title: "Faturamento:",
    value: "R$12,363.64",
    change: "+4% Ontem",
    changeType: "positive" as const,
  },
  {
    title: "Gastos e Perdas:",
    value: "R$23,432.16",
    change: "5% Ontem",
    changeType: "neutral" as const,
  },
  {
    title: "Clientes:",
    value: "74",
    change: "+7% Ontem",
    changeType: "positive" as const,
  },
  {
    title: "Lucro:",
    value: "R$5,420.16",
    change: "+2% Ontem",
    changeType: "positive" as const,
  },
]

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="font-nunito font-light text-sm text-gray-600">{metric.title}</p>
              <p className="font-bebas text-2xl text-gray-900 tracking-wide">{metric.value}</p>
              <Badge
                variant="secondary"
                className={`text-xs font-nunito font-light ${
                  metric.changeType === "positive" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {metric.change}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
