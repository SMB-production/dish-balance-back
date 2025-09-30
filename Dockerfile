FROM node:18-alpine

WORKDIR /usr/src/app

# Копируем package.json
COPY package*.json ./
RUN npm install

# Копируем остальные файлы
COPY . .

# Сборка приложения
RUN npm run build

EXPOSE 5000

# Запускаем приложение (миграции выполняются автоматически)
CMD ["npm", "run", "start:prod"]