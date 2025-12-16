"use client"

import type React from "react"
import { useState } from "react"
import { AdminSidebar } from "@/src/components/admin-sidebar"
import { MobileHeader } from "@/src/components/mobile-header"
import { MobileAdminSidebar } from "@/src/components/mobile-admin-sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Header */}
      {/* <MobileHeader
        onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        isMenuOpen={mobileSidebarOpen}
        title="Admin"
      /> */}

      {/* Mobile Sidebar */}
      <MobileAdminSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto mobile-content md:ml-0">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
