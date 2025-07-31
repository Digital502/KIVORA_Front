import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertTriangle, Eye, BarChart3 } from 'lucide-react';

export const TaskStats = ({ tasks }) => {
  const stats = [
    {
      label: 'En Progreso',
      count: tasks.filter(task => task.state === 'In Progress').length,
      icon: <Clock className="w-5 h-5" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Atrasadas',
      count: tasks.filter(task => task.state === 'Late').length,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    },
    {
      label: 'En Revisión',
      count: tasks.filter(task => task.state === 'In Review').length,
      icon: <Eye className="w-5 h-5" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    {
      label: 'Completadas',
      count: tasks.filter(task => task.state === 'finalized').length,
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30'
    }
  ];

  const totalTasks = tasks.length;
  const completedTasks = stats[3].count;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 hover:scale-105 transition-transform`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={stat.color}>
              {stat.icon}
            </div>
            <h3 className="font-medium text-sm text-gray-300">{stat.label}</h3>
          </div>
          <p className={`text-2xl font-bold ${stat.color}`}>
            {stat.count}
          </p>
        </motion.div>
      ))}
      
      {/* Progress overview */}
      {totalTasks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 lg:col-span-4 bg-[#111111] border border-[#036873]/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-5 h-5 text-[#0B758C]" />
            <h3 className="font-medium text-gray-300">Progreso General</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>{completedTasks} de {totalTasks} tareas completadas</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#036873] to-[#0B758C] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-[#0B758C]">{progressPercentage}%</p>
              <p className="text-xs text-gray-400">Completado</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
