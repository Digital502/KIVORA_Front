import { useState, useEffect } from 'react';
import { getUserTasks, updateTaskState as updateTaskStateAPI } from '../../services/api';

export const useUserTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserTasks();
      if (response && !response.error && response.tasks) {
        setTasks(response.tasks);
      } else if (response.error) {
        setError(response.e?.response?.data?.message || 'Error al cargar las tareas');
      }
    } catch (err) {
      setError('Error al cargar las tareas');
      console.error('Error fetching user tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskState = async (taskId, newState) => {
    try {
      const response = await updateTaskStateAPI(taskId, newState);
      
      if (response && !response.error) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.uid === taskId 
              ? { ...task, state: newState }
              : task
          )
        );
        return response;
      } else {
        throw new Error(response.e?.response?.data?.message || 'Error al actualizar la tarea');
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar la tarea');
      throw err;
    }
  };

  const getTasksByState = (state) => {
    return tasks.filter(task => task.state === state);
  };

  const getPendingTasks = () => {
    return tasks.filter(task => 
      task.state === 'In Progress' || task.state === 'Late'
    );
  };

  const getReviewTasks = () => {
    return tasks.filter(task => task.state === 'In Review');
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => task.state === 'finalized');
  };

  useEffect(() => {
    fetchUserTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchUserTasks,
    updateTaskState,
    getTasksByState,
    getPendingTasks,
    getReviewTasks,
    getCompletedTasks
  };
};
