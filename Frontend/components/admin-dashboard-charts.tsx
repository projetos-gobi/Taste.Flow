"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AdminDashboardCharts() {
  const monthlyData = [
    { month: "JAN", value: 400 },
    { month: "FEV", value: 350 },
    { month: "MAR", value: 300 },
    { month: "ABR", value: 280 },
    { month: "MAI", value: 320 },
    { month: "JUN", value: 290 },
    { month: "JUL", value: 250 },
    { month: "AGO", value: 450 },
    { month: "SET", value: 520 },
    { month: "OUT", value: 580 },
    { month: "NOV", value: 650 },
    { month: "DEZ", value: 480 },
  ]

  const maxValue = Math.max(...monthlyData.map((d) => d.value))

  const userPlans = [
    { name: "Plano Premium", percentage: 52, color: "bg-blue-600" },
    { name: "Plano Simples", percentage: 22, color: "bg-blue-400" },
    { name: "Plano Estoque", percentage: 26, color: "bg-blue-300" },
  ]

  const geographicData = [
    { neighborhood: "Pinheiros", revenue: "R$5,568.74", clients: 3 },
    { neighborhood: "Pinheiros", revenue: "R$5,568.74", clients: 3 },
    { neighborhood: "Pinheiros", revenue: "R$5,568.74", clients: 3 },
    { neighborhood: "Pinheiros", revenue: "R$5,568.74", clients: 3 },
    { neighborhood: "Pinheiros", revenue: "R$5,568.74", clients: 3 },
    { neighborhood: "Pinheiros", revenue: "R$5,568.74", clients: 3 },
    { neighborhood: "Pinheiros", revenue: "R$5,568.74", clients: 3 },
    { neighborhood: "Pinheiros", revenue: "R$5,568.74", clients: 3 },
  ]

  return (
    <div className="space-y-8">
      {/* Main Chart */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                Hoje
              </Button>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                Ontem
              </Button>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                Esta Semana
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white/30 hover:bg-white/10 hover:text-white bg-transparent"
              >
                Customizado 📅
              </Button>
            </div>
          </div>

          <div className="h-80 flex items-end justify-between gap-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="bg-blue-500 rounded-t-sm w-full transition-all duration-300 hover:bg-blue-400 cursor-pointer"
                  style={{
                    height: `${(data.value / maxValue) * 200}px`,
                    minHeight: "20px",
                  }}
                  title={`${data.month}: R$ ${data.value}`}
                />
                <span className="text-white/70 text-xs font-medium">{data.month}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 text-white/60 text-xs">
            <div className="flex justify-between">
              <span>R$ 0</span>
              <span>R$ 1000</span>
              <span>R$ 2000</span>
              <span>R$ 3000</span>
              <span>R$ 4000</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users and Plans */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Usuários e Planos Assinados</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  {/* Premium - 52% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="8"
                    strokeDasharray={`${52 * 2.51} ${(100 - 52) * 2.51}`}
                    strokeDashoffset="0"
                  />
                  {/* Simples - 22% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="8"
                    strokeDasharray={`${22 * 2.51} ${(100 - 22) * 2.51}`}
                    strokeDashoffset={`-${52 * 2.51}`}
                  />
                  {/* Estoque - 26% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#93C5FD"
                    strokeWidth="8"
                    strokeDasharray={`${26 * 2.51} ${(100 - 26) * 2.51}`}
                    strokeDashoffset={`-${(52 + 22) * 2.51}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">368</span>
                  <span className="text-white/70 text-sm">Usuários</span>
                  <span className="text-white/70 text-sm">Totais</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {userPlans.map((plan, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                  <span className="text-white/80 text-sm">
                    {plan.name} ({plan.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-lg">Distribuição Geográfica - São Paulo</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Map Placeholder */}
              <div className="bg-white/5 rounded-lg p-4 h-48 flex items-center justify-center">
                <div className="text-center text-white/60">
                  <div className="w-16 h-16 bg-white/10 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    🗺️
                  </div>
                  <p className="text-sm">Mapa de São Paulo</p>
                  <p className="text-xs">Distribuição de clientes</p>
                </div>
              </div>

              {/* Data Table */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 text-xs font-medium text-white/80 pb-2 border-b border-white/20">
                  <span>Bairro</span>
                  <span>Faturamento</span>
                  <span>Clientes</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {geographicData.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2 text-xs text-white/70">
                      <span>{item.neighborhood}</span>
                      <span>{item.revenue}</span>
                      <span>{item.clients}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
