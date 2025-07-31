import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import { App } from './App.jsx'
import './index.css'; 
import { NotificationsProvider } from './shared/hooks/useNotificactionContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
  </BrowserRouter>,
)
