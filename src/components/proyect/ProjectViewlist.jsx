import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectView } from "../../shared/hooks/useProyectView";
import { FolderGit2, Calendar } from "lucide-react";
import { NavbarDashboard } from "../navs/NavbarDashboard";
import { SidebarUser } from "../navs/SidebarUser";
import { FooterHome } from "../footer/FooterHome";
import {Users, KanbanSquare, UserCircle, History} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProjectList = () => {
  const { projects, isLoading, error, fetchUserProjects } = useProjectView();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
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

  const navigate = useNavigate();

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
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header y barra de búsqueda */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Mis Proyectos</h1>
                <p className="text-gray-400 mt-1">Proyectos asignados a ti</p>
              </div>

              <div className="relative sm:w-64 w-full">
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111] border border-[#036873]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#0B758C]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
              </div>
            </div>

            {/* Cuerpo */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0B758C]"></div>
              </div>
            ) : error ? (
              <p className="text-center text-red-500">
                Error: {error}{" "}
                <button
                  onClick={fetchUserProjects}
                  className="underline text-blue-500 ml-2"
                >
                  Reintentar
                </button>
              </p>
            ) : filteredProjects.length === 0 ? (
              <motion.div
                className="col-span-full py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {searchTerm ? (
                  <p className="text-gray-400">No se encontraron proyectos con ese nombre.</p>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <FolderGit2 className="w-12 h-12 text-[#0B758C]" />
                    <p className="text-gray-400">Aún no tienes proyectos asignados.</p>
                    <button
                      onClick={fetchUserProjects}
                      className="mt-4 px-6 py-2 bg-[#0B758C] hover:bg-[#0a6a7d] text-white rounded-lg"
                    >
                      Reintentar
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <AnimatePresence>
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project._id}
                      className="rounded-xl border border-[#036873]/30 shadow p-4 sm:p-6 hover:shadow-lg transition bg-[#111] cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 100,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <FolderGit2 className="w-6 h-6 text-[#0B758C]" />
                        <h3 className="text-lg font-semibold text-white truncate">
                          {project.title}
                        </h3>
                      </div>

                      <p className="text-sm text-gray-400 mb-4">{project.description}</p>

                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(project.startDate).toLocaleDateString()} –{" "}
                            {new Date(project.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#0B758C] font-semibold">Cluster: </span>
                          {project.cluster?.nombre || "N/A"}
                        </div>
                        <div>
                          <span className="text-[#0B758C] font-semibold">Scrum Master: </span>
                          {project.scrumMaster
                            ? `${project.scrumMaster.name} ${project.scrumMaster.surname}`
                            : "N/A"}
                        </div>
                        <div>
                          <span className="text-[#0B758C] font-semibold">Product Owner: </span>
                          {project.productOwner
                            ? `${project.productOwner.name} ${project.productOwner.surname}`
                            : "N/A"}
                        </div>
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