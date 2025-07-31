import React from 'react';
import { Film, UserCircle, CheckSquare, Users, KanbanSquare, History, PlayCircle } from 'lucide-react';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { FooterHome } from '../../components/footer/FooterHome';
import { useNavigate } from 'react-router-dom';

export const Tutorials = () => {
  const navigate = useNavigate();

  const tutorials = [
    {
      title: "Primeros pasos: crear grupo y proyecto",
      description: "Aprende a crear un grupo de trabajo, invitar miembros y comenzar tu primer proyecto.",
    },
    {
      title: "Implementando SCRUM en tu equipo",
      description: "Configura roles, sprints y tareas para aplicar SCRUM en tus equipos con Kivora.",
    },
    {
      title: "Asignación y seguimiento de tareas",
      description: "Gestiona tareas individuales o grupales y haz seguimiento al progreso diario.",
    },
    {
      title: "Uso efectivo del chat interno",
      description: "Comunícate fácilmente con los miembros del grupo desde la vista del proyecto.",
    },
    {
      title: "Análisis de estadísticas y reportes",
      description: "Consulta estadísticas por sprint y analiza el rendimiento del equipo en tiempo real.",
    },
    {
      title: "Análisis de estadísticas por user",
      description: "Consulta estadísticas por sprint y analiza el rendimiento del equipo en tiempo real.",
    },

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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-cyan-300 mb-10 flex items-center gap-3">
            <Film className="text-cyan-300" /> Tutoriales en Video
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tutorials.map((tutorial, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#036873]/30 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  <PlayCircle className="text-[#0B758C] w-6 h-6" />
                  <h2 className="text-lg font-semibold">{tutorial.title}</h2>
                </div>
                <p className="text-sm text-gray-400 mb-4">{tutorial.description}</p>
                <button
                  className="text-sm bg-gradient-to-r from-[#036873] to-[#0B758C] px-4 py-2 rounded-md text-white hover:from-[#0B758C] hover:to-[#036873] transition"
                >
                  Ver Tutorial
                </button>
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