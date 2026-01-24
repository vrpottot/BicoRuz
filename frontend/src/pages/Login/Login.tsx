import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register } = useAuth()
  
  // Определяем, показывать ли форму регистрации при загрузке
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register')
  
  // Состояние для формы входа
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  
  // Состояние для формы регистрации
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

  useEffect(() => {
    // Если пришли с /register, показываем форму регистрации
    if (location.pathname === '/register') {
      setIsSignUp(true)
    }
  }, [location.pathname])

  const handleSwitch = () => {
    setIsSignUp(!isSignUp)
    setLoginError('')
    setRegisterError('')
    // Обновляем URL без перезагрузки
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
      setLoginError(err.message || 'Ошибка входа')
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

    if (!registerData.firstName || !registerData.lastName) {
      setRegisterError('Имя и фамилия обязательны для заполнения')
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
      setRegisterError(err.message || 'Ошибка регистрации')
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="login-page-wrapper">
      <div className="main">
      <div className={`container a-container ${isSignUp ? 'is-txl' : ''}`} id="a-container">
        <form id="a-form" className="form" onSubmit={handleRegister}>
          <h2 className="form_title title">Создать аккаунт</h2>
          {registerError && <div className="form-error">{registerError}</div>}
          <input 
            className="form__input" 
            type="email" 
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            required
          />
          <input 
            className="form__input" 
            type="text" 
            placeholder="Имя" 
            value={registerData.firstName}
            onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
            required
          />
          <input 
            className="form__input" 
            type="text" 
            placeholder="Фамилия" 
            value={registerData.lastName}
            onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
            required
          />
          <input 
            className="form__input" 
            type="text" 
            placeholder="Отчество" 
            value={registerData.middleName}
            onChange={(e) => setRegisterData({ ...registerData, middleName: e.target.value })}
          />
          <input 
            className="form__input" 
            type="password" 
            placeholder="Пароль"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            required
          />
          <input 
            className="form__input" 
            type="password" 
            placeholder="Подтверждение пароля"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
            required
          />
          <button className="form__button button submit" type="submit" disabled={registerLoading}>
            {registerLoading ? 'Регистрация...' : 'РЕГИСТРАЦИЯ'}
          </button>
        </form>
      </div>

      <div className={`container b-container ${isSignUp ? 'is-txl is-z200' : ''}`} id="b-container">
        <form id="b-form" className="form" onSubmit={handleLogin}>
          <h2 className="form_title title">Вход на сайт</h2>
          {loginError && <div className="form-error">{loginError}</div>}
          <input 
            className="form__input" 
            type="email" 
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />
          <input 
            className="form__input" 
            type="password" 
            placeholder="Пароль"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />
          <a className="form__link" href="#">Забыли пароль?</a>
          <button className="form__button button submit" type="submit" disabled={loginLoading}>
            {loginLoading ? 'Вход...' : 'ВОЙТИ'}
          </button>
        </form>
      </div>

      <div className={`switch ${isSignUp ? 'is-txr' : ''}`} id="switch-cnt">
        <div className={`switch__circle ${isSignUp ? 'is-txr' : ''}`}></div>
        <div className={`switch__circle switch__circle--t ${isSignUp ? 'is-txr' : ''}`}></div>
        <div className={`switch__container ${isSignUp ? 'is-hidden' : ''}`} id="switch-c1">
          <h2 className="switch__title title">С возвращением!</h2>
          <p className="switch__description description">
            Чтобы оставаться на связи с нами, пожалуйста, войдите, используя свои личные данные
          </p>
          <button className="switch__button button switch-btn" onClick={handleSwitch}>
            ВОЙТИ
          </button>
        </div>
        <div className={`switch__container ${!isSignUp ? 'is-hidden' : ''}`} id="switch-c2">
          <h2 className="switch__title title">Привет, друг!</h2>
          <p className="switch__description description">
            Введите свои личные данные и начните путешествие с нами
          </p>
          <button className="switch__button button switch-btn" onClick={handleSwitch}>
            РЕГИСТРАЦИЯ
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Login
