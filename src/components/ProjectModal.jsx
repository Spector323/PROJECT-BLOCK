import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { addProject, updateProject } from '../store/slices/projectsSlice';
import { validateProjectForm } from '../utils/validation';
import '../styles/app.css';

export function ProjectModal({ project, onClose }) {
  const dispatch = useDispatch();
  const isEditing = !!project;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    endDate: '',
    progress: 0,
    teamMembers: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        teamMembers: project.teamMembers?.join(', ') || '',
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateProjectForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    const projectData = {
      ...formData,
      teamMembers: formData.teamMembers
        ? formData.teamMembers.split(',').map(m => m.trim()).filter(Boolean)
        : [],
      progress: Number(formData.progress),
    };

    if (isEditing) {
      dispatch(updateProject({ ...projectData, id: project.id }));
    } else {
      dispatch(addProject({ ...projectData, id: Date.now().toString() }));
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
            {isEditing ? 'Редактировать проект' : 'Создать новый проект'}
          </Dialog.Title>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">Название проекта *</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                placeholder="Название проекта"
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Описание *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Описание проекта"
              />
              {errors.description && <div className="form-error">{errors.description}</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="status" className="form-label">Статус *</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="planning">Планирование</option>
                  <option value="in-progress">В работе</option>
                  <option value="completed">Завершен</option>
                  <option value="on-hold">Приостановлен</option>
                </select>
                {errors.status && <div className="form-error">{errors.status}</div>}
              </div>

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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="startDate" className="form-label">Дата начала</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="form-label">Дата окончания</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.endDate && <div className="form-error">{errors.endDate}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="progress" className="form-label">Прогресс (%)</label>
              <input
                id="progress"
                name="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="teamMembers" className="form-label">Участники (через запятую)</label>
              <input
                id="teamMembers"
                name="teamMembers"
                type="text"
                value={formData.teamMembers}
                onChange={handleChange}
                className="form-input"
                placeholder="Алексей, Мария, Дмитрий"
              />
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
