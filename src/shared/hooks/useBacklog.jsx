import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
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
      toast.error('Error al cargar backlog');
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
      toast.error('El título es obligatorio');
      return 'error';
    }
    setLoading(true);
    try {
      await addItemBacklog({ ...newItemData, project: id });
      toast.success('Item agregado!');
      setNewItemData({ title: '', description: '', priority: 3 });
      await fetchBacklogs(id);
      
      return 'success';
    } catch (err) {
      toast.error(err.message);
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
        toast.success('Item actualizado!');
        await fetchBacklogs(id);
        return 'success';
      } else {
        throw new Error(res.message || 'Error al actualizar');
      }
    } catch (err) {
      toast.error(`Error al editar: ${err.message}`);
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
        toast.success('Item eliminado!');
        await fetchBacklogs(id);
        return 'success';
      } else {
        throw new Error(res.message || 'Error al eliminar');
      }
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
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
        toast.success('PDF generado correctamente');
      } else {
        throw new Error('El archivo recibido no es válido');
      }
    } catch (err) {
      console.error(err);
      toast.error('No se pudo exportar el PDF');
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
