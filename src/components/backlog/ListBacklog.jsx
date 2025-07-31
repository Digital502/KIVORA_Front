import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectBacklog } from '../../shared/hooks/useBacklog';
import { AlertTriangle, Check, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingSpinner } from '../loadingSpinner/LoadingSpinner';
import { EditBacklogModal } from './EditBacklogModal'; 
import { DeleteBacklogModal } from './DeleteBacklogModal'; 

export const ListBacklog = ({ isProductOwner, isScrumMaster, backlogs}) => {
  const { id } = useParams();
  const {
    loadingList,
    error,
    loading,
    handleDeleteBacklogItem,
    handleEditBacklogItem
  } = useProjectBacklog(id);

  const [editItem, setEditItem] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  if (!isProductOwner && !isScrumMaster) return null;

  if (loadingList) return (
    <div className="flex items-center justify-center p-8 text-[#0B758C]">
      <LoadingSpinner />
    </div>
  );

  if (error) return (
    <div className="bg-[#111] border border-[#036873]/30 p-4 rounded-lg flex items-start">
      <AlertTriangle className="text-red-500 mr-2 mt-0.5" />
      <div>
        <p className="text-red-400">{error}</p>
      </div>
    </div>
  );

  const handleDelete = async (uid) => {
    const confirm = window.confirm('¿Seguro que deseas eliminar este item del backlog?');
    if (confirm) {
      await handleDeleteBacklogItem(uid);
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setEditOpen(true);
  };

  return (
    <div className="space-y-4">
      {backlogs.length === 0 ? (
        <div className="bg-[#111] border border-[#036873]/30 p-8 text-center rounded-lg">
          <Check className="mx-auto h-6 w-6 text-[#0B758C] mb-2" />
          <p className="text-gray-400">No hay items en el backlog</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {backlogs.map((item) => (
              <motion.div
                key={item.uid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-[#111] border border-[#036873]/30 rounded-lg p-4 hover:border-[#0B758C]/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                    )}

                    <div className="mt-2 flex gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        item.priority === 1 ? 'bg-red-900/30 text-red-400 border-red-500/30' :
                        item.priority === 2 ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
                        'bg-green-900/30 text-green-400 border-green-500/30'
                      }`}>
                        Prioridad: {['Alta', 'Media', 'Baja'][item.priority - 1]}
                      </span>
                      <span className="text-xs px-2 py-1 bg-[#222] text-gray-400 rounded-full border border-[#036873]/30">
                        Estado: {item.state || 'Pendiente'}
                      </span>
                    </div>
                  </div>

                  {isProductOwner && (
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-[#0B758C] hover:text-[#0d91a7] transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteItem(item);
                          setDeleteOpen(true);
                        }}
                        className="text-red-500 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <EditBacklogModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        item={editItem}
        onSave={(updatedData) => handleEditBacklogItem(editItem.uid, updatedData)} 
        loading={loading}
      />
      
      <DeleteBacklogModal
      isOpen={deleteOpen}
      onClose={() => setDeleteOpen(false)}
      item={deleteItem}
      onConfirm={handleDeleteBacklogItem}
      loading={loading}
    />

    </div>
  );
};
