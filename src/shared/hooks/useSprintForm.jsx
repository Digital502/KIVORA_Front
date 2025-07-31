import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  createSprint, 
  getSprints, 
  updateSprint,
  deleteSprint,
  addBacklogToSprint,
  removeBacklogFromSprint
} from "../../services";
import toast from "react-hot-toast";

export const useSprintForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sprint, setSprint] = useState(null);
  const [sprintsList, setSprintsList] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const crearNuevoSprint = async (sprintData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (new Date(sprintData.dateStart) >= new Date(sprintData.dateEnd)) {
        throw new Error("La fecha de inicio debe ser anterior a la fecha de fin");
      }

      if (!sprintData.tittle || !sprintData.project || !sprintData.dateStart || !sprintData.dateEnd) {
        throw new Error("Todos los campos obligatorios deben ser completados");
      }

      const response = await createSprint({
        tittle: sprintData.tittle.trim(),
        objective: sprintData.objective || "",
        project: sprintData.project,
        dateStart: sprintData.dateStart,
        dateEnd: sprintData.dateEnd,
        backlog: sprintData.backlog || [] 
      });

      if (!response || !response.sprint) {
        const errorMessage = response?.message || "No se pudo crear el sprint";
        toast.error(errorMessage);
        setError(errorMessage);
        return null;
      }

      setSprint(response.sprint);
      await obtenerSprints(response.sprint.project);
      toast.success("Sprint creado exitosamente");
      
      return response.sprint;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error al crear el sprint";
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

const obtenerSprints = async (projectId) => {
  try {
    setIsLoading(true);
    setError(null);
    
    const response = await getSprints(projectId);

    if (!response || !response.sprints) {
      const errorMessage = response?.message || "No se pudieron obtener los sprints";
      toast.error(errorMessage);
      setError(errorMessage);
      return [];
    }

    const sprintsFormateados = response.sprints.map(s => {
      const tareas = s.task || [];
      return {
        ...s,
        totalTareas: tareas.length,
        tareasUrgentes: tareas.filter(t => t.isUrgent).length
      };
    });

    setSprintsList(sprintsFormateados);
    return sprintsFormateados;

  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || "Error al obtener los sprints";
    toast.error(errorMessage);
    setError(errorMessage);
    return [];
  } finally {
    setIsLoading(false);
  }
};

  const actualizarSprint = async (sprintId, updateData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!sprintId) {
        throw new Error("ID de sprint no proporcionado");
      }

      const response = await updateSprint(sprintId, updateData);

      if (!response || !response.sprint) {
        const errorMessage = response?.message || "No se pudo actualizar el sprint";
        toast.error(errorMessage);
        setError(errorMessage);
        return null;
      }

      if (sprint && sprint._id === sprintId) {
        setSprint(response.sprint);
      }

      if (response.sprint.project) {
        await obtenerSprints(response.sprint.project);
      }

      toast.success("Sprint actualizado exitosamente");
      return response.sprint;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error al actualizar el sprint";
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarSprint = async (sprintId) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!sprintId) {
        throw new Error("ID de sprint no proporcionado");
      }

      const response = await deleteSprint(sprintId);

      if (!response || !response.message) {
        const errorMessage = response?.message || "No se pudo eliminar el sprint";
        toast.error(errorMessage);
        setError(errorMessage);
        return false;
      }

      if (sprint && sprint._id === sprintId) {
        setSprint(null);
      }

      toast.success("Sprint eliminado exitosamente");
      return true;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error al eliminar el sprint";
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const agregarBacklogASprint = async (sprintId, backlogId) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!sprintId || !backlogId) {
        throw new Error("ID de sprint o backlog no proporcionado");
      }

      const response = await addBacklogToSprint(sprintId, backlogId);

      if (!response || !response.sprint) {
        const errorMessage = response?.message || "No se pudo agregar el backlog al sprint";
        toast.error(errorMessage);
        setError(errorMessage);
        return null;
      }

      if (sprint && sprint._id === sprintId) {
        setSprint(response.sprint);
      }

      if (response.sprint.project) {
        await obtenerSprints(response.sprint.project);
      }

      toast.success("Backlog agregado al sprint exitosamente");
      return response.sprint;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error al agregar backlog al sprint";
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const removerBacklogDeSprint = async (sprintId, backlogId) => {
    try {
      setIsLoading(true);
      setError(null);

      if (!sprintId || !backlogId) {
        throw new Error("ID de sprint o backlog no proporcionado");
      }

      const response = await removeBacklogFromSprint(sprintId, backlogId);

      if (!response || !response.sprint) {
        const errorMessage = response?.message || "No se pudo remover el backlog del sprint";
        toast.error(errorMessage);
        setError(errorMessage);
        return null;
      }

      if (sprint && sprint._id === sprintId) {
        setSprint(response.sprint);
      }

      if (response.sprint.project) {
        await obtenerSprints(response.sprint.project);
      }

      toast.success("Backlog removido del sprint exitosamente");
      return response.sprint;

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Error al remover backlog del sprint";
      toast.error(errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sprint,
    sprintsList,
    isLoading,
    error,
    crearNuevoSprint,
    obtenerSprints,
    actualizarSprint,
    eliminarSprint,
    agregarBacklogASprint,
    removerBacklogDeSprint
  };
};