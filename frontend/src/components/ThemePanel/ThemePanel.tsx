import { useState, useEffect } from 'react'
import './ThemePanel.css'

interface ThemePanelProps {
  isOpen: boolean
  onClose: () => void
}

interface ColorOption {
  id: string
  primary: string
  accent: string
}

function ThemePanel({ isOpen, onClose }: ThemePanelProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [animations, setAnimations] = useState<boolean>(true)
  const [accentColor, setAccentColor] = useState<string>('blue-6')

  const colorOptions: ColorOption[] = [
    { id: 'blue-1', primary: '#2196F3', accent: '#1976D2' },
    { id: 'blue-2', primary: '#03A9F4', accent: '#0288D1' },
    { id: 'blue-3', primary: '#00BCD4', accent: '#0097A7' },
    { id: 'blue-4', primary: '#009688', accent: '#00796B' },
    { id: 'blue-5', primary: '#4CAF50', accent: '#388E3C' },
    { id: 'blue-6', primary: '#4A90E2', accent: '#357ABD' },
    { id: 'grey-1', primary: '#607D8B', accent: '#455A64' },
    { id: 'grey-2', primary: '#795548', accent: '#5D4037' },
    { id: 'coral-1', primary: '#FF5722', accent: '#D84315' },
    { id: 'purple-1', primary: '#9C27B0', accent: '#7B1FA2' },
    { id: 'purple-2', primary: '#673AB7', accent: '#512DA8' },
    { id: 'gold-1', primary: '#FFC107', accent: '#F57C00' },
    { id: 'pink-1', primary: '#E91E63', accent: '#C2185B' },
    { id: 'green-1', primary: '#8BC34A', accent: '#689F38' },
    { id: 'red-1', primary: '#F44336', accent: '#D32F2F' },
    { id: 'teal-1', primary: '#009688', accent: '#00796B' },
  ]

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme)
    // Здесь можно добавить логику смены темы
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }

  const handleAnimationsChange = (enabled: boolean) => {
    setAnimations(enabled)
    // Здесь можно добавить логику управления анимациями
    if (enabled) {
      document.documentElement.style.setProperty('--animation-duration', '0.3s')
    } else {
      document.documentElement.style.setProperty('--animation-duration', '0s')
    }
  }

  // Функция для затемнения цвета
  const darkenColor = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.max(0, Math.floor((num >> 16) * (1 - percent)))
    const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - percent)))
    const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - percent)))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
  }

  // Инициализация цвета заголовка и footer при монтировании
  useEffect(() => {
    const currentColor = colorOptions.find(c => c.id === accentColor)
    if (currentColor) {
      document.documentElement.style.setProperty('--theme-header-color', currentColor.primary)
      document.documentElement.style.setProperty('--primary-dark', darkenColor(currentColor.primary, 0.3))
    }
  }, [])

  const handleColorChange = (colorId: string) => {
    setAccentColor(colorId)
    const color = colorOptions.find(c => c.id === colorId)
    if (color) {
      document.documentElement.style.setProperty('--primary-color', color.primary)
      document.documentElement.style.setProperty('--primary-accent', color.accent)
      document.documentElement.style.setProperty('--theme-header-color', color.primary)
      document.documentElement.style.setProperty('--primary-dark', darkenColor(color.primary, 0.3))
    }
  }

  const handleDefaultColor = () => {
    setAccentColor('blue-6')
    const defaultColor = colorOptions.find(c => c.id === 'blue-6')
    if (defaultColor) {
      document.documentElement.style.setProperty('--primary-color', defaultColor.primary)
      document.documentElement.style.setProperty('--primary-accent', defaultColor.accent)
      document.documentElement.style.setProperty('--theme-header-color', defaultColor.primary)
      document.documentElement.style.setProperty('--primary-dark', darkenColor(defaultColor.primary, 0.3))
    }
  }

  return (
    <div className={`theme-panel ${isOpen ? 'open' : ''}`}>
      <div className="theme-panel__header">
        <h2>Настройка темы</h2>
        <button 
          className="theme-panel__closebtn" 
          onClick={onClose}
          aria-label="Закрыть"
        >
          &times;
        </button>
      </div>
      
      <div className="theme-panel__content">
        <div className="theme-panel__section">
          <h3 className="theme-panel__section-title">Тема</h3>
          <div className="theme-panel__segmented-control">
            <button
              className={`theme-panel__segment ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <i className='bx bx-moon'></i>
              <span>ТЕМНАЯ</span>
            </button>
            <button
              className={`theme-panel__segment ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <i className='bx bx-cog'></i>
              <span>СВЕТЛАЯ</span>
            </button>
          </div>
        </div>

        <div className="theme-panel__section">
          <h3 className="theme-panel__section-title">Анимации</h3>
          <div className="theme-panel__segmented-control">
            <button
              className={`theme-panel__segment ${animations ? 'active' : ''}`}
              onClick={() => handleAnimationsChange(true)}
            >
              <i className='bx bxs-show'></i>
              <span>ВКЛ.</span>
            </button>
            <button
              className={`theme-panel__segment ${!animations ? 'active' : ''}`}
              onClick={() => handleAnimationsChange(false)}
            >
              <i className='bx bx-hide'></i>
              <span>ВЫКЛ.</span>
            </button>
          </div>
        </div>

        <div className="theme-panel__section">
          <h3 className="theme-panel__section-title">Цвет акцента</h3>
          <div className="theme-panel__color-grid">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                className={`theme-panel__color-swatch ${accentColor === color.id ? 'selected' : ''}`}
                onClick={() => handleColorChange(color.id)}
                style={{
                  '--color-primary': color.primary,
                  '--color-accent': color.accent,
                } as React.CSSProperties}
              >
                <div className="theme-panel__color-primary" style={{ backgroundColor: color.primary }}></div>
                <div className="theme-panel__color-accent" style={{ backgroundColor: color.accent }}></div>
                {accentColor === color.id && (
                  <i className='bx bx-check theme-panel__color-check'></i>
                )}
              </button>
            ))}
          </div>
          <button 
            className="theme-panel__default-btn"
            onClick={handleDefaultColor}
          >
            ЦВЕТ ПО УМОЛЧАНИЮ
          </button>
        </div>
      </div>
    </div>
  )
}

export default ThemePanel
