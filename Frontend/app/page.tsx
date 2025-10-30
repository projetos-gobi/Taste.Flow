"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { TasteFlowLogo } from "@/components/tasteflow-logo"
import { ForgotPasswordModal } from "@/components/forgot-password-modal"
import { ChangePasswordModal } from "@/components/change-password-modal"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Check for admin credentials
    if (email === "admin@tasteflow.com" && password === "admin123") {
      router.push("/admin/dashboard")
      return
    }

    // Check for regular user credentials
    if (email === "usuario@tasteflow.com" && password === "usuario123") {
      router.push("/dashboard")
      return
    }

    alert("Credenciais inválidas")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient background with decorative elements */}
      <div className="flex-1 bg-gradient-to-br from-[#1C194D] via-[#322ca7] to-[#4338ca] relative overflow-hidden flex items-center justify-center">
        {/* Decorative geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-lg rotate-12"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <TasteFlowLogo className="w-64 h-auto text-white" />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-2/5 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-600 text-sm">Entre com suas credenciais para acessar o sistema</p>
          </div>

          {/* Credentials info box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-xs">
            <p className="font-semibold text-blue-800 mb-1">Credenciais de teste:</p>
            <p className="text-blue-700">Admin: admin@tasteflow.com / admin123</p>
            <p className="text-blue-700">Usuário: usuario@tasteflow.com / usuario123</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 py-2 text-sm focus:border-[#322ca7] focus:ring-0"
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-0 border-b border-gray-300 rounded-none bg-transparent px-0 py-2 text-sm focus:border-[#322ca7] focus:ring-0"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={setRememberMe} className="h-3 w-3" />
                <label htmlFor="remember" className="text-gray-600">
                  Lembrar-se desse dispositivo
                </label>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-[#322ca7] hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button type="submit" className="w-full bg-[#322ca7] hover:bg-[#322ca7]/90 text-white py-2 text-sm">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="text-xs text-gray-500 hover:text-[#322ca7]"
            >
              Alterar senha
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />

      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />
    </div>
  )
}
