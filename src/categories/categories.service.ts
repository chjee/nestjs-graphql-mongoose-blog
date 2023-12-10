import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  }): Promise<Category[]> {
    const { skip, limit } = params;
    const count = await this.categories.countDocuments().exec();

    if (count <= 0) {
      this.logger.error('No categories found');
      throw new NotFoundException('No categories found');
    }

    const categories = await this.categories
      .find()
      .sort('-createdAt')
      .skip(skip || 0)
      .limit(limit || 10)
      .exec();

    return categories;
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categories.findById({ _id: id }).exec();

    if (!category) {
      this.logger.error(`Category with id ${id} not found`);
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryInput: UpdateCategoryInput,
  ): Promise<any> {
    return this.categories
      .findByIdAndUpdate(
        { _id: id },
        { $set: updateCategoryInput },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<any> {
    return this.categories.findByIdAndDelete({ _id: id }).exec();
  }
}
