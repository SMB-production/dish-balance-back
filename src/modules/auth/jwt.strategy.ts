import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from './interfaces/user-payload.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies?.token]),
      secretOrKey: process.env.JWT_SECRET || 'secret123',
    });
  }

  async validate(payload: UserPayload) {
    const user = await this.userService.findById(payload.id);

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
