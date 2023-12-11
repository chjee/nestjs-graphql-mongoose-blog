import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async findAll(params: { skip?: number; limit?: number }): Promise<User[]> {
    const { skip, limit } = params;
    const count = await this.users.countDocuments().exec();

    if (count <= 0) {
      this.logger.error('No users found');
      throw new NotFoundException('No users found');
    }

    const users = await this.users
      .find()
      .sort('-createdAt')
      .skip(skip || 0)
      .limit(limit || 10)
      .exec();

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.users.findById({ _id: id }).exec();

    if (!user) {
      this.logger.error(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<any> {
    return this.users
      .findByIdAndUpdate({ _id: id }, { $set: updateUserInput }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<any> {
    return this.users.findByIdAndDelete({ _id: id }).exec();
  }
}
