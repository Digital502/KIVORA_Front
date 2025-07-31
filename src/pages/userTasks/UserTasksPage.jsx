import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Calendar,
  User,
  Tag,
  ChevronRight,
  Filter,
  RefreshCw
} from 'lucide-react';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { SidebarUser } from '../../components/navs/SidebarUser';
import { FooterHome } from '../../components/footer/FooterHome';
import { useUserTasks } from '../../shared/hooks/useUserTasks';
import { LoadingSpinner } from '../../components/loadingSpinner/LoadingSpinner';
import { TaskCard } from '../../components/task/TaskCard';
import { TaskStats } from '../../components/task/TaskStats';

export const UserTasksPage = () => {
  const { 
    tasks, 
    loading, 
    error, 
    fetchUserTasks, 
    updateTaskState, 
    getPendingTasks, 
    getReviewTasks, 
    getCompletedTasks 
  } = useUserTasks();
  
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);

  const getStateIcon = (state) => {
    switch (state) {
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'Late':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'In Review':
        return <Eye className="w-4 h-4 text-yellow-400" />;
      case 'finalized':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Late':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'In Review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'finalized':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case 'pending':
        return getPendingTasks();
      case 'review':
        return getReviewTasks();
      case 'completed':
        return getCompletedTasks();
      default:
        return tasks;
    }
  };

  const handleStateChange = async (taskId, newState) => {
    try {
      await updateTaskState(taskId, newState);
    } catch (err) {
      console.error('Error updating task state:', err);
    }
  };

  const filters = [
    { key: 'all', label: 'Todas', count: tasks.length },
    { key: 'pending', label: 'Pendientes', count: getPendingTasks().length },
    { key: 'review', label: 'En Revisión', count: getReviewTasks().length },
    { key: 'completed', label: 'Completadas', count: getCompletedTasks().length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white">
        <NavbarDashboard />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
        <FooterHome />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white">
      <NavbarDashboard />
      
      <div className="flex flex-col lg:flex-row flex-1">
        <div className="hidden lg:block">
          <SidebarUser />
        </div>

        <main className="flex-1 py-6 px-4 sm:py-8 sm:px-6 lg:py-10 lg:px-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mis Tareas</h1>
              <p className="text-gray-400">Gestiona y organiza tus tareas asignadas</p>
            </div>
            <button
              onClick={fetchUserTasks}
              className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-[#036873] hover:bg-[#0B758C] rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>

          {/* Task Statistics */}
          <TaskStats tasks={tasks} />

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-[#036873] border-[#036873] text-white'
                    : 'bg-transparent border-[#036873]/30 text-gray-400 hover:border-[#036873]/50'
                }`}
              >
                <Filter className="w-4 h-4" />
                {filter.label}
                <span className="bg-[#0B758C]/20 text-[#0B758C] px-2 py-0.5 rounded text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Tasks Grid */}
          {getFilteredTasks().length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {activeFilter === 'all' ? 'No tienes tareas asignadas' : `No hay tareas ${filters.find(f => f.key === activeFilter)?.label.toLowerCase()}`}
              </h3>
              <p className="text-gray-500">
                {activeFilter === 'all' 
                  ? 'Cuando te asignen tareas aparecerán aquí'
                  : 'Cambia el filtro para ver otras tareas'
                }
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredTasks().map((task, index) => (
                <motion.div
                  key={task.uid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard 
                    task={task}
                    onTaskClick={setSelectedTask}
                    onStateChange={handleStateChange}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111111] border border-[#036873]/30 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold mb-2">{selectedTask.title}</h2>
                <div className="flex items-center gap-3">
                  {getStateIcon(selectedTask.state)}
                  <span className={`text-xs px-2 py-1 rounded border ${getStateColor(selectedTask.state)}`}>
                    {selectedTask.state}
                  </span>
                  {selectedTask.isUrgent && (
                    <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-1 rounded text-xs">
                      Urgente
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-gray-400">{selectedTask.description}</p>
              </div>

              {selectedTask.comment && (
                <div>
                  <h3 className="font-semibold mb-2">Comentarios</h3>
                  <p className="text-gray-400 bg-[#0D0D0D] p-3 rounded-lg">
                    {selectedTask.comment}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedTask.project && (
                  <div>
                    <h3 className="font-semibold mb-2">Proyecto</h3>
                    <p className="text-gray-400">{selectedTask.project.title}</p>
                  </div>
                )}
                {selectedTask.sprint && (
                  <div>
                    <h3 className="font-semibold mb-2">Sprint</h3>
                    <p className="text-gray-400">Sprint {selectedTask.sprint.number}</p>
                  </div>
                )}
              </div>

              {selectedTask.tags && selectedTask.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#036873]/20 text-[#0B758C] px-2 py-1 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Archivos Adjuntos</h3>
                  <div className="space-y-2">
                    {selectedTask.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-[#0D0D0D] rounded border border-[#036873]/20"
                      >
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{attachment}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              {selectedTask.state === 'In Progress' && (
                <button
                  onClick={() => {
                    handleStateChange(selectedTask.uid, 'In Review');
                    setSelectedTask(null);
                  }}
                  className="flex-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 py-2 px-4 rounded-lg hover:bg-yellow-500/30 transition-colors"
                >
                  Enviar a Revisión
                </button>
              )}
              {selectedTask.state === 'Late' && (
                <button
                  onClick={() => {
                    handleStateChange(selectedTask.uid, 'In Progress');
                    setSelectedTask(null);
                  }}
                  className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 py-2 px-4 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Reanudar Trabajo
                </button>
              )}
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 border border-[#036873]/30 rounded-lg hover:border-[#036873]/50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <FooterHome />
    </div>
  );
};
