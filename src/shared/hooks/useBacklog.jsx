import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle, FileText, Info } from 'lucide-react';
import {
  addItemBacklog,
  getBacklogItems,
  updateBacklogItem,
  deleteBacklogItem,
  exportPDFBacklog 
} from '../../services/api';

export const useProjectBacklog = (id, nombreProyecto) => {
  const [backlogs, setBacklogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState(null);
  const [newItemData, setNewItemData] = useState({
    title: '',
    description: '',
    priority: 3
  });

  const fetchBacklogs = useCallback(async (id) => {
    try {
      setLoadingList(true);
      setError(null);

      const response = await getBacklogItems(id);

      if (!response || !response.backlogs) {
        throw new Error('Formato de respuesta inválido');
      }

      setBacklogs(response.backlogs);
    } catch (err) {
      setError(err.message);
      toast(
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 mt-0.5 text-blue-500" />
          <div>
            <p className="font-medium">Lista de backlogs vacía</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">No se encontraron items en el backlog</p>
          </div>
        </div>,
        {
          className: 'border border-blue-100 bg-blue-50 dark:bg-gray-800 dark:border-blue-900/50',
          position: 'top-right',
          duration: 3000
        }
      );
      setBacklogs([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (id && id !== 'undefined') {
      fetchBacklogs(id);
    } else {
      setLoadingList(false);
      setBacklogs([]);
    }
  }, [id, fetchBacklogs]);

  const handleAddBacklogItem = async () => {
    if (!newItemData.title.trim()) {
      toast.error(
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
          <div>
            <p className="font-medium">Campo requerido</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">El título es obligatorio</p>
          </div>
        </div>,
        {
          className: 'border border-red-200 bg-red-50 dark:bg-gray-800 dark:border-red-800/50',
          position: 'top-right'
        }
      );
      return 'error';
    }
    setLoading(true);
    try {
      await addItemBacklog({ ...newItemData, project: id });
      toast.success(
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
          <div>
            <p className="font-medium">¡Item agregado!</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Al backlog del proyecto</p>
          </div>
        </div>,
        {
          className: 'border border-green-200 bg-green-50 dark:bg-gray-800 dark:border-green-800/50',
          position: 'top-right'
        }
      );
      setNewItemData({ title: '', description: '', priority: 3 });
      await fetchBacklogs(id);
      return 'success';
    } catch (err) {
      toast.error(
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
          <div>
            <p className="font-medium">Error al agregar</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{err.message}</p>
          </div>
        </div>,
        {
          className: 'border border-red-200 bg-red-50 dark:bg-gray-800 dark:border-red-800/50',
          position: 'top-right'
        }
      );
      return 'error';
    } finally {
      setLoading(false);
    }
  };

  const handleEditBacklogItem = async (backlogId, updatedData) => {
    setLoading(true);
    try {
      const res = await updateBacklogItem(id, backlogId, updatedData);

      if (res?.backlog) {
        toast.success(
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">¡Item actualizado!</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Cambios guardados</p>
            </div>
          </div>,
          {
            className: 'border border-green-200 bg-green-50 dark:bg-gray-800 dark:border-green-800/50',
            position: 'top-right'
          }
        );
        await fetchBacklogs(id);
        return 'success';
      } else {
        throw new Error(res.message || 'Error al actualizar');
      }
    } catch (err) {
      toast.error(
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
          <div>
            <p className="font-medium">Error al editar</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{err.message}</p>
          </div>
        </div>,
        {
          className: 'border border-red-200 bg-red-50 dark:bg-gray-800 dark:border-red-800/50',
          position: 'top-right'
        }
      );
      return 'error';
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBacklogItem = async (backlogId) => {
    setLoading(true);
    try {
      const res = await deleteBacklogItem(id, backlogId);

      if (res?.message?.includes('deleted')) {
        toast.success(
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">¡Item eliminado!</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Del backlog del proyecto</p>
            </div>
          </div>,
          {
            className: 'border border-green-200 bg-green-50 dark:bg-gray-800 dark:border-green-800/50',
            position: 'top-right'
          }
        );
        await fetchBacklogs(id);
        return 'success';
      } else {
        throw new Error(res.message || 'Error al eliminar');
      }
    } catch (err) {
      toast.error(
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
          <div>
            <p className="font-medium">Error al eliminar</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{err.message}</p>
          </div>
        </div>,
        {
          className: 'border border-red-200 bg-red-50 dark:bg-gray-800 dark:border-red-800/50',
          position: 'top-right'
        }
      );
      return 'error';
    } finally {
      setLoading(false);
    }
  };

  const handleExportBacklogPDF = async () => {
    try {
      const pdfBlob = await exportPDFBacklog(id);

      if (pdfBlob instanceof Blob) {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        const nombreArchivo = `${nombreProyecto.replace(/\s+/g, '_')}_Backlog.pdf`;
        link.href = url;
        link.setAttribute('download', nombreArchivo);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success(
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium">PDF generado</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Descarga iniciada</p>
            </div>
          </div>,
          {
            className: 'border border-green-200 bg-green-50 dark:bg-gray-800 dark:border-green-800/50',
            position: 'top-right'
          }
        );
      } else {
        throw new Error('El archivo recibido no es válido');
      }
    } catch (err) {
      toast.error(
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 text-red-500" />
          <div>
            <p className="font-medium">Error al exportar</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">No se pudo generar el PDF</p>
          </div>
        </div>,
        {
          className: 'border border-red-200 bg-red-50 dark:bg-gray-800 dark:border-red-800/50',
          position: 'top-right'
        }
      );
    }
  };

  return {
    backlogs,
    loading,
    loadingList,
    error,
    newItemData,
    setNewItemData,
    handleAddBacklogItem,
    handleEditBacklogItem,
    handleDeleteBacklogItem,
    refreshBacklogs: fetchBacklogs,
    handleExportBacklogPDF 
  };
};