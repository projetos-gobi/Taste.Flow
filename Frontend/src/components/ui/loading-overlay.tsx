import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = "Salvando..." }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 text-[#322CA7] animate-spin" />
        <span className="mt-2 text-gray-700 font-medium">{message}</span>
      </div>
    </div>
  );
}
