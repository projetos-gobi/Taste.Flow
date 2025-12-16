"use client"

import type React from "react"
import { useState } from "react"
import { AppSidebar } from "@/src/components/app-sidebar"
import { MobileHeader } from "@/src/components/mobile-header"
import { MobileSidebar } from "@/src/components/mobile-sidebar"
import { Button } from "@/src/components/ui/button"
import { Menu } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <AppSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Mobile Header */}
      <MobileHeader
        onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        isMenuOpen={mobileSidebarOpen}
        title="TasteFlow"
      />

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Content */}
      <main
        className={`flex-1 overflow-auto transition-all duration-300 mobile-content ${
          sidebarCollapsed ? "md:ml-16" : "md:ml-64"
        }`}
      >
        {/* Desktop Toggle Button */}
        <div className="hidden md:block p-4">
          <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="mb-4">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
