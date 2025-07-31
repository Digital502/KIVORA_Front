import React from 'react';
import { CheckCircle, UserCircle, CheckSquare, Users, KanbanSquare, History } from 'lucide-react';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { FooterHome } from '../../components/footer/FooterHome';
import { useNavigate } from 'react-router-dom';

export const Features = () => {
  const navigate = useNavigate();
  const features = [
    "Gestión de grupos de trabajo (clusters)",
    "Creación y seguimiento de proyectos estudiantiles",
    "Asignación de tareas individuales o grupales con prioridad",
    "Estadísticas por sprint y rendimiento del equipo",
    "Chat interno por grupo para comunicación",
    "Historial de actividades por usuario y proyecto",
  ];

  const mobileNavItems = [
    { label: 'Tu Perfil', icon: <UserCircle className="w-5 h-5" />, onClick: () => navigate(`/kivora/perfil`) },
    { label: 'Mis Tareas', icon: <CheckSquare className="w-5 h-5" />, onClick: () => navigate(`/kivora/mis-tareas`) },
    { label: 'Grupos', icon: <Users className="w-5 h-5" />, onClick: () => navigate(`/kivora/clusters`) },
    { label: 'Proyectos', icon: <KanbanSquare className="w-5 h-5" />, onClick: () => navigate(`/kivora/proyectoslist`) },
    { label: 'Historial', icon: <History className="w-5 h-5" />, onClick: () => navigate(`/kivora/historial`) },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white">
      <NavbarDashboard />
      <main className="flex-1 py-10 px-4 sm:px-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-cyan-300 mb-10">🚀 Funcionalidades</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((item, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#036873]/30 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="text-[#0B758C]" />
                  <h2 className="text-lg font-semibold">{item}</h2>
                </div>
                <p className="text-sm text-gray-400">
                  Esta funcionalidad está integrada en el flujo de trabajo de los estudiantes.
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Menú móvil */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#036873]/30 z-50">
        <div className="flex justify-around py-3">
          {mobileNavItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-col items-center p-1 text-xs"
            >
              <div className="text-[#0B758C]">{item.icon}</div>
              <span className="text-white text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <FooterHome />
    </div>
  );
};