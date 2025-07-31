import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, X, Users, ImageIcon, Trash2 } from 'lucide-react';
import { useCluster } from '../../shared/hooks/useCluster';
import toast from 'react-hot-toast';

export const Cluster = ({ isOpen, onClose, onGroupCreated }) => {
  const { 
    crearNuevoGrupo, 
    isLoading, 
  } = useCluster();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      toast.error('El nombre del grupo es requerido');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('descripcion', descripcion);
      
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await crearNuevoGrupo(formData);
      
      if (!response) {
        toast.error("No se pudo crear el grupo");
        return;
      }

      toast.success('Grupo creado exitosamente');
      onGroupCreated(response);
      resetForm();
      onClose();
      
    } catch (error) {
      console.error("Error al crear grupo:", error);
      toast.error(error.response?.data?.message || "Error al crear el grupo");
    }
  };

  const resetForm = () => {
    setNombre('');
    setDescripcion('');
    setProfilePicture(null);
    setPreviewImage(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={onClose}
        >
          <motion.div
            ref={modalContentRef}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-md bg-[#111] rounded-xl border border-[#036873]/30 shadow-lg max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 overflow-y-auto flex-1">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#036873]/20 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#0B758C]" />
                Crear nuevo grupo
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-6 flex flex-col items-center relative">
                  <div 
                    className="w-24 h-24 rounded-full bg-[#036873]/10 border-2 border-dashed border-[#036873]/30 flex items-center justify-center cursor-pointer overflow-hidden group"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {previewImage ? (
                      <>
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          className="absolute bottom-0 right-0 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-[#036873]/50" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <span className="mt-2 text-sm text-gray-400">Foto del grupo (opcional)</span>
                </div>

                <div className="mb-4">
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre del grupo *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    maxLength={50}
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white focus:ring-2 focus:ring-[#0B758C] focus:outline-none"
                    placeholder="Ej: Equipo de desarrollo"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    maxLength={200}
                    rows={3}
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white focus:ring-2 focus:ring-[#0B758C] focus:outline-none"
                    placeholder="Ej: Grupo para el desarrollo del proyecto X"
                  />
                </div>

                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 rounded-md font-medium bg-gradient-to-r from-[#036873] to-[#0B758C] text-white shadow hover:from-[#0B758C] hover:to-[#036873] disabled:opacity-50"
                  >
                    {isLoading ? (
                      'Creando...'
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5" />
                        Crear grupo
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