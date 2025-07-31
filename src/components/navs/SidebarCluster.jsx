import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, GitBranch, Users, FileText, ClipboardList, Settings } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const SidebarCluster = ({ setShowProjectModal, setShowInviteModal, id }) => {
    const navigate = useNavigate();

    return (
        <aside className="w-64 px-6 py-8 border-r border-[#036873]/20 bg-[#0D0D0D] flex flex-col justify-between">
            <div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowProjectModal(true)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg mb-6 bg-[#036873] hover:bg-[#036873]/90 text-white font-medium"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span>Crear proyecto</span>
                </motion.button>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <GitBranch className="w-5 h-5 text-[#0B758C]" />
                        Acciones rápidas
                    </h3>
                    <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors hover:bg-[#036873]/10"
                    >
                        <Users className="w-5 h-5" />
                        <span>Agregar miembro</span>
                    </motion.button>
                    <button className="flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors hover:bg-[#036873]/10">
                        <FileText className="w-5 h-5" />
                        <span>Documentación</span>
                    </button>
                    <button onClick={() => navigate(`/kivora/cluster/${id}/reports`)} className="flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors hover:bg-[#036873]/10">
                        <ClipboardList className="w-5 h-5" />
                        <span>Reportes</span>
                    </button>
                    <button
                        onClick={() => navigate(`/kivora/cluster/${id}/settings`)}
                        className="flex items-center gap-3 w-full px-4 py-2 rounded-lg transition-colors hover:bg-[#036873]/10 mb-8"
                    >
                        <Settings className="w-5 h-5" />
                        <span>Ajustes del grupo</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
