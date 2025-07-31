import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getMyNotifications,
  getNotificationById,
  updateNotificationState,
} from '../../services/api';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  const toastError = (title, message = '') => {
    toast.error(
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
        <div>
          <p className="font-medium">{title}</p>
          {message && <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>}
        </div>
      </div>,
      {
        className: 'border border-red-200 bg-red-50 dark:bg-gray-800 dark:border-red-800/50',
        position: 'top-right',
      }
    );
  };

  const toastSuccess = (title, message = '') => {
    toast.success(
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
        <div>
          <p className="font-medium">{title}</p>
          {message && <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>}
        </div>
      </div>,
      {
        className: 'border border-green-200 bg-green-50 dark:bg-gray-800 dark:border-green-800/50',
        position: 'top-right',
      }
    );
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getMyNotifications();
      if (!response.error) {
        setNotifications(response.notifications);
        setPendingCount(response.pendientes || 0);
      } else {
        setError('Error al cargar notificaciones');
        toastError('Error al cargar notificaciones');
      }
    } catch (err) {
      setError('Fallo en la conexión al servidor');
      toastError('Fallo en la conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationById = async (notificationId) => {
    try {
      const response = await getNotificationById(notificationId);
      if (!response.error) {
        setSelectedNotification(response.notification);
      } else {
        setError('No se pudo obtener la notificación');
        toastError('No se pudo obtener la notificación');
      }
    } catch (err) {
      setError('Error al buscar la notificación');
      toastError('Error al buscar la notificación');
    }
  };

  const changeNotificationState = async (notificationId, newState) => {
    setUpdating(true);
    try {
      const response = await updateNotificationState(notificationId, newState);
      if (!response.error) {
        toastSuccess('Notificación actualizada');
        await fetchNotifications();
      } else {
        toastError('Error actualizando notificación');
      }
    } catch (err) {
      toastError('Error en el servidor al actualizar');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    pendingCount,
    selectedNotification,
    loading,
    updating,
    error,
    fetchNotifications,
    fetchNotificationById,
    changeNotificationState,
  };
};
