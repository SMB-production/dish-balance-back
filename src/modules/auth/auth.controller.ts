import { Body, Controller, Get, Post, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/user.model';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from '../user/dto/user.dto';
import { AuthStatusDto } from './dto/auth-status.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Контроллер аутентификации')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Вход пользователя в систему' })
  @ApiResponse({ status: 200, type: RefreshTokenDto })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(loginDto.email, loginDto.password);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: tokens.accessTokenExpiresIn,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: tokens.refreshTokenExpiresIn,
    });

    return { message: 'Logged in', ...tokens };
  }

  @ApiOperation({ summary: 'Выход пользователя из системы' })
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return this.authService.logout();
  }

  @ApiOperation({ summary: 'Получение данных пользователя по кукам' })
  @ApiResponse({ status: 200, type: UserDto })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: User): UserDto {
    return UserDto.fromEntity(user);
  }

  @ApiOperation({ summary: 'Проверка статуса авторизации пользователя' })
  @ApiResponse({ status: 200, type: AuthStatusDto })
  @Get('isAuth')
  async checkAuthStatus(@Res({ passthrough: true }) res: Response) {
    const accessToken = res.req?.cookies?.accessToken;

    if (!accessToken) {
      return {
        isAuthenticated: false,
      };
    }

    return this.authService.checkAuthStatus(accessToken);
  }

  @ApiOperation({ summary: 'Обновление access токена с помощью refresh токена' })
  @ApiResponse({ status: 200, type: RefreshTokenDto })
  @Post('refresh')
  async refreshTokens(@Res({ passthrough: true }) res: Response) {
    const refreshToken = res.req?.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: tokens.accessTokenExpiresIn,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: tokens.refreshTokenExpiresIn,
    });

    return { message: 'Tokens refreshed', ...tokens };
  }
}
