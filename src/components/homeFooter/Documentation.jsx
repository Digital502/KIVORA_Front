import React from 'react';
import {
  BookOpenCheck,
  UserCircle,
  CheckSquare,
  Users,
  KanbanSquare,
  History,
  FileText,
  MessageCircle,
  BarChart3,
  Group,
  ListTodo
} from 'lucide-react';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { FooterHome } from '../../components/footer/FooterHome';
import { useNavigate } from 'react-router-dom';

export const Documentation = () => {
  const navigate = useNavigate();

  const docs = [
    {
      title: "Introducción a Kivora y SCRUM",
      description: "Conoce qué es Kivora, su propósito y cómo se integra con metodologías ágiles como SCRUM.",
      icon: <FileText className="w-6 h-6 text-[#0B758C]" />,
    },
    {
      title: "Gestión de grupos y proyectos",
      description: "Aprende a crear, editar y colaborar en proyectos dentro de grupos de trabajo.",
      icon: <Group className="w-6 h-6 text-[#0B758C]" />,
    },
    {
      title: "Asignación y seguimiento de tareas",
      description: "Descubre cómo organizar el trabajo usando tableros SCRUM y asignar responsables.",
      icon: <ListTodo className="w-6 h-6 text-[#0B758C]" />,
    },
    {
      title: "Comunicación mediante chat interno",
      description: "Explora cómo el chat de grupo facilita la coordinación rápida entre miembros.",
      icon: <MessageCircle className="w-6 h-6 text-[#0B758C]" />,
    },
    {
      title: "Estadísticas y reportes visuales",
      description: "Visualiza el rendimiento y los avances de tu equipo con gráficas por sprint.",
      icon: <BarChart3 className="w-6 h-6 text-[#0B758C]" />,
    },
    {
      title: "Estadísticas y reportes user",
      description: "Visualiza el rendimiento y los avances de tu user con gráficas por sprint tarea.",
      icon: <BarChart3 className="w-6 h-6 text-[#0B758C]" />,
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
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-cyan-300 mb-10 flex items-center gap-3">
            <BookOpenCheck className="text-cyan-300" /> Documentación
          </h1>
          <p className="mb-8 text-gray-400 text-lg">
            Aprende a usar Kivora con esta documentación visual y simple para estudiantes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {docs.map((doc, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#036873]/30 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex items-center gap-3 mb-2">
                  {doc.icon}
                  <h2 className="text-lg font-semibold">{doc.title}</h2>
                </div>
                <p className="text-sm text-gray-400">{doc.description}</p>
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