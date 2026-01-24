import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiService } from '../../services/api'
import type { Group, Teacher, Auditorium, ScheduleType } from '../../types/api'
import './Schedule.css'

function Schedule() {
  const [activeTab, setActiveTab] = useState<ScheduleType>('groups')
  const [groups, setGroups] = useState<Group[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [auditoriums, setAuditoriums] = useState<Auditorium[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'groups') {
        const data = await ApiService.getGroups()
        setGroups(data)
      } else if (activeTab === 'teachers') {
        const data = await ApiService.getTeachers()
        setTeachers(data)
      } else if (activeTab === 'auditoriums') {
        const data = await ApiService.getAuditoriums()
        setAuditoriums(data)
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCurrentData = (): (Group | Teacher | Auditorium)[] => {
    if (activeTab === 'groups') return groups
    if (activeTab === 'teachers') return teachers
    return auditoriums
  }

  const filteredData = useMemo(() => {
    const data = getCurrentData()
    if (!searchQuery) return data
    
    const query = searchQuery.toLowerCase()
    return data.filter(item => {
      const name = item.name || (item as any).Name || ''
      return name.toLowerCase().includes(query)
    })
  }, [searchQuery, groups, teachers, auditoriums, activeTab])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return filteredData.slice(start, end)
  }, [filteredData, currentPage, rowsPerPage])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  const handleItemClick = (item: Group | Teacher | Auditorium) => {
    const name = item.name || (item as any).Name || ''
    navigate(`/schedule/${activeTab}/${item.id}?name=${encodeURIComponent(name)}`)
  }

  const handleTabChange = (tab: ScheduleType) => {
    setActiveTab(tab)
    setCurrentPage(1)
    setSearchQuery('')
  }

  const getItemName = (item: Group | Teacher | Auditorium): string => {
    return item.name || (item as any).Name || (item as any).groupName || (item as any).NameGroup || ''
  }

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <div className="schedule-header-top">
          <h1 className="schedule-title">Расписание</h1>
          <div className="schedule-header-right">
            <div className="schedule-tabs">
              <button 
                className={`schedule-tab ${activeTab === 'groups' ? 'active' : ''}`}
                onClick={() => handleTabChange('groups')}
              >
                <i className='bx bx-group'></i>
                <span>ПО ГРУППАМ</span>
              </button>
              <button 
                className={`schedule-tab ${activeTab === 'auditoriums' ? 'active' : ''}`}
                onClick={() => handleTabChange('auditoriums')}
              >
                <i className='bx bx-building'></i>
                <span>ПО АУДИТОРИЯМ</span>
              </button>
              <button 
                className={`schedule-tab ${activeTab === 'teachers' ? 'active' : ''}`}
                onClick={() => handleTabChange('teachers')}
              >
                <i className='bx bx-user'></i>
                <span>ПО ПРЕПОДАВАТЕЛЯМ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="schedule-search">
        <i className='bx bx-search'></i>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Поиск"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>

      <div className="schedule-content">
        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : paginatedData.length === 0 ? (
          <div className="empty">Ничего не найдено</div>
        ) : (
          <div className="schedule-list">
            {paginatedData.map((item) => (
              <div 
                key={item.id} 
                className="schedule-item"
                onClick={() => handleItemClick(item)}
              >
                {getItemName(item)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="schedule-pagination">
        <div className="pagination-left">
          <span className="pagination-label">Строк на странице:</span>
          <select 
            className="rows-select"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="pagination-center">
          <span className="pagination-text">
            {filteredData.length > 0 
              ? `${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, filteredData.length)} из ${filteredData.length}`
              : '0-0 из 0'
            }
          </span>
        </div>
        <div className="pagination-right">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            <i className='bx bx-chevron-left'></i>
          </button>
          <button 
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            <i className='bx bx-chevron-right'></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Schedule
