import React from 'react'
import {Users, KanbanSquare, Settings, UserCircle, MessageCircle, History, LogOut} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SidebarUser = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
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
        <aside className="lg:w-64 px-4 py-6 lg:px-6 lg:py-8 border-r border-[#036873]/20 bg-[#0D0D0D] hidden lg:flex lg:flex-col justify-between">
          <nav className="space-y-2 lg:space-y-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick} 
                className="flex items-center gap-3 w-full px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-colors hover:bg-[#036873]/10 text-white"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
    )
}
