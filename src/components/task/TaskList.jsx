import { useState, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Paperclip, AlertTriangle } from 'lucide-react';
import { useProjectView } from '../../shared/hooks/useProjectView';
import { format } from 'date-fns';
import { TaskForm } from '../task/TaskForm';
import { TaskEditModal } from '../task/TaskEditModal';
import { useProjectTasks } from '../../shared/hooks/useTasks';
import { useSprintForm } from '../../shared/hooks/useSprintForm';

export const TaskList = ({ proyecto, integrantes }) => {
  const { projectId, myUser } = useProjectView(proyecto);
  const { sprintsList, isLoading: sprintsLoading } = useSprintForm();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteAttachmentModalOpen, setDeleteAttachmentModalOpen] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editMode, setEditMode] = useState('attach');
  const isLoadingData = isLoading || sprintsLoading;

  const { 
    handleDeleteTaskAttachments,
    handleQuickAction,
  } = useProjectTasks(projectId);

  useEffect(() => {
    if (projectId) {
      loadUserTasks();
    }
  }, [projectId, myUser, sprintsList]);

  const loadUserTasks = () => {
    try {
      setIsLoading(true);
      
      const userTasks = sprintsList
        ?.flatMap(sprint => sprint.task || [])
        ?.filter(task => {
          if (typeof task.assignedTo === 'object') {
            return task.assignedTo._id === myUser?._id;
          } else {
            return task.assignedTo === myUser?._id;
          }
        }) || [];
      
      setTasks(userTasks);
      setError(null);
    } catch (err) {
      setError('Error al cargar las tareas');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAttachmentClick = (task, attachment) => {
    setAttachmentToDelete({ task, attachment });
    setDeleteAttachmentModalOpen(true);
  };

  const handleConfirmDeleteAttachment = async () => {
    if (attachmentToDelete) {
      await handleDeleteTaskAttachments(
        attachmentToDelete.task._id, 
        attachmentToDelete.attachment 
      );
      setDeleteAttachmentModalOpen(false);
      setAttachmentToDelete(null);
      loadUserTasks();
    }
  };

  const handleQuickActionClick = (task, action) => {
    setTaskToEdit(task);
    setEditMode(action);
    setEditTaskModalOpen(true);
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoadingData ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0B758C]"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tasks.length === 0 ? (
            <div className="p-4 text-center text-gray-400 col-span-full">
              No tienes tareas asignadas en este proyecto
            </div>
          ) : (
            tasks.map(task => (
              <motion.div 
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border bg-[#1a1a1a] border-[#036873]/30 p-4 shadow-md hover:shadow-xl transition-all duration-300"
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
                  {task.state === "Completed" ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-[#0B758C]" />
                  )}
                  <p className="font-medium text-white">{task.title}</p>
                </div>
                {task.description && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-300 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {task.description}
                    </p>
                  </div>
                )}
                {task.sprint && (
                  <p className="text-xs text-gray-400 mb-2">
                    Sprint: <strong>{task.sprint.tittle}</strong> 
                    {' '}
                    {format(new Date(task.sprint.dateStart), 'dd/MM/yyyy')} - 
                    {format(new Date(task.sprint.dateEnd), 'dd/MM/yyyy')}
                  </p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    {task.attachments?.length > 0 && task.attachments.map((attachment, index) => (
                      <button 
                        key={index}
                        onClick={() => handleDeleteAttachmentClick(task, attachment)}
                        className="p-1 rounded hover:bg-yellow-500/20 text-yellow-500 flex items-center gap-1"
                        title="Eliminar este archivo"
                      >
                        <Paperclip className="w-4 h-4" />
                        <span className="text-xs">
                          {attachment.split('/').pop()}
                        </span>
                      </button>
                    ))}
                  </div>

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
              </motion.div>
            ))
          )}
        </div>
      )}

      <TaskEditModal
        isOpen={editTaskModalOpen}
        onClose={() => setEditTaskModalOpen(false)}
        task={taskToEdit}
        mode={editMode}
        teamMembers={[]}
        onSubmit={loadUserTasks}
        onQuickAction={handleQuickAction}
      />

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
    </div>
  );
};
