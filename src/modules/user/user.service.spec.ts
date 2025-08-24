import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { User } from './user.model';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: {
            update: jest.fn(),
            findByPk: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getModelToken(User));
  });

  it('should patch user age and weight', async () => {
    const mockUser = { id: '123', age: 30, weight: 80 };

    (userRepository.update as jest.Mock).mockResolvedValue([1]);
    (userRepository.findByPk as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.patchUser('123', { age: 30, weight: 80 });

    expect(userRepository.update).toHaveBeenCalledWith({ age: 30, weight: 80 }, { where: { id: '123' } });
    expect(result).toEqual(mockUser);
  });
});
