"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

export function AdminDashboardMetrics() {
  const metrics = [
    {
      title: "Faturamento:",
      value: "R$585,363.64",
      change: "+3.19%",
      changeType: "positive" as const,
    },
    {
      title: "Clientes:",
      value: "368",
      change: "+5.20%",
      changeType: "positive" as const,
    },
    {
      title: "Lucro:",
      value: "R$51,420.16",
      change: "+3.50%",
      changeType: "positive" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-white/80 text-sm font-medium">{metric.title}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <Badge
                  variant="secondary"
                  className={`${
                    metric.changeType === "positive"
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-red-500/20 text-red-300 border-red-500/30"
                  } flex items-center gap-1`}
                >
                  <TrendingUp className="h-3 w-3" />
                  {metric.change}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
