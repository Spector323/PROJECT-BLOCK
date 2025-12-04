import { useSelector } from 'react-redux';
import { FolderKanban, ListTodo, CheckCircle2, Clock } from 'lucide-react';
import '../styles/app.css';

export function Dashboard() {
  const projects = useSelector(state => state.projects.projects);
  const tasks = useSelector(state => state.tasks.tasks);

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in-progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    pendingTasks: tasks.filter(t => !t.completed).length,
  };

  const recentProjects = projects.slice(0, 3);
  const recentTasks = tasks.slice(0, 5);

  const getStatusLabel = (status) => {
    const labels = {
      'planning': 'Планирование',
      'in-progress': 'В работе',
      'completed': 'Завершен',
      'on-hold': 'Приостановлен',
    };
    return labels[status] || status;
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.title || 'Неизвестный проект';
  };

  return (
    <div>
      <div className="page-header">
        <h2>Дашборд</h2>
      </div>

      {/* Статистика */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px',
      }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '14px', marginBottom: '8px' }}>
                Всего проектов
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>
                {stats.totalProjects}
              </div>
            </div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FolderKanban size={30} color="var(--color-primary)" />
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '14px', marginBottom: '8px' }}>
                Активных проектов
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>
                {stats.activeProjects}
              </div>
            </div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Clock size={30} color="var(--color-warning)" />
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '14px', marginBottom: '8px' }}>
                Завершено проектов
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>
                {stats.completedProjects}
              </div>
            </div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle2 size={30} color="var(--color-success)" />
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--color-text-light)', fontSize: '14px', marginBottom: '8px' }}>
                Всего задач
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700' }}>
                {stats.totalTasks}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-light)', marginTop: '4px' }}>
                Выполнено: {stats.completedTasks} | Осталось: {stats.pendingTasks}
              </div>
            </div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ListTodo size={30} color="var(--color-secondary)" />
            </div>
          </div>
        </div>
      </div>

      {/* Недавние проекты и задачи */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Недавние проекты */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Недавние проекты</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentProjects.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '24px' }}>
                Нет проектов
              </div>
            ) : (
              recentProjects.map(project => (
                <div
                  key={project.id}
                  style={{
                    padding: '16px',
                    backgroundColor: 'var(--color-background-secondary)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '8px',
                  }}>
                    <div style={{ fontWeight: '600' }}>{project.title}</div>
                    <span className={`status-badge ${project.status}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-light)' }}>
                    {project.description}
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '12px', marginBottom: '4px', color: 'var(--color-text-light)' }}>
                      Прогресс: {project.progress}%
                    </div>
                    <div style={{
                      height: '4px',
                      backgroundColor: 'var(--color-border)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${project.progress}%`,
                        backgroundColor: 'var(--color-primary)',
                      }} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Недавние задачи */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Недавние задачи</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentTasks.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '24px' }}>
                Нет задач
              </div>
            ) : (
              recentTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--color-background-secondary)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div>
                    {task.completed ? (
                      <CheckCircle2 size={18} color="var(--color-success)" />
                    ) : (
                      <Clock size={18} color="var(--color-warning)" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: '500',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? 'var(--color-text-light)' : 'var(--color-text)',
                    }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                      {getProjectName(task.projectId)}
                      {task.dueDate && ` • До: ${task.dueDate}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
