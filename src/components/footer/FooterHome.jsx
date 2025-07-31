import React from 'react'
import { Link } from 'react-router-dom'
import { Code, Home, KanbanSquare, HelpCircle, LogIn, BookOpen, Film, FileText, Mail, Twitter, Github, Linkedin, Facebook, Instagram } from 'lucide-react'

export const FooterHome = () => {
  return (
    <footer className="relative z-10 bg-[#0D0D0D] border-t border-[#036873]/30 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-[#F2F2F2] mb-6 flex items-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0B758C] to-[#639FA6]">KIVORA</span>
              <span className="text-xs bg-[#036873] px-2 py-1 rounded-full">SCRUM</span>
            </h3>
            <p className="text-sm text-[#639FA6]">
              Plataforma diseñada para estudiantes que trabajan en proyectos grupales, facilitando la metodología SCRUM con herramientas simples y visuales.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#F2F2F2] mb-4">Navegación</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-[#639FA6] hover:text-[#0B758C] transition-colors flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-[#639FA6] hover:text-[#0B758C] transition-colors flex items-center gap-2">
                  <KanbanSquare className="w-4 h-4" />
                  Funcionalidades
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-[#639FA6] hover:text-[#0B758C] transition-colors flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#639FA6] hover:text-[#0B758C] transition-colors flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#F2F2F2] mb-4">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/documentation" className="text-[#639FA6] hover:text-[#0B758C] transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Documentación
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-[#639FA6] hover:text-[#0B758C] transition-colors flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  Tutoriales
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#639FA6] hover:text-[#0B758C] transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-[#639FA6] hover:text-[#0B758C] transition-colors flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  API
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-[#F2F2F2] mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="text-[#639FA6] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@kivora.app" className="hover:text-[#0B758C] transition-colors">digitalfact25@gmail.com</a>
              </li>
            </ul>
            
            <div className="mt-6 flex gap-4">
              <a href="https://www.instagram.com/digitalfactdev/?utm_source=ig_web_button_share_sheet" className="w-10 h-10 rounded-full bg-[#036873]/20 flex items-center justify-center hover:bg-[#036873]/40 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/GroupDigitalFact" className="w-10 h-10 rounded-full bg-[#036873]/20 flex items-center justify-center hover:bg-[#036873]/40 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/digitalfactdev/?utm_source=ig_web_button_share_sheet" className="w-10 h-10 rounded-full bg-[#036873]/20 flex items-center justify-center hover:bg-[#036873]/40 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#036873]/20 flex items-center justify-center hover:bg-[#036873]/40 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#036873]/20">
          <p className="text-center text-sm text-[#639FA6]">
            © {new Date().getFullYear()} Kivora | Todos los derechos reservados | Digital Fact
          </p>
        </div>
      </footer>
    )
}
