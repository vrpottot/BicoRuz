# Руководство по редактированию базы данных

## Варианты работы с SQLite базой данных

### 1. Использование скрипта db-manager.js (Рекомендуется)

Простой интерактивный скрипт для управления пользователями:

```bash
cd backend
node db-manager.js
```

**Возможности:**
- Просмотр всех пользователей
- Поиск пользователя по ID
- Удаление пользователя
- Обновление данных пользователя

### 2. DB Browser for SQLite (GUI инструмент)

**Скачать:** https://sqlitebrowser.org/

**Использование:**
1. Установите DB Browser for SQLite
2. Откройте приложение
3. Нажмите "Open Database"
4. Выберите файл `backend/database.db`
5. Перейдите на вкладку "Browse Data" для просмотра
6. Используйте вкладку "Execute SQL" для выполнения SQL запросов

**Полезные SQL запросы:**

```sql
-- Просмотр всех пользователей
SELECT id, email, firstName, lastName, middleName, createdAt FROM users;

-- Поиск пользователя по email
SELECT * FROM users WHERE email = 'user@example.com';

-- Удаление пользователя
DELETE FROM users WHERE id = 1;

-- Обновление email
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;

-- Обновление имени
UPDATE users SET firstName = 'НовоеИмя' WHERE id = 1;

-- Подсчет пользователей
SELECT COUNT(*) FROM users;
```

### 3. Командная строка SQLite

**Установка SQLite CLI:**
- Windows: https://www.sqlite.org/download.html
- Или используйте SQLite через Node.js:

```bash
# Установка sqlite3 CLI (если нужно)
npm install -g sqlite3

# Или используйте npx
npx sqlite3 database.db
```

**Основные команды:**

```bash
# Открыть базу данных
sqlite3 database.db

# В SQLite CLI:
.tables                    # Показать все таблицы
.schema users              # Показать структуру таблицы users
SELECT * FROM users;       # Показать всех пользователей
.quit                      # Выход
```

### 4. VS Code расширения

**Рекомендуемые расширения:**
- **SQLite Viewer** - для просмотра БД
- **SQLite** - для выполнения запросов

**Установка:**
1. Откройте VS Code
2. Перейдите в Extensions (Ctrl+Shift+X)
3. Найдите "SQLite Viewer" или "SQLite"
4. Установите расширение
5. Откройте файл `database.db` в VS Code

### 5. Онлайн инструменты

- **SQLite Viewer** (https://sqliteviewer.app/) - загрузите файл database.db
- **DB Browser Online** - веб-версия для просмотра

## Структура таблицы users

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,           -- Хешированный пароль (bcrypt)
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  middleName TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Важные замечания

⚠️ **Внимание:**
- Пароли хранятся в хешированном виде (bcrypt)
- Не редактируйте пароли напрямую в БД - используйте API регистрации
- Всегда делайте резервную копию перед изменениями
- Email должен быть уникальным

## Резервное копирование

```bash
# Создать копию базы данных
cp database.db database.db.backup

# Восстановить из копии
cp database.db.backup database.db
```

## Прямое редактирование через Node.js

Создайте временный скрипт для быстрых операций:

```javascript
// quick-edit.js
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const db = new sqlite3.Database(join(__dirname, 'database.db'))

// Пример: обновить email пользователя с ID 1
db.run('UPDATE users SET email = ? WHERE id = ?', ['newemail@example.com', 1], (err) => {
  if (err) {
    console.error('Ошибка:', err)
  } else {
    console.log('Обновлено успешно')
  }
  db.close()
})
```

Запуск: `node quick-edit.js`
