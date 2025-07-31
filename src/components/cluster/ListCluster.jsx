import React from 'react';
import { FolderGit2, Plus, Search, Users, Settings, ArrowRight, KanbanSquare, UserCircle, History } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cluster } from '../cluster/Cluster';
import { NavbarDashboard } from '../navs/NavbarDashboard';
import { FooterHome } from '../footer/FooterHome';
import { useNavigate } from 'react-router-dom';
import { useCluster } from '../../shared/hooks/useCluster';
import { SidebarUser } from '../navs/SidebarUser';

export const ListCluster = () => {
    const [grupos, setGrupos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [showClusterModal, setShowClusterModal] = useState(false);
    const { obtenerGruposUsuario } = useCluster();

    useEffect(() => {
        const fetchGrupos = async () => {
            try {
                setIsLoading(true);
                const grupos = await obtenerGruposUsuario();
                if (grupos) {
                    setGrupos(grupos);
                }
            } catch (error) {
                console.error("Error al obtener grupos:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGrupos();
    }, []);

    const handleGroupCreated = (newGroup) => {
        if (newGroup) {
            setGrupos([...grupos, newGroup]);
            setShowClusterModal(false);
        }
    };

    const handleGroupClick = (groupId) => {
        navigate(`/kivora/cluster/${groupId}`);
    };

    const filteredGroups = grupos.filter(grupo =>
        grupo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const mobileNavItems = [
    { 
      label: 'Tu Perfil', 
      icon: <UserCircle className="w-5 h-5" />, 
      onClick: () => navigate(`/kivora/perfil`)
    },
    { 
      label: 'Grupos', 
      icon: <Users className="w-5 h-5" />, 
      onClick: () => navigate(`/kivora/clusters`)
    },
    { 
      label: 'Proyectos', 
      icon: <KanbanSquare className="w-5 h-5" />, 
      onClick: () => navigate(`/kivora/proyectoslist`)
    },
    { 
      label: 'Historial', 
      icon: <History className="w-5 h-5" />, 
      onClick: () => navigate(`/kivora/historial`)
    },
  ];
    return (
        <div className="min-h-screen bg-[#0D0D0D] flex flex-col text-white">
            <NavbarDashboard />
            
            <div className="flex flex-1">
            <div className="hidden lg:block">
            <SidebarUser />
            </div>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-[#036873]/30 z-50">
                <div className="flex justify-around py-3">
                {mobileNavItems.map((item, index) => (
                    <button
                    key={index}
                    onClick={item.onClick}
                    className="flex flex-col items-center p-1 text-xs"
                    >
                    <div className="text-[#0B758C]">
                        {item.icon}
                    </div>
                    <span className="text-white text-xs mt-1">
                        {item.label}
                    </span>
                    </button>
                ))}
                </div>
            </div>
                
                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {/* Header y controles */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">Mis Grupos</h1>
                                <p className="text-gray-400 mt-1">Administra tus grupos de trabajo</p>
                            </div>
                            
                            <div className="flex gap-3 w-full sm:w-auto">
                                {/* Barra de búsqueda */}
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar grupos..."
                                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111] border border-[#036873]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#0B758C]"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target)}
                                    />
                                </div>
                                
                                {/* Botón crear grupo */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowClusterModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#0B758C] hover:bg-[#0a6a7d] text-white rounded-lg transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span className="hidden sm:inline">Nuevo Grupo</span>
                                </motion.button>
                            </div>
                        </div>

                        {/* Lista de grupos */}
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B758C]"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {filteredGroups.length === 0 ? (
                                    <motion.div
                                        className="col-span-full py-12 text-center"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        {searchTerm ? (
                                            <p className="text-gray-400">No se encontraron grupos con ese nombre.</p>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <FolderGit2 className="w-12 h-12 text-[#0B758C]" />
                                                <p className="text-gray-400">Aún no tienes grupos creados.</p>
                                                <button
                                                    onClick={() => setShowClusterModal(true)}
                                                    className="mt-4 px-6 py-2 bg-[#0B758C] hover:bg-[#0a6a7d] text-white rounded-lg flex items-center gap-2"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                    Crear primer grupo
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <AnimatePresence>
                                        {filteredGroups.map((grupo, index) => (
                                            <motion.div
                                                key={grupo._id}
                                                className="rounded-xl border border-[#036873]/30 shadow p-4 sm:p-6 hover:shadow-lg transition bg-[#111] cursor-pointer group"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
                                                onClick={() => handleGroupClick(grupo._id)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <FolderGit2 className="w-6 h-6 text-[#0B758C]" />
                                                        <h2 className="text-lg font-semibold text-white">{grupo.nombre}</h2>
                                                    </div>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/kivora/cluster/${grupo._id}/settings`);
                                                        }}
                                                        className="p-1 rounded-full hover:bg-[#036873]/20 transition-colors"
                                                    >
                                                        <Settings className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                </div>
                                                
                                                <p className="text-sm text-gray-400 mb-4">
                                                    {grupo.descripcion || "Grupo de trabajo colaborativo."}
                                                </p>
                                                
                                                <div className="flex justify-between items-center text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        <span>{grupo.miembros?.length || 0} miembros</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 group-hover:text-[#0B758C] transition-colors">
                                                        <span>Ver detalles</span>
                                                        <ArrowRight className="w-3 h-3" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Cluster
                isOpen={showClusterModal}
                onClose={() => setShowClusterModal(false)}
                onGroupCreated={handleGroupCreated}
            />

            <FooterHome />
        </div>
    );
};