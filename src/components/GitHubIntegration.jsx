import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Github, Search, Star, GitFork, ExternalLink, Code } from 'lucide-react';
import { githubApi } from '../services/githubApi';
import { useDispatch } from 'react-redux';
import { addProject } from '../store/slices/projectsSlice';
import * as Dialog from '@radix-ui/react-dialog';
import '../styles/app.css';

export function GitHubIntegration({ onClose }) {
  const dispatch = useDispatch();
  const [githubUsername, setGithubUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');

  const { data: repos, isLoading, error, refetch } = useQuery({
    queryKey: ['github-repos', selectedUsername, searchQuery],
    queryFn: () => githubApi.searchUserRepos(selectedUsername, searchQuery),
    enabled: false,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (githubUsername.trim()) {
      setSelectedUsername(githubUsername.trim());
      refetch();
    }
  };

  const handleImportRepo = async (repo) => {
    try {
      const languages = await githubApi.getRepoLanguages(repo.owner.login, repo.name);
      const project = githubApi.convertRepoToProject(repo, languages);
      dispatch(addProject(project));
      alert(`Проект "${repo.name}" успешно импортирован!`);
    } catch (error) {
      console.error('Error importing repo:', error);
      alert('Ошибка при импорте проекта');
    }
  };

  return (
    <Dialog.Root open={true} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }} />
        <Dialog.Content style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--color-background)',
          borderRadius: '12px',
          padding: '32px',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001,
          boxShadow: 'var(--shadow-lg)',
        }}>
          <Dialog.Title style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--color-text)',
          }}>
            <Github size={28} />
            Импорт проектов из GitHub
          </Dialog.Title>

          <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                placeholder="Введите GitHub username (например: facebook)"
                className="form-input"
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                <Search size={20} />
                {isLoading ? 'Поиск...' : 'Найти'}
              </button>
            </div>
          </form>

          {selectedUsername && (
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedUsername) refetch();
                }}
                placeholder="Фильтр по названию репозитория..."
                className="form-input"
              />
            </div>
          )}

          {error && (
            <div style={{
              padding: '16px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              {error.message || 'Ошибка при загрузке репозиториев'}
            </div>
          )}

          {isLoading && (
            <div className="loading-container">
              <div className="spinner" />
            </div>
          )}

          {repos && repos.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '16px',
              maxHeight: '500px',
              overflow: 'auto',
            }}>
              {repos.map(repo => (
                <div key={repo.id} style={{
                  padding: '16px',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-background)',
                  transition: 'all 0.2s',
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '4px',
                      color: 'var(--color-text)',
                    }}>
                      {repo.name}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--color-text-light)',
                      marginBottom: '8px',
                    }}>
                      {repo.description || 'Нет описания'}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--color-text-light)',
                    marginBottom: '12px',
                  }}>
                    {repo.language && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Code size={14} />
                        {repo.language}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} />
                      {repo.stargazers_count}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GitFork size={14} />
                      {repo.forks_count}
                    </div>
                  </div>

                  {repo.topics && repo.topics.length > 0 && (
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      marginBottom: '12px',
                    }}>
                      {repo.topics.slice(0, 3).map(topic => (
                        <span key={topic} style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          backgroundColor: 'var(--color-background-secondary)',
                          borderRadius: '12px',
                          color: 'var(--color-text-light)',
                        }}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ fontSize: '12px', color: 'var(--color-text-light)', marginBottom: '12px' }}>
                    Создан: {new Date(repo.created_at).toLocaleDateString('ru-RU')}
                    <br />
                    Обновлен: {new Date(repo.updated_at).toLocaleDateString('ru-RU')}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleImportRepo(repo)}
                      style={{ flex: 1 }}
                    >
                      Импортировать
                    </button>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ textDecoration: 'none' }}
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {repos && repos.length === 0 && !isLoading && (
            <div className="empty-state">
              <Github size={64} />
              <h3>Репозитории не найдены</h3>
              <p>Попробуйте изменить параметры поиска</p>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
