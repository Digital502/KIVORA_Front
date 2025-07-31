import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { validateTitle, validateTitleMessage, validateDescription, validateDescriptionMessage } from '../../shared/validators/validateBacklog';

export const FormBacklog = ({
  isOpen,
  onClose,
  newItemData,
  setNewItemData,
  handleAddBacklogItem,
  loading,
  error,
  success,
  onSuccess
}) => {
  if (!isOpen) return null;

const [localError, setLocalError] = React.useState('');

  const onChange = (e) => {
    const { name, value } = e.target;
    setNewItemData(prev => ({
      ...prev,
      [name]: name === 'priority' ? Number(value) : value,
    }));
  };

const onSubmit = async (e) => {
  e.preventDefault();

  if (!validateTitle(newItemData.title)) {
    setLocalError(validateTitleMessage);
    return;
  }

  if (!validateDescription(newItemData.description)) {
    setLocalError(validateDescriptionMessage);
    return;
  }

  setLocalError('');
  const result = await handleAddBacklogItem();

  if (result === 'success') {
    onClose();
    onSuccess?.();
  }
};

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-[#0D0D0D]/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-xl shadow-lg p-6 border bg-[#111] border-[#036873]/50 text-white"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold mb-4 text-center">Agregar nuevo item</h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={newItemData.title}
                onChange={onChange}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0B758C] bg-[#222] border-gray-700 text-white"
                placeholder="Título del item"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="description"
                value={newItemData.description}
                onChange={onChange}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0B758C] bg-[#222] border-gray-700 text-white"
                placeholder="Descripción del item"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Prioridad</label>
              <select
                name="priority"
                value={newItemData.priority}
                onChange={onChange}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0B758C] bg-[#222] border-gray-700 text-white"
              >
                <option value={1}>Alta</option>
                <option value={2}>Media</option>
                <option value={3}>Baja</option>
              </select>
            </div>

            {localError && <p className="text-red-500 text-sm">{localError}</p>}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-[#0B758C] hover:bg-[#0a6a7d] text-white"
              >
                {loading ? 'Guardando...' : 'Agregar'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};