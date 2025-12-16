"use client"

import { Button } from "@/src/components/ui/button"
import { AdminDashboardMetrics } from "@/src/components/admin-dashboard-metrics"
import { AdminDashboardCharts } from "@/src/components/admin-dashboard-charts"
import { AdminDashboardAreas } from "@/src/components/admin-dashboard-areas"
import { TasteFlowLogo } from "@/src/components/tasteflow-logo"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen admin-gradient">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <TasteFlowLogo size="small" className="text-white" />
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
