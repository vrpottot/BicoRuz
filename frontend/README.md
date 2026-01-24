# БИКОРУЗ ДГТУ - React + TypeScript + Vite

Образовательная платформа для студентов ДГТУ, переработанная на современном стеке.

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизированный JavaScript
- **Vite** - быстрый сборщик и dev-сервер
- **React Router** - маршрутизация
- **Boxicons** - иконки

## Установка

```bash
npm install
```

## Запуск dev-сервера

```bash
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `dist`

## Предпросмотр продакшен сборки

```bash
npm run preview
```

## Структура проекта

```
frontend/
├── public/          # Статические файлы (изображения, favicon)
├── src/
│   ├── components/  # React компоненты
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── ThemePanel/
│   │   └── Layout/
│   ├── pages/       # Страницы приложения
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Schedule/
│   │   ├── ScheduleDetail/
│   │   ├── Study/
│   │   └── FAQ/
│   ├── services/    # API сервисы
│   ├── types/       # TypeScript типы
│   ├── App.tsx      # Главный компонент с роутингом
│   ├── main.tsx     # Точка входа
│   └── index.css    # Глобальные стили
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## API

Приложение использует API ДГТУ:
- `https://edu.donstu.ru/api/raspGrouplist` - список групп
- `https://edu.donstu.ru/api/raspTeacherlist` - список преподавателей
- `https://edu.donstu.ru/api/raspAudlist` - список аудиторий
- `https://edu.donstu.ru/api/Rasp` - расписание

## Особенности

- ✅ Полная типизация TypeScript
- ✅ Компонентная архитектура
- ✅ Роутинг через React Router
- ✅ Адаптивный дизайн
- ✅ Работа с API расписания
- ✅ Темная/светлая тема (в разработке)
- ✅ Многоязычность (в разработке)

## Разработка

Проект использует современные практики React:
- Функциональные компоненты с хуками
- TypeScript для типобезопасности
- CSS модули для стилей
- Разделение на компоненты и страницы
