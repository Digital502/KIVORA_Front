import { AnimatePresence, motion } from 'framer-motion';
import { Archive, Bell, Eye, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { FooterHome } from '../../components/footer/FooterHome';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { SidebarUser } from '../../components/navs/SidebarUser';
import { useNotifications } from '../../shared/hooks/useNotifications';

export const NotificationsList = () => {
    const {
        notifications,
        loading,
        changeNotificationState,
        fetchNotifications,
        pendingCount
    } = useNotifications();

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
            <NavbarDashboard />

            <div className="flex flex-1">
                <SidebarUser />

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                                <Bell className="text-[#0B758C]" /> Notificaciones
                            </h1>
                            <p className="text-gray-400 mt-1">Visualiza tus alertas recientes</p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B758C]" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <p className="text-gray-400">No tienes notificaciones aún.</p>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {notifications.map((notification, index) => (
                                        <motion.div
                                            key={notification._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="rounded-xl border border-[#036873]/30 bg-[#111] p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                                        >
                                            <div className="flex-1">
                                                <h2 className="text-lg font-semibold text-white mb-1">
                                                    {notification.title || "Sin título"}
                                                </h2>
                                                <p className="text-sm text-gray-400 mb-2">{notification.message}</p>
                                                <div className="text-xs text-[#0B758C]">
                                                    Estado: {notification.state} • Tipo: {notification.type}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-4 sm:mt-0">
                                                {notification.state === "Pendiente" && (
                                                    <button
                                                        onClick={() => changeNotificationState(notification._id, "Vista")}
                                                        className="p-2 rounded-md bg-[#0B758C]/20 hover:bg-[#0B758C]/30 text-[#0B758C]"
                                                        title="Marcar como vista"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => changeNotificationState(notification._id, "Archivada")}
                                                    className="p-2 rounded-md bg-[#0B758C]/20 hover:bg-[#0B758C]/30 text-[#0B758C]"
                                                    title="Archivar"
                                                >
                                                    <Archive className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => changeNotificationState(notification._id, "Eliminada")}
                                                    className="p-2 rounded-md bg-[#0B758C]/20 hover:bg-[#0B758C]/30 text-[#0B758C]"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <FooterHome />
        </div>
    );
};