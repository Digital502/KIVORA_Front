import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  crearGrupo,
  agregarIntegrante,
  eliminarIntegrante,
  editarDescripcion,
  listarGrupos,
  getUser,
  getMyUser,
  buscarGrupoId
} from "../../services";
import toast from "react-hot-toast";
import { AlertCircle, CheckCircle } from "lucide-react";

export const useCluster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [grupoActual, setGrupoActual] = useState(null);
  const navigate = useNavigate();

  const construirGrupo = (data) => {
    if (!data) return null;
    return {
      ...data,
      profilePicture: data.profilePicture ? data.profilePicture : null,
    };
  };

  const toastError = (title, message) => {
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

  const toastSuccess = (title, message) => {
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

  const obtenerTodosUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await getUser();

      if (response.error) {
        toastError("Error al obtener los usuarios");
        return [];
      }

      setUsuarios(response.services || []);
      return response.services || [];
    } catch (error) {
      toastError("Error al obtener los usuarios");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const crearNuevoGrupo = async (formData) => {
    try {
      setIsLoading(true);
      const response = await crearGrupo(formData);

      if (!response) {
        toastError("No se pudo crear el grupo");
        return null;
      }

      const grupoCreado = construirGrupo(response.grupo);
      toastSuccess("Grupo creado exitosamente");
      return grupoCreado;
    } catch (error) {
      toastError("Error al crear el grupo", error.response?.data?.message || null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const agregarNuevoIntegrante = async (grupoId, integrante) => {
    try {
      setIsLoading(true);
      const response = await agregarIntegrante({ grupoId, integrante });

      if (!response.success) {
        toastError("No se pudo agregar el integrante");
        return null;
      }

      const grupoActualizado = construirGrupo(response.grupo);
      toastSuccess("Integrante agregado exitosamente");
      return grupoActualizado;
    } catch (error) {
      toastError("Error al agregar integrante");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarIntegranteGrupo = async (grupoId, integrante) => {
    try {
      setIsLoading(true);
      const response = await eliminarIntegrante({ grupoId, integrante });

      if (response.error || !response.grupo) {
        toastError("No se pudo eliminar el integrante");
        return null;
      }

      const grupoActualizado = construirGrupo(response.grupo);
      toastSuccess("Integrante eliminado exitosamente");
      return grupoActualizado;
    } catch (error) {
      toastError("Error al eliminar integrante");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const editarDescripcionGrupo = async (grupoId, descripcion) => {
    try {
      setIsLoading(true);
      const response = await editarDescripcion(grupoId, descripcion);

      if (response.error || !response.grupo) {
        toastError("No se pudo editar la descripción");
        return null;
      }

      const grupoActualizado = construirGrupo(response.grupo);
      toastSuccess("Descripción editada exitosamente");
      return grupoActualizado;
    } catch (error) {
      toastError("Error al editar la descripción");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerGruposUsuario = async () => {
    try {
      setIsLoading(true);

      const responseR = await getMyUser();
      const email = String(responseR.services[0].email);
      const response = await listarGrupos(email);

      if (!response.message) {
        toastError("No se pudo obtener la lista de grupos");
        return [];
      }

      const gruposFormateados = response.grupos.map(construirGrupo);
      setGrupos(gruposFormateados);
      return gruposFormateados;
    } catch (error) {
      toastError("Error al obtener los grupos");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const obtenerDetalleGrupo = useCallback(async (grupoId) => {
    try {
      setIsLoading(true);
      const response = await buscarGrupoId(grupoId);

      if (response.error || !response.grupo) {
        toastError("No se pudo obtener el grupo");
        return null;
      }

      const grupoFormateado = construirGrupo(response.grupo);
      setGrupoActual(grupoFormateado);
      return grupoFormateado;
    } catch (error) {
      toastError("Error al obtener el grupo");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    grupos,
    usuarios,
    grupoActual,
    isLoading,
    obtenerTodosUsuarios,
    crearNuevoGrupo,
    agregarNuevoIntegrante,
    eliminarIntegranteGrupo,
    editarDescripcionGrupo,
    obtenerGruposUsuario,
    obtenerDetalleGrupo,
  };
};
