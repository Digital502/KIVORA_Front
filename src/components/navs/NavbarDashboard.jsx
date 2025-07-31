import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  KanbanSquare,
  LayoutDashboard,
  User,
  Users,
  Menu,
  X
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
    <>
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

          {/* Botón de menú para móviles */}
          <div className="relative md:hidden">
            <button 
              className="p-2 rounded-lg focus:outline-none relative"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/kivora/clusters" className="hover:text-[#0B758C] transition-all flex items-center gap-1">
              <Users className="w-4 h-4" /> Grupos
            </Link>
            <Link to="/kivora/proyectoslist" className="hover:text-[#0B758C] transition-all flex items-center gap-1">
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

          <div className="hidden md:flex items-center gap-4">
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

      {/* Menú móvil con AnimatePresence */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 25 }
            }}
            exit={{ 
              opacity: 0, 
              y: -20,
              transition: { duration: 0.2 }
            }}
            className={`md:hidden fixed top-16 left-0 right-0 z-40 px-6 py-4 border-b shadow-lg
              ${darkMode ? 'bg-[#0D0D0D] border-[#0B758C]/20' : 'bg-white border-gray-200'}
            `}
          >
            <div className="flex flex-col space-y-4">
              <Link 
                to="/kivora/clusters" 
                className="hover:text-[#0B758C] transition-all flex items-center gap-2 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <Users className="w-5 h-5" />
                <span>Grupos</span>
              </Link>
              <Link 
                to="/kivora/proyectoslist" 
                className="hover:text-[#0B758C] transition-all flex items-center gap-2 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <KanbanSquare className="w-5 h-5" />
                <span>Proyectos</span>
              </Link>
              <Link 
                to="/kivora/notificaciones" 
                className="hover:text-[#0B758C] transition-all flex items-center gap-2 py-2"
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <span>Notificaciones</span>
                  {pendingCount > 0 && (
                    <span className="bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                      {pendingCount}
                    </span>
                  )}
                </div>
              </Link>
              <div className="pt-2 border-t border-[#0B758C]/20">
                <button
                  onClick={() => {
                    myProfile();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 py-2 hover:text-[#0B758C]"
                >
                  <User className="w-5 h-5" />
                  <span>Mi perfil</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};