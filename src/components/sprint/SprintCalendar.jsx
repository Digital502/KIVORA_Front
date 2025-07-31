import React, { useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const locales = { es };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const SpintCalendar = ({ sprints }) => {

  const events = Array.isArray(sprints)
    ? sprints
        .filter(sprint => sprint.dateStart && sprint.dateEnd)
        .map((sprint, index) => ({
          id: sprint.uid,
          title: `${sprint.tittle}`,
          start: new Date(sprint.dateStart),
          end: new Date(sprint.dateEnd),
          allDay: true,
          color: getEventColor(index),
          sprintData: sprint
        }))
    : [];

  function getEventColor(index) {
    const colors = [
      'linear-gradient(135deg, #0B758C 0%, #036873 100%)',
      'linear-gradient(135deg, #639FA6 0%, #0B758C 100%)',
      'linear-gradient(135deg, #036873 0%, #0D0D0D 100%)'
    ];
    return colors[index % colors.length];
  }

  const eventStyleGetter = (event) => {
    const style = {
      background: event.color,
      borderRadius: '6px',
      opacity: 0.95,
      color: '#FFFFFF',
      border: 'none',
      padding: '2px 8px',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      textTransform: 'uppercase',
      fontSize: '0.75rem',
      letterSpacing: '0.5px'
    };
    return { style };
  };

  const CustomEvent = ({ event }) => (
    <motion.div 
      className="h-full w-full p-1"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <div className="h-full flex items-center px-2">
        <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
        <span className="truncate">{event.title}</span>
      </div>
    </motion.div>
  );

  const CustomToolbar = ({ label, onNavigate }) => (
    <div className="flex justify-between items-center mb-4 px-1">
      <button 
        onClick={() => onNavigate('PREV')}
        className="p-2 rounded-lg hover:bg-[#036873]/20 transition-colors"
      >
        <ChevronLeft className="text-[#0B758C]" />
      </button>
      <span className="text-lg font-semibold text-[#0B758C]">{label}</span>
      <button 
        onClick={() => onNavigate('NEXT')}
        className="p-2 rounded-lg hover:bg-[#036873]/20 transition-colors"
      >
        <ChevronRight className="text-[#0B758C]" />
      </button>
    </div>
  );

  return (
    <div className="bg-[#0D0D0D] rounded-xl border border-[#036873]/30 p-6 min-h-[650px]">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-[#0B758C]" />
          <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] to-[#639FA6]">
            Cronograma de Sprints
          </h2>
        </div>
        <p className="text-sm text-[#639FA6]">
          Visualización avanzada de la línea temporal de tus sprints
        </p>
        
        <div className="h-[550px] relative">
          <div className="absolute inset-0 rounded-lg overflow-hidden border border-[#036873]/30">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent,
                toolbar: CustomToolbar
              }}
              messages={{
                today: 'HOY',
                previous: '',
                next: '',
                month: 'MES',
                week: 'SEMANA',
                day: 'DÍA',
                agenda: 'AGENDA',
                date: 'FECHA',
                time: 'HORA',
                event: 'EVENTO',
                noEventsInRange: 'No hay sprints programados',
              }}
              dayPropGetter={(date) => ({
                style: {
                  backgroundColor: '#0D0D0D',
                  borderRight: '1px solid #03687330',
                  borderBottom: '1px solid #03687330',
                  color: date.getDay() === 0 || date.getDay() === 6 ? '#639FA6' : '#FFFFFF'
                },
              })}
              header={{
                style: {
                  backgroundColor: '#0D0D0D',
              borderBottom: '1px solid #03687330',
              color: '#0B758C',
              padding: '10px',
              textTransform: 'uppercase',
              fontWeight: '600',
              fontSize: '0.75rem'
            },
          }}
        />
      </div>
    </div>
  </motion.div>
</div>
  );
};