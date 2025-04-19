import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './modules/users/users.controller';
import { UsersModule } from './modules/users/users.module';
import * as process from 'node:process';
import { User } from './modules/users/users.model';
import { CPFCFormModel } from './modules/CPFC-form/cpfc-form.model';
import { CPFCFormController } from './modules/CPFC-form/cpfc-form.controller';
import { CPFCFormModule } from './modules/CPFC-form/cpfc-form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, CPFCFormModel],
      autoLoadModels: true,
    }),
    UsersModule,
    CPFCFormModule,
  ],
  controllers: [AppController, UsersController, CPFCFormController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
