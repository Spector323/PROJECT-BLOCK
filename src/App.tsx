import { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProjectsList } from './components/ProjectsList';
import { TasksList } from './components/TasksList';
import { GitHubIntegration } from './components/GitHubIntegration';
import { TelegramIntegration } from './components/TelegramIntegration';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './hooks/useTheme';
import './styles/app.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const [currentView, setCurrentView] = useState('dashboard');
  const [showGitHub, setShowGitHub] = useState(false);
  const [showTelegram, setShowTelegram] = useState(false);
  const [theme, setTheme] = useTheme();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectsList />;
      case 'tasks':
        return <TasksList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView}
          onGitHubClick={() => setShowGitHub(true)}
          onTelegramClick={() => setShowTelegram(true)}
        />
        <main className="main-content">
          <div style={{ 
            position: 'absolute', 
            top: '24px', 
            right: '24px',
            zIndex: 100,
          }}>
            <ThemeToggle theme={theme} onThemeChange={setTheme} />
          </div>
          {renderView()}
        </main>
      </div>

      {showGitHub && <GitHubIntegration onClose={() => setShowGitHub(false)} />}
      {showTelegram && <TelegramIntegration onClose={() => setShowTelegram(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}