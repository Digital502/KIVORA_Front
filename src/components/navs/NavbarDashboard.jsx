import { motion } from 'framer-motion';
import {
  Bell,
  KanbanSquare,
  LayoutDashboard,
  User,
  Users
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePerfilUsuario } from '../../shared/hooks/usePerfilUsuario';
import { useGlobalNotifications } from '../../shared/hooks/useNotificactionContext';

export const NavbarDashboard = ({ darkMode: darkModeProp, toggleDarkMode: toggleDarkModeProp}) => {
  const [internalDarkMode, setInternalDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const darkMode = darkModeProp !== undefined ? darkModeProp : internalDarkMode;
  const toggleDarkMode = toggleDarkModeProp || (() => setInternalDarkMode(prev => !prev));
  const user = JSON.parse(localStorage.getItem("user"));
  const {perfil, fetchMyUser} = usePerfilUsuario();
  const { pendingCount } = useGlobalNotifications();

  useEffect(() => {
    fetchMyUser();
  }, []);

  const myProfile = () => {
    navigate('/kivora/perfil');
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`sticky top-0 z-50 w-full px-6 py-4 backdrop-blur-xl border-b transition-colors duration-300
        ${darkMode ? 'bg-[#0D0D0D]/80 border-[#0B758C]/20 text-white shadow-[0_0_20px_#0B758C20]' : 'bg-white/80 border-gray-200 text-gray-900 shadow-sm'}
      `}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/home" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0B758C] to-[#639FA6] flex items-center justify-center shadow-md">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#639FA6] to-[#0B758C]">
            KIVORA
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/grupos" className="hover:text-[#0B758C] transition-all flex items-center gap-1">
            <Users className="w-4 h-4" /> Grupos
          </Link>
          <Link to="/proyectos" className="hover:text-[#0B758C] transition-all flex items-center gap-1">
            <KanbanSquare className="w-4 h-4" /> Proyectos
          </Link>
          <Link to="/kivora/notificaciones" className="relative hover:text-[#0B758C] transition-all flex items-center gap-1">
            <Bell className="w-5 h-5" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 shadow">
                {pendingCount}
              </span>
            )}
            Notificaciones
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={myProfile}
              className="w-9 h-9 rounded-full border-2 border-[#0B758C] overflow-hidden focus:outline-none transition-shadow hover:shadow-[0_0_10px_#0B758C80]"
            >
              {perfil?.imageUrl? (
                <img
                  src={perfil.imageUrl}
                  alt="Usuario"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
              )}

            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
