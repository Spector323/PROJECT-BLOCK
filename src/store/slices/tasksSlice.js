import { createSlice } from '@reduxjs/toolkit';

const mockTasks = [
  {
    id: '1',
    projectId: '1',
    title: 'Разработать макеты главной страницы',
    description: 'Создать 3 варианта дизайна главной страницы',
    status: 'completed',
    priority: 'high',
    assignee: 'Мария',
    dueDate: '2024-02-10',
    completed: true,
  },
  {
    id: '2',
    projectId: '1',
    title: 'Реализовать адаптивную верстку',
    description: 'Верстка для desktop, tablet и mobile',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Дмитрий',
    dueDate: '2024-02-20',
    completed: false,
  },
  {
    id: '3',
    projectId: '1',
    title: 'Интеграция с CMS',
    description: 'Подключение к системе управления контентом',
    status: 'planning',
    priority: 'medium',
    assignee: 'Алексей',
    dueDate: '2024-03-01',
    completed: false,
  },
  {
    id: '4',
    projectId: '2',
    title: 'Настроить среду разработки',
    description: 'React Native + Expo setup',
    status: 'completed',
    priority: 'urgent',
    assignee: 'Иван',
    dueDate: '2024-02-05',
    completed: true,
  },
];

const loadTasks = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return mockTasks;
      }
    }
  }
  return mockTasks;
};

const initialState = {
  tasks: loadTasks(),
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
        if (typeof window !== 'undefined') {
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
      }
    },
    toggleTaskComplete: (state, action) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'in-progress';
        if (typeof window !== 'undefined') {
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
  },
});

export const { addTask, updateTask, toggleTaskComplete, deleteTask } = tasksSlice.actions;
export default tasksSlice.reducer;
