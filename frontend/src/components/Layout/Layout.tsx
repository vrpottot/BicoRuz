import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import ThemePanel from '../ThemePanel/ThemePanel'
import Footer from '../Footer/Footer'
import './Layout.css'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [themePanelOpen, setThemePanelOpen] = useState(false)

  // Скрываем Header, Sidebar и Footer на страницах логина и регистрации
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className={`layout ${isAuthPage ? 'layout--auth' : ''}`}>
      {!isAuthPage && (
        <>
          <Header 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            onThemeClick={() => setThemePanelOpen(!themePanelOpen)}
          />
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
          <Footer />
        </>
      )}
      <ThemePanel 
        isOpen={themePanelOpen} 
        onClose={() => setThemePanelOpen(false)} 
      />
      <main className={`main-content fade-in ${isAuthPage ? 'main-content--auth' : ''}`}>
        {children}
      </main>
    </div>
  )
}

export default Layout
