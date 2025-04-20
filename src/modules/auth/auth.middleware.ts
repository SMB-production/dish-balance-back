import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;
    if (token) {
      try {
        const payload = this.jwtService.verify(token);
        const user = await this.userService.findById(payload.id);
        if (user) {
          (req as any).user = user;
        }
      } catch (e) {
        console.log(e);
      }
    }
    next();
  }
}
