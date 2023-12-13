import { Injectable, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
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
  private readonly logger = new Logger(UsersService.name);

  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserInput.password,
      this.configService.get<number>('SALT_ROUND', 10),
    );
    createUserInput.password = hashedPassword;

    const user = new this.users(createUserInput);
    return user.save();
  }

  async findAll(params: {
    skip?: number;
    limit?: number;
    where?: object;
    orderBy?: string;
  }): Promise<User[] | null> {
    const { skip, limit, where, orderBy } = params;
    const count = await this.users.countDocuments().exec();

    if (count <= 0) {
      this.logger.log('No users found');
      return null;
    }

    const users = await this.users
      .find(where || {})
      .sort(orderBy || '-createdAt')
      .skip(skip || 0)
      .limit(limit || 10)
      .exec();

    return users;
  }

  async findOne(where: object): Promise<User | null> {
    return this.users.findOne(where).exec();
  }

  async update(params: { where: object; data: UpdateUserInput }): Promise<any> {
    const { where, data } = params;
    return this.users
      .findOneAndUpdate(where, { $set: data }, { new: true })
      .exec();
  }

  async remove(where: object): Promise<any> {
    return this.users.findOneAndDelete(where).exec();
  }
}
