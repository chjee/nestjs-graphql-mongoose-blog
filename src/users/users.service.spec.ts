import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  user,
  users,
  createUserInput,
  updateUserInput,
} from '../common/constants/jest.constants';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: {} },
        ConfigService,
      ],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should return a user', async () => {
      jest.spyOn(usersService, 'create').mockImplementation(async () => user);
      expect(await usersService.create(createUserInput)).toBe(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(usersService, 'findAll').mockImplementation(async () => users);
      expect(await usersService.findAll({ skip: 0, limit: 5 })).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      jest.spyOn(usersService, 'findOne').mockImplementation(async () => user);
      expect(
        await usersService.findOne({ _id: '6576d6d44441e8ea8a38b5a8' }),
      ).toBe(user);
    });
  });

  describe('update', () => {
    it('should return an updated user', async () => {
      jest.spyOn(usersService, 'update').mockImplementation(async () => user);
      expect(
        await usersService.update({
          where: { _id: '6576d6d44441e8ea8a38b5a8' },
          data: updateUserInput,
        }),
      ).toBe(user);
    });
  });

  describe('remove', () => {
    it('should return a user', async () => {
      jest.spyOn(usersService, 'remove').mockImplementation(async () => user);
      expect(
        await usersService.remove({ _id: '6576d6d44441e8ea8a38b5a8' }),
      ).toBe(user);
    });
  });
});
