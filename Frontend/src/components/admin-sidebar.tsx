"use client"

import { useState } from "react"
import { Button } from "@/src/components/ui/button"
import { TasteFlowLogo } from "@/src/components/tasteflow-logo"
import { Home, Users, Building2, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import useSession from "../hooks/useSession"
import api from "../services/api"
import Cookies from "js-cookie";

const menuItems = [
  {
    title: "HomePage Admin",
    icon: Home,
    href: "/admin/dashboard",
  },
  {
    title: "Usuários",
    icon: Users,
    href: "/admin/usuarios",
  },
  {
    title: "Empresas",
    icon: Building2,
    href: "/admin/empresas",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter();
  const session = useSession();

  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = () => {
    session.onLogout();
    session.setEmail("");
    session.setToken("");
    session.setSession("");
    session.setRole("");

    Cookies.remove("token");
    Cookies.remove("role");

    api.defaults.headers.Authorization = "";

    router.push("/");
  }

  return (
    <>
      {/* Botão hamburger FORA da sidebar - apenas quando colapsado */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsCollapsed(false);
          }}
          className="fixed left-[72px] top-6 z-50 text-gray-700 bg-gray-200 hover:bg-gray-300 border-2 border-gray-300 rounded-md p-2 h-8 w-8 shadow-md transition-all duration-300"
          title="Expandir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      <div
        className={`sidebar-gradient h-screen flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} hidden md:flex`}
      >
        {/* Header with Logo */}
        <div className={`border-b border-white/20 ${isCollapsed ? "p-4" : "p-6"}`}>
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between gap-2"} w-full`}>
            {isCollapsed ? (
              <>
                {/* Quando colapsado: apenas logo centralizado */}
                <div className="w-8 h-8 flex-shrink-0">
                  <img src="/images/tasteflow-icon.svg" alt="TasteFlow" className="w-full h-auto" />
                </div>
              </>
            ) : (
            <>
              {/* Quando expandido: logo e texto à esquerda, botão à direita */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 flex-shrink-0">
                  <img src="/images/tasteflow-icon.svg" alt="TasteFlow" className="w-full h-auto" />
                </div>
                <span className="font-bebas text-white text-xl tracking-wider">TASTEFLOW</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-white bg-white/20 hover:!bg-white/30 border-2 border-white/40 rounded-md p-2 h-8 w-8 flex-shrink-0 shadow-md"
                title="Colapsar menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:bg-white/10 transition-colors ${
                  isActive ? "bg-white/20" : ""
                } ${isCollapsed ? "px-2 justify-center" : "px-4"}`}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? "" : "mr-3"}`} />
                {!isCollapsed && <span className="font-body text-sm font-light">{item.title}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/20">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full justify-start text-white hover:bg-white/10 ${isCollapsed ? "px-2" : "px-4"}`}
        >
          <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
          {!isCollapsed && <span className="font-body">Deslogar</span>}
        </Button>
      </div>
    </div>
    </>
  )
}
