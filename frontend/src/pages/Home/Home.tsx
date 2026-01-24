import './Home.css'

function Home() {
  return (
    <div className="home-container">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-image">
            <img 
              src="/images/dgtu.png" 
              alt="ДГТУ" 
              className="hero-img"
            />
          </div>
          
          <div className="welcome-text">
            <h1>Добро пожаловать в БИКОРУЗ ДГТУ</h1>
            <h2>
              Мы рады приветствовать вас в нашей инновационной образовательной среде, 
              где знания становятся доступными, увлекательными и интегрированными.
            </h2>
            <p>
              <strong>"БИКОРУЗ ДГТУ"</strong> — это не просто образовательная платформа, 
              это место, где вы можете расширить свой кругозор, обучиться новым навыкам 
              и встретить единомышленников.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className='bx bx-book-reader'></i>
            </div>
            <h3>Учебные материалы</h3>
            <p>Доступ к лекциям, методичкам и учебным ресурсам для подготовки к экзаменам</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <i className='bx bx-group'></i>
            </div>
            <h3>Сообщество</h3>
            <p>Общайтесь с однокурсниками и преподавателями, делитесь знаниями</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
