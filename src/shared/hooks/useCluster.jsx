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

  const obtenerTodosUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await getUser();

      if (response.error) {
        toast.error("Error al obtener los usuarios");
        return [];
      }

      setUsuarios(response.services || []);
      return response.services || [];
    } catch (error) {
      toast.error("Error al obtener los usuarios");
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
        toast.error("No se pudo crear el grupo");
        return null;
      }

      const grupoCreado = construirGrupo(response.grupo);
      toast.success("Grupo creado exitosamente");
      return grupoCreado;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al crear el grupo");
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
        toast.error("No se pudo agregar el integrante");
        return null;
      }

      const grupoActualizado = construirGrupo(response.grupo);
      toast.success("Integrante agregado exitosamente");
      return grupoActualizado;
    } catch (error) {
      toast.error("Error al agregar integrante");
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
        toast.error("No se pudo eliminar el integrante");
        return null;
      }

      const grupoActualizado = construirGrupo(response.grupo);
      toast.success("Integrante eliminado exitosamente");
      return grupoActualizado;
    } catch (error) {
      toast.error("Error al eliminar integrante");
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
        toast.error("No se pudo editar la descripción");
        return null;
      }

      const grupoActualizado = construirGrupo(response.grupo);
      toast.success("Descripción editada exitosamente");
      return grupoActualizado;
    } catch (error) {
      toast.error("Error al editar la descripción");
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
        toast.error("No se pudo obtener la lista de grupos");
        return [];
      }

      const gruposFormateados = response.grupos.map(construirGrupo);
      setGrupos(gruposFormateados);
      return gruposFormateados;
    } catch (error) {
      toast.error("Error al obtener los grupos");
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
        toast.error("No se pudo obtener el grupo");
        return null;
      }

      const grupoFormateado = construirGrupo(response.grupo);
      setGrupoActual(grupoFormateado);
      return grupoFormateado;
    } catch (error) {
      toast.error("Error al obtener el grupo");
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
