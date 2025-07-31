import React from 'react';
import { Clock, Users, CheckCircle, GitBranch, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import { FooterHome } from '../../components/footer/FooterHome';
import { NavbarDashboard } from '../../components/navs/NavbarDashboard';

export const ScrumGuidePage = () => {
  const pasosScrum = [
    {
      icon: <Users className="w-10 h-10 text-[#0B758C]" />,
      title: "Roles en SCRUM",
      description: "SCRUM tiene tres roles principales: Product Owner, Scrum Master y Equipo de Desarrollo.",
      details: [
        "Product Owner: Define prioridades y gestiona el backlog.",
        "Scrum Master: Facilita y elimina impedimentos.",
        "Equipo de Desarrollo: Implementa las tareas."
      ],
    },
    {
      icon: <CalendarDays className="w-10 h-10 text-[#0B758C]" />,
      title: "Sprints",
      description: "Períodos de trabajo de 1 a 4 semanas donde se desarrollan las tareas planificadas.",
      details: [
        "Sprint Planning: Se planifican las tareas a realizar.",
        "Sprint Review: Se revisa el trabajo terminado.",
        "Sprint Retrospective: Se analiza qué mejorar."
      ],
    },
    {
      icon: <GitBranch className="w-10 h-10 text-[#0B758C]" />,
      title: "Backlog",
      description: "Lista priorizada de funcionalidades, tareas y bugs que el equipo debe abordar.",
      details: [
        "Product Backlog: Prioridades del producto.",
        "Sprint Backlog: Tareas seleccionadas para el sprint."
      ],
    },
    {
      icon: <Clock className="w-10 h-10 text-[#0B758C]" />,
      title: "Daily SCRUM",
      description: "Reunión diaria rápida (15 minutos) para sincronizar al equipo.",
      details: [
        "Qué hice ayer.",
        "Qué haré hoy.",
        "Obstáculos que tengo."
      ],
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-[#0B758C]" />,
      title: "Definición de Hecho",
      description: "Criterios claros que deben cumplirse para considerar una tarea completada.",
      details: [
        "Código probado y revisado.",
        "Documentación actualizada.",
        "Funcionalidad integrada y funcionando."
      ],
    },
  ];

  return (
    <div className='bg-[#0D0D0D]'>
    <NavbarDashboard />
    <div className="min-h-screen bg-[#0D0D0D] text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto bg-[#111111] rounded-3xl shadow-2xl p-10 border border-[#036873]/30"
      >
        <h1 className="text-5xl font-extrabold mb-6 text-center tracking-wide text-[#0B758C]">
          Guía Rápida de <span className="text-[#86AFB9]">SCRUM</span>
        </h1>
        <p className="text-lg max-w-3xl mx-auto mb-12 text-center text-[#9ca3af]">
          Aprende a trabajar de forma ágil y efectiva en equipo. Aquí encontrarás los pilares de SCRUM con ejemplos simples para estudiantes como tú.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pasosScrum.map(({ icon, title, description, details }, i) => (
            <motion.div
              key={i}
              className="bg-[#181818] rounded-xl p-6 border border-[#59818B]/40 hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-[#59818B]/10 rounded-full">
                  {icon}
                </div>
                <h2 className="text-xl font-semibold text-[#86AFB9]">{title}</h2>
              </div>
              <p className="text-sm text-[#cbd5e1] mb-2">{description}</p>
              <ul className="list-disc list-inside text-sm text-[#A0AEC0] space-y-1">
                {details.map((d, idx) => <li key={idx}>{d}</li>)}
              </ul>
            </motion.div>
          ))}
        </div>

        <section className="mt-16 bg-[#131313] rounded-xl p-8 border border-[#426A73]/50 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-[#639FA6] text-center">Ejemplo práctico</h2>
          <p className="text-[#E2E8F0] mb-4 text-center">
            Un equipo de estudiantes debe crear una app para organizar actividades escolares:
          </p>
          <ol className="list-decimal list-inside space-y-3 text-[#A0AEC0]">
            <li><strong>Product Owner</strong>: define funcionalidades como "Calendario", "Recordatorios" y "Notas".</li>
            <li>Se organiza un sprint de 2 semanas para construir el módulo de Recordatorios.</li>
            <li>Todos los días se realiza una Daily SCRUM de 10 minutos para coordinar.</li>
            <li>Al terminar, se hace una revisión del sprint y se mejora para el siguiente.</li>
          </ol>
          <p className="mt-6 text-[#94A3B8] italic text-center">
            SCRUM les permite avanzar en equipo, entregar valor y adaptarse fácilmente.
          </p>
        </section>
      </motion.div>
      <br /><br /><br />
      <FooterHome/>
    </div>
    </div>
  );
};
