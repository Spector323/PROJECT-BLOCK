import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Calendar, Users, Trash2, Edit, ExternalLink, Star, GitFork, Code } from 'lucide-react';
import { deleteProject, selectProject } from '../store/slices/projectsSlice';
import { ProjectModal } from './ProjectModal';
import '../styles/app.css';

export function ProjectsList() {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const handleDelete = (e, projectId) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
      dispatch(deleteProject(projectId));
    }
  };

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleProjectClick = (project) => {
    dispatch(selectProject(project));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const getStatusLabel = (status) => {
    const labels = {
      'planning': 'Планирование',
      'in-progress': 'В работе',
      'completed': 'Завершен',
      'on-hold': 'Приостан��влен',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      'low': 'Низкий',
      'medium': 'Средний',
      'high': 'Высокий',
      'urgent': 'Срочный',
    };
    return labels[priority] || priority;
  };

  return (
    <div>
      <div className="page-header">
        <h2>Проекты</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Создать проект
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Plus size={64} />
          </div>
          <h3>Нет проектов</h3>
          <p>Начните с создания вашего первого проекта</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Создать проект
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => handleProjectClick(project)}
            >
              <div className="project-card-header">
                <div>
                  <h3 className="project-title">{project.title}</h3>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                    <span className={`status-badge ${project.status}`}>
                      {getStatusLabel(project.status)}
                    </span>
                    <span className={`priority-badge ${project.priority}`}>
                      {getPriorityLabel(project.priority)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="project-description">{project.description}</p>

              {/* GitHub метаданные */}
              {project.isGithubProject && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  fontSize: '12px',
                  color: 'var(--color-text-light)',
                  marginBottom: 'var(--spacing-md)',
                  flexWrap: 'wrap',
                }}>
                  {project.language && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Code size={14} />
                      {project.language}
                    </div>
                  )}
                  {project.stars !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} />
                      {project.stars}
                    </div>
                  )}
                  {project.forks !== undefined && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GitFork size={14} />
                      {project.forks}
                    </div>
                  )}
                </div>
              )}

              {/* Языки программирования */}
              {project.languages && project.languages.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--color-text-light)',
                    marginBottom: '4px',
                  }}>
                    Стек технологий:
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                  }}>
                    {project.languages.slice(0, 4).map(lang => (
                      <span key={lang.name} style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        backgroundColor: 'var(--color-background-secondary)',
                        borderRadius: '12px',
                        color: 'var(--color-text)',
                      }}>
                        {lang.name} {lang.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Topics (теги) */}
              {project.topics && project.topics.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '4px',
                  }}>
                    {project.topics.slice(0, 3).map(topic => (
                      <span key={topic} style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        borderRadius: '12px',
                      }}>
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="project-meta">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} />
                  <span>{project.startDate} - {project.endDate}</span>
                </div>
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={14} />
                    <span>{project.teamMembers.join(', ')}</span>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                    Прогресс: {project.progress}%
                  </div>
                  <div style={{
                    height: '6px',
                    backgroundColor: 'var(--color-border)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${project.progress}%`,
                      backgroundColor: 'var(--color-primary)',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                </div>
              </div>

              <div className="project-actions">
                {!project.isGithubProject && (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => handleEdit(e, project)}
                  >
                    <Edit size={16} />
                    Редактировать
                  </button>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ textDecoration: 'none' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} />
                    GitHub
                  </a>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => handleDelete(e, project.id)}
                >
                  <Trash2 size={16} />
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <ProjectModal
          project={editingProject}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}