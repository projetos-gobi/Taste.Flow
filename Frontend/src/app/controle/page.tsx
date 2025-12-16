import { Package, TrendingDown, CreditCard, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function ControlePage() {
  return (
    <div className="bg-gray-50 p-6 min-h-full relative">
      {/* Elementos decorativos */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-[#322CA7]/10 rounded-2xl rotate-12"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#1C194D]/10 rounded-2xl -rotate-12"></div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-bebas text-3xl text-gray-900 tracking-wide">Controle</h1>
          <p className="font-nunito font-light text-sm text-gray-600 mt-1">
            Área dedicada ao controle de Estoque e Contas.
          </p>
        </div>

        {/* Seção Estoque */}
        <div>
          <h2 className="font-nunito font-medium text-lg text-gray-800 mb-3">Estoque</h2>

          {/* Controle de Entrada - Ativo */}
          <div className="mb-4">
            <Link href="/controle/entradas" className="block group">
              <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
                <div className="flex items-stretch h-32">
                  <div className="relative w-1/3">
                    <div className="absolute inset-0 bg-[#5B52FF]"></div>
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 0 100%)",
                        background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                      }}
                    ></div>
                    <div
                      className="absolute inset-0"
                      style={{
                        clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                        background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="text-white h-12 w-12 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center p-6 w-2/3">
                    <h3 className="font-bebas text-2xl text-white tracking-wide">CONTROLE DE ENTRADA</h3>
                    <p className="font-nunito font-light text-sm text-white/90 mt-1">
                      Sessão responsável pelo controle de Entradas de Mercadoria.
                    </p>
                  </div>
                  <div className="w-3/6 relative">
                    <Image
                      src="/images/controle-entrada-card-updated.png"
                      alt="Controle de entrada - despensa com ingredientes"
                      width={500}
                      height={128}
                      className="object-cover w-full h-full object-center"
                      priority
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, rgba(50,44,167,0.7) 0%, rgba(50,44,167,0) 100%)",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Controle de Saídas - Desabilitado */}
          <div className="mb-4">
            <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm opacity-60 cursor-not-allowed">
              <div className="flex items-stretch h-32 relative">
                <div className="relative w-1/3">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingDown className="text-white/60 h-12 w-12" />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 w-2/3">
                  <h3 className="font-bebas text-2xl text-white/60 tracking-wide">CONTROLE DE SAÍDAS</h3>
                  <p className="font-nunito font-light text-sm text-white/50 mt-1">
                    Sessão responsável pelo controle de Saídas de Mercadoria.
                  </p>
                </div>
                <div className="w-3/6 relative">
                  <Image
                    src="/images/controle-saidas-card.png"
                    alt="Controle de saídas de mercadorias"
                    width={500}
                    height={128}
                    className="object-cover w-full h-full opacity-60"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, rgba(50,44,167,0.9) 0%, rgba(50,44,167,0.3) 100%)",
                    }}
                  ></div>
                </div>
                {/* Cadeado e "Em Breve" */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center text-white">
                    <Lock className="h-12 w-12 mb-2" />
                    <span className="font-nunito font-medium text-lg">Em Breve</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estoque - Desabilitado */}
          <div className="mb-4">
            <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm opacity-60 cursor-not-allowed">
              <div className="flex items-stretch h-32 relative">
                <div className="relative w-1/3">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="text-white/60 h-12 w-12" />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 w-2/3">
                  <h3 className="font-bebas text-2xl text-white/60 tracking-wide">ESTOQUE</h3>
                  <p className="font-nunito font-light text-sm text-white/50 mt-1">
                    Sessão responsável pelo controle de Estoque.
                  </p>
                </div>
                <div className="w-3/6 relative">
                  <Image
                    src="/images/estoque-card.png"
                    alt="Controle de estoque"
                    width={500}
                    height={128}
                    className="object-cover w-full h-full opacity-60"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, rgba(50,44,167,0.9) 0%, rgba(50,44,167,0.3) 100%)",
                    }}
                  ></div>
                </div>
                {/* Cadeado e "Em Breve" */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center text-white">
                    <Lock className="h-12 w-12 mb-2" />
                    <span className="font-nunito font-medium text-lg">Em Breve</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Contas */}
        <div>
          <h2 className="font-nunito font-medium text-lg text-gray-800 mb-3">Contas</h2>

          {/* Contas a Pagar - Desabilitado */}
          <div className="mb-4">
            <div className="bg-[#322CA7] rounded-lg overflow-hidden shadow-sm opacity-60 cursor-not-allowed">
              <div className="flex items-stretch h-32 relative">
                <div className="relative w-1/3">
                  <div className="absolute inset-0 bg-[#5B52FF]"></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 0 100%)",
                      background: "linear-gradient(135deg, rgba(91,82,255,0.4) 0%, rgba(91,82,255,0) 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                      background: "linear-gradient(135deg, rgba(50,44,167,0) 0%, rgba(50,44,167,0.4) 100%)",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CreditCard className="text-white/60 h-12 w-12" />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-6 w-2/3">
                  <h3 className="font-bebas text-2xl text-white/60 tracking-wide">CONTAS A PAGAR</h3>
                  <p className="font-nunito font-light text-sm text-white/50 mt-1">
                    Sessão responsável pelo controle de contas a pagar e gastos do Restaurante.
                  </p>
                </div>
                <div className="w-3/6 relative">
                  <Image
                    src="/images/contas-pagar-card.png"
                    alt="Contas a pagar"
                    width={500}
                    height={128}
                    className="object-cover w-full h-full opacity-60"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(90deg, rgba(50,44,167,0.9) 0%, rgba(50,44,167,0.3) 100%)",
                    }}
                  ></div>
                </div>
                {/* Cadeado e "Em Breve" */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center text-white">
                    <Lock className="h-12 w-12 mb-2" />
                    <span className="font-nunito font-medium text-lg">Em Breve</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
