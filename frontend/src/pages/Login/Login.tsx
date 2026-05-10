import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register } = useAuth()
  
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register')
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  
  // Register State
  const [registerData, setRegisterData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    password: '',
    confirmPassword: ''
  })
  const [registerError, setRegisterError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)

  useEffect(() => {
    setIsSignUp(location.pathname === '/register')
  }, [location.pathname])

  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSignUp(!isSignUp)
    setLoginError('')
    setRegisterError('')
    navigate(isSignUp ? '/login' : '/register', { replace: true })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      await login(loginEmail, loginPassword)
      navigate('/')
    } catch (err: any) {
      setLoginError(err.message || 'Неверный email или пароль')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError('')
    
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Пароли не совпадают')
      return
    }
    
    if (registerData.password.length < 6) {
      setRegisterError('Пароль должен быть не менее 6 символов')
      return
    }

    setRegisterLoading(true)

    try {
      await register(
        registerData.email,
        registerData.password,
        registerData.firstName,
        registerData.lastName,
        registerData.middleName || undefined
      )
      navigate('/')
    } catch (err: any) {
      setRegisterError(err.message || 'Ошибка регистрации. Попробуйте другой email.')
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      {/* Левая часть с брендингом (скрыта на мобильных) */}
      <div className="auth-sidebar fade-in">
        <div className="auth-sidebar-content">
          <Link to="/" className="auth-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-logo-icon">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            BicoRuz
          </Link>
          <h1 className="auth-sidebar-title">
            {isSignUp ? 'Начните свой путь к знаниям' : 'Добро пожаловать обратно'}
          </h1>
          <p className="auth-sidebar-desc">
            Управляйте своим расписанием, отслеживайте успеваемость и будьте в курсе всех университетских событий в одном удобном месте.
          </p>
          
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon">✨</div>
              <span>Умное расписание и уведомления</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">📊</div>
              <span>Аналитика вашей успеваемости</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon">🚀</div>
              <span>Быстрый доступ к учебным материалам</span>
            </div>
          </div>
        </div>
        <div className="auth-sidebar-bg"></div>
      </div>

      {/* Правая часть с формой */}
      <div className="auth-form-wrapper fade-in">
        <div className="auth-form-container">
          
          {/* Мобильный логотип */}
          <Link to="/" className="auth-logo-mobile">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="auth-logo-icon">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            BicoRuz
          </Link>

          <div className="auth-header">
            <h2>{isSignUp ? 'Создать аккаунт' : 'Вход в систему'}</h2>
            <p>
              {isSignUp ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
              <a href="#" onClick={toggleMode} className="auth-toggle-link">
                {isSignUp ? 'Войти' : 'Зарегистрироваться'}
              </a>
            </p>
          </div>

          {!isSignUp ? (
            // Форма входа
            <form onSubmit={handleLogin} className="auth-form fade-in">
              {loginError && <div className="auth-error">{loginError}</div>}
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="name@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label>Пароль</label>
                  <a href="#" className="forgot-password">Забыли пароль?</a>
                </div>
                <div className="password-input-wrap">
                  <input 
                    type={showLoginPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? 'Скрыть' : 'Показать'}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loginLoading}>
                {loginLoading ? (
                  <span className="spinner"></span>
                ) : (
                  'Войти'
                )}
              </button>
            </form>
          ) : (
            // Форма регистрации
            <form onSubmit={handleRegister} className="auth-form fade-in">
              {registerError && <div className="auth-error">{registerError}</div>}
              
              <div className="form-row">
                <div className="form-group">
                  <label>Имя *</label>
                  <input 
                    type="text" 
                    placeholder="Иван" 
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Фамилия *</label>
                  <input 
                    type="text" 
                    placeholder="Иванов" 
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Отчество (опционально)</label>
                <input 
                  type="text" 
                  placeholder="Иванович" 
                  value={registerData.middleName}
                  onChange={(e) => setRegisterData({ ...registerData, middleName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  placeholder="name@university.edu"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Пароль *</label>
                <div className="password-input-wrap">
                  <input 
                    type={showRegPassword ? "text" : "password"} 
                    placeholder="Минимум 6 символов"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    {showRegPassword ? 'Скрыть' : 'Показать'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Подтвердите пароль *</label>
                <input 
                  type={showRegPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={registerLoading}>
                {registerLoading ? (
                  <span className="spinner"></span>
                ) : (
                  'Создать аккаунт'
                )}
              </button>
            </form>
          )}

          <p className="auth-footer-text">
            Продолжая, вы соглашаетесь с нашими <a href="#">Условиями использования</a> и <a href="#">Политикой конфиденциальности</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
