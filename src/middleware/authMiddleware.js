// Middleware для проверки аутентификации (адаптация для React)
export const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return !!user;
  }
  return false;
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

export const authenticate = async (email, password) => {
  // Симуляция API запроса
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Демо-пользователи
      const users = [
        { id: '1', email: 'admin@example.com', password: 'admin123', name: 'Администратор', role: 'admin' },
        { id: '2', email: 'user@example.com', password: 'user123', name: 'Пользователь', role: 'user' },
      ];
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword);
      } else {
        reject(new Error('Неверный email или пароль'));
      }
    }, 800);
  });
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};
