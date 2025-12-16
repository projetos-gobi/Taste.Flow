"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"

// Dados simulados para os gráficos
const hourlyData = [
  { hour: "00:00", value: 150 },
  { hour: "01:00", value: 120 },
  { hour: "02:00", value: 80 },
  { hour: "03:00", value: 60 },
  { hour: "04:00", value: 90 },
  { hour: "05:00", value: 110 },
  { hour: "06:00", value: 200 },
  { hour: "07:00", value: 350 },
  { hour: "08:00", value: 450 },
  { hour: "09:00", value: 520 },
  { hour: "10:00", value: 680 },
  { hour: "11:00", value: 850 },
  { hour: "12:00", value: 950 },
  { hour: "13:00", value: 880 },
  { hour: "14:00", value: 750 },
  { hour: "15:00", value: 650 },
  { hour: "16:00", value: 720 },
  { hour: "17:00", value: 680 },
  { hour: "18:00", value: 590 },
  { hour: "19:00", value: 520 },
  { hour: "20:00", value: 450 },
  { hour: "21:00", value: 380 },
  { hour: "22:00", value: 280 },
  { hour: "23:00", value: 180 },
]

export function DashboardCharts() {
  const maxValue = Math.max(...hourlyData.map((d) => d.value))

  return (
    <div className="space-y-6">
      {/* Gráfico Principal de Barras */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6">
          <div className="relative">
            <div className="h-80 flex items-end justify-between gap-1 pl-12">
              {hourlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-[#322CA7] rounded-t-sm min-h-[4px]"
                    style={{
                      height: `${(data.value / maxValue) * 100}%`,
                      maxHeight: "280px",
                    }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 font-nunito font-light">{data.hour}</span>
                </div>
              ))}
            </div>

            {/* Escala Y */}
            <div className="absolute left-0 top-0 h-72 flex flex-col justify-between text-xs text-gray-500 font-nunito font-light">
              <span>R$ 4000</span>
              <span>R$ 3000</span>
              <span>R$ 2000</span>
              <span>R$ 1000</span>
              <span>R$ 100</span>
              <span>R$ 0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos Menores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Diversificação de Vendas */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="font-nunito font-medium text-lg text-gray-900">Diversificação de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-48">
              <div className="relative w-32 h-32">
                {/* Gráfico de Pizza Simulado */}
                <div className="w-full h-full rounded-full bg-gradient-to-r from-[#322CA7] via-[#5B52D6] to-[#A5A0FF] relative">
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-bebas text-2xl text-gray-900 tracking-wide">486</div>
                      <div className="font-nunito font-light text-sm text-gray-600">Vendas</div>
                      <div className="font-nunito font-light text-sm text-gray-600">Totais</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#322CA7]"></div>
                <span className="font-nunito font-light text-sm text-gray-700">Pratos Principais (52%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#A5A0FF]"></div>
                <span className="font-nunito font-light text-sm text-gray-700">Bebidas (22%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#5B52D6]"></div>
                <span className="font-nunito font-light text-sm text-gray-700">Sobremesas (26%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quantidade de Vendas */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="font-nunito font-medium text-lg text-gray-900">Quantidade de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-48 relative">
              {/* Gráfico de Área Simulado */}
              <svg className="w-full h-full" viewBox="0 0 300 150">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#322CA7" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#5B52D6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#A5A0FF" stopOpacity="0.3" />
                  </linearGradient>
                </defs>

                <path
                  d="M 0 120 Q 50 100 100 80 Q 150 60 200 50 Q 250 40 300 30 L 300 150 L 0 150 Z"
                  fill="url(#areaGradient)"
                />

                <path
                  d="M 0 120 Q 50 100 100 80 Q 150 60 200 50 Q 250 40 300 30"
                  stroke="#322CA7"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>

              {/* Legenda */}
              <div className="absolute bottom-0 left-0 flex gap-4 text-xs font-nunito font-light">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#322CA7]"></div>
                  <span className="text-gray-700">Durante a Semana</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#A5A0FF]"></div>
                  <span className="text-gray-700">Durante o Mês</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
