import sqlite3 from 'sqlite3'
import readline from 'readline'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = new sqlite3.Database(join(__dirname, 'database.db'))

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function listUsers() {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, email, firstName, lastName, middleName, createdAt FROM users', [], (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

async function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

async function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
      if (err) {
        reject(err)
      } else {
        resolve(this.changes)
      }
    })
  })
}

async function updateUser(id, field, value) {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE users SET ${field} = ? WHERE id = ?`, [value, id], function(err) {
      if (err) {
        reject(err)
      } else {
        resolve(this.changes)
      }
    })
  })
}

async function main() {
  console.log('\n=== Управление базой данных БИКОРУЗ ===\n')
  
  while (true) {
    console.log('\nВыберите действие:')
    console.log('1. Показать всех пользователей')
    console.log('2. Найти пользователя по ID')
    console.log('3. Удалить пользователя')
    console.log('4. Обновить данные пользователя')
    console.log('5. Выход')
    
    const choice = await question('\nВаш выбор: ')
    
    try {
      switch (choice) {
        case '1':
          const users = await listUsers()
          console.log('\n=== Список пользователей ===')
          if (users.length === 0) {
            console.log('Пользователей не найдено')
          } else {
            users.forEach(user => {
              console.log(`\nID: ${user.id}`)
              console.log(`Email: ${user.email}`)
              console.log(`Имя: ${user.firstName} ${user.lastName} ${user.middleName || ''}`)
              console.log(`Создан: ${user.createdAt}`)
            })
          }
          break
          
        case '2':
          const userId = await question('Введите ID пользователя: ')
          const user = await getUserById(userId)
          if (user) {
            console.log('\n=== Данные пользователя ===')
            console.log(`ID: ${user.id}`)
            console.log(`Email: ${user.email}`)
            console.log(`Имя: ${user.firstName}`)
            console.log(`Фамилия: ${user.lastName}`)
            console.log(`Отчество: ${user.middleName || 'не указано'}`)
            console.log(`Пароль (хеш): ${user.password.substring(0, 20)}...`)
            console.log(`Создан: ${user.createdAt}`)
          } else {
            console.log('Пользователь не найден')
          }
          break
          
        case '3':
          const deleteId = await question('Введите ID пользователя для удаления: ')
          const deleted = await deleteUser(deleteId)
          if (deleted > 0) {
            console.log('Пользователь успешно удален')
          } else {
            console.log('Пользователь не найден')
          }
          break
          
        case '4':
          const updateId = await question('Введите ID пользователя: ')
          const updateUser = await getUserById(updateId)
          if (!updateUser) {
            console.log('Пользователь не найден')
            break
          }
          
          console.log('\nКакое поле обновить?')
          console.log('1. Email')
          console.log('2. Имя')
          console.log('3. Фамилия')
          console.log('4. Отчество')
          
          const fieldChoice = await question('Ваш выбор: ')
          const fields = { '1': 'email', '2': 'firstName', '3': 'lastName', '4': 'middleName' }
          const field = fields[fieldChoice]
          
          if (!field) {
            console.log('Неверный выбор')
            break
          }
          
          const newValue = await question(`Введите новое значение для ${field}: `)
          const updated = await updateUser(updateId, field, newValue)
          if (updated > 0) {
            console.log('Данные успешно обновлены')
          } else {
            console.log('Ошибка при обновлении')
          }
          break
          
        case '5':
          console.log('Выход...')
          db.close()
          rl.close()
          process.exit(0)
          break
          
        default:
          console.log('Неверный выбор')
      }
    } catch (error) {
      console.error('Ошибка:', error.message)
    }
  }
}

main().catch(console.error)
