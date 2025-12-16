"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { TrendingUp } from "lucide-react"

const metrics = [
  {
    title: "Faturamento:",
    value: "R$585,363.64",
    change: "+3.5%",
    changeType: "positive" as const,
  },
  {
    title: "Clientes:",
    value: "368",
    change: "+5.2%",
    changeType: "positive" as const,
  },
  {
    title: "Lucro:",
    value: "R$51,420.16",
    change: "+2.1%",
    changeType: "positive" as const,
  },
]

export function AdminDashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-body text-white/80">{metric.title}</p>
              <p className="text-2xl font-bold text-white font-heading">{metric.value}</p>
              <div className="flex items-center space-x-1">
                <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="font-body">{metric.change}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
