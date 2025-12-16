"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const monthlyData = [
  { month: "JAN", value: 200 },
  { month: "FEV", value: 300 },
  { month: "MAR", value: 250 },
  { month: "ABR", value: 280 },
  { month: "MAI", value: 320 },
  { month: "JUN", value: 290 },
  { month: "JUL", value: 180 },
  { month: "AGO", value: 450 },
  { month: "SET", value: 520 },
  { month: "OUT", value: 580 },
  { month: "NOV", value: 480 },
  { month: "DEZ", value: 380 },
]

const userPlansData = [
  { name: "Plano Premium", value: 52, color: "#4f46e5" },
  { name: "Plano Simples", value: 22, color: "#a78bfa" },
  { name: "Plano Estoque", value: 26, color: "#60a5fa" },
]

const geographicData = [
  { bairro: "Pinheiros", faturamento: "R$5,568.74", clientes: 3 },
  { bairro: "Pinheiros", faturamento: "R$5,568.74", clientes: 3 },
  { bairro: "Pinheiros", faturamento: "R$5,568.74", clientes: 3 },
  { bairro: "Pinheiros", faturamento: "R$5,568.74", clientes: 1 },
  { bairro: "Pinheiros", faturamento: "R$5,568.74", clientes: 3 },
  { bairro: "Pinheiros", faturamento: "R$5,568.74", clientes: 3 },
  { bairro: "Pinheiros", faturamento: "R$5,568.74", clientes: 3 },
  { bairro: "Pinheiros", faturamento: "R$5,568.74", clientes: 1 },
]

export function AdminDashboardCharts() {
  return (
    <div className="space-y-8">
      {/* Main Bar Chart */}
      <Card className="glass-card border-white/20">
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "white", fontSize: 12 }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "white", fontSize: 12 }}
                  tickFormatter={(value) => `R$ ${value}`}
                  domain={[0, 600]}
                />
                <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users and Plans Chart */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white font-heading">Usuários e Planos Assinados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="relative">
                <PieChart width={200} height={200}>
                  <Pie
                    data={userPlansData}
                    cx={100}
                    cy={100}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userPlansData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white font-heading">368</span>
                  <span className="text-sm text-white/80 font-body">Usuários Totais</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {userPlansData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-white font-body">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <CardTitle className="text-white font-heading">Distribuição Geográfica - São Paulo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Map placeholder */}
              <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center">
                <span className="text-gray-500 font-body">Mapa de São Paulo</span>
              </div>

              {/* Data table */}
              <div className="space-y-1">
                <div className="grid grid-cols-3 gap-2 text-xs font-bold text-white/80 font-body">
                  <span>Bairro</span>
                  <span>Faturamento</span>
                  <span>Clientes</span>
                </div>
                {geographicData.slice(0, 8).map((item, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 text-xs text-white font-body">
                    <span>{item.bairro}</span>
                    <span>{item.faturamento}</span>
                    <span>{item.clientes}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
