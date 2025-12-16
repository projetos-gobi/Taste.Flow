"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { Users, Building2 } from "lucide-react"
import Link from "next/link"

const adminAreas = [
  {
    title: "USUÁRIOS",
    description: "Área dedicada a administração dos Usuários Cadastrados.",
    icon: Users,
    href: "/admin/usuarios",
    gradient: "from-blue-600 to-purple-600",
  },
  {
    title: "EMPRESAS",
    description: "Área dedicada ao cadastro e administração de CNPJs e Clientes.",
    icon: Building2,
    href: "/admin/empresas",
    gradient: "from-purple-600 to-pink-600",
  },
]

export function AdminDashboardAreas() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6 font-heading">Áreas de Administração:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminAreas.map((area, index) => {
          const Icon = area.icon
          return (
            <Link key={index} href={area.href}>
              <Card
                className={`bg-gradient-to-r ${area.gradient} border-0 hover:scale-105 transition-transform cursor-pointer`}
              >
                <CardContent className="p-8 text-center text-white">
                  <Icon className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 font-heading">{area.title}</h3>
                  <p className="text-sm opacity-90 font-body">{area.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
