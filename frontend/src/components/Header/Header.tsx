import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Header.css'

interface HeaderProps {
  onMenuClick: () => void
  onThemeClick: () => void
}

interface SearchPage {
  path: string
  label: string
  icon: string
  keywords: string[]
}

function Header({ onMenuClick, onThemeClick }: HeaderProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchPage[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const userBtnRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const getUserDisplayName = () => {
    if (!user) return 'Гость'
    const parts = [user.lastName]
    if (user.firstName) {
      parts.push(user.firstName.charAt(0) + '.')
    }
    if (user.middleName) {
      parts.push(user.middleName.charAt(0) + '.')
    }
    return parts.join(' ')
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/login')
  }

  const searchPages: SearchPage[] = [
    { path: '/study', label: 'Учеба', icon: 'bx bx-book-open', keywords: ['учеба', 'учебные материалы', 'материалы', 'study'] },
    { path: '/profile', label: 'Профиль', icon: 'bx bx-user', keywords: ['профиль', 'личный кабинет', 'кабинет', 'profile'] },
    { path: '/schedule', label: 'Расписание', icon: 'bx bx-calendar-check', keywords: ['расписание', 'расп', 'schedule', 'календарь'] },
    { path: '/feed', label: 'Лента', icon: 'bx bx-news', keywords: ['лента', 'новости', 'feed', 'news'] },
    { path: '/faq', label: 'Вопросы?', icon: 'bx bx-help-circle', keywords: ['вопросы', 'faq', 'помощь', 'help', 'вопрос'] },
    { path: '/', label: 'Главная', icon: 'bx bx-home', keywords: ['главная', 'home', 'начало'] },
    { path: '/login', label: 'Вход', icon: 'bx bx-log-in', keywords: ['вход', 'login', 'авторизация'] },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        userBtnRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        !userBtnRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false)
      }
    }

    if (isUserMenuOpen || isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen, isSearchFocused])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      const filtered = searchPages.filter(page => 
        page.label.toLowerCase().includes(query) ||
        page.keywords.some(keyword => keyword.toLowerCase().includes(query))
      )
      setSearchResults(filtered)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const handleUserClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsUserMenuOpen(false)
    onThemeClick()
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log('Ошибка при переходе в полноэкранный режим:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
  }

  const handleSearchSelect = (path: string) => {
    navigate(path)
    setSearchQuery('')
    setIsSearchFocused(false)
    if (searchInputRef.current) {
      searchInputRef.current.blur()
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSearchSelect(searchResults[0].path)
    } else if (e.key === 'Escape') {
      setSearchQuery('')
      setIsSearchFocused(false)
      if (searchInputRef.current) {
        searchInputRef.current.blur()
      }
    }
  }

  return (
    <header className="top-header">
      <div className="top-header__left">
        <button 
          className="top-header__menu-btn"
          onClick={onMenuClick}
          aria-label="Меню"
        >
          <i className='bx bx-menu'></i>
        </button>
        <div className="top-header__title">Личный кабинет</div>
      </div>
      <div className="top-header__search" ref={searchRef}>
        <div className={`top-header__search-container ${isSearchFocused ? 'focused' : ''}`}>
          <i className='bx bx-search top-header__search-icon'></i>
          <input 
            ref={searchInputRef}
            type="text" 
            placeholder="Поиск страниц..." 
            className="top-header__search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onKeyDown={handleSearchKeyDown}
          />
          {searchQuery && (
            <button
              className="top-header__search-clear"
              onClick={() => {
                setSearchQuery('')
                searchInputRef.current?.focus()
              }}
              aria-label="Очистить поиск"
            >
              <i className='bx bx-x'></i>
            </button>
          )}
        </div>
        {isSearchFocused && searchResults.length > 0 && (
          <div className="top-header__search-results">
            {searchResults.map((page) => (
              <button
                key={page.path}
                className="top-header__search-result-item"
                onClick={() => handleSearchSelect(page.path)}
              >
                <i className={page.icon}></i>
                <span>{page.label}</span>
              </button>
            ))}
          </div>
        )}
        {isSearchFocused && searchQuery.trim() && searchResults.length === 0 && (
          <div className="top-header__search-results">
            <div className="top-header__search-no-results">
              Ничего не найдено
            </div>
          </div>
        )}
      </div>
      <div className="top-header__right">
        <button 
          className="top-header__icon-btn"
          onClick={onThemeClick}
          aria-label="Тема"
        >
          <i className='bx bx-snowflake'></i>
        </button>
        <button 
          className="top-header__icon-btn"
          onClick={toggleFullscreen}
          aria-label="Полноэкранный режим"
        >
          <i className='bx bx-fullscreen'></i>
        </button>
        {user ? (
          <div 
            className="top-header__user"
            onClick={handleUserClick}
            ref={userBtnRef}
          >
            <div className="top-header__user-icon">
              <i className='bx bx-user'></i>
            </div>
            <span className="top-header__user-name">{getUserDisplayName()}</span>
            <i className='bx bx-chevron-down top-header__user-dropdown'></i>
            <div 
              className={`user-menu ${isUserMenuOpen ? 'show' : ''}`}
              ref={userMenuRef}
              onClick={(e) => e.stopPropagation()}
            >
              <Link to="/profile" className="user-menu__link" onClick={() => setIsUserMenuOpen(false)}>
                <i className='bx bx-user'></i>
                <span>Профиль</span>
              </Link>
              <a 
                href="#" 
                className="user-menu__link" 
                onClick={handleSettingsClick}
              >
                <i className='bx bx-cog'></i>
                <span>Настройки</span>
              </a>
              <a 
                href="#" 
                className="user-menu__link" 
                onClick={handleLogout}
              >
                <i className='bx bx-log-out'></i>
                <span>Выйти</span>
              </a>
            </div>
          </div>
        ) : (
          <Link to="/login" className="top-header__login-btn">
            <i className='bx bx-log-in'></i>
            <span>Войти</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
