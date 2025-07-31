import { useState } from "react";
import toast from "react-hot-toast";
import { obtenerEstadisticasProyecto } from "../../services";
import { AlertCircle, CheckCircle } from "lucide-react";

export const useProjectStatistics = () => {
  const [estadisticas, setEstadisticas] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

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

  const obtenerEstadisticas = async (projectId) => {
    try {
      setIsLoadingStats(true);
      const response = await obtenerEstadisticasProyecto(projectId);

      if (response.error) {
        toastError("Error al obtener estadísticas", response.message);
        return null;
      }

      setEstadisticas(response);
      return response;
    } catch (error) {
      toastError("Error al obtener estadísticas");
      return null;
    } finally {
      setIsLoadingStats(false);
    }
  };

  return {
    estadisticas,
    isLoadingStats,
    obtenerEstadisticas,
  };
};
