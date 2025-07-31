import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, Users, ClipboardList, PlusCircle, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { useEvent } from '../../shared/hooks/useEvent';
import { useCluster } from '../../shared/hooks/useCluster';
import { useParams } from 'react-router-dom';

export const FormEvent = ({ isOpen, onClose, sprintList, eventToEdit, onEventCreated }) => {
  const { crearEvento, actualizarEvento, isLoading } = useEvent();
  const { obtenerDetalleGrupo } = useCluster();
  const { projectId } = useParams();

  const [formData, setFormData] = useState({
    tipoEvento: '',
    descripcion: '',
    fecha: null,
    sprint: '',
    participantes: []
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';

    if (projectId) {
      obtenerDetalleGrupo(projectId);
    }

    if (eventToEdit) {
      setIsEditMode(true);
      setFormData({
        tipoEvento: eventToEdit.tipoEvento || '',
        descripcion: eventToEdit.descripcion || '',
        fecha: eventToEdit.fecha ? new Date(eventToEdit.fecha) : null,
        sprint: eventToEdit.sprint?._id || '',
        participantes: eventToEdit.participantes?.map(p => p._id) || []
      });
    } else {
      setIsEditMode(false);
      setFormData({
        tipoEvento: '',
        descripcion: '',
        fecha: null,
        sprint: '',
        participantes: []
      });
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, eventToEdit, projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, fecha: date }));
  };

  const toggleParticipante = (userId) => {
    setFormData(prev => ({
      ...prev,
      participantes: prev.participantes.includes(userId)
        ? prev.participantes.filter(id => id !== userId)
        : [...prev.participantes, userId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      fecha: formData.fecha?.toISOString(),
    };

    try {
      let result;
      if (isEditMode && eventToEdit?._id) {
        result = await actualizarEvento(eventToEdit._id, dataToSend);
      } else {
        result = await crearEvento(dataToSend);
      }

      if (result) {
        toast.success(isEditMode ? 'Evento actualizado' : 'Evento creado');
        onEventCreated?.(result);
        onClose();
      }
    } catch (error) {
      toast.error("Error al procesar el evento");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-md bg-[#111] rounded-xl border border-[#036873]/30 shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-[#0B758C]" />
                  {isEditMode ? 'Editar Evento' : 'Crear Evento'}
                </h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-[#036873]/20 transition-colors">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Tipo de Evento */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Evento *</label>
                  <select
                    name="tipoEvento"
                    value={formData.tipoEvento}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white"
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="Sprint Planning">Sprint Planning</option>
                    <option value="Daily Scrum">Daily Scrum</option>
                    <option value="Sprint Review">Sprint Review</option>
                    <option value="Sprint Retrospective">Sprint Retrospective</option>
                  </select>
                </div>

                {/* Link de reunión */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Link de reunión</label>
                  <input
                    name="descripcion"
                    type="url"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/..."
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white"
                  />
                </div>

                {/* Fecha y hora */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Fecha y Hora *</label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.fecha}
                      onChange={handleDateChange}
                      minDate={new Date()}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy HH:mm"
                      placeholderText="Selecciona fecha y hora"
                      className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white"
                      required
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 w-5 h-5 text-[#036873]" />
                  </div>
                </div>

                {/* Select de Sprints */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Sprint *</label>
                  <select
                    name="sprint"
                    value={formData.sprint}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white"
                  >
                    <option value="">Selecciona un Sprint</option>
                    {sprintList?.map((s) => (
                      <option key={s.uid} value={s.uid}>
                        {s.tittle}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón */}
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 rounded-md font-medium bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow hover:from-[#0B758C] hover:to-[#036873] disabled:opacity-50"
                  >
                    {isLoading ? (
                      `${isEditMode ? 'Actualizando...' : 'Creando...'}`
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5" />
                        {isEditMode ? 'Actualizar Evento' : 'Crear Evento'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
