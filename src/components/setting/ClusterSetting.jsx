import React, { useState, useEffect } from "react";
import { Trash2, Pencil, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useCluster } from "../../shared/hooks/useCluster";
import { NavbarDashboard } from "../navs/NavbarDashboard";
import { SidebarCluster } from "../navs/SidebarCluster";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import { FooterHome } from "../footer/FooterHome";

export const ClusterSetting = () => {
  const { id } = useParams();

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

    const grupoActualizado = await editarDescripcionGrupo(grupo._id, descripcion);
     if (editadoConExito) {
    const grupoActualizadoCompleto = await obtenerDetalleGrupo(grupo._id);

    if (grupoActualizadoCompleto) {
      setGrupo(grupoActualizadoCompleto);
      setDescripcion(grupoActualizadoCompleto.descripcion || "");
    }

    setEditMode(false);
  }
  };

  const handleEliminar = async (usuario) => {
    if (!grupo) return;
    if (confirm(`¿Eliminar a ${usuario.nombre || usuario.email}?`)) {
      const grupoActualizado = await eliminarIntegranteGrupo(
        grupo._id,
        usuario.email || usuario.username
      );
      if (grupoActualizado) {
        setGrupo(grupoActualizado);
      }
    }
  };

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
        <SidebarCluster />

        <main className="flex-1 px-6 py-10 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-8 border border-[#036873]/30 p-6 rounded-2xl bg-[#111] shadow-md"
          >
            {/* Título */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#0B758C]">Configuración del Grupo</h2>
            </div>

            {/* Descripción */}
            <div className="space-y-3">
              <label className="text-sm text-gray-400">Descripción del grupo</label>
              {editMode ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#1a1a1a] border border-[#036873]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B758C]"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleGuardarDescripcion}
                    disabled={isLoading}
                    className="bg-[#0B758C] px-3 py-2 rounded-lg hover:bg-[#0d91a7] transition"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#036873]/30">
                  <p className="text-gray-300">{descripcion || "Sin descripción"}</p>
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
              <h3 className="text-lg font-semibold text-gray-300">Integrantes del grupo</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {grupo.integrantes?.length > 0 ? (
                  grupo.integrantes.map((i, idx) => {
                    const usuario = i.usuario || i || {};
                    return (
                      <motion.div
                        key={usuario._id || idx}
                        whileHover={{ scale: 1.02 }}
                        className="flex justify-between items-center bg-[#0F0F0F] border border-[#036873]/30 px-4 py-3 rounded-xl"
                      >
                        <div>
                          <p className="text-white font-medium">
                            {usuario.nombre || usuario.username || "Sin nombre"}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {usuario.email || "Sin email"}
                          </p>
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
                  <p className="text-gray-500">No hay integrantes en este grupo.</p>
                )}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    <FooterHome/>
    </div>
  );
};
