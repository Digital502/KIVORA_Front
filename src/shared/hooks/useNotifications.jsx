import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
    getMyNotifications,
    getNotificationById,
    updateNotificationState,
} from '../../services/api';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await getMyNotifications();
            if (!response.error) {
                setNotifications(response.notifications);
                setPendingCount(response.pendientes || 0);
            } else {
                setError('Error al cargar notificaciones');
                toast.error('Error al cargar notificaciones');
            }
        } catch (err) {
            setError('Fallo en la conexión al servidor');
            toast.error('Fallo en la conexión al servidor');
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
                toast.error('No se pudo obtener la notificación');
            }
        } catch (err) {
            setError('Error al buscar la notificación');
            toast.error('Error al buscar la notificación');
        }
    };

    const changeNotificationState = async (notificationId, newState) => {
        setUpdating(true);
        try {
            const response = await updateNotificationState(notificationId, newState);
            if (!response.error) {
                toast.success('Notificación actualizada');
                await fetchNotifications();
            } else {
                toast.error('Error actualizando notificación');
            }
        } catch (err) {
            toast.error('Error en el servidor al actualizar');
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