"use client"

import { AdminDashboardMetrics } from "@/components/admin-dashboard-metrics"
import { AdminDashboardCharts } from "@/components/admin-dashboard-charts"
import { AdminDashboardAreas } from "@/components/admin-dashboard-areas"

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">DashBoards:</h1>
            <p className="text-white/70">Janeiro 2024 - Dezembro 2025</p>
          </div>
        </div>

        {/* Metrics */}
        <AdminDashboardMetrics />

        {/* Charts */}
        <AdminDashboardCharts />

        {/* Administration Areas */}
        <div className="mt-12">
          <AdminDashboardAreas />
        </div>
      </div>
    </div>
  )
}
