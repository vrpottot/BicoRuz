import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './Profile.css'

function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'personal' | 'contacts' | 'connections'>('personal')

  // Моковые данные для демонстрации (в реальном приложении будут приходить с API)
  const profileData = {
    fullName: user ? `${user.lastName} ${user.firstName} ${user.middleName || ''}`.trim() : 'Масюк Владимир Владимирович',
    status: 'Обучающийся',
    averageGrade: 3.61,
    gradeDistribution: {
      satisfactory: 0,
      good: 0,
      excellent: 0
    },
    personalInfo: {
      fullName: user ? `${user.lastName} ${user.firstName} ${user.middleName || ''}`.trim() : 'Масюк Владимир Владимирович',
      transliteration: '',
      group: 'ВИЗ2',
      course: 3,
      recordBookNumber: '111111',
      faculty: 'Информатика и вычислительная техника',
      department: 'Кибербезопасность информационных систем',
      birthDate: '01 января 0000 г.',
      citizenship: 'РОССИЯ',
      email: user?.email || 'vmasyuk28@mail.ru',
      phone: '+7 988 999 99 99',
      plan: 'b090301_3-25.plx',
      scopusId: '',
      admissionYear: 2023,
      lastLogin: '24 января 2026 г.'
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-background"></div>
      <div className="profile-container">
        {/* Левая колонка */}
        <div className="profile-sidebar">
          {/* Аватар */}
          <div className="profile-avatar">
            <i className='bx bx-user'></i>
          </div>

          {/* Статус */}
          <button className="profile-status">
            <i className='bx bx-user'></i>
            <span>{profileData.status}</span>
          </button>

          {/* Имя */}
          <h2 className="profile-name">{profileData.fullName}</h2>

          {/* Кнопки действий */}
          <div className="profile-actions">
            <button className="profile-action-btn">
              <i className='bx bx-qr'></i>
              <span>ЗАБЫЛ ПРОПУСК</span>
            </button>
          </div>

          {/* Средний балл */}
          <div className="profile-grade">
            <div className="profile-grade-icon">
              <i className='bx bx-graduation-cap'></i>
            </div>
            <div className="profile-grade-info">
              <span className="profile-grade-label">Средний балл</span>
              <span className="profile-grade-value">{profileData.averageGrade}</span>
            </div>
          </div>

          {/* Распределение оценок */}
          <div className="profile-grade-distribution">
            <div className="grade-item grade-satisfactory">
              <div className="grade-label-badge">Удовл.</div>
              <div className="grade-percent">{profileData.gradeDistribution.satisfactory}%</div>
            </div>
            <div className="grade-item grade-good">
              <div className="grade-label-badge">Хор.</div>
              <div className="grade-percent">{profileData.gradeDistribution.good}%</div>
            </div>
            <div className="grade-item grade-excellent">
              <div className="grade-label-badge">Отл.</div>
              <div className="grade-percent">{profileData.gradeDistribution.excellent}%</div>
            </div>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="profile-main">
          {/* Вкладки */}
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              ЛИЧНАЯ ИНФОРМАЦИЯ
            </button>
            <button
              className={`profile-tab ${activeTab === 'contacts' ? 'active' : ''}`}
              onClick={() => setActiveTab('contacts')}
            >
              ДОП. КОНТАКТЫ
            </button>
            <button
              className={`profile-tab ${activeTab === 'connections' ? 'active' : ''}`}
              onClick={() => setActiveTab('connections')}
            >
              ПОДКЛЮЧЕНИЯ
            </button>
          </div>

          {/* Контент вкладок */}
          <div className="profile-content">
            {activeTab === 'personal' && (
              <div className="profile-info-grid">
                <div className="info-item">
                  <label className="info-label">ФИО:</label>
                  <div className="info-value">{profileData.personalInfo.fullName}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Группа:</label>
                  <div className="info-value info-link">{profileData.personalInfo.group}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Курс:</label>
                  <div className="info-value">{profileData.personalInfo.course}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Номер зачетной книжки:</label>
                  <div className="info-value info-link">{profileData.personalInfo.recordBookNumber}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Факультет:</label>
                  <div className="info-value">{profileData.personalInfo.faculty}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Кафедра:</label>
                  <div className="info-value">{profileData.personalInfo.department}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Дата рождения:</label>
                  <div className="info-value">{profileData.personalInfo.birthDate}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Гражданство:</label>
                  <div className="info-value">{profileData.personalInfo.citizenship}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">E-Mail:</label>
                  <div className="info-value">{profileData.personalInfo.email}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Номер телефона:</label>
                  <div className="info-value">{profileData.personalInfo.phone}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Год поступления:</label>
                  <div className="info-value">{profileData.personalInfo.admissionYear}</div>
                </div>

                <div className="info-item">
                  <label className="info-label">Дата последнего входа:</label>
                  <div className="info-value">{profileData.personalInfo.lastLogin}</div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="profile-tab-content">
                <p>Дополнительные контакты будут здесь</p>
              </div>
            )}

            {activeTab === 'connections' && (
              <div className="profile-tab-content">
                <p>Подключения будут здесь</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
