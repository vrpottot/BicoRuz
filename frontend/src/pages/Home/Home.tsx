import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Home.css'

function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="home-container fade-in">
      {/* Герой-блок (Hero Section) */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">🎓 Платформа БИКОРУЗ</span>
          <h1 className="hero-title">
            Образовательная среда <br />
            <span className="text-gradient">нового поколения</span>
          </h1>
          <p className="hero-description">
            Мы рады приветствовать вас в инновационной среде ДГТУ. Управляйте расписанием, находите учебные материалы и общайтесь с единомышленниками в одном удобном пространстве.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <Link to="/profile" className="btn-primary">
                Перейти в личный кабинет
                <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Присоединиться
                  <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <Link to="/login" className="btn-secondary">
                  Уже есть аккаунт? Войти
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-visual-bg"></div>
          <img 
            src="/images/dgtu.png" 
            alt="ДГТУ Кампус" 
            className="hero-image"
            onError={(e) => {
              // Если картинки нет, показываем плейсхолдер
              e.currentTarget.src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop";
            }}
          />
          {/* Декоративный плавающий виджет */}
          <div className="hero-widget float-animation">
            <div className="widget-icon">📅</div>
            <div className="widget-text">
              <strong>Расписание обновлено</strong>
              <span>Осенний семестр 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Секция статистики */}
      <section className="stats-section">
        <div className="stat-card">
          <h3>24/7</h3>
          <p>Доступ к материалам</p>
        </div>
        <div className="stat-card">
          <h3>100%</h3>
          <p>Актуальное расписание</p>
        </div>
        <div className="stat-card">
          <h3>5k+</h3>
          <p>Студентов на платформе</p>
        </div>
      </section>

      {/* Секция преимуществ (Features) */}
      <section className="features-section">
        <div className="features-header">
          <h2>Почему студенты выбирают нас?</h2>
          <p>Всё необходимое для эффективной учебы в одном месте</p>
        </div>
        
        <div className="features-grid">
          {/* Фича 1 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                <rect x="4" y="4" width="16" height="16" rx="2" />
              </svg>
            </div>
            <h3>Умное расписание</h3>
            <p>Моментальный доступ к расписанию занятий, изменениям аудиторий и заменам преподавателей в реальном времени.</p>
          </div>

          {/* Фича 2 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3>Учебные материалы</h3>
            <p>Единая база методичек, конспектов и видеолекций от преподавателей. Учитесь в удобном темпе.</p>
          </div>

          {/* Фича 3 */}
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3>Студенческое сообщество</h3>
            <p>Общайтесь с однокурсниками, создавайте учебные группы и находите ответы на любые вопросы.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          {isAuthenticated ? (
            <>
              <h2>Вы уже вошли в систему</h2>
              <p>Продолжайте обучение и следите за обновлениями в личном кабинете.</p>
              <Link to="/profile" className="btn-primary btn-large">
                Перейти в личный кабинет
              </Link>
            </>
          ) : (
            <>
              <h2>Готовы начать учебу по-новому?</h2>
              <p>Создайте аккаунт за минуту и получите доступ ко всем возможностям портала.</p>
              <Link to="/register" className="btn-primary btn-large">
                Зарегистрироваться сейчас
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
