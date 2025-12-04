// Валидация форм
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email обязателен';
  if (!regex.test(email)) return 'Некорректный email';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Пароль обязателен';
  if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
  return null;
};

export const validateRequired = (value, fieldName = 'Поле') => {
  if (!value || value.trim() === '') {
    return `${fieldName} обязательно`;
  }
  return null;
};

export const validateProjectForm = (data) => {
  const errors = {};
  
  const titleError = validateRequired(data.title, 'Название проекта');
  if (titleError) errors.title = titleError;
  
  const descError = validateRequired(data.description, 'Описание');
  if (descError) errors.description = descError;
  
  if (!data.status) errors.status = 'Выберите статус';
  if (!data.priority) errors.priority = 'Выберите приоритет';
  
  if (data.startDate && data.endDate) {
    if (new Date(data.startDate) > new Date(data.endDate)) {
      errors.endDate = 'Дата окончания должна быть после даты начала';
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateTaskForm = (data) => {
  const errors = {};
  
  const titleError = validateRequired(data.title, 'Название задачи');
  if (titleError) errors.title = titleError;
  
  if (!data.projectId) errors.projectId = 'Выберите проект';
  if (!data.priority) errors.priority = 'Выберите приоритет';
  
  return Object.keys(errors).length > 0 ? errors : null;
};

export const validateLoginForm = (data) => {
  const errors = {};
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;
  
  return Object.keys(errors).length > 0 ? errors : null;
};
