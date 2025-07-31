import { useParams } from "react-router-dom";
import { useClusterHome } from "../../shared/hooks/useClusterHome";
import { NavbarDashboard } from "../navs/NavbarDashboard";
import { SidebarCluster } from "../navs/SidebarCluster";
import { LoadingSpinner } from "../loadingSpinner/LoadingSpinner";
import { BarChart2, CalendarDays, AlertTriangle, Folder, PlusCircle, Users, FileText, Settings } from "lucide-react";

export const Reports = () => {
  const { id } = useParams();
  const { proyectos, loadingGroup, formatDate } = useClusterHome(id);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <NavbarDashboard />
      <div className="flex">
        <SidebarCluster />

        {/* Layout con sidebar derecha para acciones */}
        <div className="flex flex-1">
          {/* Contenedor principal de reportes (70% ancho) */}
          <main className="flex-1 p-6 transition-all duration-300">
            <header className="mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart2 className="w-6 h-6 text-[#0B758C]" />
                Reportes de Proyectos
              </h1>
              <p className="text-gray-400 text-sm">
                Visualiza el progreso y estado actual de todos los proyectos del grupo.
              </p>
            </header>

            {loadingGroup ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : proyectos.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                <Folder className="w-10 h-10 mb-3 text-gray-500" />
                <p className="text-gray-300">Aún no hay proyectos en este grupo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {proyectos.map((p, i) => {
                  const fechaInicio = new Date(p.startDate);
                  const fechaFin = new Date(p.endDate);
                  const fechaHoy = new Date();
                  const totalDuracion = fechaFin - fechaInicio;
                  const transcurrido = fechaHoy - fechaInicio;
                  const avance = Math.min(100, Math.max(0, (transcurrido / totalDuracion) * 100));

                  return (
                    <div
                      key={p._id || i}
                      className="bg-[#111] p-4 rounded-lg border border-[#036873]/30 hover:border-[#036873]/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium">{p.title}</h3>
                          {p.description && <p className="text-gray-400 text-sm mt-1">{p.description}</p>}
                          
                          <div className="flex items-center gap-3 mt-3 text-xs">
                            <span className="flex items-center gap-1 text-gray-400">
                              <CalendarDays className="w-3 h-3" />
                              {formatDate(p.startDate)} - {formatDate(p.endDate)}
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className="text-gray-400">Tipo: {p.projectType || "No especificado"}</span>
                          </div>
                        </div>
                        
                        {avance < 30 && (
                          <span className="flex items-center gap-1 bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-full text-xs">
                            <AlertTriangle className="w-3 h-3" />
                            Bajo avance
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${avance < 30 ? 'bg-yellow-500' : 'bg-[#0B758C]'}`}
                            style={{ width: `${avance}%` }}
                          />
                        </div>
                        <p className="text-right text-xs mt-1 text-gray-400">
                          {avance.toFixed(0)}% completado
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};