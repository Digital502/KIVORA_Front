import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';

export const DeleteBacklogModal = ({
  isOpen,
  onClose,
  item,
  onConfirm,
  loading
}) => {
  if (!isOpen || !item) return null;

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

          <div className="text-center">
            <Trash2 className="mx-auto text-red-500 w-8 h-8 mb-4" />
            <h2 className="text-xl font-bold mb-2">¿Eliminar item del backlog?</h2>
            <p className="text-gray-300 mb-4">
              Estás a punto de eliminar <strong>{item.title}</strong>. Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm(item.uid);
                  onClose();
                }}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
