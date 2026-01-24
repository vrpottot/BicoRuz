import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ApiService } from '../../services/api'
import type { ScheduleEntry, ScheduleType } from '../../types/api'
import Calendar from '../../components/Calendar/Calendar'
import './ScheduleDetail.css'

const DAYS_OF_WEEK = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

function ScheduleDetail() {
  const { type, id } = useParams<{ type: ScheduleType; id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const name = searchParams.get('name') || ''
  
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([])
  const [allScheduleForCalendar, setAllScheduleForCalendar] = useState<ScheduleEntry[]>([])
  const [scheduleInfo, setScheduleInfo] = useState<{ curWeekNumber?: number; selectedNumNed?: number; typesWeek?: Array<{ typeWeekID: number; name: string; shortName: string }> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(() => {
    const dateParam = searchParams.get('date')
    return dateParam || new Date().toISOString().split('T')[0]
  })
  const [showCalendar, setShowCalendar] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const datePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (type && id) {
      loadSchedule()
      loadAllScheduleForCalendar()
    }
  }, [type, id, selectedDate])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      setShowScrollTop(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadSchedule = async () => {
    if (!type || !id) return
    
    setLoading(true)
    try {
      const response = await ApiService.getSchedule(type, id, selectedDate)
      setSchedule(response.entries)
      if (response.info) {
        setScheduleInfo({
          curWeekNumber: response.info.curWeekNumber,
          selectedNumNed: response.info.selectedNumNed,
          typesWeek: response.info.typesWeek
        })
      }
    } catch (error) {
      console.error('Ошибка загрузки расписания:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllScheduleForCalendar = async () => {
    if (!type || !id) return
    
    try {
      // Загружаем расписание за несколько ключевых дат семестра, чтобы собрать все даты с расписанием
      // API возвращает расписание за период (неделю), поэтому загружаем за несколько недель
      const periods = [
        '01.09.2025', // Начало осеннего семестра
        '15.09.2025',
        '01.10.2025',
        '15.10.2025',
        '01.11.2025',
        '15.11.2025',
        '01.12.2025',
        '15.12.2025',
        '01.01.2026',
        '15.01.2026',
        '01.02.2026',
        '15.02.2026'
      ]
      
      const allEntries: ScheduleEntry[] = []
      const seenEntryIds = new Set<number>()
      
      // Загружаем расписание за каждый период параллельно
      const promises = periods.map(periodDate => 
        ApiService.getSchedule(type, id, periodDate).catch(() => ({ entries: [] }))
      )
      
      const responses = await Promise.all(promises)
      
      responses.forEach(response => {
        response.entries.forEach(entry => {
          // Используем код записи для дедупликации
          const entryId = (entry as any).код || (entry as any).code || Math.random()
          if (!seenEntryIds.has(entryId)) {
            seenEntryIds.add(entryId)
            allEntries.push(entry)
          }
        })
      })
      
      setAllScheduleForCalendar(allEntries)
    } catch (error) {
      console.error('Ошибка загрузки расписания для календаря:', error)
    }
  }

  const normalizeDate = (dateString: string): string => {
    // Преобразуем дату в формат YYYY-MM-DD
    if (!dateString) return ''
    
    // Если уже в формате YYYY-MM-DD
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString
    }
    
    // Если в формате с T (ISO)
    if (dateString.includes('T')) {
      return dateString.split('T')[0]
    }
    
    // Если в формате DD.MM.YYYY
    if (dateString.includes('.')) {
      const parts = dateString.split('.')
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0')
        const month = parts[1].padStart(2, '0')
        const year = parts[2]
        return `${year}-${month}-${day}`
      }
    }
    
    // Пытаемся распарсить как Date
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    } catch (e) {
      // Игнорируем ошибки парсинга
    }
    
    return dateString
  }

  const getWeekDatesFromSelected = (selectedDate: string): string[] => {
    // Получаем все даты недели, начиная с выбранной даты до конца недели (воскресенья)
    const dates: string[] = []
    const start = new Date(selectedDate)
    
    // Получаем день недели (0 = воскресенье, 1 = понедельник, ..., 6 = суббота)
    const dayOfWeek = start.getDay()
    
    // Вычисляем количество дней от выбранной даты до воскресенья
    const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
    
    // Добавляем все дни с выбранной даты до воскресенья включительно
    for (let i = 0; i <= daysUntilSunday; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      dates.push(`${year}-${month}-${day}`)
    }
    
    return dates
  }

  const groupScheduleByDay = (entries: ScheduleEntry[], filterWeekStart?: string) => {
    const grouped: Record<string, ScheduleEntry[]> = {}
    
    // Если указана дата начала недели, получаем все даты с этой даты до конца недели
    const weekDates = filterWeekStart ? getWeekDatesFromSelected(filterWeekStart) : null
    
    entries.forEach(entry => {
      // Поддерживаем как английские, так и кириллические названия полей
      const date = (entry as any).дата || entry.date || entry.Date || 
                   (entry as any).датаНачала || entry.dateStart || entry.DateStart || 
                   entry.day || entry.Day
      if (!date) return
      
      const formattedDate = normalizeDate(date)
      
      // Фильтруем по неделе, если указана дата начала недели
      if (weekDates && !weekDates.includes(formattedDate)) {
        return
      }
      
      if (!grouped[formattedDate]) {
        grouped[formattedDate] = []
      }
      grouped[formattedDate].push(entry)
    })
    
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        const timeA = getTimeValue(a)
        const timeB = getTimeValue(b)
        return timeA - timeB
      })
    })
    
    return grouped
  }

  const getTimeValue = (entry: ScheduleEntry): number => {
    const timeStart = (entry as any).начало || entry.timeStart || entry.TimeStart || 
                      entry.beginLesson || entry.BeginLesson || '00:00'
    const [hours, minutes] = timeStart.split(':').map(Number)
    return hours * 60 + minutes
  }

  const getTimeStart = (entry: ScheduleEntry): string => {
    const time = (entry as any).начало || entry.timeStart || entry.TimeStart || 
                 entry.beginLesson || entry.BeginLesson || '00:00'
    return time.length > 5 ? time.substring(0, 5) : time
  }

  const getTimeEnd = (entry: ScheduleEntry): string => {
    const time = (entry as any).конец || entry.timeEnd || entry.TimeEnd || 
                 entry.endLesson || entry.EndLesson || '00:00'
    return time.length > 5 ? time.substring(0, 5) : time
  }

  const getSubject = (entry: ScheduleEntry): string => {
    return (entry as any).дисциплина || entry.subject || entry.Subject || 
           entry.discipline || entry.Discipline || 'Не указано'
  }

  const getTeacher = (entry: ScheduleEntry): string => {
    return (entry as any).фиоПреподавателя || (entry as any).преподаватель || 
           entry.teacher || entry.Teacher || entry.teacherName || entry.TeacherName || 
           entry.fio || entry.FIO || 'Не указано'
  }

  const getAuditorium = (entry: ScheduleEntry): string => {
    return (entry as any).аудитория || entry.auditorium || entry.Auditorium || 
           entry.auditoriumName || entry.AuditoriumName || 'Не указано'
  }

  const getEntryType = (entry: ScheduleEntry): string => {
    const type = entry.type || entry.Type || ''
    const typeMap: Record<string, string> = {
      'лек': 'лек',
      'лаб': 'лаб',
      'пр': 'пр',
      'лекция': 'лек',
      'лабораторная': 'лаб',
      'практика': 'пр'
    }
    return typeMap[type.toLowerCase()] || type || 'лек'
  }

  const getLessonType = (entry: ScheduleEntry): 'lecture' | 'exam' | 'practice' | 'lab' => {
    // Проверяем название дисциплины на наличие "экз" для экзамена
    const subject = getSubject(entry).toLowerCase()
    if (subject.includes('экз') || subject.includes('экзамен')) {
      return 'exam'
    }
    
    // Проверяем тип занятия
    const type = (entry.type || entry.Type || '').toLowerCase()
    const subjectLower = subject
    
    if (type.includes('лаб') || type.includes('лабораторная') || 
        subjectLower.includes('лаб') || subjectLower.includes('лабораторная')) {
      return 'lab'
    }
    
    if (type.includes('пр') || type.includes('практика') || 
        subjectLower.includes('пр') || subjectLower.includes('практика')) {
      return 'practice'
    }
    
    // По умолчанию лекция
    return 'lecture'
  }

  const getTimeBlockColor = (entry: ScheduleEntry): string => {
    const lessonType = getLessonType(entry)
    const colorMap = {
      'lecture': '#4CAF50',    // Зеленый для лекции
      'exam': '#F44336',       // Красный для экзамена
      'practice': '#FF9800',  // Оранжевый для практики
      'lab': '#9C27B0'         // Фиолетовый для лабораторной
    }
    return colorMap[lessonType]
  }

  const getLessonNumber = (entry: ScheduleEntry): number => {
    return (entry as any).номерЗанятия || 1
  }

  const getWeekTypeName = (): string => {
    if (!scheduleInfo?.typesWeek || !scheduleInfo?.selectedNumNed) {
      return 'Верхняя неделя'
    }
    const weekType = scheduleInfo.typesWeek.find(w => w.typeWeekID === scheduleInfo.selectedNumNed)
    return weekType?.name || 'Верхняя неделя'
  }

  const getCurrentWeek = (): string => {
    if (!scheduleInfo?.curWeekNumber) {
      return '21 (В нед.)'
    }
    const weekType = scheduleInfo.typesWeek?.find(w => w.typeWeekID === scheduleInfo.selectedNumNed)
    const shortName = weekType?.shortName || 'В'
    return `${scheduleInfo.curWeekNumber} (${shortName} нед.)`
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }

  const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString)
    return DAYS_OF_WEEK[date.getDay()]
  }

  const scheduleByDay = groupScheduleByDay(schedule, selectedDate)
  const sortedDays = Object.keys(scheduleByDay).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  // Получаем даты с событиями для календаря из всех записей расписания за весь период
  const allScheduleByDay = groupScheduleByDay(allScheduleForCalendar.length > 0 ? allScheduleForCalendar : schedule)
  const datesWithEvents: string[] = []
  
  Object.keys(allScheduleByDay).forEach(date => {
    // Если дата уже в формате YYYY-MM-DD, добавляем как есть
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      datesWithEvents.push(date)
    } else {
      // Иначе конвертируем из Date объекта
      try {
        const dateObj = new Date(date)
        if (!isNaN(dateObj.getTime())) {
          const year = dateObj.getFullYear()
          const month = String(dateObj.getMonth() + 1).padStart(2, '0')
          const day = String(dateObj.getDate()).padStart(2, '0')
          datesWithEvents.push(`${year}-${month}-${day}`)
        }
      } catch (e) {
        // Игнорируем ошибки
      }
    }
  })

  const getTypeLabel = (): string => {
    if (type === 'groups') return 'Группа'
    if (type === 'teachers') return 'Преподаватель'
    return 'Аудитория'
  }

  const handleCalendarToggle = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }
    setShowCalendar(prev => !prev)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    const newParams = new URLSearchParams(searchParams)
    newParams.set('date', date)
    navigate(`/schedule/${type}/${id}?${newParams.toString()}`, { replace: true })
    setShowCalendar(false)
  }

  const getCalendarPosition = (): { top: number; left: number } | undefined => {
    if (!datePickerRef.current) return undefined
    
    const rect = datePickerRef.current.getBoundingClientRect()
    return {
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="schedule-detail-container">
      <div className="schedule-detail-header">
        <div className="schedule-detail-header__left">
          <button 
            className="schedule-detail-back-btn"
            onClick={() => navigate('/schedule')}
          >
            <i className='bx bx-arrow-back'></i>
            <span className="schedule-detail-title">РАСПИСАНИЕ</span>
          </button>
        </div>
        <div className="schedule-detail-header__right">
          <button className="schedule-detail-search-btn">
            <i className='bx bx-search'></i>
          </button>
          <span className="schedule-detail-update">Обновлено: {formatDate(new Date().toISOString())}</span>
        </div>
      </div>

      <div className="schedule-info-panels">
        <div className="schedule-info-panels__row">
          <div className="info-panel">
            <div className="info-panel__label">{getTypeLabel()}</div>
            <div className="info-panel__value">{name || '-'}</div>
          </div>
          <div className="info-panel">
            <div className="info-panel__label">Учебный год</div>
            <div className="info-panel__value">2025-2026</div>
          </div>
          <div className="info-panel">
            <div className="info-panel__label">Семестр</div>
            <div className="info-panel__value">
              <i className='bx bx-umbrella'></i>
              <span>Осень</span>
            </div>
          </div>
          <div className="info-panel">
            <div className="info-panel__label">Текущая неделя</div>
            <div className="info-panel__value info-panel__value--week">
              <span className="week-dot"></span>
              <span>{getCurrentWeek()}</span>
            </div>
          </div>
        </div>
        <div className="schedule-info-panels__row">
          <div className="info-panel">
            <div className="info-panel__label">Выберите дату</div>
            <div 
              ref={datePickerRef}
              className="info-panel__value info-panel__value--date"
              onClick={handleCalendarToggle}
            >
              <i className='bx bx-calendar'></i>
              <div className="date-value-wrapper">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    const newParams = new URLSearchParams(searchParams)
                    newParams.set('date', e.target.value)
                    navigate(`/schedule/${type}/${id}?${newParams.toString()}`, { replace: true })
                  }}
                  className="date-picker-input"
                />
                <span className="date-display">{formatDate(selectedDate)}</span>
                <div className="date-underline"></div>
              </div>
              <span className="date-dot"></span>
              <i 
                className='bx bx-chevron-down calendar-chevron'
              ></i>
            </div>
          </div>
          <div className="info-panel">
            <div className="info-panel__label">Тип недели</div>
            <div className="info-panel__value info-panel__value--week-type">
              <span>{getWeekTypeName()}</span>
              <div className="week-type-underline"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="schedule-display-area">
        {loading ? (
          <div className="loading">Загрузка расписания...</div>
        ) : sortedDays.length === 0 ? (
          <>
            <h2 className="schedule-empty-title">Расписание отсутствует</h2>
            <p className="schedule-empty-text">На выбранный период расписание не найдено</p>
          </>
        ) : (
          sortedDays.map(date => (
            <div key={date} className="schedule-day">
              <div className="day-header">
                <span className="day-name">{getDayOfWeek(date)}</span>
                <span className="day-date">{formatDate(date)}</span>
              </div>
              <div className="day-content">
                {scheduleByDay[date].map((entry, index) => (
                  <div key={index} className="schedule-entry">
                    <div 
                      className="time-block"
                      style={{ background: getTimeBlockColor(entry) }}
                    >
                      <span className="time-start">{getTimeStart(entry)}</span>
                      <span className="time-end">{getTimeEnd(entry)}</span>
                    </div>
                    <div 
                      className="entry-content"
                      style={{ borderLeftColor: getTimeBlockColor(entry) }}
                    >
                      <div className="entry-top-row">
                        <div className="entry-main">
                          <span className="entry-subject">{getSubject(entry)}</span>
                        </div>
                        <div className="entry-actions">
                          <span className="lesson-number">{getLessonNumber(entry)}-е занятие</span>
                          <i className='bx bx-dots-vertical-rounded menu-icon'></i>
                        </div>
                      </div>
                      <div className="entry-meta">
                        <div className="entry-teacher">
                          <i className='bx bx-user'></i>
                          <span>{getTeacher(entry)}</span>
                        </div>
                        <div className="entry-auditorium">
                          <i className='bx bx-building'></i>
                          <span>Аудитория: {getAuditorium(entry)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {showCalendar && (
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onClose={() => setShowCalendar(false)}
          datesWithEvents={datesWithEvents}
          position={getCalendarPosition()}
        />
      )}

      {showScrollTop && (
        <button 
          className="scroll-to-top-btn"
          onClick={scrollToTop}
          aria-label="Наверх"
        >
          <i className='bx bx-up-arrow-alt'></i>
        </button>
      )}
    </div>
  )
}

export default ScheduleDetail
