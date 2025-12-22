"use client"

import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2, 
  DollarSign, 
  Package,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter,
  MoreVertical,
  Crown,
  Star,
  Box
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from "recharts"
import Link from "next/link"

// Dados de exemplo
const metrics = [
  {
    title: "Faturamento Total",
    value: "R$ 585.363,64",
    change: "+3.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    title: "Total de Clientes",
    value: "368",
    change: "+5.2%",
    changeType: "positive" as const,
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    title: "Lucro Líquido",
    value: "R$ 51.420,16",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: TrendingUp,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    title: "Licenças Ativas",
    value: "185",
    change: "+8.1%",
    changeType: "positive" as const,
    icon: Activity,
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
]

const monthlyRevenue = [
  { month: "Jan", receita: 45000, despesas: 32000, lucro: 13000 },
  { month: "Fev", receita: 52000, despesas: 35000, lucro: 17000 },
  { month: "Mar", receita: 48000, despesas: 33000, lucro: 15000 },
  { month: "Abr", receita: 61000, despesas: 38000, lucro: 23000 },
  { month: "Mai", receita: 55000, despesas: 36000, lucro: 19000 },
  { month: "Jun", receita: 67000, despesas: 40000, lucro: 27000 },
  { month: "Jul", receita: 58000, despesas: 37000, lucro: 21000 },
  { month: "Ago", receita: 72000, despesas: 42000, lucro: 30000 },
  { month: "Set", receita: 65000, despesas: 39000, lucro: 26000 },
  { month: "Out", receita: 78000, despesas: 45000, lucro: 33000 },
  { month: "Nov", receita: 71000, despesas: 43000, lucro: 28000 },
  { month: "Dez", receita: 85000, despesas: 48000, lucro: 37000 },
]

const planDistribution = [
  { name: "Premium", value: 52, color: "#8b5cf6", icon: Crown },
  { name: "Completo", value: 28, color: "#3b82f6", icon: Star },
  { name: "Básico", value: 20, color: "#10b981", icon: Box },
]

const recentActivity = [
  { type: "user", action: "Novo usuário cadastrado", name: "João Silva", time: "2 min atrás", status: "success" },
  { type: "enterprise", action: "Empresa criada", name: "Tech Solutions LTDA", time: "15 min atrás", status: "success" },
  { type: "product", action: "Produto atualizado", name: "Produto Premium X", time: "1h atrás", status: "info" },
  { type: "user", action: "Usuário removido", name: "Maria Santos", time: "2h atrás", status: "warning" },
]

// Dados de distribuição geográfica serão carregados dinamicamente
const geographicDistribution = [
  { estado: "SP", cidade: "São Paulo", empresas: 45, licencas: 68, porcentagem: 36.5 },
  { estado: "RJ", cidade: "Rio de Janeiro", empresas: 28, licencas: 42, porcentagem: 22.7 },
  { estado: "MG", cidade: "Belo Horizonte", empresas: 18, licencas: 25, porcentagem: 14.5 },
  { estado: "RS", cidade: "Porto Alegre", empresas: 12, licencas: 18, porcentagem: 9.7 },
  { estado: "PR", cidade: "Curitiba", empresas: 8, licencas: 12, porcentagem: 6.5 },
  { estado: "SC", cidade: "Florianópolis", empresas: 6, licencas: 9, porcentagem: 4.8 },
  { estado: "BA", cidade: "Salvador", empresas: 5, licencas: 7, porcentagem: 4.0 },
  { estado: "Outros", cidade: "Outras cidades", empresas: 2, licencas: 3, porcentagem: 1.3 },
]

export default function AdminDashboardPreview() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading mb-2">
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 font-body">
              Visão geral do desempenho e métricas do sistema
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Últimos 30 dias
            </Button>
            <Button className="bg-[#322ca7] hover:bg-[#322ca7]/90 gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${metric.iconColor}`} />
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600 font-body">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900 font-heading">{metric.value}</p>
                    <div className="flex items-center gap-1 pt-2">
                      {metric.changeType === "positive" ? (
                        <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                          <ArrowUpRight className="h-4 w-4" />
                          <span>{metric.change}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 text-sm font-medium">
                          <ArrowDownRight className="h-4 w-4" />
                          <span>{metric.change}</span>
                        </div>
                      )}
                      <span className="text-sm text-gray-500 font-body">vs. mês anterior</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart - Takes 2 columns */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900 font-heading">
                Receita e Despesas
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  Mensal
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  Anual
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `R$ ${value/1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value: any) => `R$ ${value.toLocaleString('pt-BR')}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="receita" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="Receita"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="despesas" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: '#ef4444', r: 4 }}
                      name="Despesas"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="lucro" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Lucro"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 font-heading">
                Distribuição de Planos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={planDistribution}
                      cx={100}
                      cy={100}
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900 font-heading">368</span>
                    <span className="text-xs text-gray-500 font-body">Total</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {planDistribution.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${item.color}15` }}>
                          <Icon className="h-5 w-5" style={{ color: item.color }} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 font-body">{item.name}</p>
                          <p className="text-xs text-gray-500 font-body">{item.value}% dos usuários</p>
                        </div>
                      </div>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 font-heading">
                Atividades Recentes
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-[#322ca7]">
                Ver todas
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className={`p-2 rounded-lg ${
                      activity.status === "success" ? "bg-emerald-100" :
                      activity.status === "warning" ? "bg-amber-100" :
                      "bg-blue-100"
                    }`}>
                      {activity.type === "user" && <Users className={`h-5 w-5 ${
                        activity.status === "success" ? "text-emerald-600" :
                        activity.status === "warning" ? "text-amber-600" :
                        "text-blue-600"
                      }`} />}
                      {activity.type === "enterprise" && <Building2 className="h-5 w-5 text-emerald-600" />}
                      {activity.type === "product" && <Package className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 font-body">{activity.action}</p>
                      <p className="text-sm text-gray-600 font-body">{activity.name}</p>
                      <p className="text-xs text-gray-400 font-body mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Geographic Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 font-heading">
                Distribuição Geográfica
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-[#322ca7]">
                Ver mapa completo
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {geographicDistribution.map((region, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md transition-all hover:border-[#322ca7]/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 font-body">{region.cidade}</p>
                          <span className="text-xs text-gray-500 font-body">({region.estado})</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 font-body">
                          <span>{region.empresas} empresas</span>
                          <span>•</span>
                          <span>{region.licencas} licenças ativas</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-[#322ca7] font-heading">{region.porcentagem}%</span>
                        <p className="text-xs text-gray-500 font-body">do total</p>
                      </div>
                    </div>
                    {/* Barra de progresso visual */}
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#322ca7] to-[#6366f1] h-2 rounded-full transition-all"
                        style={{ width: `${region.porcentagem}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-800 font-body">
                  💡 <strong>Insight:</strong> Concentração de {geographicDistribution[0].porcentagem}% em {geographicDistribution[0].cidade} indica oportunidade de expansão em outras regiões.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Analysis Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 font-heading">
              Análise de Mercado e Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-body">Regiões Atendidas</p>
                    <p className="text-2xl font-bold text-gray-900 font-heading">{geographicDistribution.length}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-body">Estados com clientes ativos</p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-body">Maior Concentração</p>
                    <p className="text-xl font-bold text-gray-900 font-heading">{geographicDistribution[0].cidade}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-body">{geographicDistribution[0].porcentagem}% dos clientes</p>
              </div>
              
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Activity className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-body">Oportunidade</p>
                    <p className="text-xl font-bold text-gray-900 font-heading">Expansão</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-body">Regiões com baixa penetração</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 font-heading">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Usuários", icon: Users, href: "/admin/usuarios", color: "from-blue-500 to-indigo-600", count: "368" },
              { title: "Empresas", icon: Building2, href: "/admin/empresas", color: "from-purple-500 to-pink-600", count: "124" },
              { title: "Relatórios", icon: Activity, href: "#", color: "from-emerald-500 to-teal-600", count: "12" },
              { title: "Análises", icon: TrendingUp, href: "#", color: "from-orange-500 to-red-600", count: "8" },
            ].map((area, index) => {
              const Icon = area.icon
              return (
                <Link key={index} href={area.href}>
                  <Card className={`bg-gradient-to-br ${area.color} border-0 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer group`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="h-8 w-8 opacity-90 group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold font-heading">{area.count}</span>
                      </div>
                      <h3 className="text-lg font-semibold font-heading">{area.title}</h3>
                      <p className="text-sm opacity-80 font-body mt-1">Gerenciar {area.title.toLowerCase()}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

