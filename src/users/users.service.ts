import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserPasswordDto } from './dto/update-user-password-dto';
import { DeleteUserDto } from './dto/delete-user-dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    return await this.userRepository.create(dto);
  }

  async getAllUsers() {
    return await this.userRepository.findAll();
  }

  async updateUserPassword({ password, id }: UpdateUserPasswordDto) {
    await this.userRepository.update(
      {
        password,
      },
      {
        where: { id: id },
      },
    );
  }

  async deleteUser({ id }: DeleteUserDto) {
    await this.userRepository.destroy({
      where: { id },
    });
    return id;
  }
}
