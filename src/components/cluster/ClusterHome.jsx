import {
  Users, FolderGit2, Calendar, User2, Clock, Shield, Star, Sun, Moon, X, Check, Settings, UserPlus, BarChart2, FileText, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useClusterHome } from '../../shared/hooks/useClusterHome';
import { getUser } from '../../services/api';
import { React, useState, useEffect } from 'react';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';
import { SidebarCluster } from '../navs/SidebarCluster';

const projectSchema = yup.object().shape({
  title: yup.string().required('El título es requerido'),
  description: yup.string().required('La descripción es requerida'),
  projectType: yup.string().oneOf(['Academic', 'Informatic'], 'Tipo de proyecto inválido').required('El tipo de proyecto es requerido'),
  startDate: yup.date().required('La fecha de inicio es requerida'),
  endDate: yup.date()
    .required('La fecha de finalización es requerida')
    .min(yup.ref('startDate'), 'La fecha de finalización debe ser posterior a la de inicio'),
  productOwner: yup.string().required('Debes seleccionar un Product Owner')
});

export const ClusterHome = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);

  const {
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
  } = useClusterHome(id);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(projectSchema)
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersResponse = await getUser();
        if (!usersResponse.error) {
          setAllUsers(usersResponse);
        }
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
      }
    };

    loadUsers();
  }, []);

  if (loadingGroup || !grupo) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-[#0D0D0D]' : 'bg-white'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0B758C] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className={`mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Cargando grupo...</p>
        </div>
      </div>
    );
  }

const navItems = [
    { label: 'Salir', icon: <LogOut />, onClick: handleLogout },

  { 
    label: 'Documentación', 
    icon: <FileText className="w-5 h-5" />, 
    onClick: () => navigate(`/kivora/grupo/${id}/documentacion`) 
  },
  { 
    label: 'Reportes', 
    icon: <BarChart2 className="w-5 h-5" />, 
    onClick: () => navigate(`/kivora/grupo/${id}/reportes`) 
  },
  { 
    label: 'Ajustes', 
    icon: <Settings className="w-5 h-5" />, 
    onClick: () => navigate(`/kivora/grupo/${id}/ajustes`) 
  }
];

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className={`${darkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-gray-800'} transition-colors duration-300 min-h-screen`}>
      <NavbarDashboard />

      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl shadow-lg p-6 w-full max-w-md ${darkMode ? 'bg-[#111] border border-[#036873]/50' : 'bg-white border border-[#036873]/20'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Crear nuevo proyecto</h3>
              <button onClick={() => setShowProjectModal(false)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitProject)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título del proyecto</label>
                  <input
                    {...register('title')}
                    type="text"
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-300'} ${errors.title ? 'border-red-500' : ''}`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-300'} ${errors.description ? 'border-red-500' : ''}`}
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de inicio</label>
                    <Controller
                      control={control}
                      name="startDate"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          selectsStart
                          startDate={field.value}
                          endDate={control._formValues.endDate}
                          className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-300'} ${errors.startDate ? 'border-red-500' : ''}`}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Selecciona fecha"
                        />
                      )}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha de finalización</label>
                    <Controller
                      control={control}
                      name="endDate"
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          selectsEnd
                          startDate={control._formValues.startDate}
                          endDate={field.value}
                          minDate={control._formValues.startDate}
                          className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-300'} ${errors.endDate ? 'border-red-500' : ''}`}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Selecciona fecha"
                        />
                      )}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de proyecto</label>
                  <select
                    {...register('projectType')}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-300'} ${errors.projectType ? 'border-red-500' : ''}`}
                  >
                    <option value="">Selecciona un tipo</option>
                    <option value="Academic">Académico</option>
                    <option value="Informatic">Informático</option>
                  </select>
                  {errors.projectType && <p className="text-red-500 text-sm mt-1">{errors.projectType.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Product Owner</label>
                  <select
                    {...register('productOwner')}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-300'} ${errors.productOwner ? 'border-red-500' : ''}`}
                  >
                    <option value="">Selecciona un integrante</option>
                    {grupo?.integrantes?.map((integrante, index) => (
                      <option
                        key={integrante._id}
                        value={integrante.usuario.uid} 
                      >
                        {integrante.usuario.username || integrante.usuario.email}
                      </option>
                    ))}
                  </select>
                  {errors.productOwner && <p className="text-red-500 text-sm mt-1">{errors.productOwner.message}</p>}
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg bg-[#0B758C] hover:bg-[#0a6a7d] text-white flex items-center gap-2`}
                  >
                    {loading ? 'Creando...' : 'Crear proyecto'}
                    {!loading && <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl shadow-lg p-6 w-full max-w-md ${darkMode ? 'bg-[#111] border border-[#036873]/50' : 'bg-white border border-[#036873]/20'}`}
          >

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Agregar miembro</h3>
              <button onClick={() => {
                setShowInviteModal(false);
                setInviteEmail('');
                setError('');
                setSuccess('');
              }} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email o nombre de usuario</label>
                <input
                  type="text"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-[#222] border-gray-700' : 'bg-white border-gray-300'}`}
                  placeholder="ejemplo@kinal.edu.gt o username"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                    setError('');
                    setSuccess('');
                  }}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleInviteMember}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg bg-[#0B758C] hover:bg-[#0a6a7d] text-white flex items-center gap-2`}
                >
                  {loading ? 'Agregando...' : 'Agregar miembro'}
                  {!loading && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Botón de modo oscuro */}
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full ${darkMode ? 'bg-[#036873]/20 text-white' : 'bg-[#036873]/10 text-gray-800'}`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[90vh]">
        {/* Sidebar para desktop */}
        <div className="hidden lg:block">
          <SidebarCluster setShowProjectModal={setShowProjectModal} setShowInviteModal={setShowInviteModal} id={id} />
        </div>

        {/* Menú móvil */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0D0D0D] border-t border-gray-800 z-10">
          <div className="flex justify-around py-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="flex flex-col items-center p-2 text-xs"
              >
                <div className="text-[#0B758C] w-5 h-5">
                  {item.icon}
                </div>
                <span className="text-white text-xs mt-1">
                  {item.label.split(' ')[0]} {/* Muestra solo la primera palabra para ahorrar espacio */}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido principal */}
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-10 lg:border-r border-[#036873]/10 pb-20 lg:pb-0">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-8">
            <img
              src={grupo.profilePicture || "https://via.placeholder.com/80"}
              alt={grupo.nombre}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-[#0B758C]"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{grupo.nombre}</h1>
              <p className={`text-sm sm:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>{grupo.descripcion}</p>
              <div className="flex items-center gap-3 sm:gap-4">
                <span className={`flex items-center gap-1 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  {grupo.integrantes?.length || 0} miembros
                </span>
                <span className={`flex items-center gap-1 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FolderGit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  {proyectos.length} proyectos
                </span>
              </div>
            </div>
          </div>

          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B758C]" />
              Proyectos del grupo
            </h2>

            {proyectos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 sm:p-8 rounded-xl border ${darkMode ? 'bg-[#111] border-[#036873]/30' : 'bg-white border-[#036873]/20'} text-center`}
              >
                <p className="text-gray-400 mb-4">No hay proyectos en este grupo aún</p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowProjectModal(true)}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-[#036873] hover:bg-[#036873]/90' : 'bg-[#036873] hover:bg-[#036873]/90'} text-white font-medium`}
                >
                  Crear primer proyecto
                </motion.button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {proyectos.map((proyecto, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`rounded-xl border shadow-md p-4 sm:p-6 transition hover:shadow-lg cursor-pointer ${darkMode ? 'bg-[#111] border-[#036873]/30' : 'bg-white border-[#036873]/20'}`}
                    onClick={() =>
                      navigate(`/kivora/proyecto/${proyecto.uid}`, {
                        state: {
                          proyecto,
                          integrantes: grupo.integrantes
                        }
                      })
                    }
                  >
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-1">{proyecto.title}</h3>
                        <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 sm:mb-3`}>{proyecto.description}</p>
                      </div>
                      {proyecto.productOwner === grupo.propietario?._id && (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[#0B758C]/10 text-[#0B758C]">
                          <Shield className="w-3 h-3" />
                          Propietario
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-2 sm:gap-0">
                      <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{formatDate(proyecto.startDate)} - {formatDate(proyecto.endDate)}</span>
                      </div>
                      <span className={`px-2 py-1 rounded ${darkMode ? 'bg-[#036873]/20 text-[#0B758C]' : 'bg-[#036873]/10 text-[#0B758C]'}`}>
                        {proyecto.projectType}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <section className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B758C]" />
              Actividad reciente
            </h2>
            <div className={`p-4 sm:p-6 rounded-xl border ${darkMode ? 'bg-[#111] border-[#036873]/30' : 'bg-white border-[#036873]/20'}`}>
              <div className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 mb-3 sm:mb-4 border-b border-[#036873]/10">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B758C]/10 flex items-center justify-center">
                  <User2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B758C]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium">Dabp7 creó el proyecto "Sistema de Gestión Académica"</p>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hace 2 días</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B758C]/10 flex items-center justify-center">
                  <User2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B758C]" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium">asd se unió al grupo</p>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hace 1 semana</p>
                </div>
              </div>
            </div>
          </section>

          <div className="lg:hidden fixed bottom-20 right-4 z-10">
          <button
            onClick={() => setShowInviteModal(true)}
            className="p-3 rounded-full bg-[#0B758C] text-white shadow-lg"
          >
            <UserPlus className="w-6 h-6" />
          </button>
        </div>
        </main>

        <aside className={`hidden lg:block w-72 px-6 py-8 ${darkMode ? 'bg-[#0D0D0D]' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0B758C]" />
            Miembros ({grupo.integrantes?.length || 0})
          </h2>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {grupo.integrantes?.map((integrante, index) => {
              const usuario = integrante.usuario || {};
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'hover:bg-[#111]' : 'hover:bg-gray-50'}`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-[#0B758C]/10 flex items-center justify-center">
                      <User2 className="w-5 h-5 text-[#0B758C]" />
                    </div>
                    {integrante.rol === "admin" && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0B758C] flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{usuario.username || 'Usuario'}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                      {usuario.email || 'email@ejemplo.com'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-[#0B758C]' : 'text-[#036873]'}`}>
                      {integrante.rol === "admin" ? "Administrador" : "Miembro"}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-[#111]' : 'bg-gray-50'}`}>
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0B758C]" />
              Permisos del grupo
            </h3>
            <ul className={`text-xs sm:text-sm space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-center gap-2">
                <span>•</span>
                <span>Administradores pueden editar el grupo</span>
              </li>
              <li className="flex items-center gap-2">
                <span>•</span>
                <span>Miembros pueden crear proyectos</span>
              </li>
              <li className="flex items-center gap-2">
                <span>•</span>
                <span>Solo el propietario puede eliminar el grupo</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};