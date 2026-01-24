import { useState } from 'react'
import './FAQ.css'

function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])) // Первый элемент открыт по умолчанию

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const faqItems = [
    {
      id: 'chacor1',
      question: 'Как происходит обучение?',
      answer: (
        <>
          <p>Процесс обучения на платформе "БИКОРУЗ" включает в себя следующие этапы:</p>
          <ol style={{ marginLeft: 'var(--spacing-lg)', marginTop: 'var(--spacing-md)' }}>
            <li><strong>Регистрация и авторизация:</strong> Пользователи регистрируются на платформе и получают доступ к учебным материалам.</li>
            <li><strong>Выбор курсов:</strong> Студенты выбирают курсы, соответствующие их учебным программам.</li>
            <li><strong>Доступ к материалам:</strong> Доступ к лекциям, методичкам, видеоматериалам в различных форматах.</li>
            <li><strong>Самостоятельное обучение:</strong> Изучение материалов в удобное время и темпе.</li>
            <li><strong>Взаимодействие:</strong> Общение с преподавателями через форумы и чаты.</li>
            <li><strong>Дополнительные ресурсы:</strong> Библиотека, ссылки на полезные статьи и инструменты для обмена знаниями.</li>
          </ol>
        </>
      )
    },
    {
      id: 'chacor2',
      question: 'Что такое БИКОРУЗ?',
      answer: (
        <p>БИКОРУЗ — это библиотека интегрированных курсов, ресурсов и образовательных материалов университетских знаний. Платформа создана для облегчения образовательного процесса и предоставления доступа к учебным материалам.</p>
      )
    },
    {
      id: 'chacor3',
      question: 'Для кого сделана эта платформа?',
      answer: (
        <>
          <p>Платформа "БИКОРУЗ" предназначена для:</p>
          <ul style={{ marginLeft: 'var(--spacing-lg)', marginTop: 'var(--spacing-md)' }}>
            <li><strong>Заочников:</strong> Дистанционный доступ к лекциям и материалам</li>
            <li><strong>Студентов, пропустивших пары:</strong> Наверстать пропущенный материал</li>
            <li><strong>Преподавателей:</strong> Размещение лекций и методичек для студентов</li>
            <li><strong>Администраторов:</strong> Управление содержанием и пользователями</li>
          </ul>
        </>
      )
    },
    {
      id: 'chacor4',
      question: 'Как добавлять Word документ?',
      answer: (
        <>
          <p>Для добавления документа:</p>
          <ol style={{ marginLeft: 'var(--spacing-lg)', marginTop: 'var(--spacing-md)' }}>
            <li>Заполните форму и прикрепите ваш файл</li>
            <li>Ожидайте одобрения файла администратором</li>
          </ol>
        </>
      )
    }
  ]

  return (
    <div className="container faq-page">
      <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-3xl)' }}>
        <h1 style={{ color: 'var(--primary-color)', marginBottom: 'var(--spacing-md)' }}>
          Часто задаваемые вопросы
        </h1>
        <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-secondary)' }}>
          Найдите ответы на популярные вопросы о платформе
        </p>
      </header>

      <div className="acor-container">
        {faqItems.map((item, index) => (
          <div key={item.id}>
            <input
              type="checkbox"
              name="chacor"
              id={item.id}
              checked={openItems.has(index)}
              onChange={() => toggleItem(index)}
              style={{ display: 'none' }}
            />
            <label 
              htmlFor={item.id}
              className={openItems.has(index) ? 'checked' : ''}
            >
              {item.question}
            </label>
            <div className={`acor-body ${openItems.has(index) ? 'open' : ''}`}>
              {item.answer}
            </div>
          </div>
        ))}
      </div>

      <div className="contact-section">
        <h2>Остались вопросы?</h2>
        <p>
          Задавайте их нашему{' '}
          <a
            href="https://t.me/nyyyyafka"
            target="_blank"
            rel="noopener"
          >
            Team Leader
          </a>
        </p>
      </div>
    </div>
  )
}

export default FAQ
