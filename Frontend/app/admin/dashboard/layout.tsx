"use client"

import type React from "react"

import { TasteFlowLogo } from "@/components/tasteflow-logo"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogOut, Home, Users, Building2, BarChart3, Settings } from "lucide-react"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard", active: true },
    { icon: Users, label: "Usuários", href: "/admin/usuarios" },
    { icon: Building2, label: "Empresas", href: "/admin/empresas" },
    { icon: BarChart3, label: "Relatórios", href: "/admin/relatorios" },
    { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col items-center py-6 z-50">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-4">
          {sidebarItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className={`w-10 h-10 p-0 ${
                item.active ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              title={item.label}
            >
              <item.icon className="h-5 w-5" />
            </Button>
          ))}
        </nav>

        {/* Logout */}
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 text-white/60 hover:text-white hover:bg-white/10"
          onClick={handleLogout}
          title="Sair"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="ml-16">
        {/* Top Header */}
        <div className="bg-black/10 backdrop-blur-sm border-b border-white/10 px-8 py-4">
          <div className="flex items-center justify-between">
            <TasteFlowLogo />
            <div className="flex items-center gap-4">
              <span className="text-white/70 text-sm">Administrador</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  )
}
