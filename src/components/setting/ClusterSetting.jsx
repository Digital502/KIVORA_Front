import React, { useState, useEffect } from "react";
import {
  Trash2, Pencil, Save, Users, Settings, ChevronLeft, User2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useCluster } from "../../shared/hooks/useCluster";
import { NavbarDashboard } from "../navs/NavbarDashboard";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import { FooterHome } from "../footer/FooterHome";
import { SidebarCluster } from "../navs/SidebarCluster";

export const ClusterSetting = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const {
    grupoActual,
    isLoading,
    eliminarIntegranteGrupo,
    editarDescripcionGrupo,
    obtenerDetalleGrupo,
  } = useCluster();

  const [descripcion, setDescripcion] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [grupo, setGrupo] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    const cargarGrupo = async () => {
      if (id) {
        const grupoDetalle = await obtenerDetalleGrupo(id);
        if (grupoDetalle) {
          setGrupo(grupoDetalle);
          setDescripcion(grupoDetalle.descripcion || "");
        } else {
          setGrupo(null);
          setDescripcion("");
        }
      }
    };
    cargarGrupo();
  }, [id, obtenerDetalleGrupo]);

  useEffect(() => {
    if (grupoActual && grupoActual._id === id) {
      setGrupo(grupoActual);
      setDescripcion(grupoActual.descripcion || "");
    }
  }, [grupoActual, id]);

  const handleGuardarDescripcion = async () => {
    if (!descripcion.trim() || !grupo) return;

    const editadoConExito = await editarDescripcionGrupo(grupo._id, descripcion);
    if (editadoConExito) {
      const grupoActualizadoCompleto = await obtenerDetalleGrupo(grupo._id);
      if (grupoActualizadoCompleto) {
        setGrupo(grupoActualizadoCompleto);
        setDescripcion(grupoActualizadoCompleto.descripcion || "");
      }
      setEditMode(false);
    }
  };

  const handleEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setShowConfirmModal(true);
  };

  const confirmarEliminacion = async () => {
    if (!grupo || !usuarioSeleccionado) return;

    const grupoActualizado = await eliminarIntegranteGrupo(
      grupo._id,
      usuarioSeleccionado.email || usuarioSeleccionado.username
    );

    if (grupoActualizado) {
      setGrupo(grupoActualizado);
    }

    setShowConfirmModal(false);
    setUsuarioSeleccionado(null);
  };

  const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, userName }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-[#111] text-white p-6 rounded-xl border border-[#036873]/30 shadow-lg w-full max-w-md"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-2 items-center">
                <Trash2 className="w-6 h-6 text-red-500" />
                <h2 className="text-xl font-semibold">Eliminar integrante</h2>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-4 text-gray-300">
              ¿Estás seguro de que deseas eliminar a{" "}
              <span className="text-white font-bold">{userName}</span> del grupo?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm bg-gray-700 hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-md text-sm bg-red-600 hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!grupo) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0D0D0D] text-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col">
      <NavbarDashboard />
      <div className="flex flex-1">
      <div className="hidden md:block">
        <SidebarCluster
          id={id}
          setShowProjectModal={setShowProjectModal}
          setShowInviteModal={setShowInviteModal}
        />
      </div>
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-10 pb-20 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 border border-[#036873]/30 p-6 rounded-2xl bg-[#111] shadow-md"
          >
            <motion.button
              onClick={() => navigate(`/kivora/cluster/${id}`)}
              whileHover={{ x: -2 }}
              className="flex items-center gap-2 mb-6 text-[#0B758C] group"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Volver al grupo</span>
            </motion.button>

            <div className="flex justify-between items-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#0B758C]">
                Configuración del Grupo
              </h2>
            </div>

            {/* Descripción */}
            <div className="space-y-3 lg:space-y-4">
              <label className="text-sm lg:text-base text-gray-400">
                Descripción del grupo
              </label>
              {editMode ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="flex-1 px-4 py-2 lg:py-3 bg-[#1a1a1a] border border-[#036873]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B758C]"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleGuardarDescripcion}
                    disabled={isLoading}
                    className="bg-[#0B758C] px-3 py-2 lg:py-3 rounded-lg hover:bg-[#0d91a7] transition"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-[#1a1a1a] px-4 py-3 lg:py-4 rounded-lg border border-[#036873]/30">
                  <p className="text-gray-300 lg:text-base">
                    {descripcion || "Sin descripción"}
                  </p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-[#0B758C] hover:text-[#0d91a7]"
                    disabled={isLoading}
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Lista de integrantes */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-300">
                  Integrantes del grupo
                </h3>
                <span className="text-sm text-gray-400">
                  {grupo.integrantes?.length || 0} miembros
                </span>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                {grupo.integrantes?.length > 0 ? (
                  grupo.integrantes.map((i, idx) => {
                    const usuario = i.usuario || i || {};
                    return (
                      <motion.div
                        key={usuario._id || idx}
                        whileHover={{ scale: 1.02 }}
                        className="flex justify-between items-center bg-[#0F0F0F] border border-[#036873]/30 px-4 py-3 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0B758C]/10 flex items-center justify-center">
                            <User2 className="w-4 h-4 text-[#0B758C]" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {usuario.nombre || usuario.username || "Sin nombre"}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {usuario.email || "Sin email"}
                            </p>
                          </div>
                        </div>
                        {usuario._id !== grupo.propietario && (
                          <button
                            onClick={() => handleEliminar(usuario)}
                            className="text-red-500 hover:text-red-600"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 py-4 text-center">
                    No hay integrantes en este grupo.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
          <br /><br />
        </main>
      </div>

      <FooterHome />

      {/* Modal de confirmación */}
      <ConfirmDeleteModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmarEliminacion}
        userName={
          usuarioSeleccionado?.nombre || usuarioSeleccionado?.email || "este usuario"
        }
      />
    </div>
  );
};
