import React from 'react';
import { ChatLayout } from '../../components/chat/ChatLayout';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { SidebarUser } from '../../components/navs/SidebarUser';
import {
  Users, KanbanSquare,  History,
  MessageCircle,  UserCircle, CheckSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ChatPage = () => {
  const userData = localStorage.getItem("user");
  const parsedUser = JSON.parse(userData);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const mobileNavItems = [
    {
      label: "Tu Perfil",
      icon: <UserCircle className="w-5 h-5" />,
      onClick: () => navigate(`/kivora/perfil`),
    },
    {
      label: "Mis Tareas",
      icon: <CheckSquare className="w-5 h-5" />,
      onClick: () => navigate(`/kivora/mis-tareas`),
    },
    {
      label: "Grupos",
      icon: <Users className="w-5 h-5" />,
      onClick: () => navigate(`/kivora/clusters`),
    },
    {
      label: "Proyectos",
      icon: <KanbanSquare className="w-5 h-5" />,
      onClick: () => navigate(`/kivora/proyectoslist`),
    },
    {
      label: "Chat",
      icon: <MessageCircle className="w-5 h-5" />,
      onClick: () => navigate("/kivora/chatPage"),
    },

    {
      label: "Historial",
      icon: <History className="w-5 h-5" />,
      onClick: () => navigate(`/kivora/historial`),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0D0D] text-[#E0E0E0]">
      <NavbarDashboard />

      <div className="flex flex-1">
        {/* Sidebar en pantallas grandes */}
        <div className="hidden lg:block">
          <SidebarUser />
        </div>

        {/* Contenido principal del chat */}
        <main className="flex-1 overflow-hidden">
          <ChatLayout userId={parsedUser?.user || null} />
        </main>
      </div>

      {/* Barra de navegación inferior para móviles */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#036873]/30 z-50">
        <div className="flex justify-around py-2">
          {mobileNavItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-col items-center p-1 text-xs"
            >
              <div className="text-[#0B758C]">{item.icon}</div>
              <span className="text-white text-xs mt-1">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
