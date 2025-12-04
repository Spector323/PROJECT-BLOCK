import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, FolderKanban, ListTodo, LogOut, Github, Send } from 'lucide-react';
import { logout } from '../store/slices/authSlice';
import '../styles/app.css';

export function Sidebar({ currentView, onViewChange, onGitHubClick, onTelegramClick }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'projects', label: 'Проекты', icon: FolderKanban },
    { id: 'tasks', label: 'Задачи', icon: ListTodo },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>PM System</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ 
        marginTop: 'auto',
        paddingTop: 'var(--spacing-lg)',
        borderTop: '1px solid var(--color-border)',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-md)',
        }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onGitHubClick}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Github size={16} />
            GitHub
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onTelegramClick}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Send size={16} />
            Telegram
          </button>
        </div>
      </div>

      <div className="user-menu">
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout} style={{ width: '100%', marginTop: '8px' }}>
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </div>
  );
}