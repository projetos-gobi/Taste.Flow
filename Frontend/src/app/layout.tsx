import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientProvider from "./ClientProvider"
import { Toaster } from "../components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TasteFlow - Sistema de Gestão de Restaurantes",
  description: "O Sabor da Gestão Simplificada",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <ClientProvider>
          {children}
          <Toaster /> 
        </ClientProvider>
      </body>
    </html>
  )
}
