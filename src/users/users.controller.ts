import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserPasswordDto } from './dto/update-user-password-dto';
import { DeleteUserDto } from './dto/delete-user-dto';

@Controller('users')
export class UsersController {

  constructor(private userService: UsersService   ) {
  }

  @Get()
  getAll() {
    return this.userService.getAllUsers()
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.userService.createUser(userDto)
  }

  @Patch()
  updateUser(@Body() userDto: UpdateUserPasswordDto) {
    return this.userService.updateUserPassword(userDto)
  }

  @Delete()
  deleteUser(@Body() userDto: DeleteUserDto) {
    return this.userService.deleteUser(userDto)
  }
}
