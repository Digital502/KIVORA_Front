import { useState, useEffect, Fragment  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Check, Settings, Plus, Edit, Trash2, Paperclip, User, AlertTriangle, Tag, Search  } from 'lucide-react';
import { useSprintForm } from '../../shared/hooks/useSprintForm';
import { useProjectView } from '../../shared/hooks/useProjectView';
import { useProjectBacklog } from '../../shared/hooks/useBacklog';
import { format } from 'date-fns';
import { SprintForm } from './SprintForm';
import toast from 'react-hot-toast';
import { TaskForm  } from '../task/TaskForm';
import { TaskEditModal } from '../task/TaskEditModal';
import { useProjectTasks } from '../../shared/hooks/useTasks';


export const SprintTable = ({ proyecto, integrantes  }) => {
  const { 
    sprintsList, 
    isLoading, 
    error, 
    obtenerSprints, 
    eliminarSprint,
    removerBacklogDeSprint,
    agregarBacklogASprint
  } = useSprintForm();


  const { projectId, isScrumMaster, myUser } = useProjectView(proyecto);
  const { backlogs: allBacklogs, loadingList } = useProjectBacklog(projectId);
  
  const [expandedSprint, setExpandedSprint] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState(null);
  const [sprintToDelete, setSprintToDelete] = useState(null);
  const [addBacklogModalOpen, setAddBacklogModalOpen] = useState(false);
  const [selectedBacklogToAdd, setSelectedBacklogToAdd] = useState(null);
  const [backlogToRemove, setBacklogToRemove] = useState(null);
  const [removeBacklogModalOpen, setRemoveBacklogModalOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [sprintParaTarea, setSprintParaTarea] = useState(null);
  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [deleteAttachmentModalOpen, setDeleteAttachmentModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editMode, setEditMode] = useState('full');

  useEffect(() => {
    if (projectId) {
      obtenerSprints(projectId);
    }
  }, [projectId]);

  const handleTareaCreada = async () => {
    await obtenerSprints(projectId);
    setTaskFormOpen(false);
    setSprintParaTarea(null);
  };

  const { 
    handleDeleteTask,
    handleDeleteTaskAttachments,
    handleQuickAction,
    handleUpdateTask ,
  } = useProjectTasks(projectId);

  const teamMembers = integrantes?.map(integrante => ({
    _id: integrante.usuario?.uid, 
    name: integrante.usuario?.username,
    email: integrante.usuario?.email
  })).filter(member => member._id) || [];

  const handleDeleteTaskClick = (task) => {
    setTaskToDelete(task);
    setDeleteTaskModalOpen(true);
  };

const handleDeleteAttachmentClick = (task, attachment) => {
  setAttachmentToDelete({ 
    task, 
    attachment 
  });
  setDeleteAttachmentModalOpen(true);
};

const handleConfirmDeleteTask = async () => {
    if (taskToDelete) {
      await handleDeleteTask(taskToDelete._id);
      setDeleteTaskModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleConfirmDeleteAttachment = async () => {
    if (attachmentToDelete) {
      await handleDeleteTaskAttachments(
        attachmentToDelete.task._id, 
        attachmentToDelete.attachment 
      );
      setDeleteAttachmentModalOpen(false);
      setAttachmentToDelete(null);
    }
  };
  const handleQuickActionClick = (task, action) => {
    setTaskToEdit(task);
    setEditMode(action);
    setEditTaskModalOpen(true);
  };

  const handleFullEditClick = (task) => {
    setTaskToEdit(task);
    setEditMode('full');
    setEditTaskModalOpen(true);
  };

  const toggleSprint = (sprintId) => {
    setExpandedSprint(prev => (prev === sprintId ? null : sprintId));
  };

  const handleEditSprint = (sprint) => {
    setSelectedSprint(sprint);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (sprint) => {
    setSprintToDelete(sprint);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (sprintToDelete) {
      const success = await eliminarSprint(sprintToDelete.uid);
      if (success) {
        await obtenerSprints(projectId);
      }
      setDeleteModalOpen(false);
      setSprintToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setSprintToDelete(null);
  };

  const handleSprintUpdated = () => {
    obtenerSprints(projectId);
    setEditModalOpen(false);
  };

  const handleRemoveBacklogClick = (sprintId, backlogId) => {
    setBacklogToRemove({ sprintId, backlogId });
    setRemoveBacklogModalOpen(true);
  };

  const handleConfirmRemoveBacklog = async () => {
    if (backlogToRemove) {
      await removerBacklogDeSprint(backlogToRemove.sprintId, backlogToRemove.backlogId);
      await obtenerSprints(projectId);
      setRemoveBacklogModalOpen(false);
      setBacklogToRemove(null);
    }
  };

  const handleCancelRemoveBacklog = () => {
    setRemoveBacklogModalOpen(false);
    setBacklogToRemove(null);
  };

  const [busquedaTarea, setBusquedaTarea] = useState('');
  const [prioridadFiltro, setPrioridadFiltro] = useState(''); 

  const handleAddBacklogClick = (sprint) => {
    const availableBacklogs = getAvailableBacklogs(sprint);
    if (availableBacklogs.length === 0) {
      toast("No hay backlogs disponibles para agregar", {
        icon: "⚠️"
      });
      return;
    }
    setSelectedSprint(sprint);
    setAddBacklogModalOpen(true);
  };

  const handleAddBacklogToSprint = async (backlogId) => {
    if (selectedSprint && backlogId) {
      await agregarBacklogASprint(selectedSprint.uid, backlogId);
      await obtenerSprints(projectId);
      setAddBacklogModalOpen(false);
      setSelectedBacklogToAdd(null);
    }
  };

  const getAvailableBacklogs = (sprint) => {
    if (!allBacklogs || !sprint) return [];
    return allBacklogs.filter(backlog => 
      backlog.status && 
      backlog.state === 'Pending' && 
      !sprint.backlog.includes(backlog.uid)
    );
  };

const handleAgregarTarea = (sprint) => {
  setSprintParaTarea(sprint);
  setTaskFormOpen(true);
};

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      1: { text: 'Alta', color: 'bg-red-500' },
      2: { text: 'Media', color: 'bg-yellow-500' },
      3: { text: 'Baja', color: 'bg-green-500' }
    };
    
    const { text, color } = priorityMap[priority] || { text: 'Desconocida', color: 'bg-gray-500' };
    
    return (
      <span className={`${color} text-xs text-white px-2 py-1 rounded-full`}>
        {text}
      </span>
    );
  };

  const getBacklogTitle = (backlogId) => {
    const backlog = allBacklogs.find(b => b.uid === backlogId);
    return backlog ? backlog.title : 'Backlog';
  };

const getAssignedUserName = (assignedTo) => {
  if (typeof assignedTo === 'object') return assignedTo.name || assignedTo.username;
  const member = teamMembers.find(m => m._id === assignedTo);
  return member?.name || 'Usuario desconocido';
};

const getAssignedUserEmail = (assignedTo) => {
  if (typeof assignedTo === 'object') return assignedTo.email;
  const member = teamMembers.find(m => m._id === assignedTo);
  return member?.email || '';
};

const isAssignedToCurrentUser = (assignedTo) => {
  if (!myUser) return false;
  if (typeof assignedTo === 'object') return assignedTo._id === myUser._id;
  return assignedTo === myUser._id;
};


  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0B758C]"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          {sprintsList?.map(sprint => (
            <motion.div 
              key={sprint.uid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border overflow-hidden bg-[#111] border-[#036873]/30"
            >
              <div className="w-full p-5 flex justify-between items-center hover:bg-[#036873]/10">
                <button 
                  onClick={() => toggleSprint(sprint.uid)}
                  className="flex-1 text-left flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg text-white">{sprint.tittle}</h3>
                    <p className="text-sm text-gray-400">
                      {format(new Date(sprint.dateStart), 'dd/MM/yyyy')} - {format(new Date(sprint.dateEnd), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  {expandedSprint === sprint.uid ? (
                    <ChevronUp className="w-5 h-5 text-white" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white" />
                  )}
                </button>

                {isScrumMaster && (
                  <div className="flex gap-2 ml-4">
                    <motion.button
                      onClick={() => handleEditSprint(sprint)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full hover:bg-[#036873]/20 text-[#0B758C]"
                      title="Editar sprint"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeleteClick(sprint)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full hover:bg-red-500/20 text-red-500"
                      title="Eliminar sprint"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
              </div>
              
              <AnimatePresence>
                {expandedSprint === sprint.uid && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-5 border-t border-[#036873]/30 text-white">
                      {sprint.objective && (
                        <>
                          <h4 className="font-medium text-sm text-gray-400 mb-2">Objetivo</h4>
                          <p className="mb-6">
                            {sprint.objective}
                          </p>
                        </>
                      )}
                      
                      <h4 className="font-medium mb-2">Backlogs del Sprint</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sprint.backlog?.length > 0 ? (
                          allBacklogs
                            .filter(backlog => sprint.backlog.includes(backlog.uid))
                            .map(backlog => (
                              <div 
                                key={backlog.uid}
                                className="p-4 rounded-2xl bg-[#1e1e1e] border border-[#036873]/30 shadow-md hover:shadow-lg transition-all duration-300"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{backlog.title}</span>
                                  {getPriorityBadge(backlog.priority)}
                                </div>
                                <br />
                                {isScrumMaster && (
                                  <button
                                    onClick={() => handleRemoveBacklogClick(sprint.uid, backlog.uid)}
                                    className="text-red-500 hover:text-red-400 p-1"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))
                        ) : (
                          <p className="text-sm text-gray-400 italic">No hay backlogs en este sprint</p>
                        )}
                      </div>
                      <br/>
                      <h4 className="font-medium mb-4">Tareas del Sprint</h4>
                      <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Buscar tarea..."
                          value={busquedaTarea}
                          onChange={(e) => setBusquedaTarea(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-[#1e1e1e] border border-[#036873]/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B758C]"
                        />
                      </div>
                      <br />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(() => {
                          const tareasFiltradas = (isScrumMaster
                            ? sprint.task
                            : sprint.task?.filter(task => task.assignedTo?._id === myUser?._id)
                          )?.filter(task => {
                            const coincideBusqueda = task.title.toLowerCase().includes(busquedaTarea.toLowerCase()) || 
                                                    task.description?.toLowerCase().includes(busquedaTarea.toLowerCase());
                            const coincidePrioridad = prioridadFiltro ? task.priority?.toString() === prioridadFiltro : true;
                            return coincideBusqueda && coincidePrioridad;
                          });

                          if (!tareasFiltradas || tareasFiltradas.length === 0) {
                            return (
                              <p className="text-sm text-gray-400 italic">
                                {isScrumMaster
                                  ? "No hay tareas en este sprint"
                                  : "No tienes tareas asignadas en este sprint"}
                              </p>
                            );
                          }

                        return tareasFiltradas.map(task => (
                          <div
                            key={task._id}
                            className="p-4 rounded-2xl bg-[#1e1e1e] border border-[#036873]/30 shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {/* Mostrar tags */}
                              {task.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {task.tags.map((tag, index) => (
                                    <span 
                                      key={index} 
                                      className="text-xs bg-[#036873]/30 text-white px-2 py-1 rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {task.isUrgent && (
                                <span className="flex items-center gap-1 text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
                                  <AlertTriangle className="w-3 h-3" />
                                  Urgente
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-3 mb-2">
                              {task.state === "Completed" ? (
                                <Check className="w-5 h-5 text-green-500" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-[#0B758C]" />
                              )}
                              <p className="font-medium">{task.title}</p>
                            </div>

                            {/* Tercera línea: Descripción */}
                            {task.description && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-300 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                                  {task.description}
                                </p>
                              </div>
                            )}

                            {/* Cuarta línea: Información de asignación */}
                            {isScrumMaster && task.assignedTo && (
                              <p className="text-xs text-gray-400 mb-2">
                                Asignado a:{" "}
                                <strong>
                                  {getAssignedUserName(task.assignedTo)}
                                  {isAssignedToCurrentUser(task.assignedTo) ? " (Te pertenece)" : ""}
                                </strong>{" "}
                                ({getAssignedUserEmail(task.assignedTo)})
                              </p>
                            )}

                            {/* Quinta línea: Botones y adjuntos */}
                            <div className="flex justify-between items-center">
                              {/* Adjuntos con botón de eliminar */}
                              {task.attachments?.length > 0 && (
                                <div className="flex flex-col gap-1">
                                  {task.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <button 
                                        onClick={() => handleDeleteAttachmentClick(task, attachment)}
                                        className="p-1 rounded hover:bg-yellow-500/20 text-yellow-500 flex items-center gap-1"
                                        title="Eliminar este archivo"
                                      >
                                        <Paperclip className="w-4 h-4" />
                                        <span className="text-xs">
                                          {attachment.split('/').pop()}
                                        </span>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {/* Botones de acciones (solo para Scrum Master) */}
                        {(isScrumMaster || isAssignedToCurrentUser(task.assignedTo)) && (
                          <div className="flex gap-2">
                            {isScrumMaster && (
                              <>
                                <button 
                                  onClick={() => handleFullEditClick(task)}
                                  className="p-1 rounded hover:bg-blue-500/20 text-blue-500"
                                  title="Editar tarea"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleQuickActionClick(task, 'reassign')}
                                  className="p-1 rounded hover:bg-purple-500/20 text-purple-500"
                                  title="Reasignar tarea"
                                >
                                  <User className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleQuickActionClick(task, 'urgent')}
                                  className="p-1 rounded hover:bg-orange-500/20 text-orange-500"
                                  title="Marcar como urgente"
                                >
                                  <AlertTriangle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleQuickActionClick(task, 'tags')}
                                  className="p-1 rounded hover:bg-green-500/20 text-green-500"
                                  title="Editar etiquetas"
                                >
                                  <Tag className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteTaskClick(task)}
                                  className="p-1 rounded hover:bg-red-500/20 text-red-500"
                                  title="Eliminar tarea"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            {/* Subir archivo (entregar tarea) - visible para asignado o scrum */}
                              {task.attachments?.length >= 4 ? (
                                <div className="p-1 text-xs text-yellow-500" title="Máximo 4 archivos permitidos">
                                  <Paperclip className="w-4 h-4 opacity-50" />
                                </div>
                              ) : (
                                <button 
                                  onClick={() => handleQuickActionClick(task, 'attach')}
                                  className="p-1 rounded hover:bg-blue-500/20 text-blue-500"
                                  title="Entregar tarea"
                                >
                                  <Paperclip className="w-4 h-4" />
                                </button>
                              )}
                          </div>
                        )}

                            </div>
                          </div>
                        ))
                        })()}
                      </div>

                      
                      {isScrumMaster && (
                        <div className="flex gap-2 mt-4">
                          <button 
                            className="px-3 py-1 text-sm bg-[#0B758C] hover:bg-[#0a6a7d] text-white rounded-lg flex items-center gap-2"
                            onClick={() => handleAddBacklogClick(sprint)}
                          >
                            <Plus className="w-4 h-4" />
                            Agregar Backlog
                          </button>
                        <button 
                          className="px-3 py-1 text-sm bg-[#0B758C] hover:bg-[#0a6a7d] text-white rounded-lg flex items-center gap-2"
                          onClick={() => handleAgregarTarea(sprint)}
                        >
                          <Plus className="w-4 h-4" />
                          Agregar Tarea
                        </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      <SprintForm 
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSprintCreated={handleSprintUpdated}
        proyecto={proyecto}
        sprintToEdit={selectedSprint}
      />


      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        sprint={sprintParaTarea}
        projectId={projectId}
        teamMembers={teamMembers}
        onTaskCreated={handleTareaCreada} 
      />

      <TaskEditModal
        isOpen={editTaskModalOpen}
        onClose={() => setEditTaskModalOpen(false)}
        task={taskToEdit}
        mode={editMode}
        teamMembers={teamMembers}
        onSubmit={handleUpdateTask}
        onQuickAction={handleQuickAction}
      />

      <AnimatePresence>
        {deleteTaskModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full border border-red-500/30"
            >
              <div className="text-center">
                <Trash2 className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Tarea?</h3>
                <p className="text-gray-300 mb-6">
                  ¿Estás seguro de que deseas eliminar la tarea "{taskToDelete?.title}"? 
                  Esta acción no se puede deshacer.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setDeleteTaskModalOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDeleteTask}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    <AnimatePresence>
    {deleteAttachmentModalOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full border border-yellow-500/30"
        >
          <div className="text-center">
            <Paperclip className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Archivo Adjunto?</h3>
            <p className="text-gray-300 mb-6">
              ¿Estás seguro de que deseas eliminar el archivo "{attachmentToDelete?.attachment?.split('/').pop()}"?
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteAttachmentModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteAttachment}
                className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white transition-colors flex items-center gap-2"
              >
                <Paperclip className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
    </AnimatePresence>

      {/* Modal de confirmación para eliminar sprint */}
      <AnimatePresence>
        {deleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full border border-red-500/30"
            >
              <div className="text-center">
                <Trash2 className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Sprint?</h3>
                <p className="text-gray-300 mb-6">
                  ¿Estás seguro de que deseas eliminar el sprint "{sprintToDelete?.tittle}"? Esta acción no se puede deshacer.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para agregar backlog */}
      <AnimatePresence>
        {addBacklogModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
            onClick={() => setAddBacklogModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full border border-[#036873]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">Agregar Backlog al Sprint</h3>
                <p className="text-gray-300 mb-4">Selecciona un backlog para agregar</p>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {loadingList ? (
                    <div className="text-center text-gray-400">Cargando backlogs...</div>
                  ) : getAvailableBacklogs(selectedSprint).length === 0 ? (
                    <div className="text-center text-gray-400">No hay backlogs disponibles</div>
                  ) : (
                    getAvailableBacklogs(selectedSprint).map(backlog => (
                      <div 
                        key={backlog.uid}
                        className={`p-3 rounded-md cursor-pointer ${selectedBacklogToAdd === backlog.uid ? 'bg-[#036873]/30' : 'bg-[#222] hover:bg-[#036873]/20'}`}
                        onClick={() => setSelectedBacklogToAdd(backlog.uid)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{backlog.title}</span>
                          {getPriorityBadge(backlog.priority)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setAddBacklogModalOpen(false);
                    setSelectedBacklogToAdd(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleAddBacklogToSprint(selectedBacklogToAdd)}
                  disabled={!selectedBacklogToAdd}
                  className="px-4 py-2 rounded-lg bg-[#0B758C] hover:bg-[#0a6a7d] text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de confirmación para eliminar backlog */}
      <AnimatePresence>
        {removeBacklogModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full border border-red-500/30"
            >
              <div className="text-center">
                <Trash2 className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">¿Remover Backlog?</h3>
                <p className="text-gray-300 mb-6">
                  ¿Estás seguro de que deseas remover el backlog "{getBacklogTitle(backlogToRemove?.backlogId)}" del sprint? Esta acción no se puede deshacer.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleCancelRemoveBacklog}
                    className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmRemoveBacklog}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remover
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};