import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/create-user.dto';

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

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id };

    const token = this.jwtService.sign(payload, { expiresIn: '1d' });

    return { token };
  }

  async logout() {
    return { message: 'Logged out' };
  }

  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
