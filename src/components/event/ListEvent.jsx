import { useEffect, useState } from "react";
import { useEvent } from "../../shared/hooks/useEvent";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Trash2, Pencil, Users, X } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FormEvent } from "./FormEvent";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import { useSprintForm } from "../../shared/hooks/useSprintForm";
import { useProjectView } from "../../shared/hooks/useProjectView";
import { useLocation } from "react-router-dom";

export const ListEvent = () => {
  const { eventos, obtenerEventos, isLoading, marcarAsistenciaEvento, eliminarEvento, actualizarEvento } = useEvent();
  const [asistencia, setAsistencia] = useState({});
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [eventoAEditar, setEventoAEditar] = useState(null);
  const { sprintsList, obtenerSprints } = useSprintForm();
  const { state } = useLocation();
  
  const { proyecto, integrantes } = state || {};
  const { isScrumMaster, isProductOwner, projectId } = useProjectView(proyecto);

   useEffect(() => {
      if (projectId) {
        obtenerSprints(projectId);
      }
    }, [projectId]);

    useEffect(() => {
      const interval = setInterval(async () => {
        const now = new Date();

        for (const evento of eventos) {
          const fechaEvento = new Date(evento.fecha);
          const finEvento = new Date(fechaEvento.getTime() + 10 * 60000); 
          let nuevoEstado = null;

          if (now >= fechaEvento && now < finEvento && evento.statusEvent !== "En Curso") {
            nuevoEstado = "En Curso";
          } else if (now >= finEvento && evento.statusEvent !== "Finalizado") {
            nuevoEstado = "Finalizado";
          }

          if (nuevoEstado) {
            await actualizarEvento(evento._id, { statusEvent: nuevoEstado });
            await obtenerEventos(); 
          }
        }
      }, 60000); 

      return () => clearInterval(interval);
    }, [eventos]);

  const ConfirmModal = ({ isOpen, onClose, onConfirm, eventName }) => (
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
                <h2 className="text-xl font-semibold">Eliminar evento</h2>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
                </button>
            </div>

            <p className="mt-4 text-gray-300">
                ¿Estás seguro de que deseas eliminar el evento{" "}
                <span className="text-white font-bold">{eventName}</span>?
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

  useEffect(() => {
    obtenerEventos();
  }, []);

  useEffect(() => {
    if (!showFormModal) { 
      obtenerEventos();
    }
  }, [showFormModal]);

  const toggleAsistencia = async (eventoId, userId) => {
    setAsistencia(prev => ({
      ...prev,
      [eventoId]: {
        ...(prev[eventoId] || {}),
        [userId]: !(prev[eventoId]?.[userId] || false),
      }
    }));

    const presente = !(asistencia[eventoId]?.[userId] || false);

    const exito = await marcarAsistenciaEvento({ eventId: eventoId, userId, presente });

    if (!exito) {
      setAsistencia(prev => ({
        ...prev,
        [eventoId]: {
          ...(prev[eventoId] || {}),
          [userId]: !presente,
        }
      }));
      toast.error("No se pudo actualizar la asistencia.");
    }
  };

  const confirmarEliminar = (eventoId) => {
    setEventoAEliminar(eventoId);
    setShowModalEliminar(true);
  };

  const handleEliminar = async () => {
    if (!eventoAEliminar) return;

    const exito = await eliminarEvento(eventoAEliminar);
    if (exito) {
      toast.success("Evento eliminado.");
    }
    setShowModalEliminar(false);
    setEventoAEliminar(null);
  };

  const handleCancelarEliminar = () => {
    setShowModalEliminar(false);
    setEventoAEliminar(null);
  };

  const handleEditar = (evento) => {
    setEventoAEditar(evento);
    setShowFormModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {isLoading ? (
          <LoadingSpinner/>
        ) : eventos.length === 0 ? (
          <p className="text-white">No hay eventos registrados.</p>
        ) : (
          eventos.map(evento => {
            const fechaEvento = new Date(evento.fecha);
            const estado = evento.statusEvent || (fechaEvento < new Date() ? "Finalizado" : "Pendiente");

            return (
              <motion.div
                key={evento._id}
                whileHover={{ scale: 1.02 }}
                className="bg-[#111] text-white rounded-lg border border-[#036873]/40 p-4 shadow-md flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B758C]">{evento.tipoEvento}</h3>
                    <p className="text-sm text-gray-400">
                      {evento.descripcion || "Sin enlace"}
                    </p>
                  </div>
                  {isScrumMaster && (
                    <div className="flex gap-2">
                      <button onClick={() => handleEditar(evento)} title="Editar">
                        <Pencil className="w-5 h-5 text-yellow-500 hover:scale-110 transition" />
                      </button>
                      <button onClick={() => confirmarEliminar(evento._id)} title="Eliminar">
                        <Trash2 className="w-5 h-5 text-red-500 hover:scale-110 transition" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Fecha y estado */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-[#0B758C]" />
                  <span>{format(fechaEvento, "dd/MM/yyyy HH:mm")}</span>
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-xs ${
                      estado === "Finalizado"
                        ? "bg-red-600"
                        : estado === "En Curso"
                        ? "bg-yellow-600"
                        : estado === "Cancelado"
                        ? "bg-gray-500"
                        : "bg-green-600"
                    }`}
                  >
                    {estado}
                  </span>
                </div>

                {/* Asistencia del grupo */}
                {evento?.sprint?.project?.cluster?.integrantes?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-[#0B758C] mb-2">
                      <Users className="w-5 h-5" />
                      Asistencia del Grupo
                    </h4>
                    <ul className="grid gap-2">
                      {evento.sprint.project.cluster.integrantes.map(int => {
                        const user = int.usuario;
                        if (!user) return null;

                        const estaPresente =
                          evento.asistencia?.find(a => a.usuario === user._id)?.presente ||
                          asistencia[evento._id]?.[user._id] ||
                          false;

                        return (
                          <li
                            key={user._id}
                            className="flex items-center justify-between bg-[#0d0d0d] px-4 py-2 rounded-md border border-[#036873]/30"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#036873]/30 flex items-center justify-center text-sm font-semibold text-white">
                                {user.name?.[0]?.toUpperCase() || "?"}
                              </div>
                              <span className="text-sm text-white">{user.name || "Sin nombre"}</span>
                            </div>
                            {isScrumMaster && (
                                <button
                                  onClick={() => toggleAsistencia(evento._id, user._id)}
                                  className={`px-3 py-1 text-sm rounded-full transition-all duration-200 font-medium ${
                                    estaPresente
                                      ? "bg-green-600 text-white hover:bg-green-700"
                                      : "bg-gray-700 text-white hover:bg-gray-600"
                                  }`}
                                >
                                  {estaPresente ? "Presente" : "Ausente"}
                                </button>
                              )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {showModalEliminar && (
          <ConfirmModal
            isOpen={showModalEliminar}
            message="¿Estás seguro que deseas eliminar este evento?"
            onConfirm={handleEliminar}
            onCancel={handleCancelarEliminar}
          />
        )}
      </AnimatePresence>
      <FormEvent
        isOpen={showFormModal}
        onClose={() => {
            setShowFormModal(false);
            setEventoAEditar(null);
            obtenerEventos();
        }}
        sprintList={sprintsList}
        eventToEdit={eventoAEditar}
        onEventCreated={() => {
            setShowFormModal(false);
            setEventoAEditar(null);
            obtenerEventos();
        }}
      />
    </>
  );
};
