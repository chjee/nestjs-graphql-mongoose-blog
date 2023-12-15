import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(CategoriesService.name);

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
    const count = await this.categories.countDocuments(where || {}).exec();

    if (count <= 0) {
      this.logger.log('No categories found');
      return [];
    }

    const categories = await this.categories
      .find(where || {})
      .sort(orderBy || '-createdAt')
      .skip(skip || 0)
      .limit(limit || 10)
      .exec();

    return categories;
  }

  async findOne(where: object): Promise<Category | null> {
    return this.categories.findById(where).exec();
  }

  async update(params: {
    where: object;
    data: UpdateCategoryInput;
  }): Promise<any> {
    const { where, data } = params;
    return this.categories
      .findByIdAndUpdate(where, { $set: data }, { new: true })
      .exec();
  }

  async remove(where: object): Promise<any> {
    return this.categories.findByIdAndDelete(where).exec();
  }
}
