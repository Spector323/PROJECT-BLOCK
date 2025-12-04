import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import '../styles/app.css';

export function ThemeToggle({ theme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />;
      case 'dark':
        return <Moon size={20} />;
      case 'system':
        return <Monitor size={20} />;
      default:
        return <Monitor size={20} />;
    }
  };

  const handleSelect = (newTheme) => {
    onThemeChange(newTheme);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-background)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          color: 'var(--color-text)',
        }}
        aria-label="Переключить тему"
      >
        {getIcon()}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: '160px',
            backgroundColor: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '4px',
            boxShadow: 'var(--shadow-md)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => handleSelect('light')}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: theme === 'light' ? 'var(--color-background-secondary)' : 'transparent',
              color: 'var(--color-text)',
              border: 'none',
              textAlign: 'left',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (theme !== 'light') {
                e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (theme !== 'light') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Sun size={16} />
            <span>Светлая</span>
          </button>

          <button
            onClick={() => handleSelect('dark')}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: theme === 'dark' ? 'var(--color-background-secondary)' : 'transparent',
              color: 'var(--color-text)',
              border: 'none',
              textAlign: 'left',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (theme !== 'dark') {
                e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (theme !== 'dark') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Moon size={16} />
            <span>Темная</span>
          </button>

          <button
            onClick={() => handleSelect('system')}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: theme === 'system' ? 'var(--color-background-secondary)' : 'transparent',
              color: 'var(--color-text)',
              border: 'none',
              textAlign: 'left',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              if (theme !== 'system') {
                e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
              }
            }}
            onMouseLeave={(e) => {
              if (theme !== 'system') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <Monitor size={16} />
            <span>Системная</span>
          </button>
        </div>
      )}
    </div>
  );
}