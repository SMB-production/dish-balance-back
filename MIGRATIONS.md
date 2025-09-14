# Миграции базы данных

## Автоматический запуск миграций

Миграции настроены для автоматического запуска при запуске приложения в production режиме.

### В Docker

```bash
# Запуск с автоматическими миграциями
docker-compose up --build
```

В этом случае:
1. Сначала запускается база данных PostgreSQL
2. Приложение ждет готовности базы данных
3. Автоматически выполняются миграции
4. Запускается основное приложение

### Ручной запуск миграций

```bash
# Выполнить миграции
npm run migrate

# Откатить последнюю миграцию
npm run migrate:undo

# Откатить все миграции
npm run migrate:undo:all
```

## Структура миграций

- `migrations/` - папка с файлами миграций
- `config/config.js` - конфигурация для разных окружений (использует переменные окружения)
- `.sequelizerc` - конфигурация Sequelize CLI

## Создание новых миграций

```bash
# Создать новую миграцию
npx sequelize-cli migration:generate --name название-миграции

# Пример
npx sequelize-cli migration:generate --name add-new-table
```

## Переменные окружения

Убедитесь, что в `.production.env` указаны правильные настройки базы данных:

```env
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database
NODE_ENV=production
```

## Troubleshooting

### Миграции не выполняются

1. Проверьте подключение к базе данных
2. Убедитесь, что переменные окружения настроены правильно
3. Проверьте логи приложения: `docker-compose logs app`

### Ошибка подключения к базе данных

1. Убедитесь, что база данных запущена: `docker-compose ps`
2. Проверьте health check базы данных: `docker-compose logs db`
3. Проверьте настройки в `config/config.js` и переменные окружения
