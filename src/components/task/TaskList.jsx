import { useState, useEffect, useCallback } from 'react';
import { useProjectView } from '../../shared/hooks/useProjectView';
import { useSprintForm } from '../../shared/hooks/useSprintForm';
import { 
  Check, AlertTriangle, Tag, Paperclip, Search, ChevronDown, ChevronUp, 
  Edit, Trash2, User, Plus, MessageCircle, Download 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectTasks } from '../../shared/hooks/useTasks';
import { TaskEditModal } from '../task/TaskEditModal';
import { TaskForm } from '../task/TaskForm';

export const TaskList = ({ proyecto, integrantes }) => {
  const { projectId, isScrumMaster, myUser } = useProjectView(proyecto);
  const { sprintsList, obtenerSprints } = useSprintForm();
  const { 
    handleDeleteTask,
    handleDeleteTaskAttachments,
    handleQuickAction,
    handleUpdateTask,
  } = useProjectTasks(projectId);
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllTasks, setShowAllTasks] = useState(false);
  
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editMode, setEditMode] = useState('full');
  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteAttachmentModalOpen, setDeleteAttachmentModalOpen] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const stateOptions = ["Late", "In Progress", "In Review", "finalized"];
  const [selectedState, setSelectedState] = useState('');
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState('');
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [attachmentsToDownload, setAttachmentsToDownload] = useState([]);

  const teamMembers = integrantes?.map(integrante => ({
    _id: integrante.usuario?.uid, 
    name: integrante.usuario?.username,
    email: integrante.usuario?.email
  })).filter(member => member._id) || [];

  const loadSprints = useCallback(async () => {
    if (projectId && loading) {
      try {
        await obtenerSprints(projectId);
      } finally {
        setLoading(false);
      }
    }
  }, [projectId, obtenerSprints, loading]);

  useEffect(() => {
    loadSprints();
  }, [loadSprints]);

    useEffect(() => {
      if (!loading && sprintsList) {
        const allTasks = sprintsList.flatMap(sprint => 
          sprint.task?.map(task => ({
            ...task,
            sprintTitle: sprint.tittle,
            sprintId: sprint._id || sprint.uid, 
         attachments: task.attachments || [],
        attachmentUrls: task.attachmentUrls || []
          })) || []
        );

        const filteredTasks = (isScrumMaster && showAllTasks) 
          ? allTasks 
          : allTasks.filter(task => 
              task.assignedTo?._id === myUser?._id || 
              task.assignedTo === myUser?._id
            );

        setTasks(filteredTasks);
      }
    }, [sprintsList, isScrumMaster, myUser, loading, showAllTasks]);

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
      await obtenerSprints(projectId); 
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
      await obtenerSprints(projectId); 
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

  const filteredTasks = tasks.filter(task => {
  const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        task.description?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesState = selectedState === '' || task.state === selectedState;

  return matchesSearch && matchesState;
  });

  const translateState = (state) => {
    const states = {
      "Late": "Atrasado",
      "In Progress": "En Progreso",
      "In Review": "En Revisión",
      "finalized": "Finalizado"
    };
    return states[state] || state;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0B758C]"></div>
      </div>
    );
  }

  const handleCommentClick = (comment) => {
    setSelectedComment(comment);
    setCommentModalOpen(true);
  };

  const handleDownloadClick = (task) => {
    setAttachmentsToDownload({
      task,
      attachments: task.attachments || [],
      urls: task.attachmentUrls || []
    });
    setDownloadModalOpen(true);
  };

  const handleDownloadFile = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

return (
  <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white">
    <div className="flex justify-center py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#036873]/30 shadow-md p-4 sm:p-6 bg-[#111111]"
      >
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Lista de Tareas</h1>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-2.5 md:-translate-y-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar tarea..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1e1e1e] border border-[#036873]/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B758C]"
            />
          </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1e1e1e] border border-[#036873]/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B758C]"
                >
                  <option value="">Todos</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>
                      {translateState(state)}
                    </option>
                  ))}
                </select>
              </div>

              {isScrumMaster && (
                <div className="flex items-end">
                  <button
                    onClick={() => setShowAllTasks(!showAllTasks)}
                    className="px-2 py-2.5 text-sm bg-[#0B758C] hover:bg-[#0a6a7d] text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    {showAllTasks ? "Mostrar solo mis tareas" : "Mostrar todas"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {isScrumMaster 
                ? "No hay tareas que coincidan con los filtros" 
                : "No tienes tareas asignadas que coincidan con los filtros"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map(task => (
                <motion.div 
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-[#1e1e1e] border border-[#036873]/30 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
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
                    {task.state === "finalized" ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#0B758C]" />
                    )}
                    <p className="font-medium">{task.title}</p>
                    {task.priority && getPriorityBadge(task.priority)}
                  </div>

                  {task.description && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-300 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                        {task.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <h4 className="text-xs text-gray-400">Sprint</h4>
                      <p className="text-xs">{task.sprintTitle || 'Sin sprint'}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-gray-400">Estado</h4>
                      <p className="text-xs capitalize">{translateState(task.state)}</p>
                    </div>
                  </div>

                  {(isScrumMaster || isAssignedToCurrentUser(task.assignedTo)) && task.assignedTo && (
                    <p className="text-xs text-gray-400 mb-3">
                      Asignado a:{" "}
                      <strong>
                        {getAssignedUserName(task.assignedTo)}
                        {isAssignedToCurrentUser(task.assignedTo) ? " (Te pertenece)" : ""}
                      </strong>{" "}
                      {isScrumMaster && `(${getAssignedUserEmail(task.assignedTo)})`}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    {task.attachments?.length > 0 && (
                      <div className="flex flex-col gap-1 w-full sm:w-auto">
                        {task.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <button 
                              onClick={() => handleDeleteAttachmentClick(task, attachment)}
                              className="p-1 rounded hover:bg-yellow-500/20 text-yellow-500 flex items-center gap-1"
                              title="Eliminar este archivo"
                              disabled={!isAssignedToCurrentUser(task.assignedTo) && !isScrumMaster}
                            >
                              <Paperclip className="w-4 h-4" />
                              <span className="text-xs truncate max-w-[120px]">
                                {attachment.split('/').pop()}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
            
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                      {(isScrumMaster || isAssignedToCurrentUser(task.assignedTo)) && (
                        <>
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
                        {isScrumMaster && task.state === "In Review" && (
                          <button 
                            onClick={() => handleQuickActionClick(task, 'calificar')}
                            className="p-1 rounded hover:bg-indigo-500/20 text-indigo-500"
                            title="Calificar entrega"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {task.comment && (
                        <button 
                          onClick={() => handleCommentClick(task.comment)}
                          className="p-1 rounded hover:bg-blue-500/20 text-blue-500"
                          title="Ver comentario del Scrum Master"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      )}
                      {task.attachments?.length > 0 && (
                          <button
                            onClick={() => handleDownloadClick(task)}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1"
                          >
                            <Download className="w-4 h-4" />
                            Descargar archivos
                          </button>
                      )}

                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>

    <TaskForm
      isOpen={taskFormOpen}
      onClose={() => setTaskFormOpen(false)}
      projectId={projectId}
      teamMembers={teamMembers}
      onTaskCreated={() => {
        obtenerSprints(projectId);
        setTaskFormOpen(false);
      }}
    />

<TaskEditModal
  isOpen={editTaskModalOpen}
  onClose={() => setEditTaskModalOpen(false)}
  task={taskToEdit}
  mode={editMode}
  teamMembers={teamMembers}
  onSubmit={async (data) => {
    await handleUpdateTask(data);
    await obtenerSprints(projectId); // Recarga los datos
  }}
  onQuickAction={async (mode, taskId, data) => {
    await handleQuickAction(mode, taskId, data);
    await obtenerSprints(projectId); // Recarga los datos
  }}
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

      <AnimatePresence>
        {downloadModalOpen && (
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
              className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full border border-[#0B758C]"
            >
              <div className="text-center">
                <Download className="w-12 h-12 mx-auto text-[#0B758C] mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Descargar Archivos</h3>
                <p className="text-gray-300 mb-4">Selecciona el archivo que deseas descargar:</p>
                
                <div className="max-h-60 overflow-y-auto mb-6">
                  {attachmentsToDownload.urls?.map((url, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-[#2e2e2e] rounded">
                      <span className="text-sm text-gray-300 truncate max-w-[200px]">
                        {attachmentsToDownload.attachments[index]?.split('/').pop()}
                      </span>
                      <button
                        onClick={() => handleDownloadFile(
                          url, 
                          attachmentsToDownload.attachments[index]?.split('/').pop()
                        )}
                        className="p-1 rounded hover:bg-[#0B758C]/20 text-[#0B758C]"
                        title="Descargar archivo"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={() => setDownloadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#0B758C] hover:bg-[#0a6a7d] text-white transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


    <AnimatePresence>
      {commentModalOpen && (
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
            className="bg-[#1e1e1e] rounded-xl p-6 max-w-md w-full border border-[#0B758C]"
          >
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto text-[#0B758C] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Comentario del Scrum Master</h3>
              <p className="text-gray-300 mb-6 whitespace-pre-wrap">
                {selectedComment || "No hay comentario disponible"}
              </p>
              
              <button
                onClick={() => setCommentModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#0B758C] hover:bg-[#0a6a7d] text-white transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
   </div>
 
  );
};