import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarCheck, ListChecks, KanbanSquare,Users,CalendarClock,Leaf,PieChart,ArrowRight,HelpCircle,
  Home,LogIn,Mail,Github,Twitter,Linkedin,Facebook,BookOpen,Film,FileText,Code} from 'lucide-react';
import { NavbarHome } from '../../components/navs/NavbarHome';
import { FooterHome } from '../../components/footer/FooterHome';

export const HomePage = () => {
  return (
    <div className="bg-[#0D0D0D] min-h-screen flex flex-col justify-between overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#036873]/20"
            style={{
              width: Math.random() * 300 + 100,
              height: Math.random() * 300 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 30 + 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>
      <NavbarHome/>
      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center px-8 py-20 gap-16 max-w-7xl mx-auto">
        <motion.div 
          className="max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-extrabold text-[#F2F2F2] mb-8 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] via-[#639FA6] to-[#036873]">
              Scrum simplificado
            </span> para equipos estudiantiles
          </motion.h2>
          
          <motion.p 
            className="text-xl text-[#639FA6] mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Kivora es una plataforma web centrada en estudiantes que trabajan en proyectos grupales. 
            Facilita la metodología SCRUM mediante herramientas simples, visuales y colaborativas 
            que promueven una dinámica de trabajo calmada, enfocada y productiva.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Link 
              to="/register" 
              className="relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-[#0B758C] to-[#036873] text-[#F2F2F2] font-medium text-lg group transition-all duration-500 flex items-center"
            >
              <span className="relative z-10 flex items-center gap-3">
                Comienza ahora
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </span>
              <span className="absolute inset-0 bg-[#639FA6] scale-0 group-hover:scale-100 transition-transform duration-500 z-0 opacity-30"></span>
            </Link>
            
            <Link 
              to="/kivora/caracteristics" 
              className="px-8 py-4 rounded-xl border-2 border-[#036873] text-[#F2F2F2] font-medium text-lg hover:bg-[#036873]/20 transition-all duration-300 flex items-center gap-3"
            >
              <KanbanSquare className="w-5 h-5" />
              Ver características
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="absolute -inset-8 bg-[#0B758C]/20 rounded-3xl rotate-12 blur-lg"></div>
          <div className="absolute -inset-4 bg-[#036873]/20 rounded-3xl -rotate-6 blur-md"></div>
          <motion.img 
            src="/logoKivora.png"
            alt="Interfaz de Kivora"
            className="relative w-96 h-auto rounded-2xl border-2 border-[#036873]/50 shadow-2xl"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          />
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-[#0D0D0D] to-[#0D0D0D]/90">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-center text-[#F2F2F2] mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] to-[#639FA6]">
              Características
            </span> principales
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Gestión de Sprints",
                description: "Crea y administra tus Sprints fácilmente con herramientas visuales.",
                icon: <CalendarCheck className="w-8 h-8 text-[#639FA6]" />,
                color: "from-[#0B758C]/10 to-[#0B758C]/20"
              },
              {
                title: "Tareas y responsabilidades",
                description: "Asignación clara de tareas a miembros del equipo con seguimiento.",
                icon: <ListChecks className="w-8 h-8 text-[#639FA6]" />,
                color: "from-[#036873]/10 to-[#036873]/20"
              },
              {
                title: "Tablero Kanban",
                description: "Seguimiento visual del progreso en tiempo real para todo el equipo.",
                icon: <KanbanSquare className="w-8 h-8 text-[#639FA6]" />,
                color: "from-[#0B758C]/10 to-[#0B758C]/20"
              },
              {
                title: "Roles SCRUM",
                description: "Define Product Owner, Scrum Master y equipo de desarrollo fácilmente.",
                icon: <Users className="w-8 h-8 text-[#639FA6]" />,
                color: "from-[#036873]/10 to-[#036873]/20"
              },
              {
                title: "Reuniones SCRUM",
                description: "Programa reuniones diarias, revisiones y retrospectivas con recordatorios.",
                icon: <CalendarClock className="w-8 h-8 text-[#639FA6]" />,
                color: "from-[#0B758C]/10 to-[#0B758C]/20"
              },
              {
                title: "Ambiente amigable",
                description: "Interfaz relajante diseñada específicamente para estudiantes.",
                icon: <Leaf className="w-8 h-8 text-[#639FA6]" />,
                color: "from-[#036873]/10 to-[#036873]/20"
              },
              {
                title: "Reportes de progreso",
                description: "Visualización del avance del proyecto por Sprint y por usuario.",
                icon: <PieChart className="w-8 h-8 text-[#639FA6]" />,
                color: "from-[#0B758C]/10 to-[#0B758C]/20"
              },
              {
                title: "Colaboración en equipo",
                description: "Herramientas diseñadas para fomentar el trabajo colaborativo eficiente.",
                icon: <Users className="w-8 h-8 text-[#639FA6]" />,
                color: "from-[#036873]/10 to-[#036873]/20"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-br ${feature.color} border border-[#036873]/30 rounded-xl p-6 hover:border-[#639FA6]/50 transition-all duration-300 hover:-translate-y-2 shadow-lg`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-4 p-3 bg-[#036873]/10 rounded-lg w-max">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#F2F2F2] mb-3">{feature.title}</h3>
                <p className="text-[#639FA6]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-8">
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-center text-[#F2F2F2] mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] to-[#639FA6]">
              Cómo funciona
            </span> Kivora
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-[#0D0D0D] border border-[#036873]/30 rounded-2xl p-8 hover:border-[#639FA6]/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] to-[#639FA6] mb-4">1</div>
              <h3 className="text-xl font-bold text-[#F2F2F2] mb-3">Crea tu equipo</h3>
              <p className="text-[#639FA6] mb-4">
                Invita a tus compañeros de clase y asigna roles SCRUM (Product Owner, Scrum Master y equipo de desarrollo).
              </p>
              <div className="flex justify-center mt-6">
                <Users className="w-16 h-16 text-[#036873]/30" />
              </div>
            </motion.div>
            
            <motion.div
              className="bg-[#0D0D0D] border border-[#036873]/30 rounded-2xl p-8 hover:border-[#639FA6]/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] to-[#639FA6] mb-4">2</div>
              <h3 className="text-xl font-bold text-[#F2F2F2] mb-3">Planifica tus Sprints</h3>
              <p className="text-[#639FA6] mb-4">
                Divide tu proyecto en Sprints, define objetivos y establece el tiempo para cada uno.
              </p>
              <div className="flex justify-center mt-6">
                <CalendarCheck className="w-16 h-16 text-[#036873]/30" />
              </div>
            </motion.div>
            
            <motion.div
              className="bg-[#0D0D0D] border border-[#036873]/30 rounded-2xl p-8 hover:border-[#639FA6]/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] to-[#639FA6] mb-4">3</div>
              <h3 className="text-xl font-bold text-[#F2F2F2] mb-3">Trabaja colaborativamente</h3>
              <p className="text-[#639FA6] mb-4">
                Usa el tablero Kanban para gestionar tareas, realiza reuniones SCRUM y sigue el progreso.
              </p>
              <div className="flex justify-center mt-6">
                <KanbanSquare className="w-16 h-16 text-[#036873]/30" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>      
      <FooterHome/>
    </div>
  );
};