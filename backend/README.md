# Бэкенд для БИКОРУЗ

Backend сервер для системы аутентификации.

## Установка

```bash
npm install
```

## Запуск

```bash
# Разработка (с автоперезагрузкой)
npm run dev

# Продакшен
npm start
```

Сервер будет доступен на `http://localhost:3001`

## API Endpoints

### POST /api/auth/register
Регистрация нового пользователя

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Иван",
  "lastName": "Иванов",
  "middleName": "Иванович" // опционально
}
```

### POST /api/auth/login
Вход в систему

**Тело запроса:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET /api/auth/me
Получение информации о текущем пользователе

**Заголовки:**
```
Authorization: Bearer <token>
```

## База данных

Используется SQLite. База данных создается автоматически при первом запуске в файле `database.db`.
