import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UpdateUserRoleInput } from './dto/update-user-role.input';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private users: Model<User>,
    private readonly configService: ConfigService,
  ) {}
  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      this.configService.get<number>('SALT_ROUNDS', 10),
    );

    const user = new this.users({
      ...createUserInput,
      password: hashedPassword,
      role: 'USER',
    });
    return user.save();
  }

  async findAll(params: {
    skip?: number;
    limit?: number;
    where?: object;
    orderBy?: string;
  }): Promise<User[]> {
    const { skip, limit, where, orderBy } = params;

    const users = await this.users
      .find(where || {})
      .sort(orderBy || '-createdAt')
      .skip(Math.max(skip ?? 0, 0))
      .limit(Math.min(Math.max(limit ?? 10, 1), 100))
      .exec();

    return users;
  }

  async findOne(where: object): Promise<User | null> {
    return this.users.findOne(where).exec();
  }

  async update(params: {
    where: object;
    data: UpdateUserInput | UpdateUserRoleInput;
  }): Promise<any> {
    const { where, data } = params;
    return this.users
      .findOneAndUpdate(where, { $set: data }, { new: true })
      .exec();
  }

  async remove(where: object): Promise<any> {
    return this.users.findOneAndDelete(where).exec();
  }
}
