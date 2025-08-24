import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { User } from './user.model';

describe('UserService', () => {
  let service: UserService;
  let userRepository: typeof User;

  const mockUser = {
    id: '123',
    email: 'test@mail.com',
    name: 'Danil',
    surname: 'Ivanov',
    age: 25,
    weight: 70,
    height: 175,
    sex: 'male',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User),
          useValue: {
            create: jest.fn(),
            findByPk: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getModelToken(User));
  });

  it('should patch user data', async () => {
    (userRepository.update as jest.Mock).mockResolvedValue([1]);
    (userRepository.findByPk as jest.Mock).mockResolvedValue(mockUser);

    const result = await service.patchUser('123', { age: 26, weight: 72 });

    expect(userRepository.update).toHaveBeenCalledWith({ age: 26, weight: 72 }, { where: { id: '123' } });
    expect(result).toEqual(mockUser);
  });

  it('should edit user data', async () => {
    (userRepository.update as jest.Mock).mockResolvedValue([1]);

    const dto = { ...mockUser, age: 27 };
    await service.editUser(dto as any);

    expect(userRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({ age: 27, id: '123', email: 'test@mail.com' }),
      { where: { id: '123' } },
    );
  });
});
