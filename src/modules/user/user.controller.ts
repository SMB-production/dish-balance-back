import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EditUserDto } from './dto/edit-user.dto';
import { Body, Controller, InternalServerErrorException, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { UserService } from './user.service';

@ApiTags('Контроллер для работы с пользователем')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Редактирование пользователя' })
  @ApiResponse({ status: 200, type: EditUserDto })
  @UseGuards(JwtAuthGuard)
  @Put('edit-user-data')
  async editUser(@Body() editUserDto: EditUserDto, @CurrentUser() user: UserPayload) {
    const userData = { id: user.id, email: user.email, ...editUserDto };
    try {
      await this.userService.editUser(userData);
      return userData;
    } catch {
      throw new InternalServerErrorException('Что-то пошло не так');
    }
  }
}
