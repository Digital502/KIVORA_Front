import React, { useEffect, useState } from "react";
import { usePerfilUsuario } from "../../shared/hooks/usePerfilUsuario";
import {LoadingSpinner} from "../loadingSpinner/LoadingSpinner"
import { validatePerfil, validateCambioPassword, validateImagenPerfil } from "../../shared/validators/perfilValidators";
import { 
  Users, KanbanSquare, Settings, MessageCircle, Sun, Moon,
  UserCircle, History, LogOut, Edit, Trash2, 
  Lock, X, Upload, Eye, EyeOff 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FooterHome } from "../footer/FooterHome";
import { NavbarDashboard } from "../navs/NavbarDashboard";
import { useNavigate } from 'react-router-dom';

export const PerfilUsuario = () => {
  const {
    perfil,
    isLoading,
    fetchMyUser,
    actualizarPerfil,
    cambiarContrasena,
    eliminarCuenta,
    actualizarFotoPerfil,
  } = usePerfilUsuario();

  const [form, setForm] = useState({
    name: "",
    surname: "",
    username: "",
    phone: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [editarPerfil, setEditarPerfil] = useState(false);
  const [editarPassword, setEditarPassword] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [editarFoto, setEditarFoto] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorImagen, setErrorImagen] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Tu Perfil', icon: <UserCircle />, onClick: () => navigate('/kivora/perfil') },
    { label: 'Chat', icon: <MessageCircle />, onClick: () => navigate('/kivora/chatPage') },
    { label: 'Grupos', icon: <Users />, onClick: () => navigate('/kivora/grupos') },
    { label: 'Proyectos', icon: <KanbanSquare />, onClick: () => navigate('/kivora/proyectos') },
    { label: 'Ajustes', icon: <Settings />, onClick: () => navigate('/kivora/ajustes') },
    { label: 'Historial', icon: <History />, onClick: () => navigate('/kivora/historial') },
    { label: 'Salir', icon: <LogOut />, onClick: handleLogout }
  ];

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const handleImagenChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagenSeleccionada(e.target.files[0]);
    }
  };

  const handleSubirImagen = async () => {
    const result = validateImagenPerfil(imagenSeleccionada);
    if (!result.isValid) {
      setErrorImagen(result.message);
      return;
    }

    await actualizarFotoPerfil(imagenSeleccionada);
    setImagenSeleccionada(null);
    setErrorImagen("");
    setEditarFoto(false);
  };

  useEffect(() => {
    fetchMyUser();
  }, []);

  useEffect(() => {
    if (perfil) {
      setForm({
        name: perfil.name || "",
        surname: perfil.surname || "",
        username: perfil.username || "",
        phone: perfil.phone || "",
        email: perfil.email || "",
        oldPassword: "",
        newPassword: "",
      });
    }
  }, [perfil]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleActualizar = async () => {
    const result = validatePerfil(form);
    if (!result.isValid) {
      setErrorPerfil(result.message);
      return;
    }

    const { name, surname, username, phone, email } = form;
    await actualizarPerfil({ name, surname, username, phone, email });
    setEditarPerfil(false);
    setErrorPerfil("");
  };

  const handleCambiarPassword = async () => {
    const result = validateCambioPassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });

    if (!result.isValid) {
      setErrorPassword(result.message);
      return;
    }

    await cambiarContrasena({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });
    setForm((prev) => ({ ...prev, oldPassword: "", newPassword: "" }));
    setEditarPassword(false);
    setErrorPassword("");
  };

  const handleCancelarEdicion = () => {
    setEditarPerfil(false);
    setEditarPassword(false);
    setEditarFoto(false);
    setErrorPerfil("");
    setErrorPassword("");
    setErrorImagen("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0D0D] text-white">
      <NavbarDashboard />
      
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Sidebar para desktop */}
        <aside className="lg:w-64 px-4 py-6 lg:px-6 lg:py-8 border-r border-[#036873]/20 bg-[#0D0D0D] hidden lg:flex lg:flex-col justify-between">
          <nav className="space-y-2 lg:space-y-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick} 
                className="flex items-center gap-3 w-full px-3 py-2 lg:px-4 lg:py-2 rounded-lg transition-colors hover:bg-[#036873]/10 text-white"
              >
                {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

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
        <main className="flex-1 py-6 px-4 sm:py-8 sm:px-6 lg:py-10 lg:px-10 pb-20 lg:pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-[#036873]/30 shadow-md p-6 mb-6 bg-[#111111]"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Perfil de Usuario</h1>
            
              {isLoading ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0D]/90">
                  <LoadingSpinner />
                </div>
              ) : perfil ? (
              <div className="space-y-6 sm:space-y-8">
                {/* Sección Foto de Perfil */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
                  <div className="flex-shrink-0 mx-auto sm:mx-0">
                    {perfil.imageUrl ? (
                      <img
                        src={perfil.imageUrl}
                        alt="Foto de perfil"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-[#0B758C]"
                      />
                    ) : (
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-2 border-[#0B758C] bg-[#111]">
                        <UserCircle className="w-16 h-16 sm:w-20 sm:h-20 text-[#0B758C]" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                      <h2 className="text-lg sm:text-xl font-semibold">Foto de perfil</h2>
                      <motion.button
                        onClick={() => {
                          setEditarFoto(!editarFoto);
                          setErrorImagen("");
                          setImagenSeleccionada(null);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow"
                      >
                        {editarFoto ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        {editarFoto ? "Cancelar" : "Editar foto"}
                      </motion.button>
                    </div>
                    
                    {editarFoto && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 rounded-lg bg-[#0D0D0D]"
                      >
                        <label className="block mb-2 text-sm font-medium">
                          Seleccionar nueva imagen
                        </label>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImagenChange}
                            className="w-full px-3 py-2 rounded-md border text-sm bg-[#0D0D0D] border-[#036873]/50"
                          />
                          <motion.button
                            onClick={handleSubirImagen}
                            disabled={!imagenSeleccionada}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 ${
                              imagenSeleccionada 
                                ? 'bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Upload className="w-4 h-4" />
                            Subir
                          </motion.button>
                        </div>
                        {errorImagen && (
                          <p className="mt-2 text-sm text-red-500">{errorImagen}</p>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Sección Información Personal */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Información Personal</h2>
                    {!editarPerfil && !editarPassword && (
                      <motion.button
                        onClick={() => setEditarPerfil(!editarPerfil)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow"
                      >
                        <Edit className="w-4 h-4" />
                        Editar información
                      </motion.button>
                    )}
                  </div>

                  {!editarPerfil ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">Nombre</p>
                        <p className="text-base sm:text-lg">{perfil.name || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">Apellido</p>
                        <p className="text-base sm:text-lg">{perfil.surname || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">Nombre de usuario</p>
                        <p className="text-base sm:text-lg">{perfil.username || "-"}</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400">Correo electrónico</p>
                        <p className="text-base sm:text-lg">{perfil.email || "-"}</p>
                      </div>
                      <div className="xs:col-span-2">
                        <p className="text-xs sm:text-sm text-gray-400">Teléfono</p>
                        <p className="text-base sm:text-lg">{perfil.phone || "-"}</p>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 sm:p-6 rounded-lg bg-[#0D0D0D]"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">Nombre</label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:outline-none bg-[#111] border-[#036873]/50 text-white focus:ring-[#0B758C]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">Apellido</label>
                          <input
                            type="text"
                            name="surname"
                            value={form.surname}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:outline-none bg-[#111] border-[#036873]/50 text-white focus:ring-[#0B758C]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">Nombre de usuario</label>
                          <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:outline-none bg-[#111] border-[#036873]/50 text-white focus:ring-[#0B758C]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">Correo electrónico</label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:outline-none bg-[#111] border-[#036873]/50 text-white focus:ring-[#0B758C]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs sm:text-sm font-medium mb-1">Teléfono</label>
                          <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:outline-none bg-[#111] border-[#036873]/50 text-white focus:ring-[#0B758C]"
                          />
                        </div>
                      </div>
                      {errorPerfil && (
                        <p className="mt-4 text-sm text-red-500">{errorPerfil}</p>
                      )}
                      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
                        <motion.button
                          onClick={handleCancelarEdicion}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-md text-sm font-medium border border-gray-500 text-gray-500 hover:bg-gray-500/10"
                        >
                          Cancelar
                        </motion.button>
                        <motion.button
                          onClick={handleActualizar}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow"
                        >
                          Guardar cambios
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sección Contraseña */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Seguridad</h2>
                    {!editarPerfil && !editarPassword && (
                      <motion.button
                        onClick={() => setEditarPassword(!editarPassword)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow"
                      >
                        <Lock className="w-4 h-4" />
                        Cambiar contraseña
                      </motion.button>
                    )}
                  </div>

                  {editarPassword && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 p-4 sm:p-6 rounded-lg bg-[#0D0D0D]"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">Contraseña actual</label>
                          <div className="relative">
                            <input
                              type={showOldPassword ? "text" : "password"}
                              name="oldPassword"
                              value={form.oldPassword}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:outline-none bg-[#111] border-[#036873]/50 text-white focus:ring-[#0B758C]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showOldPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium mb-1">Nueva contraseña</label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={form.newPassword}
                              onChange={handleChange}
                              className="w-full px-3 py-2 rounded-md border focus:ring-2 focus:outline-none bg-[#111] border-[#036873]/50 text-white focus:ring-[#0B758C]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                      {errorPassword && (
                        <p className="mt-4 text-sm text-red-500">{errorPassword}</p>
                      )}
                      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
                        <motion.button
                          onClick={handleCancelarEdicion}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-md text-sm font-medium border border-gray-500 text-gray-500 hover:bg-gray-500/10"
                        >
                          Cancelar
                        </motion.button>
                        <motion.button
                          onClick={handleCambiarPassword}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow"
                        >
                          Actualizar contraseña
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sección Eliminar Cuenta */}
                {!editarPerfil && !editarPassword && (
                  <div className="pt-6 border-t border-[#036873]/20">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-red-500">Zona peligrosa</h2>
                    <div className="p-4 sm:p-6 rounded-lg bg-[#0D0D0D]">
                      <p className="mb-4 text-sm sm:text-base">Al eliminar tu cuenta, todos tus datos serán borrados permanentemente. Esta acción no se puede deshacer.</p>
                      <motion.button
                        onClick={eliminarCuenta}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-red-500 text-white shadow hover:bg-red-600 w-full sm:w-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar cuenta permanentemente
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p>No se encontró información del usuario.</p>
            )}
          </motion.div>
        </main>
      </div>

      <FooterHome />
    </div>
  );
};