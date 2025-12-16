"use client"

import { Button } from "@/src/components/ui/button"
import { Home, Users, Settings, BarChart3, Shield, Database, LogOut, X } from "lucide-react"

interface MobileAdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const adminMenuItems = [
  { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Users, label: "Usuários", href: "/admin/usuarios" },
  { icon: Database, label: "Sistema", href: "/admin/sistema" },
  { icon: BarChart3, label: "Relatórios", href: "/admin/relatorios" },
  { icon: Shield, label: "Segurança", href: "/admin/seguranca" },
  { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
]

export function MobileAdminSidebar({ isOpen, onClose }: MobileAdminSidebarProps) {
  const handleNavigation = (href: string) => {
    window.location.href = href
    onClose()
  }

  const handleLogout = () => {
    window.location.href = "/"
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="mobile-sidebar-overlay lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`mobile-sidebar sidebar-gradient lg:hidden ${isOpen ? "open" : ""} safe-area-left`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 safe-area-top">
            <div className="flex items-center space-x-3">
              <img src="/images/tasteflow-icon.svg" alt="TasteFlow Admin" className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="text-white font-heading text-lg">TasteFlow</span>
                <span className="text-white/70 text-xs">Admin</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/10 p-2">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            {adminMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className="mobile-nav-item w-full flex items-center space-x-3 text-white hover:bg-white/10 transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20 safe-area-bottom">
            <button
              onClick={handleLogout}
              className="mobile-nav-item w-full flex items-center space-x-3 text-white hover:bg-white/10 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
