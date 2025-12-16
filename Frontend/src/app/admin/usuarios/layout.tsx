import type React from "react"
import { AdminSidebar } from "@/src/components/admin-sidebar"
import { MobileAdminSidebar } from "@/src/components/mobile-admin-sidebar"
import { MobileHeader } from "@/src/components/mobile-header"

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden">
        {/* <MobileHeader>
          <MobileAdminSidebar />
        </MobileHeader> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
