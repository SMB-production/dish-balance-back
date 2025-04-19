import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/users.model';
import { CPFCFormModel } from './modules/CPFC-form/cpfc-form.model';
import { CPFCFormController } from './modules/CPFC-form/cpfc-form.controller';
import { CPFCFormModule } from './modules/CPFC-form/cpfc-form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        models: [User, CPFCFormModel],
        autoLoadModels: true,
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),

    UsersModule,
    CPFCFormModule,
  ],
  controllers: [AppController, UsersController, CPFCFormController],
  providers: [AppService],
})
export class AppModule {}
