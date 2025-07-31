import React from 'react';
import { NotebookPen, UserCircle, CheckSquare, Users, KanbanSquare, History } from 'lucide-react';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { FooterHome } from '../../components/footer/FooterHome';
import { useNavigate } from 'react-router-dom';

export const Blog = () => {
  const navigate = useNavigate();

  const posts = [
    {
      title: "Kivora: nueva actualización v2.1",
      date: "30 julio 2025",
      summary: "Incluye mejoras en el sistema de tareas, rendimiento y nueva vista para estadísticas de sprints.",
    },
    {
      title: "¿Cómo aplicar SCRUM en proyectos estudiantiles?",
      date: "25 julio 2025",
      summary: "Una guía rápida para implementar metodologías ágiles en equipos académicos usando Kivora.",
    },
    {
      title: "Tips para mejorar la productividad en equipo",
      date: "20 julio 2025",
      summary: "Pequeños hábitos y recursos disponibles en Kivora que potencian el rendimiento colectivo.",
    },
    {
      title: "Cómo organizar tu primer sprint con éxito",
      date: "15 julio 2025",
      summary: "Pasos básicos para estructurar correctamente un sprint desde la plataforma.",
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
            <NotebookPen className="text-cyan-300" /> Blog y Novedades
          </h1>
          <div className="space-y-6">
            {posts.map((post, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#036873]/30 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-cyan-200">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <p className="text-gray-300">{post.summary}</p>
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