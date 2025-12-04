import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Trash2, Edit, CheckCircle2, Circle } from 'lucide-react';
import { deleteTask, toggleTaskComplete } from '../store/slices/tasksSlice';
import { TaskModal } from './TaskModal';
import '../styles/app.css';

export function TasksList() {
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.tasks.tasks);
  const projects = useSelector(state => state.projects.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterProject, setFilterProject] = useState('all');

  const handleDelete = (taskId) => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      dispatch(deleteTask(taskId));
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleToggleComplete = (taskId) => {
    dispatch(toggleTaskComplete(taskId));
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.title || 'Неизвестный проект';
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

  const filteredTasks = filterProject === 'all'
    ? tasks
    : tasks.filter(t => t.projectId === filterProject);

  return (
    <div>
      <div className="page-header">
        <h2>Задачи</h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="form-select"
            style={{ width: '200px' }}
          >
            <option value="all">Все проекты</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Создать задачу
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Plus size={64} />
          </div>
          <h3>Нет задач</h3>
          <p>Создайте вашу первую задачу для проекта</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Создать задачу
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="tasks-list">
            {filteredTasks.map(task => (
              <div key={task.id} className="task-item">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {task.completed ? (
                    <CheckCircle2 size={20} color="var(--color-success)" />
                  ) : (
                    <Circle size={20} color="var(--color-border-dark)" />
                  )}
                </button>

                <div className="task-content">
                  <div className={`task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </div>
                  <div className="task-meta">
                    <span>{getProjectName(task.projectId)}</span>
                    {task.assignee && <span>• {task.assignee}</span>}
                    {task.dueDate && <span>• До: {task.dueDate}</span>}
                    <span className={`priority-badge ${task.priority}`} style={{ marginLeft: '8px' }}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleEdit(task)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
