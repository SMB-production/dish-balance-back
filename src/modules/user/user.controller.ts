import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EditUserDto } from './dto/edit-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';
import { Body, Controller, InternalServerErrorException, Patch, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { UserService } from './user.service';

@ApiTags('Контроллер для работы с пользователем')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Редактирование пользователя (PUT)' })
  @ApiResponse({ status: 200, type: EditUserDto })
  @UseGuards(JwtAuthGuard)
  @Put('edit-user')
  async editUser(@Body() editUserDto: EditUserDto, @CurrentUser() user: UserPayload) {
    const userData = { id: user.id, email: user.email, ...editUserDto };
    try {
      await this.userService.editUser(userData);
      return userData;
    } catch {
      throw new InternalServerErrorException('Что-то пошло не так');
    }
  }

  @ApiOperation({ summary: 'Частичное редактирование возраста/веса/роста/пола (PATCH)' })
  @ApiResponse({ status: 200, type: PatchUserDto })
  @UseGuards(JwtAuthGuard)
  @Patch('edit-user')
  async patchUser(@Body() patchUserDto: PatchUserDto, @CurrentUser() user: UserPayload) {
    try {
      return await this.userService.patchUser(user.id, patchUserDto);
    } catch {
      throw new InternalServerErrorException('Не удалось обновить данные пользователя');
    }
  }
}
