"use client"

import { Button } from "@/src/components/ui/button"
import { Menu, X } from "lucide-react"

interface MobileHeaderProps {
  isMenuOpen: boolean
  onMenuToggle: () => void
  title?: string
}

export function MobileHeader({ isMenuOpen, onMenuToggle, title = "TasteFlow" }: MobileHeaderProps) {
  return (
    <div className="mobile-header lg:hidden safe-area-top">
      <Button
        variant="ghost"
        size="sm"
        onClick={onMenuToggle}
        className="touch-button p-2"
        aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      <div className="flex-1 text-center">
        <h1 className="text-lg font-heading text-gray-900">{title}</h1>
      </div>
      <div className="w-10" /> {/* Spacer for centering */}
    </div>
  )
}
