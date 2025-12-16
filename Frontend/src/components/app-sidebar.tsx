"use client"

import { Home, Shield, LogOut, List, BarChart3 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import api from "../services/api"
import useSession from "../hooks/useSession"
import Cookies from "js-cookie";

const menuItems = [
  {
    title: "HomePage",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Cadastros",
    icon: List,
    url: "/cadastros",
  },
  {
    title: "Controle",
    icon: BarChart3,
    url: "/controle",
  },
  {
    title: "Administração",
    icon: Shield,
    url: "/administracao",
  }
]

interface AppSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function AppSidebar({ isCollapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter();
  const session = useSession();
  
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
    <div
      className={`sidebar-gradient min-h-screen transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"} flex-col fixed left-0 top-0 z-40 hidden md:flex`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex-shrink-0">
            <img src="/images/tasteflow-icon.svg" alt="TasteFlow" className="w-full h-auto" />
          </div>
          {!isCollapsed && <span className="font-bebas text-white text-xl tracking-wider">TASTEFLOW</span>}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.url)
            return (
              <a
                key={item.title}
                href={item.url}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-white/10 transition-colors ${
                  isActive ? "bg-white/20" : ""
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.title : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-nunito font-light text-sm">{item.title}</span>}
              </a>
            )
          })}
          <a
            onClick={handleLogout}
            href="/"
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-white hover:bg-white/10 transition-colors ${isCollapsed ? "justify-center" : ""}`}
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
            {!isCollapsed && <span className="font-nunito font-light text-sm">Deslogar</span>}
          </a>
        </nav>
      </div>
    </div>
  )
}
