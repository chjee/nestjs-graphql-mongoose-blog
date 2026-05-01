import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import {
  user,
  users,
  createUserInput,
  updateUserInput,
} from '../common/constants/jest.constants';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: jest.Mock & Record<string, jest.Mock>;
  let save: jest.Mock;

  const queryChain = (result: unknown) => {
    const exec = jest.fn().mockResolvedValue(result);
    const limit = jest.fn().mockReturnValue({ exec });
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    return { exec, limit, skip, sort };
  };

  beforeEach(async () => {
    save = jest.fn().mockResolvedValue(user);
    userModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save,
    })) as jest.Mock & Record<string, jest.Mock>;
    userModel.find = jest.fn();
    userModel.findOne = jest.fn();
    userModel.findOneAndUpdate = jest.fn();
    userModel.findOneAndDelete = jest.fn();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: userModel },
        { provide: ConfigService, useValue: { get: jest.fn(() => 10) } },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hashes passwords and creates USER role accounts', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-password' as never);

    await expect(usersService.create(createUserInput)).resolves.toBe(user);

    expect(bcrypt.hash).toHaveBeenCalledWith(createUserInput.password, 10);
    expect(userModel).toHaveBeenCalledWith({
      ...createUserInput,
      password: 'hashed-password',
      role: 'USER',
    });
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('finds users with bounded pagination defaults', async () => {
    const chain = queryChain(users);
    userModel.find.mockReturnValue(chain);

    await expect(usersService.findAll({})).resolves.toBe(users);

    expect(userModel.find).toHaveBeenCalledWith({});
    expect(chain.sort).toHaveBeenCalledWith('-createdAt');
    expect(chain.skip).toHaveBeenCalledWith(0);
    expect(chain.limit).toHaveBeenCalledWith(10);
  });

  it('applies filters and clamps pagination limits', async () => {
    const chain = queryChain(users);
    userModel.find.mockReturnValue(chain);

    await usersService.findAll({
      where: { role: 'ADMIN' },
      orderBy: 'email',
      skip: -5,
      limit: 999,
    });

    expect(userModel.find).toHaveBeenCalledWith({ role: 'ADMIN' });
    expect(chain.sort).toHaveBeenCalledWith('email');
    expect(chain.skip).toHaveBeenCalledWith(0);
    expect(chain.limit).toHaveBeenCalledWith(100);
  });

  it('finds one user', async () => {
    const exec = jest.fn().mockResolvedValue(user);
    userModel.findOne.mockReturnValue({ exec });

    await expect(usersService.findOne({ _id: user.id })).resolves.toBe(user);
    expect(userModel.findOne).toHaveBeenCalledWith({ _id: user.id });
  });

  it('updates one user', async () => {
    const exec = jest.fn().mockResolvedValue(user);
    userModel.findOneAndUpdate.mockReturnValue({ exec });

    await expect(
      usersService.update({
        where: { _id: user.id },
        data: updateUserInput,
      }),
    ).resolves.toBe(user);
    expect(userModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: user.id },
      { $set: updateUserInput },
      { new: true },
    );
  });

  it('removes one user', async () => {
    const exec = jest.fn().mockResolvedValue(user);
    userModel.findOneAndDelete.mockReturnValue({ exec });

    await expect(usersService.remove({ _id: user.id })).resolves.toBe(user);
    expect(userModel.findOneAndDelete).toHaveBeenCalledWith({ _id: user.id });
  });
});
