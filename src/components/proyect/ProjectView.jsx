import { useState, useEffect } from 'react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectView } from '../../shared/hooks/useProjectView';
import { NavbarDashboard } from "../navs/NavbarDashboard";
import { TaskList } from '../task/TaskList.jsx';
import {
  CalendarCheck, ListChecks, Users, Clock, ChevronDown, ChevronUp,
  Plus, Check, X, Calendar, AlertCircle, GitBranch, Settings,
  ArrowRight, Loader2, KanbanSquare, PieChart, Shield, User2, Star,
  History, LogOut, UserCircle, Download, RefreshCw, Trash2, PhoneCall
} from 'lucide-react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
import { SprintTable } from "../sprint/SprintTable.jsx";
import { SpintCalendar } from '../sprint/SprintCalendar.jsx';
import { useSprintForm } from '../../shared/hooks/useSprintForm.jsx';
import { useProjectStatistics  } from '../../shared/hooks/useClusterStatistics';
import { FormEvent } from '../event/FormEvent.jsx';
import { ListEvent } from '../event/ListEvent.jsx';
import { useEvent } from '../../shared/hooks/useEvent.jsx';

const locales = { 'es': esLocale };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export const ProjectView = () => {
  const { state } = useLocation();
  const { proyecto, integrantes } = state || {};
  const { isScrumMaster, isProductOwner, projectId } = useProjectView(proyecto);
  const { estadisticas, isLoadingStats, obtenerEstadisticas } = useProjectStatistics();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('backlog');
  const [showBacklogModal, setShowBacklogModal] = useState(false);
  const [expandedSprints, setExpandedSprints] = useState({});
  const [showSprintForm, setShowSprintForm] = useState(false);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [showFormEvent, setShowFormEvent] = useState(false);
  const [eventoParaEditar, setEventoParaEditar] = useState(null);

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
  } = useProjectBacklog(projectId, proyecto?.title);

  const {
    obtenerEventos
  } = useEvent();

  function handleLogout() {
    if (localStorage.getItem("user")) {
      localStorage.removeItem("user");
    }
    navigate("/login");
  }

  useEffect(() => {
    if (projectId) {
      obtenerEstadisticas(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (proyecto) {
        const calendarEvents = [
          {
            title: 'Inicio del proyecto',
            start: new Date(proyecto.startDate),
            end: new Date(proyecto.startDate),
            allDay: true,
            color: '#0B758C'
          },
          ...(sprintsList || []).map(sprint => ({
            title: sprint.name,
            start: sprint.startDate,
            end: sprint.endDate,
            allDay: true,
            color: '#639FA6'
          }))
        ];
        setEvents(calendarEvents);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [proyecto, sprintsList]);

  useEffect(() => {
    if (projectId) {
      obtenerSprints(projectId);
    }
  }, [projectId]);

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

  const ProgressDonut = ({ percentage }) => {
  // Tamaño 60x60 px
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percentage / 100);

  return (
    <svg width={60} height={60} viewBox="0 0 60 60">
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke="#222"
        strokeWidth="6"
      />
      <circle
        cx="30"
        cy="30"
        r={radius}
        fill="none"
        stroke="#0B758C"
        strokeWidth="6"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 30 30)"
      />
      <text
        x="30"
        y="34"
        textAnchor="middle"
        fontSize="14"
        fill="#0B758C"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        {percentage.toFixed(0)}%
      </text>
    </svg>
  );
};

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
  <div className="bg-[#0D0D0D] text-white min-h-screen flex flex-col">
    <NavbarDashboard />

    {/* Layout principal */}
    <div className="flex flex-1 overflow-x-hidden">
      {/* Contenido principal */}
      <main className="flex-1 p-0 sm:p-4 md:p-6 lg:p-8 pb-8 sm:pb-12 md:pb-16 lg:pb-8 relative">
        {/* Contenido del proyecto */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-4 p-4  sm:px-6  lg:px-8">
            {/* Header del proyecto */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 sm:mb-10 md:mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-1 sm:mb-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] via-[#639FA6] to-[#036873]">
                      {proyecto.title}
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-3xl">
                    {proyecto.description}
                  </p>
                </div>

                {isScrumMaster && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 bg-gradient-to-r from-[#0B758C] to-[#036873] text-white rounded-lg flex items-center gap-1 sm:gap-2 w-max text-xs sm:text-sm md:text-base"
                  >
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span>Scrum Master</span>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl bg-[#111] border border-[#036873]/30 shadow-md">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Fecha inicio</p>
                  <p className="font-medium text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                    <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B758C]" />
                    {new Date(proyecto.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Fecha fin</p>
                  <p className="font-medium text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                    <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B758C]" />
                    {new Date(proyecto.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Tipo</p>
                  <p className="font-medium text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                    <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B758C]" />
                    {proyecto.projectType}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Miembros</p>
                  <p className="font-medium text-sm sm:text-base flex items-center gap-1 sm:gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B758C]" />
                    {integrantes.length}
                  </p>
                </div>
              </div>
            </motion.header>

<div className="mb-4 sm:mb-6 border-b border-[#036873]/20">
  <nav className="flex sm:flex-row flex-col sm:space-x-4 space-y-2 sm:space-y-0">
    <div className="sm:hidden">
      <select
        className={`py-2 px-3 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-[#0B758C] to-[#036873] text-white 
          border-none hover:brightness-110 transition focus:outline-none`}
        value={activeTab}
        onChange={(e) => setActiveTab(e.target.value)}
      >
        {[
          { id: 'backlog', name: 'Backlog' },
          { id: 'sprints', name: 'Sprints' },
          { id: 'meet', name: 'Reuniones' },
          { id: 'calendar', name: 'Calendario' },
          { id: 'members', name: 'Miembros' },
          ...(isScrumMaster ? [{ id: 'reports', name: 'Reportes' }] : [])
        ].map((tab) => (
          <option
            key={tab.id}
            value={tab.id}
            className={`py-2 text-sm ${activeTab === tab.id ? 'bg-[#036873] text-black' : 'text-black'}`}
          >
            {tab.name}
          </option>
        ))}
      </select>
    </div>

    {/* Botones para pantallas más grandes */}
    <div className="hidden sm:flex space-x-2 sm:space-x-4 min-w-max">
      {[
        { id: 'backlog', name: 'Backlog', icon: <ListChecks className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> },
        { id: 'sprints', name: 'Sprints', icon: <KanbanSquare className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> },
        { id: 'meet', name: 'Reuniones', icon: <PhoneCall className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> },
        { id: 'calendar', name: 'Calendario', icon: <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> },
        { id: 'members', name: 'Miembros', icon: <Users className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> },
        ...(isScrumMaster ? [{ id: 'reports', name: 'Reportes', icon: <PieChart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" /> }] : [])
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-2 px-1 sm:py-3 sm:px-2 md:px-3 border-b-2 font-medium text-xs flex items-center gap-1 sm:gap-2 ${activeTab === tab.id
            ? 'border-[#0B758C] text-[#0B758C]'
            : 'border-transparent hover:border-gray-700 text-gray-400 hover:text-gray-300'}`}
        >
          {tab.icon}
          <span className="whitespace-nowrap">{tab.name}</span>
        </button>
      ))}
    </div>
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
                  <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
                    {/* Contenido para Product Owner */}
                    {isProductOwner && (
                      <>
                        {/* Sección del Backlog para PO */}
                        <section className="mb-6 sm:mb-8">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold flex items-center gap-1 sm:gap-2 md:gap-3">
                              <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#0B758C]" />
                              <span className="text-xs sm:text-sm md:text-base">Backlog</span>
                            </h2>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setShowBacklogModal(true)}
                                className="flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#0B758C] to-[#036873] text-white rounded-lg hover:brightness-110 transition text-xs sm:text-sm"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="whitespace-nowrap">Agregar Item</span>
                              </button>
                              <button
                                onClick={handleExportBacklogPDF}
                                className="flex items-center gap-1 sm:gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#0B758C] to-[#036873] text-white rounded-lg hover:brightness-110 transition text-xs sm:text-sm"
                              >
                                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="whitespace-nowrap">Exportar PDF</span>
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2 sm:space-y-3 md:space-y-4">
                            {(isProductOwner || isScrumMaster) && (
                              <section className="mb-6 sm:mb-8">
                                <ListBacklog
                                  isProductOwner={isProductOwner}
                                  isScrumMaster={isScrumMaster}
                                  backlogs={backlogs}
                                />
                              </section>
                            )}
                          </div>
                        </section>

                        <div className="mb-6 sm:mb-8">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-1 sm:gap-2 md:gap-3">
                            <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#0B758C]" />
                            <span className="text-xs sm:text-sm md:text-base">Mis tareas asignadas</span>
                          </h2>
                          <TaskList proyecto={proyecto} integrantes={integrantes}/>
                        </div>
                      </>
                    )}

                    {/* Contenido para Scrum Master (solo lista de items) */}
                    {isScrumMaster && !isProductOwner && (
                      <section className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-1 sm:gap-2 md:gap-3">
                          <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#0B758C]" />
                          <span className="text-xs sm:text-sm md:text-base">Backlog</span>
                        </h2>
                      </section>
                    )}

                    {/* Contenido para otros roles (solo tareas asignadas) */}
                    {!isProductOwner && !isScrumMaster && (
                      <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 flex items-center gap-1 sm:gap-2 md:gap-3">
                          <ListChecks className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#0B758C]" />
                          <span className="text-xs sm:text-sm md:text-base">Mis tareas asignadas</span>
                        </h2>
                        <TaskList proyecto={proyecto} integrantes={integrantes}/>
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
                        refreshBacklogs(projectId);        
                        setShowBacklogModal(false); 
                      }}
                    />
                  </div>
                )}

                {/* Pestaña Sprints */}
                {activeTab === 'sprints' && (
                  <div>
                    {isScrumMaster && (
                      <div className="flex justify-end mb-4 sm:mb-6">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowSprintForm(true)}
                          className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#0B758C] to-[#036873] text-white rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                          <span className="whitespace-nowrap">Nuevo Sprint</span>
                        </motion.button>

                        <SprintForm 
  isOpen={showSprintForm}
  onClose={() => setShowSprintForm(false)}
  onSprintCreated={(newSprint) => {
    obtenerSprints(projectId); 
  }}
  proyecto={proyecto}
/>
                      </div>
                    )}
<SprintTable 
  proyecto={proyecto} 
  integrantes={integrantes}
  onRefreshSprints={() => obtenerSprints(projectId)}
/>
                  </div>
                )}

                {activeTab =='meet' && (
                  <div>
                  {isScrumMaster && (
                    <div>
                      <div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFormEvent(true)}
                            className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#0B758C] to-[#036873] text-white rounded-lg flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                            <span className="whitespace-nowrap">Nueva Reunión</span>
                          </motion.button>
                          <FormEvent 
                            isOpen={showFormEvent}
                            onClose={() => setShowFormEvent(false)}
                            sprintList={sprintsList}
                            onEventCreated={() => {
                              setShowFormEvent(false);
                              obtenerEventos(); 
                            }}
                          />
                      </div>
                      <br />
                    </div>
                  )}
                  <ListEvent/>
                </div>
                )}
                {/* Pestaña Calendario */}
                {activeTab === 'calendar' && (
                  <div className="overflow-x-auto">
                    <div className="min-w-[300px]">
                      <SpintCalendar sprints={sprintsList}/>
                    </div>
                  </div>
                )}

                {/* Pestaña Miembros */}
                {activeTab === 'members' && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                      {integrantes.map((integrante, idx) => {
                        const usuario = integrante.usuario || {};
                        return (
                          <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border bg-[#111] border-[#036873]/30 shadow-sm"
                          >
                            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                              <div className="relative">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-[#0B758C]/10 flex items-center justify-center">
                                  <User2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#0B758C]" />
                                </div>
                                {integrante.rol === "admin" && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0B758C] flex items-center justify-center">
                                    <Star className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium text-sm sm:text-base">{usuario.username || 'Usuario'}</h3>
                                <p className="text-xs sm:text-sm text-gray-400">
                                  {integrante.rol === "admin" ? "Administrador" : "Miembro"}
                                </p>
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 md:pt-4 border-t border-[#036873]/20">
                              <p className="text-xs sm:text-sm text-gray-400">
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
                  <div className="space-y-8 max-w-7xl mx-auto">
                    <div className="p-6 rounded-xl border bg-[#111] border-[#036873]/30 shadow-md">
                      <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        <PieChart className="w-6 h-6 text-[#0B758C]" />
                        Informe General
                      </h3>

                      {isLoadingStats && <p>Cargando estadísticas...</p>}

                      {estadisticas && estadisticas.informeGeneral ? (
                        <>
                          <ul className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-sm md:text-base">
                            <li>
                              <span className="block font-semibold text-[#0B758C] text-lg">
                                {estadisticas.informeGeneral.totalTareas}
                              </span>
                              Total de tareas
                            </li>
                            <li>
                              <span className="block font-semibold text-green-500 text-lg">
                                {estadisticas.informeGeneral.tareasEntregadas}
                              </span>
                              Entregadas
                            </li>
                            <li>
                              <span className="block font-semibold text-yellow-400 text-lg">
                                {estadisticas.informeGeneral.tareasPendientes}
                              </span>
                              Pendientes
                            </li>
                            <li>
                              <span className="block font-semibold text-[#0B758C] text-lg">
                                {estadisticas.informeGeneral.totalEventos}
                              </span>
                              Eventos
                            </li>
                            <li>
                              <span className="block font-semibold text-[#0B758C] text-lg">
                                {estadisticas.informeGeneral.integrantes}
                              </span>
                              Integrantes
                            </li>
                          </ul>

                          <div className="mt-8" style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                              <AreaChart
                                data={[
                                  { name: 'Tareas Entregadas', value: estadisticas.informeGeneral.tareasEntregadas },
                                  { name: 'Tareas Pendientes', value: estadisticas.informeGeneral.tareasPendientes },
                                  { name: 'Eventos', value: estadisticas.informeGeneral.totalEventos }
                                ]}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                              >
                                <defs>
                                  <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0B758C" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#0B758C" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FFC107" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#FFC107" stopOpacity={0}/>
                                  </linearGradient>
                                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#36B37E" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#36B37E" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="value" stroke="#0B758C" fill="url(#colorDelivered)" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      ) : (
                        !isLoadingStats && <p>No hay datos de informe general.</p>
                      )}
                    </div>

                    <div className="p-6 rounded-xl border bg-[#111] border-[#036873]/30 shadow-md">
                      <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-[#0B758C]" />
                        Informe por usuario
                      </h3>

                      {isLoadingStats && <p>Cargando estadísticas...</p>}

                    {estadisticas?.estadisticasUsuarios?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {estadisticas.estadisticasUsuarios.map((userStat, i) => {
                          if (!userStat?.usuario) return null;

                          const total = userStat.totalTareas || 0;
                          const entregadas = userStat.entregadas || 0;
                          const pendientes = userStat.pendientes || 0;
                          const porcentaje = total === 0 ? 0 : Math.round((entregadas / total) * 100);

                          const initials = userStat.usuario.nombre
                            ? userStat.usuario.nombre
                                .split(' ')
                                .filter(Boolean) 
                                .map(n => n[0]?.toUpperCase() || '')
                                .join('')
                            : 'U';

                            return (
                              <div
                                key={i}
                                className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col max-w-xl mx-auto transition-shadow hover:shadow-2xl"
                              >
                                <div className="flex items-center gap-6 mb-6">
                                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white font-semibold text-xl select-none">
                                    {initials}
                                  </div>
                                  <div>
                                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                      {userStat.usuario.nombre || 'Usuario'}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{userStat.usuario.email}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 text-center mb-8">
                                  <div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{total}</p>
                                    <p className="uppercase text-xs tracking-wide text-gray-500 dark:text-gray-400">Tareas totales</p>
                                  </div>
                                  <div>
                                    <p className="text-3xl font-bold text-green-600">{entregadas}</p>
                                    <p className="uppercase text-xs tracking-wide text-gray-500 dark:text-gray-400">Entregadas</p>
                                  </div>
                                  <div>
                                    <p className="text-3xl font-bold text-yellow-500">{pendientes}</p>
                                    <p className="uppercase text-xs tracking-wide text-gray-500 dark:text-gray-400">Pendientes</p>
                                  </div>
                                </div>

                                <div className="mb-8">
                                  <label htmlFor={`progress-${i}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Progreso de tareas entregadas: {porcentaje}%
                                  </label>
                                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                                    <div
                                      id={`progress-${i}`}
                                      className="h-4 bg-blue-600 dark:bg-blue-500 transition-all duration-500"
                                      style={{ width: `${porcentaje}%` }}
                                    ></div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                                    Detalle por Sprint
                                  </h4>

                                  {Object.entries(userStat.detallePorSprint).length === 0 ? (
                                    <p className="text-gray-500 dark:text-gray-400 italic">No hay tareas asignadas.</p>
                                  ) : (
                                    Object.entries(userStat.detallePorSprint).map(([sprintName, tareas]) => (
                                      <section key={sprintName} className="mb-6 last:mb-0">
                                        <h5 className="text-md font-medium text-blue-600 dark:text-blue-500 mb-4">{sprintName}</h5>
                                        <ul className="space-y-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
                                          {tareas.map((tarea, idx) => (
                                            <li
                                              key={idx}
                                              className="rounded-lg shadow-md overflow-hidden"
                                            >
                                              <div className="bg-[#0B758C] text-white px-4 py-2 font-semibold truncate">
                                                {tarea.titulo}
                                              </div>

                                              <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                                                <span
                                                  className={`font-semibold text-sm ${
                                                    tarea.estado === 'Entregada'
                                                      ? 'text-green-700 dark:text-green-400'
                                                      : 'text-yellow-600 dark:text-yellow-400'
                                                  }`}
                                                >
                                                  {tarea.estado}
                                                </span>
                                                <span className="text-sm text-gray-700 dark:text-gray-300 italic">
                                                  {tarea.proyecto}
                                                </span>
                                              </div>
                                            </li>
                                          ))}
                                        </ul>
                                      </section>
                                    ))
                                  )}
                                </div>

                                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 grid grid-cols-3 gap-6 text-center">
                                  <div>
                                    <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                                      {userStat.eventosParticipados || 0}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Eventos participados</p>
                                  </div>
                                  <div>
                                    <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                                      {userStat.asistencias || 0}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Asistencias</p>
                                  </div>
                                  <div>
                                    <p className="text-xl font-semibold text-cyan-600 dark:text-cyan-400">
                                      {userStat.porcentajeAsistencia || 0}%
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">% Asistencia</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        !isLoadingStats && <p>No hay datos para usuarios.</p>
                      )}
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
