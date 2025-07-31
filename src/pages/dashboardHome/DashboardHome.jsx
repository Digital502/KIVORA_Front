import React from "react";

import {
  PlusCircle,
  FolderGit2,
  BookOpenCheck,
  CheckCircle,
  ListTodo,
  Rocket,
  Users,
  KanbanSquare,
  UserCircle,
  History,
  CheckSquare,
  MessageCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { FooterHome } from "../../components/footer/FooterHome";
import { NavbarDashboard } from "../../components/navs/NavbarDashboard";
import { Cluster } from "../../components/cluster/Cluster";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCluster } from "../../shared/hooks/useCluster";
import { SidebarUser } from "../../components/navs/SidebarUser";
import { QuickTasksOverview } from "../../components/task/QuickTasksOverview";

export const DashboardHome = () => {
  const [grupos, setGrupos] = useState([]);
  const [nuevoGrupo, setNuevoGrupo] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [showClusterModal, setShowClusterModal] = useState(false);
  const { crearNuevoGrupo, isLoading, obtenerGruposUsuario } = useCluster();

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const grupos = await obtenerGruposUsuario();
        if (grupos) {
          setGrupos(grupos);
        }
      } catch (error) {
        console.error("Error al obtener grupos:", error);
      }
    };

    fetchGrupos();
  }, []);

  const handleGroupClick = (groupId) => {
    navigate(`/kivora/cluster/${groupId}`);
  };

  const handleGroupCreated = (newGroup) => {
    if (newGroup) {
      setGrupos([...grupos, newGroup]);
      setShowClusterModal(false);
    }
  };

  const paneles = [
    {
      titulo: "Guía rápida sobre SCRUM",
      descripcion:
        "Comprende los roles, eventos y artefactos de SCRUM para trabajar mejor en equipo.",
      icono: <BookOpenCheck className="w-8 h-8 text-[#0B758C]" />,
      onClick: () => navigate("/kivora/guideScrum"),
    },
    {
      titulo: "Tus Tareas",
      descripcion:
        "Revisa y organiza las tareas asignadas a ti en tus proyectos actuales.",
      icono: <CheckCircle className="w-8 h-8 text-[#0B758C]" />,
      onClick: () => navigate("/kivora/mis-tareas"),
    },
    {
      titulo: "Tareas Pendientes",
      descripcion:
        "Visualiza qué tareas están en espera de ser finalizadas y prioriza tus esfuerzos.",
      icono: <ListTodo className="w-8 h-8 text-[#0B758C]" />,
      onClick: () => navigate("/kivora/mis-tareas"),
    },
  ];

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
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white">
      <NavbarDashboard />

      <div className="flex flex-col lg:flex-row flex-1">
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
                <div className="text-[#0B758C]">{item.icon}</div>
                <span className="text-white text-xs mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        <main className="flex-1 py-6 px-4 sm:py-8 sm:px-6 lg:py-10 lg:px-10 pb-20 lg:pb-10">
          <p className="text-sm sm:text-base text-gray-400 mb-4 capitalize">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-10">
            Hola,{" "}
            <span className="text-[#0B758C]">
              {user ? `${user.username}` : "Usuario"}
            </span>
          </h1>

          {/* Paneles rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-16">
            {paneles.map((panel, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={panel.onClick}
                className="cursor-pointer rounded-xl border border-[#036873]/30 shadow-md p-4 sm:p-6 transition hover:shadow-lg bg-[#111111]"
              >
                <div className="flex items-center gap-3 mb-3">
                  {panel.icono}
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {panel.titulo}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-400">
                  {panel.descripcion}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Cómo funciona Kivora */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 sm:mb-16 p-4 sm:p-6 rounded-xl border border-[#036873]/30 shadow-md bg-[#111]"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B758C]" />
              <h2 className="text-xl sm:text-2xl font-bold">
                ¿Cómo funciona <span className="text-[#0B758C]">Kivora</span>?
              </h2>
            </div>
            <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">
              Kivora es una plataforma diseñada para facilitar la colaboración
              en proyectos utilizando metodologías ágiles como SCRUM. Desde tu
              panel puedes crear grupos, asignar tareas, monitorear el progreso
              de tus proyectos y mantener comunicación eficiente entre los
              miembros del equipo.
            </p>
            <ul className="list-disc ml-4 sm:ml-6 space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li>Organiza equipos y proyectos fácilmente.</li>
              <li>Asigna tareas y define prioridades por sprint.</li>
              <li>
                Consulta tu guía rápida de SCRUM para aplicar buenas prácticas.
              </li>
              <li>
                Visualiza notificaciones, historial de actividades y tu perfil.
              </li>
            </ul>
          </motion.section>

          {/* Quick Tasks Overview */}
          <div className="mb-10 sm:mb-16">
            <QuickTasksOverview />
          </div>

          {/* Crear grupo */}
          <section>
            <motion.button
              onClick={() => setShowClusterModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 my-3 sm:my-5 rounded-md text-sm sm:text-base font-medium bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow hover:from-[#0B758C] hover:to-[#036873]"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Crear Grupo
            </motion.button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {grupos.length === 0 ? (
                <motion.p
                  className="text-center col-span-full text-gray-400 text-sm sm:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Aún no hay grupos creados.
                </motion.p>
              ) : (
                grupos.map((grupo, index) => (
                  <motion.div
                    key={index}
                    className="rounded-xl border border-[#036873]/30 shadow p-4 sm:p-6 hover:shadow-lg transition bg-[#111111] cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleGroupClick(grupo._id)}
                  >
                    <div className="flex items-center gap-3 mb-2 sm:mb-3">
                      <FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B758C]" />
                      <h2 className="text-lg sm:text-xl font-semibold">
                        {grupo.nombre}
                      </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400">
                      Grupo creado recientemente. Puedes agregar miembros o
                      tareas.
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </section>
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
