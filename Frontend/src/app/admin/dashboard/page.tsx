"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { AdminDashboardMetrics } from "@/src/components/admin-dashboard-metrics"
import { AdminDashboardCharts } from "@/src/components/admin-dashboard-charts"
import { AdminDashboardAreas } from "@/src/components/admin-dashboard-areas"
import AdminDashboardPreview from "./preview"
import { Eye, Code } from "lucide-react"

export default function AdminDashboardPage() {
  const [showPreview, setShowPreview] = useState(false)

  // Se preview estiver ativo, mostrar a versão nova
  if (showPreview) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(false)}
            className="bg-white shadow-lg"
          >
            <Code className="h-4 w-4 mr-2" />
            Voltar ao Original
          </Button>
        </div>
        <AdminDashboardPreview />
      </div>
    )
  }

  // Versão original
  return (
    <div className="min-h-screen admin-gradient">
      <div>
        {/* Preview Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setShowPreview(true)}
            className="bg-[#322ca7] hover:bg-[#322ca7]/90 shadow-lg"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Preview do Novo Design
          </Button>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-white font-body text-lg">Dashboard Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white font-body">Janeiro 2024 - Dezembro 2025</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10 font-body bg-transparent"
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10 font-body bg-transparent"
              >
                Ontem
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/20 hover:bg-white/10 font-body bg-transparent"
              >
                Esta Semana
              </Button>
              <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 font-body">
                Customizado 📅
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          <AdminDashboardMetrics />
          <AdminDashboardCharts />
          <AdminDashboardAreas />
        </div>
      </div>
    </div>
  )
}
