import React from 'react';
import { ChatLayout } from '../../components/chat/ChatLayout';
import {
  Users, KanbanSquare, Settings, Sun, Moon, History,
  MessageCircle, LogOut, UserCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { FooterHome } from '../../components/footer/FooterHome';

export const ChatPage = () => {
  const userData = localStorage.getItem("user");
  const parsedUser = JSON.parse(userData);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
        { label: 'Tu Perfil', icon: <UserCircle className="w-5 h-5" />, onClick: () => navigate('/kivora/perfil') },
        { label: 'Grupos', icon: <Users className="w-5 h-5" />, onClick: () => navigate('/kivora/clusters') },
        { label: 'Proyectos', icon: <KanbanSquare className="w-5 h-5" />, onClick: () => navigate('/kivora/proyectos') },
        { label: 'Historial de Proyectos', icon: <History className="w-5 h-5" />, onClick: () => navigate('/kivora/historial') },
        { label: 'Chat', icon: <MessageCircle className="w-5 h-5" />, onClick: () => navigate('/kivora/chatPage') },
        { label: 'Cerrar Sesión', icon: <LogOut className="w-5 h-5" />, onClick: handleLogout }
  ];

  return (
    <div className="flex flex-col h-screen bg-[#0D0D0D] text-[#E0E0E0] overflow-hidden">
      <NavbarDashboard />

      <div className="flex flex-1 overflow-hidden">
        {/* Barra lateral */}
        <aside className="hidden lg:flex lg:w-64 px-6 py-8 border-r border-[#E0E0E0]/20 bg-[#0D0D0D] flex-col justify-between">
          <nav className="space-y-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-[#036873]/10 text-[#E0E0E0] transition-colors"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto bg-[#0D0D0D]">
          <div className="max-w-6xl mx-auto p-4">
            <ChatLayout userId={parsedUser?.user || null} />
          </div>
        </main>
      </div>

      {/* Menú móvil fijo */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#E0E0E0]/20 z-10">
        <div className="flex justify-around py-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-col items-center p-2 text-xs text-[#E0E0E0] transition-colors"
            >
              <div className="w-5 h-5">
                {item.icon}
              </div>
              <span className="mt-1">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
