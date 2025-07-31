import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Edit, User, AlertTriangle, Tag, Paperclip } from 'lucide-react';

export const TaskEditModal = ({
  isOpen,
  onClose,
  task,
  mode,
  teamMembers,
  onSubmit,
  onQuickAction
}) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    sprint: task?.sprint?._id || task?.sprint || task?.sprintId || null,
    assignedTo: task?.assignedTo?._id || task?.assignedTo || (teamMembers[0]?._id || ''),
    tags: task?.tags?.join(', ') || '',
    isUrgent: task?.isUrgent || false,
    attachments: null
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    tags: '',
    attachments: ''
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      title: '',
      description: '',
      tags: '',
      attachments: ''
    };

    if (mode === 'full') {
      if (!formData.title.trim()) {
        newErrors.title = 'El título no puede estar vacío';
        valid = false;
      } else if (formData.title.length > 50) {
        newErrors.title = 'El título no puede exceder los 50 caracteres';
        valid = false;
      }

      if (!formData.description.trim()) {
        newErrors.description = 'La descripción no puede estar vacía';
        valid = false;
      } else if (formData.description.length > 300) {
        newErrors.description = 'La descripción no puede exceder los 300 caracteres';
        valid = false;
      }

      if (formData.tags.length > 30) {
        newErrors.tags = 'Las etiquetas no pueden exceder los 30 caracteres en total';
        valid = false;
      }
    }

    if (mode === 'attach') {
      if (!formData.attachments) {
        newErrors.attachments = 'Debe seleccionar un archivo';
        valid = false;
      } else if (formData.attachments.size > 25 * 1024 * 1024) {
        newErrors.attachments = 'El archivo no puede exceder los 25MB';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      if (mode === 'full') {
        const dataToSubmit = {
          id: task._id,
          title: formData.title,
          description: formData.description,
          sprint: formData.sprint, 
          assignedTo: formData.assignedTo,
          tags: formData.tags.split(',').map(tag => tag.trim()),
          isUrgent: formData.isUrgent
        };
        
        await onSubmit(dataToSubmit);
      } else {
        if (mode === 'attach') {
          const formDataToSend = new FormData(); 
          formDataToSend.append('attachments', formData.attachments); 
          await onQuickAction(mode, task._id, formDataToSend);
        } else if (mode === 'reassign') {
          await onQuickAction(mode, task._id, { newUserId: formData.assignedTo });
        } else {
          await onQuickAction(mode, task._id, { tags: formData.tags.split(',').map(tag => tag.trim()) });
        }
      }
      
      onClose();
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      alert(`Ocurrió un error al actualizar la tarea: ${error.message}`);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-[#1e1e1e] border border-[#036873]/30 p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold text-white">
                {mode === 'full' && 'Editar Tarea'}
                {mode === 'reassign' && 'Reasignar Tarea'}
                {mode === 'urgent' && 'Marcar como Urgente'}
                {mode === 'tags' && 'Editar Etiquetas'}
                {mode === 'attach' && 'Entregar Tarea'}
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {(mode === 'full' || mode === 'reassign') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Asignar a
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                    className="w-full bg-[#333] border border-[#444] rounded-md px-3 py-2 text-white"
                    required={mode === 'reassign'} 
                  >
                    <option value="">Seleccione un usuario</option>
                    {teamMembers.map(member => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {mode === 'full' && (
                <>
                  <div className="mb-1"> 
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-[#333] border border-[#444] rounded-md px-3 py-2 text-white"
                      maxLength={51} 
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div className="mb-1">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-[#333] border border-[#444] rounded-md px-3 py-2 text-white"
                      rows="3"
                      maxLength={301}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>
                </>
              )}

              {(mode === 'full' || mode === 'tags') && (
                <div className="mb-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Etiquetas (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full bg-[#333] border border-[#444] rounded-md px-3 py-2 text-white"
                    maxLength={31}
                  />
                  {errors.tags && (
                    <p className="mt-1 text-sm text-red-500">{errors.tags}</p>
                  )}
                </div>
              )}

              {mode === 'urgent' && (
                <div className="mb-4 flex items-center">
                  <input
                    id="isUrgent"
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isUrgent" className="text-sm text-gray-300">
                    Marcar como urgente
                  </label>
                </div>
              )}

              {mode === 'attach' && (
                <div className="mb-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Archivo de entrega
                  </label>
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <input
                      type="file"
                      onChange={(e) => setFormData({...formData, attachments: e.target.files[0]})}
                      className="w-full text-white text-sm"
                    />
                  </div>
                  {errors.attachments && (
                    <p className="mt-1 text-sm text-red-500">{errors.attachments}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Sube el archivo que demuestre la finalización de la tarea (max. 25MB)
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0B758C] hover:bg-[#0a6a7d] text-white transition-colors flex items-center gap-2"
                >
                  {mode === 'full' && <Edit className="w-4 h-4" />}
                  {mode === 'reassign' && <User className="w-4 h-4" />}
                  {mode === 'urgent' && <AlertTriangle className="w-4 h-4" />}
                  {mode === 'tags' && <Tag className="w-4 h-4" />}
                  {mode === 'full' ? 'Actualizar' : 'Confirmar'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};