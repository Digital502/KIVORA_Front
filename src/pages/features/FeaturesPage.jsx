import React from 'react';
import { 
  CalendarCheck,
  ListChecks,
  KanbanSquare,
  Users,
  CalendarClock,
  Leaf,
  PieChart,
  RefreshCw,
  User,
  Shield,
  Code2,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  Circle,
  ArrowRight,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FooterHome } from '../../components/footer/FooterHome';
import { NavbarHome } from '../../components/navs/NavbarHome';

export const FeaturesPage = () => {
  const features = [
    {
      icon: <CalendarCheck className="w-8 h-8" />,
      title: "Gestión de Sprints",
      description: "Organiza y administra tus sprints de forma visual e intuitiva. Planifica tus entregas, define objetivos y mantén el ritmo del equipo con claridad.",
      details: [
        "Creación de sprints con fechas definidas",
        "Establecimiento de objetivos claros",
        "Visualización del progreso general",
        "Herramientas para ajustar la planificación"
      ]
    },
    {
      icon: <ListChecks className="w-8 h-8" />,
      title: "Tareas y responsabilidades",
      description: "Asigna tareas fácilmente a los miembros del equipo, con descripciones claras, fechas límite y estados de avance.",
      details: [
        "Asignación de tareas con un solo clic",
        "Descripciones detalladas",
        "Fechas límite visibles",
        "Estados de progreso (pendiente, en progreso, completado)"
      ]
    },
    {
      icon: <KanbanSquare className="w-8 h-8" />,
      title: "Tablero Kanban visual",
      description: "Sigue el progreso en tiempo real con un tablero dinámico que refleja el estado de cada tarea: pendiente, en progreso o finalizada.",
      details: [
        "Vista tipo Kanban intuitiva",
        "Arrastra y suelta para cambiar estados",
        "Personalización de columnas",
        "Filtros por miembro o etiquetas"
      ]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Roles SCRUM definidos",
      description: "Define de manera clara los roles del equipo: Product Owner, Scrum Master y Equipo de desarrollo para mejor organización.",
      subFeatures: [
        {
          icon: <User className="w-5 h-5 text-[#0B758C]" />,
          title: "Product Owner",
          description: "Define las prioridades y mantiene la visión del producto"
        },
        {
          icon: <Shield className="w-5 h-5 text-[#0B758C]" />,
          title: "Scrum Master",
          description: "Facilita el proceso y elimina obstáculos"
        },
        {
          icon: <Code2 className="w-5 h-5 text-[#0B758C]" />,
          title: "Equipo de desarrollo",
          description: "Ejecuta las tareas y construye el producto"
        }
      ]
    },
    {
      icon: <CalendarClock className="w-8 h-8" />,
      title: "Reuniones y recordatorios SCRUM",
      description: "Planifica y gestiona reuniones clave con recordatorios automáticos para no perder ningún evento importante.",
      subFeatures: [
        {
          icon: <Clock className="w-5 h-5 text-[#0B758C]" />,
          title: "Dailies",
          description: "Reuniones diarias rápidas para sincronizar al equipo"
        },
        {
          icon: <CheckCircle className="w-5 h-5 text-[#0B758C]" />,
          title: "Revisiones",
          description: "Revisión del trabajo completado en el sprint"
        },
        {
          icon: <RefreshCw className="w-5 h-5 text-[#0B758C]" />,
          title: "Retrospectivas",
          description: "Mejora continua identificando qué funcionó y qué no"
        },
        {
          icon: <Bell className="w-5 h-5 text-[#0B758C]" />,
          title: "Recordatorios",
          description: "Notificaciones automáticas para cada evento"
        }
      ]
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Ambiente amigable y relajante",
      description: "Una interfaz moderna, calmada y centrada en la experiencia de estudiantes. Ideal para trabajar sin estrés y fomentar el enfoque.",
      details: [
        "Diseño minimalista y limpio",
        "Colores relajantes",
        "Experiencia intuitiva",
        "Enfoque en la usabilidad"
      ]
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Reportes de progreso",
      description: "Visualiza el avance por sprint y por usuario con gráficas simples pero informativas. Mide el rendimiento y mejora constantemente.",
      details: [
        "Gráficos de progreso del sprint",
        "Métricas por miembro del equipo",
        "Velocidad del equipo",
        "Tendencias de productividad"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Colaboración en tiempo real",
      description: "Los equipos pueden trabajar juntos simultáneamente, con actualizaciones automáticas y sincronización instantánea.",
      details: [
        "Cambios en tiempo real",
        "Notificaciones de actividad",
        "Comentarios en tareas",
        "Historial de cambios"
      ]
    }
  ];

  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <NavbarHome/> 
      {/* Hero Section */}
      <section className="relative z-10 py-16 px-6 bg-gradient-to-b from-[#0D0D0D] to-[#036873]/5">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#036873]/20 text-[#639FA6] mb-6">
              <Star className="w-5 h-5 mr-2" />
              <span>Todo lo que necesitas para Scrum</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#F2F2F2] mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] via-[#639FA6] to-[#036873]">
                Características
              </span> diseñadas para estudiantes
            </h1>
            <p className="text-xl text-[#639FA6] max-w-3xl mx-auto">
              Kivora ofrece todas las herramientas necesarias para gestionar proyectos académicos con metodología SCRUM, en una plataforma intuitiva y amigable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-[#0D0D0D] border border-[#036873]/20 rounded-xl p-8 hover:border-[#639FA6]/50 transition-all duration-300`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="p-3 bg-[#036873]/10 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#F2F2F2]">{feature.title}</h2>
                    <p className="text-[#639FA6] mt-2">{feature.description}</p>
                  </div>
                </div>

                {feature.details && (
                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <Circle className="w-4 h-4 mt-1 text-[#639FA6] flex-shrink-0" />
                        <span className="text-[#F2F2F2]">{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {feature.subFeatures && (
                  <div className="grid grid-cols-1 gap-4 mt-6">
                    {feature.subFeatures.map((subFeature, i) => (
                      <div key={i} className="bg-[#0D0D0D] border border-[#036873]/10 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          {subFeature.icon}
                          <h3 className="font-medium text-[#F2F2F2]">{subFeature.title}</h3>
                        </div>
                        <p className="text-[#639FA6] mt-2 ml-8">{subFeature.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 bg-[#0D0D0D] border-t border-b border-[#036873]/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#F2F2F2] mb-6">
              ¿Listo para transformar tu forma de trabajar en equipo?
            </h2>
            <p className="text-xl text-[#639FA6] mb-10">
              Regístrate hoy y descubre cómo Kivora puede simplificar la gestión de tus proyectos académicos.
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#0B758C] to-[#036873] text-[#F2F2F2] font-medium text-lg group transition-all duration-500"
            >
              <span className="relative z-10 flex items-center gap-3">
                Comenzar ahora
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
      <FooterHome/>
    </div>
  );
};

