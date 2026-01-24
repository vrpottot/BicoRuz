import { useState, useEffect, useRef } from 'react'
import './Calendar.css'

interface CalendarProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  onClose: () => void
  datesWithEvents?: string[]
  position?: { top: number; left: number }
}

const MONTHS = [
  'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
  'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
]

const WEEKDAYS_SHORT = ['П', 'В', 'С', 'Ч', 'П', 'С', 'В']
const WEEKDAYS_FULL = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье']

function Calendar({ selectedDate, onDateSelect, onClose, datesWithEvents = [], position }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date(selectedDate)
    return new Date(date.getFullYear(), date.getMonth(), 1)
  })
  
  const calendarRef = useRef<HTMLDivElement>(null)

  // Синхронизируем текущий месяц с выбранной датой
  useEffect(() => {
    const parts = selectedDate.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1 // месяц в JS начинается с 0
    setCurrentMonth(new Date(year, month, 1))
  }, [selectedDate])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    // Небольшая задержка, чтобы не закрывать календарь сразу при открытии
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  // Парсим дату в формате YYYY-MM-DD, избегая проблем с часовыми поясами
  const parseDate = (dateString: string): { year: number; month: number; day: number } => {
    const parts = dateString.split('-')
    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10) - 1, // месяц в JS начинается с 0
      day: parseInt(parts[2], 10)
    }
  }

  const selectedDateParts = parseDate(selectedDate)
  const selectedDay = selectedDateParts.day
  const selectedMonth = selectedDateParts.month
  const selectedYear = selectedDateParts.year
  
  // Создаем Date объект для отображения (используем локальное время)
  const selectedDateObj = new Date(selectedYear, selectedMonth, selectedDay)

  const getDayOfWeekShort = (date: Date): string => {
    const day = date.getDay()
    return WEEKDAYS_SHORT[day === 0 ? 6 : day - 1]
  }

  const getDayOfWeekFull = (date: Date): string => {
    const day = date.getDay()
    return WEEKDAYS_FULL[day === 0 ? 6 : day - 1]
  }

  const getMonthName = (date: Date): string => {
    return MONTHS[date.getMonth()]
  }

  const formatSelectedDate = (date: Date): string => {
    const day = date.getDate()
    const month = MONTHS[date.getMonth()].substring(0, 3)
    return `${getDayOfWeekShort(date)}, ${day} ${month}.`
  }

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date): number => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const day = firstDay.getDay()
    return day === 0 ? 6 : day - 1
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth() + 1
    // Форматируем дату в формате YYYY-MM-DD без использования toISOString (чтобы избежать проблем с часовыми поясами)
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onDateSelect(dateString)
    onClose()
  }

  const isDateWithEvent = (day: number): boolean => {
    if (!datesWithEvents || datesWithEvents.length === 0) return false
    
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    const dateString = `${year}-${month}-${dayStr}`
    
    return datesWithEvents.includes(dateString)
  }

  const isSelectedDate = (day: number): boolean => {
    return (
      day === selectedDay &&
      currentMonth.getMonth() === selectedMonth &&
      currentMonth.getFullYear() === selectedYear
    )
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days: (number | null)[] = []

  // Добавляем пустые ячейки для дней предыдущего месяца
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Добавляем дни текущего месяца
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const calendarStyle: React.CSSProperties = position
    ? {
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 1000,
        transform: 'translateX(-50%)',
      }
    : {}

  return (
    <>
      <div className="calendar-overlay" onClick={onClose}></div>
      <div ref={calendarRef} className="calendar-popup" style={calendarStyle}>
        <div className="calendar-header">
          <div className="calendar-header__year">{selectedYear}</div>
          <div className="calendar-header__date">{formatSelectedDate(selectedDateObj)}</div>
        </div>
        <div className="calendar-nav">
          <button className="calendar-nav__button" onClick={handlePrevMonth}>
            <i className='bx bx-chevron-left'></i>
          </button>
          <div className="calendar-nav__month">
            {getMonthName(currentMonth)} {currentMonth.getFullYear()} г.
          </div>
          <button className="calendar-nav__button" onClick={handleNextMonth}>
            <i className='bx bx-chevron-right'></i>
          </button>
        </div>
        <div className="calendar-weekdays">
          {WEEKDAYS_SHORT.map((day, index) => (
            <div key={index} className="calendar-weekday">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="calendar-day calendar-day--empty"></div>
            }
            
            const hasEvent = isDateWithEvent(day)
            const isSelected = isSelectedDate(day)
            
            return (
              <div
                key={index}
                className={`calendar-day ${isSelected ? 'calendar-day--selected' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <span className="calendar-day__number">{day}</span>
                {hasEvent && <span className="calendar-day__dot"></span>}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Calendar
