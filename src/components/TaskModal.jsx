import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { addTask, updateTask } from '../store/slices/tasksSlice';
import { validateTaskForm } from '../utils/validation';
import '../styles/app.css';

export function TaskModal({ task, onClose }) {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects.projects);
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    status: 'planning',
    assignee: '',
    dueDate: '',
    completed: false,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else if (projects.length > 0) {
      setFormData(prev => ({ ...prev, projectId: projects[0].id }));
    }
  }, [task, projects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateTaskForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    if (isEditing) {
      dispatch(updateTask({ ...formData, id: task.id }));
    } else {
      dispatch(addTask({ ...formData, id: Date.now().toString() }));
    }

    onClose();
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
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          zIndex: 1001,
          boxShadow: 'var(--shadow-lg)',
        }}>
          <Dialog.Title style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '24px',
          }}>
            {isEditing ? 'Редактировать задачу' : 'Создать новую задачу'}
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Название задачи *</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Название задачи"
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Описание</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Описание задачи"
              />
            </div>

            <div className="form-group">
              <label htmlFor="projectId" className="form-label">Проект *</label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Выберите проект</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
              {errors.projectId && <div className="form-error">{errors.projectId}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="priority" className="form-label">Приоритет *</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="urgent">Срочный</option>
                </select>
                {errors.priority && <div className="form-error">{errors.priority}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">Статус</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="planning">Планирование</option>
                  <option value="in-progress">В работе</option>
                  <option value="completed">Завершена</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="assignee" className="form-label">Исполнитель</label>
                <input
                  id="assignee"
                  name="assignee"
                  type="text"
                  value={formData.assignee}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Имя исполнителя"
                />
              </div>

              <div className="form-group">
                <label htmlFor="dueDate" className="form-label">Срок выполнения</label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {isEditing ? 'Сохранить' : 'Создать'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                Отмена
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
