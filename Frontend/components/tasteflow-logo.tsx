import Image from "next/image"

export function TasteFlowLogo() {
  return (
    <div className="flex flex-col items-center">
      {/* Logo completa com ícone e texto */}
      <div className="flex items-center gap-3 mb-2">
        {/* Ícone do TasteFlow */}
        <div className="w-12 h-12 flex-shrink-0">
          <Image
            src="/images/tasteflow-icon.svg"
            alt="TasteFlow Icon"
            width={136}
            height={132}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Logo de texto */}
        <div className="w-56 h-auto">
          <Image
            src="/images/tasteflow-logo.svg"
            alt="TasteFlow"
            width={503}
            height={90}
            priority
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Slogan */}
      <p className="tasteflow-subtitle text-sm text-white opacity-90 mt-1 font-normal tracking-wide text-center">
        O Sabor da Gestão Simplificada.
      </p>
    </div>
  )
}
