export interface Group {
  id: number
  name: string
  Name?: string
  groupName?: string
  NameGroup?: string
}

export interface Teacher {
  id: number
  name: string
  Name?: string
  fio?: string
  FIO?: string
}

export interface Auditorium {
  id: number
  name: string
  Name?: string
  auditoriumName?: string
  AuditoriumName?: string
}

export interface ScheduleEntry {
  date?: string
  Date?: string
  dateStart?: string
  DateStart?: string
  day?: string
  Day?: string
  timeStart?: string
  TimeStart?: string
  timeEnd?: string
  TimeEnd?: string
  beginLesson?: string
  BeginLesson?: string
  endLesson?: string
  EndLesson?: string
  subject?: string
  Subject?: string
  discipline?: string
  Discipline?: string
  teacher?: string
  Teacher?: string
  teacherName?: string
  TeacherName?: string
  fio?: string
  FIO?: string
  auditorium?: string
  Auditorium?: string
  auditoriumName?: string
  AuditoriumName?: string
  type?: string
  Type?: string
  updated?: boolean
  Updated?: boolean
  // Кириллические поля из API
  дата?: string
  начало?: string
  конец?: string
  дисциплина?: string
  преподаватель?: string
  фиоПреподавателя?: string
  аудитория?: string
  типНедели?: number
  номерЗанятия?: number
}

export interface ScheduleInfo {
  curWeekNumber?: number
  curNumNed?: number
  selectedNumNed?: number
  typesWeek?: Array<{
    typeWeekID: number
    name: string
    shortName: string
  }>
}

export interface ScheduleResponse {
  entries: ScheduleEntry[]
  info?: ScheduleInfo
}

export interface ApiResponse<T> {
  data?: T
  state?: number
  msg?: string
  rasp?: T
}

export type ScheduleType = 'groups' | 'teachers' | 'auditoriums'
