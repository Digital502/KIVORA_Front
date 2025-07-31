import React from 'react';
import { Code, UserCircle, CheckSquare, Users, KanbanSquare, History } from 'lucide-react';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { FooterHome } from '../../components/footer/FooterHome';
import { useNavigate } from 'react-router-dom';

export const Api = () => {
  const navigate = useNavigate();

  const endpoints = [
    { method: 'POST', url: '/auth/login', description: 'Login de usuarios con JWT' },
    { method: 'GET', url: '/projects', description: 'Obtener lista de proyectos' },
    { method: 'POST', url: '/projects', description: 'Crear un nuevo proyecto' },
    { method: 'GET', url: '/projects/:id/tasks', description: 'Tareas de un proyecto específico' },
    { method: 'POST', url: '/messages', description: 'Enviar mensajes de chat' },
    { method: 'GET', url: '/stats', description: 'Obtener estadísticas del equipo' },
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
            <Code className="text-cyan-300" /> API Pública
          </h1>
          <table className="w-full border-collapse border border-[#036873]/30 text-gray-300">
            <thead>
              <tr className="bg-[#111]">
                <th className="border border-[#036873]/30 px-4 py-2 text-left">Método</th>
                <th className="border border-[#036873]/30 px-4 py-2 text-left">URL</th>
                <th className="border border-[#036873]/30 px-4 py-2 text-left">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(({ method, url, description }, i) => (
                <tr key={i} className="hover:bg-[#222] cursor-default">
                  <td className="border border-[#036873]/30 px-4 py-2 font-mono">{method}</td>
                  <td className="border border-[#036873]/30 px-4 py-2 font-mono">{url}</td>
                  <td className="border border-[#036873]/30 px-4 py-2">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
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