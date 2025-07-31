import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, X, Calendar as CalendarIcon, Target, Settings, List } from 'lucide-react';
import { useSprintForm } from '../../shared/hooks/useSprintForm';
import { useProjectView } from '../../shared/hooks/useProjectView';
import { useProjectBacklog } from '../../shared/hooks/useBacklog';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

export const SprintForm = ({ isOpen, onClose, onSprintCreated, proyecto, sprintToEdit }) => {
  const { crearNuevoSprint, actualizarSprint, obtenerSprints, isLoading } = useSprintForm();
  const { projectId, isScrumMaster } = useProjectView(proyecto);
  const { backlogs, loadingList } = useProjectBacklog(projectId);
  
  const [formData, setFormData] = useState({
    tittle: '',
    objective: '',
    project: projectId,
    dateStart: null,
    dateEnd: null,
    backlog: []
  });

  const [selectedBacklog, setSelectedBacklog] = useState(null);
  const [isBacklogDropdownOpen, setIsBacklogDropdownOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const pendingBacklogs = backlogs?.filter(backlog => backlog.state === 'Pending') || [];


  useEffect(() => {
    if (!isOpen) return;
    
    document.body.style.overflow = 'hidden';
    
    if (sprintToEdit) {
      setIsEditMode(true);
      setFormData({
        tittle: sprintToEdit.tittle,
        objective: sprintToEdit.objective || '',
        project: sprintToEdit.project,
        dateStart: new Date(sprintToEdit.dateStart),
        dateEnd: new Date(sprintToEdit.dateEnd),
        backlog: sprintToEdit.backlog || []
      });
      setSelectedBacklog(sprintToEdit.backlog?.[0] || null);
    } else {
      setIsEditMode(false);
      setFormData({
        tittle: '',
        objective: '',
        project: projectId,
        dateStart: null,
        dateEnd: null,
        backlog: []
      });
      setSelectedBacklog(null);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, projectId, sprintToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };

  const handleSelectBacklog = (backlog) => {
    setSelectedBacklog(backlog.uid);
    setIsBacklogDropdownOpen(false);
  };

  const handleRemoveBacklog = () => {
    setSelectedBacklog(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const sprintData = {
        ...formData,
        dateStart: formData.dateStart.toISOString(),
        dateEnd: formData.dateEnd.toISOString(),
        backlog: selectedBacklog ? [selectedBacklog] : []
      };

      const response = isEditMode 
        ? await actualizarSprint(sprintToEdit.uid, sprintData)
        : await crearNuevoSprint(sprintData);
      
      if (response) {
        await obtenerSprints(projectId);
        onSprintCreated(response);
        onClose();
      }
    } catch (error) {
      console.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} sprint:`, error);
      toast.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} sprint`);
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      1: { text: 'Alta', color: 'bg-red-500' },
      2: { text: 'Media', color: 'bg-yellow-500' },
      3: { text: 'Baja', color: 'bg-green-500' }
    };
    
    const { text, color } = priorityMap[priority] || { text: 'Desconocida', color: 'bg-gray-500' };
    
    return (
      <span className={`${color} text-xs text-white px-2 py-1 rounded-full`}>
        {text}
      </span>
    );
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
                  <Target className="w-6 h-6 text-[#0B758C]" />
                  {isEditMode ? 'Editar Sprint' : 'Crear nuevo Sprint'}
                </h2>
                
                <div className="flex gap-2">
                  {isEditMode && isScrumMaster && (
                    <button
                      className="p-1 rounded-full hover:bg-[#036873]/20 transition-colors"
                      title="Ajustes avanzados"
                    >
                      <Settings className="w-5 h-5 text-[#0B758C]" />
                    </button>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-[#036873]/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="tittle" className="block text-sm font-medium text-gray-300 mb-1">
                    Título del Sprint *
                  </label>
                  <input
                    id="tittle"
                    name="tittle"
                    type="text"
                    value={formData.tittle}
                    onChange={handleChange}
                    maxLength={50}
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white focus:ring-2 focus:ring-[#0B758C] focus:outline-none"
                    placeholder="Ej: Sprint 1 - Inicio del proyecto"
                    required
                    disabled={isEditMode} 
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="objective" className="block text-sm font-medium text-gray-300 mb-1">
                    Objetivo
                  </label>
                  <textarea
                    id="objective"
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    maxLength={200}
                    rows={3}
                    className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white focus:ring-2 focus:ring-[#0B758C] focus:outline-none"
                    placeholder="Ej: Implementar la autenticación y estructura base"
                    disabled={isEditMode}
                  />
                </div>

                {/* Selector de Backlog */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Backlog Pendiente
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsBacklogDropdownOpen(!isBacklogDropdownOpen)}
                      className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white flex justify-between items-center"
                      disabled={isEditMode}
                    >
                      <div className="flex items-center gap-2">
                        <List className="w-5 h-5 text-[#036873]" />
                        <span className="truncate">
                          {selectedBacklog 
                            ? pendingBacklogs.find(b => b.uid === selectedBacklog)?.title
                            : 'Seleccionar backlog'}
                        </span>
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isBacklogDropdownOpen && !isEditMode && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute z-10 w-full mt-1 bg-[#0D0D0D] border border-[#036873]/30 rounded-md shadow-lg overflow-hidden"
                        >
                          <div className="max-h-60 overflow-y-auto">
                            {loadingList ? (
                              <div className="p-3 text-center text-gray-400">Cargando backlogs...</div>
                            ) : pendingBacklogs.length === 0 ? (
                              <div className="p-3 text-center text-gray-400">No hay backlogs pendientes</div>
                            ) : (
                              pendingBacklogs.map(backlog => (
                                <div 
                                  key={backlog.uid}
                                  className="px-4 py-2 hover:bg-[#036873]/20 cursor-pointer flex items-center justify-between"
                                  onClick={() => handleSelectBacklog(backlog)}
                                >
                                  <span className="truncate">{backlog.title}</span>
                                  {getPriorityBadge(backlog.priority)}
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Backlog seleccionado */}
                {selectedBacklog && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Backlog Seleccionado
                    </label>
                    <div className="px-3 py-2 bg-[#0D0D0D] rounded-md border border-[#036873]/30 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="truncate">
                          {pendingBacklogs.find(b => b.uid === selectedBacklog)?.title}
                        </span>
                        {getPriorityBadge(pendingBacklogs.find(b => b.uid === selectedBacklog)?.priority)}
                      </div>
                      {!isEditMode && (
                        <button
                          type="button"
                          onClick={handleRemoveBacklog}
                          className="text-red-500 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="dateStart" className="block text-sm font-medium text-gray-300 mb-1">
                      Fecha de inicio *
                    </label>
                    <div className="relative">
                      <DatePicker
                        id="dateStart"
                        selected={formData.dateStart}
                        onChange={(date) => handleDateChange('dateStart', date)}
                        selectsStart
                        startDate={formData.dateStart}
                        endDate={formData.dateEnd}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecciona fecha"
                        className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white focus:ring-2 focus:ring-[#0B758C] focus:outline-none"
                        required
                        showPopperArrow={false}
                        popperClassName="!bg-[#0D0D0D] !border !border-[#036873]/30 !rounded-lg"
                        dayClassName={() => "hover:bg-[#036873]/30 text-white"}
                        weekDayClassName={() => "text-gray-400"}
                        calendarClassName="bg-[#0D0D0D] border border-[#036873]/30 text-white"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                      <CalendarIcon className="absolute right-3 top-2.5 w-5 h-5 text-[#036873] pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dateEnd" className="block text-sm font-medium text-gray-300 mb-1">
                      Fecha de fin *
                    </label>
                    <div className="relative">
                      <DatePicker
                        id="dateEnd"
                        selected={formData.dateEnd}
                        onChange={(date) => handleDateChange('dateEnd', date)}
                        selectsEnd
                        startDate={formData.dateStart}
                        endDate={formData.dateEnd}
                        minDate={formData.dateStart || new Date()}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecciona fecha"
                        className="w-full px-4 py-2 rounded-md bg-[#0D0D0D] border border-[#036873]/30 text-white focus:ring-2 focus:ring-[#0B758C] focus:outline-none"
                        required
                        showPopperArrow={false}
                        popperClassName="!bg-[#0D0D0D] !border !border-[#036873]/30 !rounded-lg"
                        dayClassName={() => "hover:bg-[#036873]/30 text-white"}
                        weekDayClassName={() => "text-gray-400"}
                        calendarClassName="bg-[#0D0D0D] border border-[#036873]/30 text-white"
                        disabled={!formData.dateStart}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                      />
                      <CalendarIcon className="absolute right-3 top-2.5 w-5 h-5 text-[#036873] pointer-events-none" />
                    </div>
                  </div>
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
                      `${isEditMode ? 'Actualizando...' : 'Creando...'}`
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5" />
                        {isEditMode ? 'Actualizar Sprint' : 'Crear Sprint'}
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