"use client"

import type React from "react"
import { useState } from "react"
import { AppSidebar } from "@/src/components/app-sidebar"
import { Menu } from "lucide-react"

export default function ControleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // Inicia minimizado

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        {/* Header com trigger para expandir/recolher */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1" />
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
