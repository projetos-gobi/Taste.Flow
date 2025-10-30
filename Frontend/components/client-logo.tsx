import Image from "next/image"

interface ClientLogoProps {
  logoUrl?: string
  clientName: string
  className?: string
}

export function ClientLogo({ logoUrl = "/images/client-logo.png", clientName, className = "" }: ClientLogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Image
        src={logoUrl || "/placeholder.svg"}
        alt={`${clientName} Logo`}
        width={200}
        height={60}
        className="max-h-12 w-auto object-contain"
        priority
      />
    </div>
  )
}
