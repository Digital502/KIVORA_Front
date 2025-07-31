import React from 'react'
import { LayoutDashboard, KanbanSquare, HelpCircle, LogIn, UserPlus, PieChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export const NavbarHome = () => {
  return (
    <header className="relative z-50 bg-[#0D0D0D]/90 backdrop-blur-lg px-6 py-3 flex justify-between items-center border-b border-[#036873]/30 shadow-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-10"
        >
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#0B758C] to-[#639FA6] rounded-lg flex items-center justify-center">
              <LayoutDashboard className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#639FA6] to-[#0B758C]">
              KIVORA
            </h1>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/features" 
              className="text-[#F2F2F2] hover:text-[#639FA6] transition-colors flex items-center space-x-2 group"
            >
              <div className="p-1 rounded-md group-hover:bg-[#036873]/20 transition-colors">
                <KanbanSquare className="w-5 h-5" />
              </div>
              <span>Funcionalidades</span>
            </Link>
            <Link 
              to="/how-it-works" 
              className="text-[#F2F2F2] hover:text-[#639FA6] transition-colors flex items-center space-x-2 group"
            >
              <div className="p-1 rounded-md group-hover:bg-[#036873]/20 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span>Cómo funciona</span>
            </Link>
            <Link 
              to="/pricing" 
              className="text-[#F2F2F2] hover:text-[#639FA6] transition-colors flex items-center space-x-2 group"
            >
              <div className="p-1 rounded-md group-hover:bg-[#036873]/20 transition-colors">
                <PieChart className="w-5 h-5" />
              </div>
              <span>Planes</span>
            </Link>
          </nav>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link 
            to="/login" 
            className="relative overflow-hidden px-5 py-2 rounded-lg border border-[#036873] text-[#F2F2F2] group transition-all duration-300 flex items-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span className="relative z-10">Iniciar Sesión</span>
            <span className="absolute inset-0 bg-[#036873] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-0"></span>
          </Link>
          <Link 
            to="/register" 
            className="relative overflow-hidden px-5 py-2 rounded-lg bg-gradient-to-r from-[#0B758C] to-[#036873] text-[#F2F2F2] group transition-all duration-300 flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span className="relative z-10">Registrarse</span>
            <span className="absolute inset-0 bg-[#639FA6] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 z-0 opacity-70"></span>
          </Link>
        </motion.div>
      </header>
    )
}
