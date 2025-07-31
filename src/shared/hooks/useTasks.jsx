import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  addTask,
  reassignTask,
  markTaskUrgent,
  setTaskTags,
  addTaskAttachments,
  deleteTaskAttachments,
  updateTask,
  deleteTask,
  calificarEntrega
} from '../../services/api';

export const useProjectTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    sprint: '',
    assignedTo: '',
    attachments: null
  });

  const fetchTasks = useCallback(async (projectId) => {
    try {
      setLoadingList(true);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar tareas');
      setTasks([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (projectId && projectId !== 'undefined') {
      fetchTasks(projectId);
    } else {
      setLoadingList(false);
      setTasks([]);
    }
  }, [projectId, fetchTasks]);

const handleAddTask = async (formData) => {
  setLoading(true);
  try {
    const response = await addTask(formData);
    if (response.error) throw new Error(response.e?.message || 'Error al agregar tarea');
    
    toast.success('Tarea agregada!');
    await fetchTasks(projectId);
    return { status: 'success', data: response };
  } catch (err) {
    toast.error(err.message);
    return { status: 'error', error: err.message };
  } finally {
    setLoading(false);
  }
};

const handleQuickAction = async (action, taskId, data) => {
  setLoading(true);
  try {
    let response;
    switch(action) {
      case 'reassign':
        response = await reassignTask(taskId, data.newUserId);
        break;
      case 'urgent':
        response = await markTaskUrgent(taskId);
        break;
      case 'tags':
        response = await setTaskTags(taskId, data.tags);
        break;
      case 'attach':
        response = await addTaskAttachments(taskId, data);
        break;
      case 'calificar':
        response = await calificarEntrega({
          taskId,
          isAccepted: data.isAccepted,
          newComment: data.newComment
        });
        break;
      default:
        throw new Error('Acción no válida');
    }

    if (response.error) throw new Error(response.e?.message || `Error al ${action}`);
    toast.success(`Tarea actualizada (${action})!`);
    await fetchTasks(projectId);
    return { status: 'success', data: response };
  } catch (err) {
    toast.error(`Error: ${err.message}`);
    return { status: 'error', error: err.message };
  } finally {
    setLoading(false);
  }
};

  const handleReassignTask = async (taskId, newUserId) => {
    setLoading(true);
    try {
      const response = await reassignTask(taskId, newUserId);
      if (response.error) throw new Error(response.e?.message || 'Error al reasignar tarea');
      
      toast.success('Tarea reasignada!');
      await fetchTasks(projectId);
      return { status: 'success', data: response };
    } catch (err) {
      toast.error(`Error al reasignar: ${err.message}`);
      return { status: 'error', error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleMarkTaskUrgent = async (taskId) => {
    setLoading(true);
    try {
      const response = await markTaskUrgent(taskId);
      if (response.error) throw new Error(response.e?.message || 'Error al marcar como urgente');
      
      toast.success('Tarea marcada como urgente!');
      await fetchTasks(projectId);
      return { status: 'success', data: response };
    } catch (err) {
      toast.error(`Error al marcar como urgente: ${err.message}`);
      return { status: 'error', error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleSetTaskTags = async (taskId, tags) => {
    setLoading(true);
    try {
      const response = await setTaskTags(taskId, tags);
      if (response.error) throw new Error(response.e?.message || 'Error al etiquetar tarea');
      
      toast.success('Etiquetas actualizadas!');
      await fetchTasks(projectId);
      return { status: 'success', data: response };
    } catch (err) {
      toast.error(`Error al etiquetar: ${err.message}`);
      return { status: 'error', error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleAddTaskAttachments = async (taskId, filename) => {
    setLoading(true);
    try {
      const response = await addTaskAttachments(taskId, filename);
      if (response.error) throw new Error(response.e?.message || 'Error al agregar archivos');
      
      toast.success('Archivos agregados!');
      await fetchTasks(projectId);
      return { status: 'success', data: response };
    } catch (err) {
      toast.error(`Error al agregar archivos: ${err.message}`);
      return { status: 'error', error: err.message };
    } finally {
      setLoading(false);
    }
  };

    const handleDeleteTaskAttachments = async (taskId, filenamesObj) => {
      setLoading(true);
      try {
        const response = await deleteTaskAttachments(taskId, filenamesObj); 
        if (response.error) throw new Error(response.e?.message || 'Error al eliminar archivos');
        
        toast.success('Archivos eliminados!');
        await fetchTasks(projectId);
        return { status: 'success', data: response };
      } catch (err) {
        toast.error(`Error al eliminar archivos: ${err.message}`);
        return { status: 'error', error: err.message };
      } finally {
        setLoading(false);
      }
    };

  const handleUpdateTask = async (taskData) => {
    setLoading(true);
    try {
      const response = await updateTask(taskData);
      if (response.error) throw new Error(response.e?.message || 'Error al actualizar tarea');
      
      toast.success('Tarea actualizada!');
      await fetchTasks(projectId);
      return { status: 'success', data: response };
    } catch (err) {
      toast.error(`Error al actualizar: ${err.message}`);
      return { status: 'error', error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await deleteTask(taskId);
      if (response.error) throw new Error(response.e?.message || 'Error al eliminar tarea');
      
      toast.success('Tarea eliminada!');
      await fetchTasks(projectId);
      return { status: 'success', data: response };
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
      return { status: 'error', error: err.message };
    } finally {
      setLoading(false);
    }
  };

    const handleCalificarEntrega = async ({ taskId, isAccepted, newComment }) => {
    setLoading(true);
    try {
      const response = await calificarEntrega({ taskId, isAccepted, newComment });
      if (response.error) throw new Error(response.e?.message || 'Error al calificar entrega');
      
      toast.success(isAccepted ? 'Entrega aceptada!' : 'Entrega rechazada!');
      await fetchTasks(projectId);
      return { status: 'success', data: response };
    } catch (err) {
      toast.error(`Error al calificar entrega: ${err.message}`);
      return { status: 'error', error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    loadingList,
    error,
    newTaskData,
    handleQuickAction,
    setNewTaskData,
    handleAddTask,
    handleReassignTask,
    handleMarkTaskUrgent,
    handleSetTaskTags,
    handleAddTaskAttachments,
    handleDeleteTaskAttachments,
    handleUpdateTask,
    handleDeleteTask,
    handleCalificarEntrega,
    refreshTasks: fetchTasks
  };
};