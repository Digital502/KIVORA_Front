import React from "react";
import { Loader } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D0D]">
      <div className="relative w-32 h-32">
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-8 border-t-[#0B758C] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute top-4 left-4 w-24 h-24 rounded-full border-4 border-t-[#036873] border-r-transparent border-b-transparent border-l-transparent animate-spin-reverse"></div>
        <div className="absolute top-8 left-8 w-16 h-16 rounded-full border-[3px] border-t-[#639FA6] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_8px_#0B758C]">
          <Loader className="w-10 h-10 text-[#0B758C]" strokeWidth={2.5} />
        </div>
      </div>

      <p className="mt-8 text-lg tracking-wide text-[#639FA6] drop-shadow-[0_0_5px_#639FA6] font-medium">
        Cargando...
      </p>

      <style>
        {`
          @keyframes spin-reverse {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          .animate-spin-reverse {
            animation: spin-reverse 3s linear infinite;
          }
        `}
      </style>
    </div>
  );
};
