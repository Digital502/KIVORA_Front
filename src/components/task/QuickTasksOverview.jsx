import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Clock, AlertTriangle, ChevronRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserTasks } from '../../shared/hooks/useUserTasks';

export const QuickTasksOverview = () => {
  const navigate = useNavigate();
  const { tasks, loading, getPendingTasks } = useUserTasks();
  const [recentTasks, setRecentTasks] = useState([]);

  useEffect(() => {
    if (tasks.length > 0) {
      const pendingTasks = getPendingTasks();
      const sortedTasks = pendingTasks
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setRecentTasks(sortedTasks);
    }
  }, [tasks]);

  const getStateIcon = (state) => {
    switch (state) {
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'Late':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'In Review':
        return <Eye className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'In Progress':
        return 'text-blue-400';
      case 'Late':
        return 'text-red-400';
      case 'In Review':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getUrgentTasksCount = () => {
    return tasks.filter(task => task.isUrgent && task.state !== 'finalized').length;
  };

  const getPendingCount = () => {
    return getPendingTasks().length;
  };

  if (loading) {
    return (
      <div className="bg-[#111111] border border-[#036873]/30 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111111] border border-[#036873]/30 rounded-xl p-6 hover:border-[#036873]/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CheckSquare className="w-6 h-6 text-[#0B758C]" />
          <h3 className="text-lg font-semibold">Tareas Pendientes</h3>
        </div>
        {getUrgentTasksCount() > 0 && (
          <div className="flex items-center gap-1 bg-orange-500/20 px-2 py-1 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-400 font-medium">
              {getUrgentTasksCount()} urgentes
            </span>
          </div>
        )}
      </div>

      {recentTasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">¡No tienes tareas pendientes!</p>
          <p className="text-gray-500 text-sm">Mantén el buen trabajo</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {recentTasks.map((task, index) => (
              <motion.div
                key={task.uid}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-[#0D0D0D] rounded-lg hover:bg-[#036873]/10 transition-colors cursor-pointer"
                onClick={() => navigate('/kivora/mis-tareas')}
              >
                <div className="mt-1">
                  {getStateIcon(task.state)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{task.title}</h4>
                    {task.isUrgent && (
                      <AlertTriangle className="w-3 h-3 text-orange-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{task.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${getStateColor(task.state)}`}>
                      {task.state === 'In Progress' ? 'En Progreso' : 
                       task.state === 'Late' ? 'Atrasada' : 
                       task.state === 'In Review' ? 'En Revisión' : task.state}
                    </span>
                    {task.project && (
                      <>
                        <span className="text-gray-500">•</span>
                        <span className="text-xs text-gray-500 truncate">
                          {task.project.title}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#036873]/20">
            <span className="text-sm text-gray-400">
              {getPendingCount()} tareas pendientes en total
            </span>
            <button
              onClick={() => navigate('/kivora/mis-tareas')}
              className="text-sm text-[#0B758C] hover:text-[#036873] font-medium flex items-center gap-1"
            >
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};
