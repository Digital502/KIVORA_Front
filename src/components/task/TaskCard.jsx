import React from 'react';
import { 
  Clock, 
  AlertTriangle, 
  Eye, 
  CheckCircle, 
  Calendar,
  Tag,
  ChevronRight
} from 'lucide-react';

export const TaskCard = ({ task, onTaskClick, onStateChange }) => {
  const getStateIcon = (state) => {
    switch (state) {
      case 'In Progress':
        return <Clock className="w-4 h-4 text-blue-400" />;
      case 'Late':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'In Review':
        return <Eye className="w-4 h-4 text-yellow-400" />;
      case 'finalized':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStateColor = (state) => {
    switch (state) {
      case 'In Progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Late':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'In Review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'finalized':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="bg-[#111111] border border-[#036873]/30 rounded-xl p-6 hover:border-[#036873]/50 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:shadow-[#036873]/10"
      onClick={() => onTaskClick && onTaskClick(task)}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStateIcon(task.state)}
          <span className={`text-xs px-2 py-1 rounded border ${getStateColor(task.state)}`}>
            {task.state === 'finalized' ? 'Finalizada' : task.state}
          </span>
        </div>
        {task.isUrgent && (
          <div className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-orange-400 font-medium">Urgente</span>
          </div>
        )}
      </div>

      {/* Task Title */}
      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#0B758C] transition-colors">
        {task.title}
      </h3>

      {/* Task Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      {/* Task Info */}
      <div className="space-y-2 mb-4">
        {task.project && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Tag className="w-4 h-4" />
            <span className="truncate">{task.project.title}</span>
          </div>
        )}
        {task.sprint && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Sprint {task.sprint.number}</span>
          </div>
        )}
        {task.createdAt && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Creada: {formatDate(task.createdAt)}</span>
          </div>
        )}
      </div>

      {/* Task Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {task.tags.slice(0, 3).map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="bg-[#036873]/20 text-[#0B758C] px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-gray-500 text-xs px-2 py-1">
              +{task.tags.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {task.state === 'In Progress' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStateChange && onStateChange(task.uid, 'In Review');
            }}
            className="flex-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 py-2 px-3 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors"
          >
            Enviar a Revisión
          </button>
        )}
        {task.state === 'Late' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStateChange && onStateChange(task.uid, 'In Progress');
            }}
            className="flex-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 py-2 px-3 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
          >
            Reanudar
          </button>
        )}
        <button 
          className="flex items-center justify-center w-10 h-10 border border-[#036873]/30 rounded-lg hover:border-[#036873]/50 transition-colors group-hover:border-[#036873]"
          onClick={(e) => {
            e.stopPropagation();
            onTaskClick && onTaskClick(task);
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
