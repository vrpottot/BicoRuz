import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import './Profile.css'

function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'personal' | 'contacts' | 'connections'>('personal')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    phone: user?.email ? '+7 (988) 999-99-99' : '+7 (988) 999-99-99',
    email: user?.email || 'vmasyuk28@mail.ru',
    citizenship: 'РОССИЯ'
  })

  const handleSave = () => {
    // В реальном приложении здесь будет API запрос
    setIsEditing(false)
    // alert('Данные успешно сохранены!')
  }

  // Моковые данные для демонстрации
  const profileData = {
    fullName: user ? `${user.lastName} ${user.firstName} ${user.middleName || ''}`.trim() : 'Масюк Владимир Владимирович',
    status: 'Обучающийся',
    averageGrade: 3.61,
    gradeDistribution: {
      satisfactory: 15,
      good: 45,
      excellent: 40
    },
    personalInfo: {
      fullName: user ? `${user.lastName} ${user.firstName} ${user.middleName || ''}`.trim() : 'Масюк Владимир Владимирович',
      transliteration: 'MASIUK VLADIMIR',
      group: 'ВИЗ2',
      course: 3,
      recordBookNumber: '111111',
      faculty: 'Информатика и вычислительная техника',
      department: 'Кибербезопасность информационных систем',
      birthDate: '01 января 2000 г.',
      citizenship: 'РОССИЯ',
      email: user?.email || 'vmasyuk28@mail.ru',
      phone: '+7 (988) 999-99-99',
      plan: 'b090301_3-25.plx',
      scopusId: 'Не указан',
      admissionYear: 2023,
      lastLogin: '24 января 2026 г.'
    }
  }

  return (
    <div className="profile-dashboard fade-in">
      <div className="profile-header">
        <h1>Личный кабинет</h1>
        <p>Управление вашим профилем и настройками</p>
      </div>

      <div className="profile-layout">
        {/* Левая колонка (Сайдбар) */}
        <aside className="profile-sidebar">
          {/* Карточка пользователя */}
          <div className="dashboard-widget user-card">
            <div className="user-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="user-status-badge">
              <span className="status-dot"></span>
              {profileData.status}
            </div>
            <h2 className="user-name">{profileData.fullName}</h2>
            <p className="user-email">{profileData.personalInfo.email}</p>
            
            <button className="btn-primary full-width mt-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon-sm">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
              </svg>
              QR-Пропуск
            </button>
          </div>

          {/* Карточка успеваемости */}
          <div className="dashboard-widget grade-card">
            <h3>Успеваемость</h3>
            <div className="grade-highlight">
              <div className="grade-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <div>
                <div className="grade-value">{profileData.averageGrade}</div>
                <div className="grade-label">Средний балл</div>
              </div>
            </div>

            <div className="grade-bars">
              <div className="grade-bar-item">
                <div className="grade-bar-header">
                  <span className="text-success">Отлично</span>
                  <span>{profileData.gradeDistribution.excellent}%</span>
                </div>
                <div className="progress-bg"><div className="progress-fill bg-success" style={{width: `${profileData.gradeDistribution.excellent}%`}}></div></div>
              </div>
              <div className="grade-bar-item">
                <div className="grade-bar-header">
                  <span className="text-warning">Хорошо</span>
                  <span>{profileData.gradeDistribution.good}%</span>
                </div>
                <div className="progress-bg"><div className="progress-fill bg-warning" style={{width: `${profileData.gradeDistribution.good}%`}}></div></div>
              </div>
              <div className="grade-bar-item">
                <div className="grade-bar-header">
                  <span className="text-danger">Удовл.</span>
                  <span>{profileData.gradeDistribution.satisfactory}%</span>
                </div>
                <div className="progress-bg"><div className="progress-fill bg-danger" style={{width: `${profileData.gradeDistribution.satisfactory}%`}}></div></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Правая колонка (Основной контент) */}
        <main className="profile-main-content">
          <div className="dashboard-widget tabs-widget">
            <div className="profile-tabs">
              <button
                className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                Личная информация
              </button>
              <button
                className={`profile-tab ${activeTab === 'contacts' ? 'active' : ''}`}
                onClick={() => setActiveTab('contacts')}
              >
                Доп. контакты
              </button>
              <button
                className={`profile-tab ${activeTab === 'connections' ? 'active' : ''}`}
                onClick={() => setActiveTab('connections')}
              >
                Подключения
              </button>
            </div>

            <div className="profile-tab-content">
              {activeTab === 'personal' && (
                <>
                  <div className="tab-header-actions">
                    <h3>Личные данные</h3>
                    {!isEditing ? (
                      <button className="btn-secondary btn-sm" onClick={() => setIsEditing(true)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon-sm">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                        Редактировать
                      </button>
                    ) : (
                      <div className="edit-actions">
                        <button className="btn-ghost btn-sm" onClick={() => {
                          setIsEditing(false)
                          setEditForm({
                            phone: profileData.personalInfo.phone,
                            email: profileData.personalInfo.email,
                            citizenship: profileData.personalInfo.citizenship
                          })
                        }}>
                          Отмена
                        </button>
                        <button className="btn-primary btn-sm" onClick={handleSave}>
                          Сохранить
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="data-grid">
                    <div className="data-item">
                      <span className="data-label">ФИО</span>
                      <span className="data-value">{profileData.personalInfo.fullName}</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Группа</span>
                      <span className="data-value link-style">{profileData.personalInfo.group}</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Курс</span>
                      <span className="data-value">{profileData.personalInfo.course}</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">№ зачетной книжки</span>
                      <span className="data-value link-style">{profileData.personalInfo.recordBookNumber}</span>
                    </div>
                    <div className="data-item full-width-item">
                      <span className="data-label">Факультет</span>
                      <span className="data-value">{profileData.personalInfo.faculty}</span>
                    </div>
                    <div className="data-item full-width-item">
                      <span className="data-label">Кафедра</span>
                      <span className="data-value">{profileData.personalInfo.department}</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Дата рождения</span>
                      <span className="data-value">{profileData.personalInfo.birthDate}</span>
                    </div>
                    
                    {/* Редактируемые поля */}
                    <div className={`data-item ${isEditing ? 'editing' : ''}`}>
                      <span className="data-label">Гражданство</span>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input" 
                          value={editForm.citizenship}
                          onChange={(e) => setEditForm({...editForm, citizenship: e.target.value})}
                        />
                      ) : (
                        <span className="data-value">{editForm.citizenship}</span>
                      )}
                    </div>
                    
                    <div className="data-item">
                      <span className="data-label">Email</span>
                      {isEditing ? (
                        <input 
                          type="email" 
                          className="edit-input" 
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        />
                      ) : (
                        <span className="data-value">{editForm.email}</span>
                      )}
                    </div>

                    <div className={`data-item ${isEditing ? 'editing' : ''}`}>
                      <span className="data-label">Номер телефона</span>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="edit-input" 
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        />
                      ) : (
                        <span className="data-value">{editForm.phone}</span>
                      )}
                    </div>
                    
                    <div className="data-item">
                      <span className="data-label">Год поступления</span>
                      <span className="data-value">{profileData.personalInfo.admissionYear}</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'contacts' && (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  <p>Дополнительные контакты пока не добавлены</p>
                  <button className="btn-secondary mt-4">Добавить контакт</button>
                </div>
              )}

              {activeTab === 'connections' && (
                <div className="empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <p>Внешние подключения не настроены</p>
                  <button className="btn-secondary mt-4">Настроить интеграции</button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Profile
