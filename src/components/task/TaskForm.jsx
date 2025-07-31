import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, FileText, Paperclip, Check } from 'lucide-react';
import { useProjectView } from '../../shared/hooks/useProjectView';
import { useProjectTasks } from '../../shared/hooks/useTasks';
import toast from 'react-hot-toast';

export const TaskForm = ({ isOpen, onClose, sprint, projectId, teamMembers, onTaskCreated }) => {
  const { isScrumMaster } = useProjectView();
  const { handleAddTask, loading } = useProjectTasks();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: ''
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    assignedTo: ''
  });

  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    
    setFormData({
      title: '',
      description: '',
      assignedTo: ''
    });
    setSelectedFiles([]);
    setErrors({
      title: '',
      description: '',
      assignedTo: ''
    });

    return () => {};
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      title: '',
      description: '',
      assignedTo: ''
    };

    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
      valid = false;
    } else if (formData.title.length > 50) {
      newErrors.title = 'El título no puede exceder los 50 caracteres';
      valid = false;
    }

  if (!formData.description.trim()) {
      newErrors.description = 'La description es obligatorio';
      valid = false;
    }else if (formData.description.length > 300) {
      newErrors.description = 'La descripción no puede exceder los 300 caracteres';
      valid = false;
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Debe asignar la tarea a un usuario';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!sprint?.uid) {
      toast.error('No se ha seleccionado un sprint válido');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('sprint', sprint.uid);
      formDataToSend.append('project', projectId);
      
      if (formData.assignedTo) {
        formDataToSend.append('assignedTo', formData.assignedTo);
      }
      
      selectedFiles.forEach(file => {
        formDataToSend.append('attachments', file);
      });

      const result = await handleAddTask(formDataToSend);
      
      if (result.status === 'success') {
        toast.success('Tarea creada exitosamente!');
        onClose();
        if (onTaskCreated) { 
          onTaskCreated(); 
        }
      }
    } catch (error) {
      console.error('Error al crear tarea:', error);
      toast.error(error.response?.data?.message || 'Error al crear tarea');
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
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-[#0B758C]" />
                  Crear nueva Tarea
                </h2>
                
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-[#036873]/20 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-1"> {/* Cambiado a mb-1 para dejar espacio al mensaje de error */}
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                    Título de la Tarea *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white focus:ring-2 focus:ring-[#0B758C] focus:outline-none"
                    placeholder="Ej: Implementar formulario de login"
                    maxLength={51}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="mb-1">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white focus:ring-2 focus:ring-[#0B758C] focus:outline-none"
                    placeholder="Describe los detalles de la tarea..."
                    maxLength={301}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Sprint
                  </label>
                  <div className="px-3 py-2 bg-[#0D0D0D] rounded-md border border-[#036873]/30">
                    {sprint?.tittle || 'No se ha seleccionado un sprint'}
                  </div>
                </div>

                {teamMembers?.length > 0 && (
                  <div className="mb-1">
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-1">
                      <User className="w-4 h-4" /> Asignar a *
                    </label>
                    <select
                      id="assignedTo"
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white focus:ring-2 focus:ring-[#0B758C] focus:outline-none"
                    >
                      <option value="">Seleccione un usuario</option>
                      {teamMembers
                        .filter(member => member._id) 
                        .map(member => (
                          <option key={member._id} value={member._id}>
                            {member.name} ({member.email})
                          </option>
                        ))}
                    </select>
                    {errors.assignedTo && (
                      <p className="mt-1 text-sm text-red-500">{errors.assignedTo}</p>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 rounded-md font-medium bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow hover:from-[#0B758C] hover:to-[#036873] disabled:opacity-50"
                  >
                    {loading ? (
                      'Creando...'
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Crear Tarea
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