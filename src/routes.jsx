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
import { ChatPage } from "./pages/chat/ChatPage";

export const routes = [
    {path: '/', element: <HomePage/>},
    {path: '/kivora/caracteristics', element: <FeaturesPage/>},
    {path: '/register', element: <RegisterPage/>},
    {path: '/login', element: <AuthPage/>},
    {path: '/home', element: <DashboardHome/>},
    {path: '/kivora/guideScrum', element: <ScrumGuidePage/>},
    {path: '/kivora/perfil', element: <PerfilUsuario/>},
    {path: '/kivora/cluster/:id', element: <ClusterHome/>},
    {path: '/kivora/proyecto/:id', element: <ProjectView />},
    {path: '/kivora/cluster/:id/settings', element: <ClusterSetting/>},
    {path: '*', element: <NotFound/>},
    {path: '/kivora/clusters', element: <ListCluster/>},
    {path: "/kivora/notificaciones", element: <NotificationsList/>},
    {path: '/kivora/chatPage', element: <ChatPage />}
]