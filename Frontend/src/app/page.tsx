"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent } from "@/src/components/ui/card"
import { ForgotPasswordModal } from "@/src/components/forgot-password-modal"
import { ChangePasswordModal } from "@/src/components/change-password-modal"
import { Eye, EyeOff } from "lucide-react"
import dayjs from "dayjs";
import { login } from "@/src/services/auth"
import { ILoginRequest } from "@/src/types/auth"
import useSession from "@/src/hooks/useSession"
import api from "@/src/services/api"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"
import { useChangePasswordModal, useForgotPasswordModal } from "../hooks/useModal"
import { decodeToken, mustChangePassword } from "./utils/storageUtils"
import { toast } from "sonner"

export default function LoginPage() {
  const forgotPasswordModal = useForgotPasswordModal();
  const changePasswordModal = useChangePasswordModal();

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    setIsPageLoaded(true)
  }, [])

  const handleUserRole = (role: string) => {
    if (role.toLowerCase().includes("109ae3c4-17fd-4cf3-a0e2-e781fe457dcf")) {
      return "administrator";
    }

    return "";
  }

  const handleLogin = async  (e: React.FormEvent) => {
    e.preventDefault();

    const request: ILoginRequest = { email, password };

    try {
      const response = await login(request);

      if(response.token && response.authenticationStatus === "Success"){
        api.defaults.headers.Authorization = `Bearer ${response.token}`;

        if (mustChangePassword(response.token)) {
          var token = decodeToken(response.token);
          changePasswordModal.openModal(true, token.changepasswordcode);
          return;
        }

        Cookies.set("token", response.token);
        Cookies.set("role", response.role);

        session.setEmail(response.email); 
        session.setToken(response.token);
        session.setSession(dayjs().format("YYYY-MM-DD HH:mm:ss"));
        session.setRole(handleUserRole(response.role));
        session.setUserId(response.userId);
        session.setRefreshToken(response.refreshToken);
        session.onLogin();

        switch (response.role) {
          case "109ae3c4-17fd-4cf3-a0e2-e781fe457dcf":
            router.push("/admin/dashboard");
            break;

          case "b7c9b9d4-4c1f-4f01-a3b3-5ae71f66dabc":
            router.push("/dashboard");
            break;
          default:
            router.push("/");
        }
      }else{
        toast.warning("Credenciais inválidas.");
      }
    } catch (err: any) {
      toast.error("Erro ao fazer login");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div
        className={`w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 ${isPageLoaded ? "form-section-enter" : "opacity-0"}`}
      >
        <Card className="w-full max-w-md mobile-card">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl sm:text-3xl font-heading text-gray-900 mobile-title">Bem-vindo de volta</h1>
                <p className="text-gray-600 mobile-subtitle">Entre na sua conta para continuar</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 mobile-form">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mobile-input input-focus transition-smooth"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mobile-input input-focus transition-smooth pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-gray-600">Lembrar-me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => forgotPasswordModal.openModal(true)}
                    className="text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full touch-button btn-hover-lift transition-smooth bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Entrar
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Brand Section */}
      <div
        className={`hidden lg:flex lg:w-1/2 login-gradient items-center justify-center p-12 relative overflow-hidden ${isPageLoaded ? "brand-section-enter" : "opacity-0"}`}
      >
        {/* Geometric Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large circles */}
          <div className="absolute top-10 right-16 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-12 w-40 h-40 bg-white/3 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/3 left-8 w-24 h-24 bg-white/4 rounded-full animate-pulse delay-500"></div>

          {/* Medium circles */}
          <div className="absolute top-20 left-1/3 w-16 h-16 bg-white/6 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-32 right-20 w-20 h-20 bg-white/4 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-2/3 right-12 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-200"></div>

          {/* Small circles */}
          <div className="absolute top-16 right-1/3 w-8 h-8 bg-white/7 rounded-full animate-pulse delay-400"></div>
          <div className="absolute bottom-16 left-1/4 w-10 h-10 bg-white/5 rounded-full animate-pulse delay-600"></div>
          <div className="absolute top-1/2 left-16 w-6 h-6 bg-white/6 rounded-full animate-pulse delay-800"></div>

          {/* Diamond shapes */}
          <div className="absolute top-24 right-24 w-14 h-14 bg-white/4 transform rotate-45 animate-pulse delay-100"></div>
          <div className="absolute bottom-24 left-20 w-10 h-10 bg-white/5 transform rotate-45 animate-pulse delay-900"></div>
          <div className="absolute top-1/2 right-8 w-8 h-8 bg-white/6 transform rotate-45 animate-pulse delay-350"></div>
          <div className="absolute top-40 left-1/2 w-12 h-12 bg-white/3 transform rotate-45 animate-pulse delay-750"></div>

          {/* Rectangle shapes */}
          <div className="absolute bottom-40 right-16 w-16 h-6 bg-white/4 rounded-sm transform rotate-12 animate-pulse delay-450"></div>
          <div className="absolute top-1/3 right-1/3 w-20 h-4 bg-white/3 rounded-sm transform -rotate-12 animate-pulse delay-650"></div>

          {/* Hexagon-like shapes */}
          <div className="absolute top-12 left-1/4 w-10 h-10 bg-white/5 transform rotate-30 animate-pulse delay-250"></div>
          <div className="absolute bottom-12 right-1/4 w-14 h-14 bg-white/3 transform rotate-60 animate-pulse delay-850"></div>
        </div>

        <div className="text-center text-white space-y-6 max-w-md relative z-10">
          <div className={`${isPageLoaded ? "logo-enter logo-float" : "opacity-0"}`}>
            <img
              src="/images/tasteflow-logo-new.svg"
              alt="TasteFlow"
              className="w-80 h-auto mx-auto mb-6 high-dpi-image"
            />
          </div>

          <div className={`space-y-3 ${isPageLoaded ? "slogan-enter" : "opacity-0"}`}>
            <h2 className="text-2xl tasteflow-subtitle leading-tight">O Sabor da Gestão Simplificada</h2>
            <p className="text-base tasteflow-subtitle opacity-85 leading-relaxed">
              Transforme a gestão do seu restaurante com nossa plataforma completa e intuitiva
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ForgotPasswordModal isOpen={forgotPasswordModal.isOpen} />

      <ChangePasswordModal open={changePasswordModal.isModalOpen} />
    </div>
  )
}
