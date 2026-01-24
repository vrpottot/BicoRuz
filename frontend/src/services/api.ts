import type { Group, Teacher, Auditorium, ScheduleEntry, ApiResponse, ScheduleType, ScheduleResponse, ScheduleInfo } from '../types/api'

const API_BASE_URL = 'https://edu.donstu.ru/api'

export class ApiService {
  private static async fetchApi<T>(url: string): Promise<T> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors'
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse<T> = await response.json()

    if (data.state === -1) {
      throw new Error(data.msg || 'Ошибка API')
    }

    return data as T
  }

  static async getGroups(year: string = '2025-2026'): Promise<Group[]> {
    const data = await this.fetchApi<Group[] | ApiResponse<Group[]>>(
      `${API_BASE_URL}/raspGrouplist?year=${year}`
    )

    if (Array.isArray(data)) {
      return data
    }

    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data
    }

    return []
  }

  static async getTeachers(year: string = '2025-2026'): Promise<Teacher[]> {
    const data = await this.fetchApi<Teacher[] | ApiResponse<Teacher[]>>(
      `${API_BASE_URL}/raspTeacherlist?year=${year}`
    )

    if (Array.isArray(data)) {
      return data
    }

    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data
    }

    return []
  }

  static async getAuditoriums(year: string = '2025-2026'): Promise<Auditorium[]> {
    const data = await this.fetchApi<Auditorium[] | ApiResponse<Auditorium[]>>(
      `${API_BASE_URL}/raspAudlist?year=${year}`
    )

    if (Array.isArray(data)) {
      return data
    }

    if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data
    }

    return []
  }

  static async getSchedule(
    type: ScheduleType,
    id: number | string,
    date: string
  ): Promise<ScheduleResponse> {
    const params = new URLSearchParams()
    
    // Преобразуем дату из YYYY-MM-DD в DD.MM.YYYY для API
    let apiDate = date
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = date.split('-')
      apiDate = `${day}.${month}.${year}`
    }
    
    params.append('sdate', apiDate)

    if (type === 'groups') {
      params.append('idGroup', String(id))
    } else if (type === 'teachers') {
      params.append('idTeacher', String(id))
    } else if (type === 'auditoriums') {
      params.append('idAud', String(id))
    }

    const url = `${API_BASE_URL}/Rasp?${params.toString()}`
    
    const data = await this.fetchApi<any>(url)

    let entries: ScheduleEntry[] = []
    let info: ScheduleInfo | undefined

    // Обрабатываем разные форматы ответа
    if (Array.isArray(data)) {
      entries = data
    } else if (data && typeof data === 'object') {
      if ('data' in data) {
        const dataObj = data.data
        if (Array.isArray(dataObj)) {
          entries = dataObj
        } else if (dataObj && typeof dataObj === 'object') {
          if ('rasp' in dataObj && Array.isArray(dataObj.rasp)) {
            entries = dataObj.rasp
          }
          if ('info' in dataObj && dataObj.info) {
            info = {
              curWeekNumber: dataObj.info.curWeekNumber,
              curNumNed: dataObj.info.curNumNed,
              selectedNumNed: dataObj.info.selectedNumNed,
              typesWeek: dataObj.info.typesWeek
            }
          }
        }
      } else if ('rasp' in data && Array.isArray(data.rasp)) {
        entries = data.rasp
      }
    }

    return { entries, info }
  }

  static async findGroupIdByName(groupName: string): Promise<number | null> {
    try {
      const groups = await this.getGroups()
      const foundGroup = groups.find(group => {
        const name = group.name || group.Name || group.groupName || group.NameGroup || ''
        return name.toLowerCase().includes(groupName.toLowerCase()) || name === groupName
      })
      return foundGroup?.id || null
    } catch (error) {
      console.error('Ошибка поиска группы:', error)
      return null
    }
  }
}
