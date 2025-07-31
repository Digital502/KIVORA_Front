import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md mx-auto">
        <div className="mx-auto w-20 h-20 rounded-full bg-[#036873]/20 flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-[#0B758C]" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#0B758C] mb-4">Página no encontrada</h2>
        <p className="text-gray-400 mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-[#0B758C] hover:bg-[#0a6a7d] text-white rounded-lg flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver atrás
        </button>

        <p className="mt-6 text-gray-500">
          O ve al{' '}
          <button 
            onClick={() => navigate('/')} 
            className="text-[#0B758C] hover:underline"
          >
            inicio
          </button>
        </p>
      </div>
    </div>
  );
};