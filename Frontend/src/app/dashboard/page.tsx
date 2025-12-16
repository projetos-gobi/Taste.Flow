"use client"

import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { DashboardMetrics } from "@/src/components/dashboard-metrics"
import { DashboardCharts } from "@/src/components/dashboard-charts"
import { DashboardAreas } from "@/src/components/dashboard-areas"
import { ClientLogo } from "@/src/components/client-logo"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getEnterpriseDetailById } from "@/src/services/enterprise"
import useSession from "@/src/hooks/useSession"

interface IEnterpriseDetail {
  id: string;
  fantasyName: string;
  socialReason: string;
  cnpj: string;
  stateRegistration: string;
  municipalRegistration: string;
}

export default function DashboardPage() {
  const session = useSession();

  const currentDate = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  
  const [enterprise, setEnterprise] = useState<IEnterpriseDetail>({
    id: "",
    fantasyName: "",
    socialReason: "",
    cnpj: "",
    stateRegistration: "",
    municipalRegistration: "",
  });

  const fetchInitialData = async () => {
    try {
      const response = await getEnterpriseDetailById();

      session.setEnterpriseId(response.id);
      setEnterprise(response);
    } catch (err) {
      toast.error("Erro ao buscar dados iniciais.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const clientData = {
    name: "Cliente Exemplo",
    logoUrl: "/images/client-logo.png",
  }

  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      {/* Elementos decorativos */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="font-nunito font-light text-2xl text-gray-900 mb-1">Bem Vindo,</h1>
            <div className="mb-2">
              <h1>{enterprise.fantasyName}</h1>
              {/* <ClientLogo logoUrl={clientData.logoUrl} clientName={clientData.name} /> */}
            </div>
            <p className="font-nunito font-light text-sm text-gray-600 capitalize">{currentDate}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-nunito font-light text-sm text-gray-700">Gráficos:</span>
            <div className="flex gap-2">
              <Badge className="bg-[#322CA7] hover:bg-[#1C194D] text-white font-nunito font-light">Hoje</Badge>
              <Button variant="ghost" size="sm" className="font-nunito font-light text-sm text-gray-600">
                Ontem
              </Button>
              <Button variant="ghost" size="sm" className="font-nunito font-light text-sm text-gray-600">
                Esta Semana
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="font-nunito font-light text-sm text-gray-600 flex items-center gap-1"
              >
                Customizado
                <span className="text-xs">📅</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Métricas */}
        <DashboardMetrics />

        {/* Gráficos */}
        <DashboardCharts />

        {/* Áreas */}
        <DashboardAreas />
      </div>
    </div>
  )
}
