import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EditUserDto } from './dto/edit-user.dto';
import { PatchUserDto } from './dto/patch-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

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
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            patchUser: jest.fn(),
            editUser: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('PATCH /user/edit-user-stats', async () => {
    const dto: PatchUserDto = { age: 26, weight: 72 };
    (service.patchUser as jest.Mock).mockResolvedValue({ ...mockUser, ...dto });

    const result = await controller.patchUser(dto, { id: '123', email: 'test@mail.com' });

    expect(service.patchUser).toHaveBeenCalledWith('123', dto);
    expect(result?.age).toEqual(26);
    expect(result?.weight).toEqual(72);
  });

  it('PUT /user/edit-user-data', async () => {
    const dto: EditUserDto = { name: 'Danil', surname: 'Ivanov', age: 27, weight: 75 };
    (service.editUser as jest.Mock).mockResolvedValue({ ...mockUser, ...dto });

    const result = await controller.editUser(dto, { id: '123', email: 'test@mail.com' });

    expect(service.editUser).toHaveBeenCalled();
    expect(result.age).toEqual(27);
    expect(result.weight).toEqual(75);
  });
});
