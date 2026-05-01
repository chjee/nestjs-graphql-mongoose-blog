import { Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categories: Model<Category>,
  ) {}
  async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
    const category = new this.categories(createCategoryInput);
    return category.save();
  }

  async findAll(params: {
    skip?: number;
    limit?: number;
    where?: object;
    orderBy?: string;
  }): Promise<Category[]> {
    const { skip, limit, where, orderBy } = params;

    const categories = await this.categories
      .find(where || {})
      .sort(orderBy || '-createdAt')
      .skip(Math.max(skip ?? 0, 0))
      .limit(Math.min(Math.max(limit ?? 10, 1), 100))
      .exec();

    return categories;
  }

  async findOne(where: object): Promise<Category | null> {
    return this.categories.findOne(where).exec();
  }

  async update(params: {
    where: object;
    data: UpdateCategoryInput;
  }): Promise<any> {
    const { where, data } = params;
    return this.categories
      .findOneAndUpdate(where, { $set: data }, { new: true })
      .exec();
  }

  async remove(where: object): Promise<any> {
    return this.categories.findOneAndDelete(where).exec();
  }
}
