import { createSlice } from '@reduxjs/toolkit';

// Начальные данные проектов
const mockProjects = [
  {
    id: '1',
    title: 'Редизайн веб-сайта',
    description: 'Полное обновление корпоративного веб-сайта с современным дизайном',
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-03-30',
    progress: 65,
    teamMembers: ['Алексей', 'Мария', 'Дмитрий'],
  },
  {
    id: '2',
    title: 'Мобильное приложение',
    description: 'Разработка нативного мобильного приложения для iOS и Android',
    status: 'planning',
    priority: 'urgent',
    startDate: '2024-02-01',
    endDate: '2024-06-15',
    progress: 20,
    teamMembers: ['Ольга', 'Иван'],
  },
  {
    id: '3',
    title: 'Система аналитики',
    description: 'Внедрение системы бизнес-аналитики и отчетности',
    status: 'completed',
    priority: 'medium',
    startDate: '2023-11-01',
    endDate: '2024-01-20',
    progress: 100,
    teamMembers: ['Елена', 'Сергей'],
  },
];

// Загрузка из localStorage
const loadProjects = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockProjects;
      }
    }
  }
  return mockProjects;
};

const initialState = {
  projects: loadProjects(),
  selectedProject: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action) => {
      state.projects.push(action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('projects', JSON.stringify(state.projects));
      }
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload };
        if (typeof window !== 'undefined') {
          localStorage.setItem('projects', JSON.stringify(state.projects));
        }
      }
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('projects', JSON.stringify(state.projects));
      }
    },
    selectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
  },
});

export const { addProject, updateProject, deleteProject, selectProject } = projectsSlice.actions;
export default projectsSlice.reducer;
