// hooks/useProjectView.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { listarProyectosUsuario } from "../../services";

export const useProjectView = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listarProyectosUsuario();

      if (data.error) {
        toast.error("Error al cargar proyectos");
        setError(data.e?.message || "Error desconocido");
        setProjects([]);
        return;
      }

      if (!data.projects || data.projects.length === 0) {
        toast("No tienes proyectos asignados");
      }

      setProjects(data.projects || []);
    } catch (err) {
      toast.error("Error al obtener proyectos");
      setError(err.message);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, []);

  return { projects, isLoading, error, fetchUserProjects };
};