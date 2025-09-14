import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.create({ ...createUserDto, password: hashedPassword });
  }

  async login(email: string, password: string): Promise<RefreshTokenDto> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '4h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '2d',
    });

    const accessTokenExpiresAt = this.getTokenExpirationTime(accessToken);
    const refreshTokenExpiresAt = this.getTokenExpirationTime(refreshToken);

    const now = new Date();
    const accessTokenExpiresIn = accessTokenExpiresAt.getTime() - now.getTime();
    const refreshTokenExpiresIn = refreshTokenExpiresAt.getTime() - now.getTime();

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
      refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
      accessTokenExpiresIn: Math.max(0, accessTokenExpiresIn),
      refreshTokenExpiresIn: Math.max(0, refreshTokenExpiresIn),
    };
  }

  async logout() {
    return { message: 'Logged out' };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }

  async checkAuthStatus(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.id);

      if (!user) {
        return {
          isAuthenticated: false,
        };
      }

      const tokenExpiresAt = this.getTokenExpirationTime(token);
      const now = new Date();
      const tokenExpiresIn = tokenExpiresAt.getTime() - now.getTime();

      return {
        isAuthenticated: true,
        tokenExpiresAt: tokenExpiresAt.toISOString(),
        tokenExpiresIn: Math.max(0, tokenExpiresIn),
        userId: user.id,
        userEmail: user.email,
      };
    } catch (error) {
      console.log(error);
      return {
        isAuthenticated: false,
      };
    }
  }

  async refreshTokens(refreshToken: string): Promise<RefreshTokenDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.id);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Создаем новые токены
      const newPayload = { id: user.id, email: user.email };

      const accessToken = this.jwtService.sign(newPayload, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '4h',
      });

      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '2d',
      });

      // Вычисляем время истечения токенов
      const accessTokenExpiresAt = this.getTokenExpirationTime(accessToken);
      const refreshTokenExpiresAt = this.getTokenExpirationTime(newRefreshToken);

      const now = new Date();
      const accessTokenExpiresIn = accessTokenExpiresAt.getTime() - now.getTime();
      const refreshTokenExpiresIn = refreshTokenExpiresAt.getTime() - now.getTime();

      return {
        accessToken,
        refreshToken: newRefreshToken,
        accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
        refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
        accessTokenExpiresIn: Math.max(0, accessTokenExpiresIn),
        refreshTokenExpiresIn: Math.max(0, refreshTokenExpiresIn),
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private getTokenExpirationTime(token: string): Date {
    const decoded = this.jwtService.decode(token) as any;
    return new Date(decoded.exp * 1000);
  }
}
