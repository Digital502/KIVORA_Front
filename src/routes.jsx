import { ClusterHome } from "../src/components/cluster/ClusterHome";
import { ProjectView } from "../src/components/proyect/ProjectView";
import { PerfilUsuario } from "../src/components/user/PerfilUsuario";
import { AuthPage } from "../src/pages/auth/AuthPage";
import { HomePage } from "../src/pages/home/HomePage";
import { ListCluster } from "./components/cluster/ListCluster";
import { NotFound } from "./components/notfound/NotFound";
import { NotificationsList } from "./components/notifications/Notifications";
import { ClusterSetting } from "./components/setting/ClusterSetting";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardHome } from "./pages/dashboardHome";
import { FeaturesPage } from "./pages/features";
import { ScrumGuidePage } from "./pages/pagesHomeDashboard";
import { ProjectList } from "./components/proyect/ProjectViewlist"
import { ProjectListHistorial } from "./components/proyect/ProyectViewHistorial"
import { ForgotPassword } from "./components/ForgotPassword";
import { Reports } from "./components/pagesExtra/Reports";
import { PrivateRoute } from "./components/PrivateRoute";
import { UserTasksPage } from "./pages/userTasks";
import { Documentation } from "./components/homeFooter/Documentation";
import { Api } from "./components/homeFooter/Api";
import { Blog } from "./components/homeFooter/Blog";
import { Tutorials } from "./components/homeFooter/Tutorials";
import { HowItWorks } from "./components/homeFooter/HowItWorks";
import { Features } from "./components/homeFooter/Features";
import { ChatPage } from "./pages/chat/ChatPage";

export const routes = [
    {path: '/', element: <HomePage/>},
    {path: '/kivora/caracteristics', element: <FeaturesPage/>},
    {path: '/register', element: <RegisterPage/>},
    {path: '/login', element: <AuthPage/>},
    {path: '/home', element: <PrivateRoute><DashboardHome/></PrivateRoute>},
    {path: '/kivora/guideScrum', element: <PrivateRoute><ScrumGuidePage/></PrivateRoute>},
    {path: '/kivora/perfil', element: <PrivateRoute><PerfilUsuario/></PrivateRoute>},
    {path: '/kivora/cluster/:id', element: <PrivateRoute><ClusterHome/></PrivateRoute>},
    {path: '/kivora/proyecto/:id', element: <PrivateRoute><ProjectView /></PrivateRoute>},
    {path: '/kivora/proyectoslist', element: <PrivateRoute><ProjectList/></PrivateRoute>},
    {path: '/kivora/historial', element: <PrivateRoute><ProjectListHistorial/></PrivateRoute>},
    {path: '/kivora/cluster/:id/settings', element: <PrivateRoute><ClusterSetting/></PrivateRoute>},
    {path: '*', element: <NotFound/>},
    {path: '/kivora/clusters', element: <PrivateRoute><ListCluster/></PrivateRoute>},
    {path: "/kivora/notificaciones", element: <PrivateRoute><NotificationsList/></PrivateRoute>},
    {path: "/kivora/forgot-password", element: <ForgotPassword/>},
    {path: '/kivora/cluster/:id/reports', element: <PrivateRoute><Reports/></PrivateRoute>},
    {path: '/kivora/mis-tareas', element: <PrivateRoute><UserTasksPage/></PrivateRoute>},
    { path: '/features', element: <Features /> },
    { path: '/how-it-works', element: <HowItWorks /> },
    { path: '/documentation', element: <Documentation /> },
    { path: '/tutorials', element: <Tutorials /> },
    { path: '/blog', element: <Blog /> },
    { path: '/api', element: <Api /> },
    {path: '/kivora/chatPage', element: <PrivateRoute><ChatPage /></PrivateRoute>}
]