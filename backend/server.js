import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = 3001
const JWT_SECRET = 'bicoruz_secret_key_2026' // В продакшене использовать переменную окружения

app.use(cors())
app.use(express.json())

// Инициализация базы данных
const db = new sqlite3.Database(join(__dirname, 'database.db'))

// Создание таблицы пользователей
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      middleName TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, middleName } = req.body

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        state: -1, 
        msg: 'Все обязательные поля должны быть заполнены' 
      })
    }

    // Проверка существования пользователя
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ state: -1, msg: 'Ошибка базы данных' })
      }

      if (row) {
        return res.status(400).json({ state: -1, msg: 'Пользователь с таким email уже существует' })
      }

      // Хеширование пароля
      const hashedPassword = await bcrypt.hash(password, 10)

      // Сохранение пользователя
      db.run(
        'INSERT INTO users (email, password, firstName, lastName, middleName) VALUES (?, ?, ?, ?, ?)',
        [email, hashedPassword, firstName, lastName, middleName || null],
        function(err) {
          if (err) {
            return res.status(500).json({ state: -1, msg: 'Ошибка при регистрации' })
          }

          // Генерация JWT токена
          const token = jwt.sign(
            { userId: this.lastID, email },
            JWT_SECRET,
            { expiresIn: '7d' }
          )

          res.json({
            state: 1,
            msg: 'Регистрация успешна',
            data: {
              token,
              user: {
                id: this.lastID,
                email,
                firstName,
                lastName,
                middleName: middleName || null
              }
            }
          })
        }
      )
    })
  } catch (error) {
    res.status(500).json({ state: -1, msg: 'Ошибка сервера' })
  }
})

// Вход
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ state: -1, msg: 'Email и пароль обязательны' })
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ state: -1, msg: 'Ошибка базы данных' })
      }

      if (!row) {
        return res.status(401).json({ state: -1, msg: 'Неверный email или пароль' })
      }

      // Проверка пароля
      const isValidPassword = await bcrypt.compare(password, row.password)

      if (!isValidPassword) {
        return res.status(401).json({ state: -1, msg: 'Неверный email или пароль' })
      }

      // Генерация JWT токена
      const token = jwt.sign(
        { userId: row.id, email: row.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({
        state: 1,
        msg: 'Вход выполнен успешно',
        data: {
          token,
          user: {
            id: row.id,
            email: row.email,
            firstName: row.firstName,
            lastName: row.lastName,
            middleName: row.middleName
          }
        }
      })
    })
  } catch (error) {
    res.status(500).json({ state: -1, msg: 'Ошибка сервера' })
  }
})

// Проверка токена
app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ state: -1, msg: 'Токен не предоставлен' })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ state: -1, msg: 'Недействительный токен' })
      }

      db.get('SELECT id, email, firstName, lastName, middleName FROM users WHERE id = ?', 
        [decoded.userId], 
        (err, row) => {
          if (err || !row) {
            return res.status(404).json({ state: -1, msg: 'Пользователь не найден' })
          }

          res.json({
            state: 1,
            data: {
              user: {
                id: row.id,
                email: row.email,
                firstName: row.firstName,
                lastName: row.lastName,
                middleName: row.middleName
              }
            }
          })
        }
      )
    })
  } catch (error) {
    res.status(500).json({ state: -1, msg: 'Ошибка сервера' })
  }
})

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
