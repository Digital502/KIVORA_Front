import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyNotifications } from '../../services/api';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await getMyNotifications();
      if (!response.error) {
        setNotifications(response.notifications);
        setPendingCount(response.pendientes || 0);

        setPreviousCount(response.pendientes || 0);
      }
    } catch (err) {
      toast.error('Error al actualizar notificaciones');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, pendingCount, fetchNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useGlobalNotifications = () => useContext(NotificationsContext);
