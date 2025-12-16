"use client"

import type React from "react"

import { AdminSidebar } from "@/src/components/admin-sidebar"
import { MobileAdminSidebar } from "@/src/components/mobile-admin-sidebar"
import { useState } from "react"

export default function AdminEmpresasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* <MobileHeader onMenuClick={() => setIsMobileSidebarOpen(true)} title="Empresas" /> */}
      </div>

      {/* Mobile Sidebar */}
      <MobileAdminSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto bg-gray-100">{children}</main>
      </div>
    </div>
  )
}
