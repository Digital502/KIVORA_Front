import { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getMyNotifications } from '../../services/api';
import { AlertCircle } from 'lucide-react';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);

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

  const fetchNotifications = async () => {
    try {
      const response = await getMyNotifications();
      if (!response.error) {
        setNotifications(response.notifications);
        setPendingCount(response.pendientes || 0);
        setPreviousCount(response.pendientes || 0);
      }
    } catch (err) {
      toastError('Error al cargar notificaciones', 'Intenta de nuevo más tarde.');
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
