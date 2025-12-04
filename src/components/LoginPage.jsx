import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Lock } from 'lucide-react';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authenticate } from '../middleware/authMiddleware';
import { validateLoginForm } from '../utils/validation';
import '../styles/app.css';

export function LoginPage() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очистка ошибки при вводе
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    // Валидация
    const validationErrors = validateLoginForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    dispatch(loginStart());

    try {
      const user = await authenticate(formData.email, formData.password);
      dispatch(loginSuccess(user));
    } catch (error) {
      dispatch(loginFailure());
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Lock size={30} color="white" />
            </div>
          </div>
          <h1>Вход в систему</h1>
          <p>Управление проектами</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="admin@example.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          {serverError && (
            <div style={{
              padding: '12px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '8px',
              fontSize: '14px',
            }}>
              {serverError}
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            backgroundColor: 'var(--color-background-secondary)',
            borderRadius: '8px',
            fontSize: '13px',
            color: 'var(--color-text-light)',
          }}>
            <strong>Демо-аккаунты:</strong><br />
            admin@example.com / admin123<br />
            user@example.com / user123
          </div>
        </form>
      </div>
    </div>
  );
}
