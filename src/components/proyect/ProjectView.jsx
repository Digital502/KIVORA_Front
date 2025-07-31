import { useState, useEffect } from 'react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectView } from '../../shared/hooks/useProjectView';
import { NavbarDashboard } from "../navs/NavbarDashboard";
import { TaskList } from '../task/TaskList.jsx';
import { FooterHome } from "../footer/FooterHome";
import {
  CalendarCheck, ListChecks, Users, Clock, ChevronDown, ChevronUp,
  Plus, Check, X, Calendar, AlertCircle, GitBranch, Settings,
  ArrowRight, Loader2, KanbanSquare, PieChart, Shield, User2, Star,
  History, LogOut, UserCircle, Download, RefreshCw, Trash2
} from 'lucide-react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import esLocale from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { useProjectBacklog } from '../../shared/hooks/useBacklog.jsx';
import { FormBacklog } from '../backlog/FormBacklog.jsx'
import { ListBacklog } from '../backlog/ListBacklog.jsx';
import { SprintForm } from "../sprint/SprintForm.jsx" 
import { SprintTable } from "../sprint/SprintTable.jsx"
import { SpintCalendar } from '../sprint/SprintCalendar.jsx';
import { useSprintForm } from '../../shared/hooks/useSprintForm.jsx';

const locales = { 'es': esLocale };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export const ProjectView = () => {
  const { state } = useLocation();
  const { proyecto, integrantes } = state || {};
  const { isScrumMaster, isProductOwner, projectId } = useProjectView(proyecto);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('backlog');
  const [showBacklogModal, setShowBacklogModal] = useState(false);
  const [expandedSprints, setExpandedSprints] = useState({});
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const {
    sprintsList,
    obtenerSprints
  } = useSprintForm();

  const {
    newItemData,
    setNewItemData,
    handleAddBacklogItem,
    loading: backlogLoading,
    backlogs,
    error,
    success,
    refreshBacklogs,
    handleExportBacklogPDF
  } = useProjectBacklog(projectId, proyecto.title);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      const calendarEvents = [
        {
          title: 'Inicio del proyecto',
          start: new Date(proyecto.startDate),
          end: new Date(proyecto.startDate),
          allDay: true,
          color: '#0B758C'
        },
        ...sprints.map(sprint => ({
          title: sprint.name,
          start: sprint.startDate,
          end: sprint.endDate,
          allDay: true,
          color: '#639FA6'
        }))
      ];
      setEvents(calendarEvents);
    }, 1500);
    return () => clearTimeout(timer);
  }, [proyecto]);

  useEffect(() => {
    if (projectId) {
      obtenerSprints(projectId);
    }
  }, [projectId]);

  const sprints = sprintsList || [];

  const toggleSprint = (sprintId) => {
    setExpandedSprints(prev => ({ ...prev, [sprintId]: !prev[sprintId] }));
  };

  if (!proyecto || !integrantes) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D0D0D] text-white">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Proyecto no encontrado</h2>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-[#0B758C] hover:bg-[#0a6a7d] rounded-lg flex items-center gap-2 mx-auto"
          >
            <ArrowRight className="w-5 h-5 rotate-180" />
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen flex flex-col">
      <NavbarDashboard />

      {/* Layout principal */}
      <div className="flex flex-1">
        {/* Contenido principal */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 relative">
          {/* Contenido del proyecto */}
          <div className="relative z-10 max-w-7xl mx-auto">
            {/* Header del proyecto */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] via-[#639FA6] to-[#036873]">
                      {proyecto.title}
                    </span>
                  </h1>
                  <p className="text-sm md:text-base text-gray-300 max-w-3xl">
                    {proyecto.description}
                  </p>
                </div>

                {isScrumMaster && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-[#0B758C] to-[#036873] text-white rounded-lg flex items-center gap-2 w-max text-sm md:text-base"
                  >
                    <Shield className="w-4 h-4 md:w-5 md:h-5" />
                    <span>Scrum Master</span>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl bg-[#111] border border-[#036873]/30 shadow-md">
                <div>
                  <p className="text-sm text-gray-400">Fecha inicio</p>
                  <p className="font-medium flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-[#0B758C]" />
                    {new Date(proyecto.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Fecha fin</p>
                  <p className="font-medium flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-[#0B758C]" />
                    {new Date(proyecto.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tipo</p>
                  <p className="font-medium flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-[#0B758C]" />
                    {proyecto.projectType}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Miembros</p>
                  <p className="font-medium flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#0B758C]" />
                    {integrantes.length}
                  </p>
                </div>
              </div>
            </motion.header>
            {/* Pestañas principales */}
            <div className="mb-6 border-b border-[#036873]/20 overflow-x-auto">
              <nav className="flex space-x-4 min-w-max">
                {[
                  { id: 'backlog', name: 'Mi Backlog', icon: <ListChecks className="w-4 h-4 md:w-5 md:h-5" /> },
                  { id: 'sprints', name: 'Sprints', icon: <KanbanSquare className="w-4 h-4 md:w-5 md:h-5" /> },
                  { id: 'calendar', name: 'Calendario', icon: <Calendar className="w-4 h-4 md:w-5 md:h-5" /> },
                  { id: 'members', name: 'Miembros', icon: <Users className="w-4 h-4 md:w-5 md:h-5" /> },
                  ...(isScrumMaster ? [{ id: 'reports', name: 'Reportes', icon: <PieChart className="w-4 h-4 md:w-5 md:h-5" /> }] : [])
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 px-2 md:px-3 border-b-2 font-medium text-xs md:text-sm flex items-center gap-1 md:gap-2 ${activeTab === tab.id
                      ? 'border-[#0B758C] text-[#0B758C]'
                      : 'border-transparent hover:border-gray-700 text-gray-400 hover:text-gray-300'}`}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Contenido de las pestañas */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Pestaña Backlog */}
                {activeTab === 'backlog' && (
                  <div className="space-y-6 max-w-7xl mx-auto">
                    {/* Contenido para Product Owner */}
                    {isProductOwner && (
                      <>
                        {/* Sección del Backlog para PO */}
                        <section className="mb-8">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 md:gap-3">
                              <ListChecks className="w-5 h-5 md:w-6 md:h-6 text-[#0B758C]" />
                              <span className="text-sm md:text-base">Backlog</span>
                            </h2>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setShowBacklogModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0B758C] to-[#036873] text-white rounded-lg hover:brightness-110 transition text-sm"
                              >
                                <Plus className="w-4 h-4" />
                                Agregar Item
                              </button>
                              <button
                                onClick={handleExportBacklogPDF}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0B758C] to-[#036873] text-white rounded-lg hover:brightness-110 transition text-sm"
                              >
                                <Download className="w-4 h-4" />
                                Exportar PDF
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3 md:space-y-4">
                            {(isProductOwner || isScrumMaster) && (
                              <section className="mb-8">
                                <ListBacklog
                                  isProductOwner={isProductOwner}
                                  isScrumMaster={isScrumMaster}
                                  backlogs={backlogs}
                                />
                              </section>
                            )}
                          </div>
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                          <div className="lg:col-span-2">
                            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                              <ListChecks className="w-5 h-5 md:w-6 md:h-6 text-[#0B758C]" />
                              <span className="text-sm md:text-base">Mis tareas asignadas</span>
                            </h2>
                             <TaskList proyecto={proyecto} integrantes={integrantes} />
                          </div>
                        </div>
                      </>
                    )}

                    {/* Contenido para Scrum Master (solo lista de items) */}
                    {isScrumMaster && !isProductOwner && (
                      <section className="mb-8">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                          <ListChecks className="w-5 h-5 md:w-6 md:h-6 text-[#0B758C]" />
                          <span className="text-sm md:text-base">Backlog</span>
                        </h2>
                      </section>
                    )}

                    {/* Contenido para otros roles (solo tareas asignadas) */}
                    {!isProductOwner && !isScrumMaster && (
                      <div className="space-y-6">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                          <ListChecks className="w-5 h-5 md:w-6 md:h-6 text-[#0B758C]" />
                          <span className="text-sm md:text-base">Mis tareas asignadas</span>
                        </h2>
                     <TaskList proyecto={proyecto} integrantes={integrantes} />

                      </div>
                    )}
                    <FormBacklog
                      isOpen={showBacklogModal}
                      onClose={() => setShowBacklogModal(false)}
                      newItemData={newItemData}
                      setNewItemData={setNewItemData}
                      handleAddBacklogItem={handleAddBacklogItem}
                      loading={backlogLoading}
                      error={error}
                      success={success}
                      onSuccess={() => {
                        refreshBacklogs(id);        
                        setShowBacklogModal(false); 
                      }}
                    />
                  </div>
                )}
                {/* Pestaña Sprints */}
                {activeTab === 'sprints' && (
                  <div>
                    {isScrumMaster && (
                      <div className="flex justify-end mb-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowSprintForm(true)}
                          className="px-4 py-2 bg-gradient-to-r from-[#0B758C] to-[#036873] text-white rounded-lg flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          Crear nuevo Sprint
                        </motion.button>

                        <SprintForm 
                          isOpen={showSprintForm}
                          onClose={() => setShowSprintForm(false)}
                          onSprintCreated={(newSprint) => {
                            console.log("Nuevo sprint:", newSprint);
                          }}
                          proyecto={proyecto}
                        />

                      </div>
                    )}

                    <SprintTable proyecto={proyecto} integrantes={integrantes}/>
                  </div>
                )}

                {/* Pestaña Calendario */}
                {activeTab === 'calendar' && (
                  <div>
                    <SpintCalendar sprints={sprintsList}/>
                  </div>
                )}

                {/* Pestaña Miembros */}
                {activeTab === 'members' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {integrantes.map((integrante, idx) => {
                        const usuario = integrante.usuario || {};
                        return (
                          <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="p-5 rounded-xl border bg-[#111] border-[#036873]/30 shadow-sm"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-[#0B758C]/10 flex items-center justify-center">
                                  <User2 className="w-6 h-6 text-[#0B758C]" />
                                </div>
                                {integrante.rol === "admin" && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0B758C] flex items-center justify-center">
                                    <Star className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">{usuario.username || 'Usuario'}</h3>
                                <p className="text-sm text-gray-400">
                                  {integrante.rol === "admin" ? "Administrador" : "Miembro"}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-[#036873]/20">
                              <p className="text-sm text-gray-400">
                                {usuario.email || 'email@ejemplo.com'}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'reports' && isScrumMaster && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-xl border bg-[#111] border-[#036873]/30">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-[#0B758C]" />
                        Progreso general
                      </h3>
                      <div className="h-64">
                        {/* Gráfico de progreso (simulado) */}
                        <div className="w-full h-4 bg-gray-700 rounded-full mb-8">
                          <div
                            className="h-4 rounded-full bg-gradient-to-r from-[#0B758C] to-[#036873]"
                            style={{ width: '65%' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl border bg-[#111] border-[#036873]/30">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#0B758C]" />
                        Rendimiento por miembro
                      </h3>
                      <div className="space-y-4">
                        {integrantes.map((integrante, idx) => {
                          const usuario = integrante.usuario || {};
                          return (
                            <div key={idx}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{usuario.username || 'Usuario'}</span>
                                <span className="text-sm">{(Math.random() * 100).toFixed(0)}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-700 rounded-full">
                                <div
                                  className="h-2 rounded-full bg-[#036873]"
                                  style={{ width: `${Math.random() * 100}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};