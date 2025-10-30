"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Building2 } from "lucide-react"

export function AdminDashboardAreas() {
  const areas = [
    {
      title: "USUÁRIOS",
      description: "Área dedicada a administração dos Usuários Cadastrados.",
      icon: Users,
      color: "from-blue-600 to-blue-700",
      href: "/admin/usuarios",
    },
    {
      title: "EMPRESAS",
      description: "Área dedicada ao cadastro e administração de CNPJs e Clientes.",
      icon: Building2,
      color: "from-purple-600 to-purple-700",
      href: "/admin/empresas",
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Áreas de Administração:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {areas.map((area, index) => (
          <Card
            key={index}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-white/20 hover:from-white/15 hover:to-white/10 transition-all duration-300 cursor-pointer group"
          >
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div
                  className={`p-4 rounded-lg bg-gradient-to-br ${area.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <area.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{area.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{area.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
