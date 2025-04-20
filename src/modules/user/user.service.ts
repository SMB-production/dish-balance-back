import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(dto: CreateUserDto) {
    return this.userModel.create(dto);
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.userModel.findByPk(id);
  }
}
