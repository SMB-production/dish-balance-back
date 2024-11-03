import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserPasswordDto } from './dto/update-user-password-dto';
import { DeleteUserDto } from './dto/delete-user-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './users.model';

@ApiTags('Users controller')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({summary: 'Получение всех пользователей'})
  @ApiResponse({status: 200, type: [User]})
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @ApiOperation({summary: 'Создание пользователя'})
  @ApiResponse({status: 200, type: User})
  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto);
  }

  @ApiOperation({summary: 'Обновление пароля пользователя'})
  @ApiResponse({status: 204})
  @Patch()
  updateUser(@Body() userDto: UpdateUserPasswordDto) {
    return this.userService.updateUserPassword(userDto);
  }

  @ApiOperation({summary: 'Удаление пользователя'})
  @ApiResponse({status: 200, type: String})
  @Delete()
  deleteUser(@Body() userDto: DeleteUserDto) {
    return this.userService.deleteUser(userDto);
  }
}
