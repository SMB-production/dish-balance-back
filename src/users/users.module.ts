import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersController } from './users.controller';
import { User } from './users.model';

@Module({
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
