import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { EditUserInterface } from './interfaces/edit-user.interface';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  async create(dto: CreateUserDto) {
    return this.userRepository.create(dto);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string) {
    return this.userRepository.findByPk(id);
  }

  async editUser(user: EditUserInterface) {
    return this.userRepository.update(
      { ...user },
      {
        where: { id: user.id },
      },
    );
  }
}
