import React from 'react';
import {
  ClipboardList,
  Users,
  KanbanSquare,
  CalendarCheck,
  MessageCircle,
  BarChart2,
  UserCircle,
  CheckSquare,
  History
} from 'lucide-react';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { FooterHome } from '../../components/footer/FooterHome';
import { useNavigate } from 'react-router-dom';
import { KanbanSquare as Kanban, Users as GroupIcon } from 'lucide-react';

export const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <ClipboardList className="w-6 h-6 text-[#0B758C]" />,
      title: '1. Registro',
      description: 'Regístrate con tu correo institucional @kinal.edu.gt para acceder a la plataforma.',
    },
    {
      icon: <Users className="w-6 h-6 text-[#0B758C]" />,
      title: '2. Crear o Unirse a Proyecto',
      description: 'Inicia un nuevo proyecto o únete a uno existente para comenzar a colaborar.',
    },
    {
      icon: <KanbanSquare className="w-6 h-6 text-[#0B758C]" />,
      title: '3. Organiza con SCRUM',
      description: 'Crea tableros tipo SCRUM para distribuir y visualizar las tareas de forma ágil.',
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-[#0B758C]" />,
      title: '4. Asigna y Planifica',
      description: 'Define responsables y plazos para cada sprint de trabajo del equipo.',
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#0B758C]" />,
      title: '5. Comunicación',
      description: 'Usa el chat interno para mantener la coordinación entre miembros del grupo.',
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-[#0B758C]" />,
      title: '6. Revisa el Progreso',
      description: 'Consulta estadísticas y avances de tu equipo por sprint y por proyecto.',
    },
  ];

  const mobileNavItems = [
    { label: 'Tu Perfil', icon: <UserCircle className="w-5 h-5" />, onClick: () => navigate(`/kivora/perfil`) },
    { label: 'Mis Tareas', icon: <CheckSquare className="w-5 h-5" />, onClick: () => navigate(`/kivora/mis-tareas`) },
    { label: 'Grupos', icon: <GroupIcon className="w-5 h-5" />, onClick: () => navigate(`/kivora/clusters`) },
    { label: 'Proyectos', icon: <Kanban className="w-5 h-5" />, onClick: () => navigate(`/kivora/proyectoslist`) },
    { label: 'Historial', icon: <History className="w-5 h-5" />, onClick: () => navigate(`/kivora/historial`) },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white">
      <NavbarDashboard />

      <main className="flex-1 py-10 px-4 sm:px-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-10 text-cyan-300">🚀 ¿Cómo Funciona Kivora?</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-[#111] border border-[#036873]/30 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-3">
                  {step.icon}
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                </div>
                <p className="text-sm text-gray-400">{step.description}</p>
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