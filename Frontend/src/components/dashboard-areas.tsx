"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { List, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

const areas = [
  {
    title: "CADASTROS",
    description: "Hub de cadastros do seu restaurante.",
    icon: List,
    href: "/cadastros",
  },
  {
    title: "CONTROLE",
    description: "Área dedicada ao controle de Estoque.",
    icon: BarChart3,
    href: "/controle",
  },
  {
    title: "ADMINISTRAÇÃO",
    description: "Área dedicada à atribuição de funções.",
    icon: Shield,
    href: "/administracao",
  },
]

export function DashboardAreas() {
  return (
    <div className="space-y-4">
      <h2 className="font-nunito font-medium text-xl text-gray-900">Áreas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {areas.map((area, index) => (
          <Link key={index} href={area.href}>
            <Card className="bg-[#322CA7] hover:bg-[#1C194D] transition-colors cursor-pointer border-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <area.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bebas text-xl text-white tracking-wider">{area.title}</h3>
                    <p className="font-nunito font-light text-sm text-white/90 leading-relaxed">{area.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
