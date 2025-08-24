import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PatchUserDto } from './dto/patch-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            patchUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should patch user data', async () => {
    const dto: PatchUserDto = { age: 28, weight: 75 };
    const user = { id: '123', email: 'test@mail.com' };
    const expected = { id: '123', age: 28, weight: 75 };

    (service.patchUser as jest.Mock).mockResolvedValue(expected);

    const result = await controller.patchUser(dto, user);

    expect(service.patchUser).toHaveBeenCalledWith('123', dto);
    expect(result).toEqual(expected);
  });
});
