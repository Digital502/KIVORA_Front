import { useState } from "react";
import { addEvent, listEvent, markAttendance, updateEvent, deleteEvent } from "../../services/api";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle } from "lucide-react";

export const useEvent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [eventos, setEventos] = useState([]);

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
        position: 'top-right'
      }
    );
  };

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
        position: 'top-right'
      }
    );
  };

  const crearEvento = async (formData) => {
    try {
      setIsLoading(true);
      const response = await addEvent(formData);

      if (response.error || !response.event) {
        toastError("No se pudo crear el evento", response.message);
        return null;
      }

      toastSuccess("Evento creado exitosamente");
      return response.event;
    } catch (error) {
      toastError("Error al crear el evento");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerEventos = async () => {
    try {
      setIsLoading(true);
      const response = await listEvent();

      if (response.error || !response.events) {
        toastError("No se pudieron obtener los eventos", response.message);
        return [];
      }

      setEventos(response.events);
      return response.events;
    } catch (error) {
      toastError("Error al obtener los eventos");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const marcarAsistenciaEvento = async ({ eventId, userId, presente }) => {
    try {
      const response = await markAttendance({ eventId, userId, presente });

      if (response.error) {
        toastError("No se pudo marcar la asistencia", response.message);
        return false;
      }

      toastSuccess("Asistencia actualizada");
      await obtenerEventos(); 
      return true;
    } catch (error) {
      toastError("Error al marcar asistencia");
      return false;
    }
  };

  const actualizarEvento = async (id, data) => {
    try {
      setIsLoading(true);
      const response = await updateEvent(id, data);

      if (response.error) {
        toastError("No se pudo actualizar el evento", response.message);
        return null;
      }

      toastSuccess("Evento actualizado exitosamente");
      await obtenerEventos();
      return response.event;
    } catch (error) {
      toastError("Error al actualizar el evento");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarEvento = async (id) => {
    try {
      setIsLoading(true);
      const response = await deleteEvent(id);

      if (response.error) {
        toastError("No se pudo eliminar el evento", response.message);
        return false;
      }

      toastSuccess("Evento eliminado exitosamente");
      await obtenerEventos();
      return true;
    } catch (error) {
      toastError("Error al eliminar el evento");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    eventos,
    crearEvento,
    obtenerEventos,
    marcarAsistenciaEvento,
    actualizarEvento,
    eliminarEvento,
  };
};
