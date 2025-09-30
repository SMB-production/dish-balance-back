import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigrations() {
  if (process.env.NODE_ENV === 'production') {
    try {
      console.log('Запуск миграций базы данных...');
      await execAsync('npx sequelize-cli db:migrate --env production');
      console.log('Миграции выполнены успешно!');
    } catch (error) {
      console.error('Ошибка при выполнении миграций:', error.message);
      console.log('Продолжаем запуск приложения...');
    }
  }
}

async function bootstrap() {
  await runMigrations();

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  const config = new DocumentBuilder()
    .setTitle('Dish Balance')
    .setDescription('Документация REST API')
    .setVersion('1.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
    swaggerUrl: '/swagger/json',
    explorer: true,
    swaggerOptions: {
      urls: [
        { url: '/swagger/json', name: 'OpenAPI JSON' },
        { url: '/swagger/yaml', name: 'OpenAPI YAML' },
      ],
    },
  });

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();
