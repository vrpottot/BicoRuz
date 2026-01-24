import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  // Публичные пункты меню (доступны всем)
  const publicMenuItems = [
    { path: '/schedule', icon: 'bx bx-calendar-check', label: 'Расписание', page: 'schedule' },
    { path: '/faq', icon: 'bx bx-help-circle', label: 'Вопросы?', page: 'FAQ' },
  ]

  // Защищенные пункты меню (только для авторизованных)
  const protectedMenuItems = [
    { path: '/study', icon: 'bx bx-book-open', label: 'Учеба', page: 'study' },
    { path: '/profile', icon: 'bx bx-user', label: 'Профиль', page: 'profile' },
    { path: '/feed', icon: 'bx bx-news', label: 'Лента', page: 'feed' },
  ]

  // Объединяем меню в зависимости от авторизации
  const menuItems = isAuthenticated 
    ? [...protectedMenuItems, ...publicMenuItems]
    : publicMenuItems

  return (
    <div className={`sidebar_menu ${isOpen ? 'open' : ''}`}>
      <div className="Logo">
        <i className='bx bxl-bootstrap icon'></i>
        <Link to="/" id="sidebar-logo-link" onClick={onClose}>
          <div className="Text_Logo">БИКОРУЗ</div>
        </Link>
        <i className='bx bx-menu' id="Button" onClick={onClose}></i>
      </div>

      <ul className="Nav_Item">
        {menuItems.map((item) => (
          <li 
            key={item.path} 
            data-page={item.page}
            className={location.pathname.startsWith(item.path) ? 'active' : ''}
          >
            <Link 
              to={item.path} 
              className="nav-link"
              onClick={onClose}
            >
              <i className={item.icon}></i>
              <span className="Item_Name">{item.label}</span>
            </Link>
            <span className="Menu_btn">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
