import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  agregarIntegrante,
  addProject,
  buscarGrupoId,
  listarProyectosGrupo
} from '../../services/api';
import toast from 'react-hot-toast';

export const useClusterHome = (id) => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [grupo, setGrupo] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [loadingGroup, setLoadingGroup] = useState(true);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        setLoadingGroup(true);

        const groupResponse = await buscarGrupoId(id);
        const proyectosResponse = await listarProyectosGrupo(id);

        console.log("Respuesta del grupo:", groupResponse);

        if (groupResponse.error || !groupResponse.grupo) {
          console.error("Error: grupo no encontrado o inválido");
          setGrupo(null);
        } else {
          console.log("Integrantes del grupo:", groupResponse.grupo.integrantes);
          setGrupo(groupResponse.grupo);
        }

        console.log("Proyectos del grupo:", proyectosResponse);
        setProyectos(proyectosResponse.projects || []);
      } catch (err) {
        console.error("Error al cargar datos del grupo:", err);
      } finally {
        setLoadingGroup(false);
      }
    };

    fetchGroupData();
  }, [id, navigate]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      setError('Por favor ingresa un email o nombre de usuario');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await agregarIntegrante({
        grupoId: id,
        integrante: inviteEmail
      });

      if (response.error) {
        setError(response.message);
        toast.error(response.message);
      } else {
        setSuccess('Miembro agregado exitosamente');
        setInviteEmail('');
        setGrupo(prev => ({
          ...prev,
          integrantes: [...prev.integrantes, response.newMember]
        }));
        toast.success('Miembro agregado exitosamente');
        window.location.reload();
      }
    } catch (err) {
      setError('Error al agregar miembro');
      console.error(err);
      toast.error('Error al agregar miembro');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitProject = async (data) => {
    console.log('📦 Datos del formulario:', data);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!grupo) {
        setError('Información del grupo no disponible.');
        toast.error('Información del grupo no disponible.');
        return;
      }

      const projectData = {
        title: data.title,
        description: data.description,
        projectType: data.projectType,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        productOwner: data.productOwner,  
        cluster: id
      };
      const response = await addProject(projectData);

      if (response.error) {
        setError(response.message);
        toast.error(response.message);
      } else {
        setSuccess('Proyecto creado exitosamente');
        setShowProjectModal(false);
        toast.success('Proyecto creado exitosamente');

        const proyectosActualizados = await listarProyectosGrupo(id);
        if (!proyectosActualizados.error) {
          setProyectos(proyectosActualizados.projects);
        }
      }
    } catch (err) {
      setError('Error al crear proyecto');
      console.error(err);
      toast.error('Error al crear proyecto');
    } finally {
      setLoading(false);
    }
  };

  return {
    darkMode,
    setDarkMode,
    showProjectModal,
    setShowProjectModal,
    showInviteModal,
    setShowInviteModal,
    inviteEmail,
    setInviteEmail,
    loading,
    error,
    success,
    grupo,
    proyectos,
    loadingGroup,
    formatDate,
    handleInviteMember,
    onSubmitProject
  };
};
