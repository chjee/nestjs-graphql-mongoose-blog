import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import {
  category,
  categories,
  createCategoryInput,
  updateCategoryInput,
} from '../common/constants/jest.constants';
import { Category } from './entities/category.entity';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoryModel: jest.Mock & Record<string, jest.Mock>;
  let save: jest.Mock;

  const queryChain = (result: unknown) => {
    const exec = jest.fn().mockResolvedValue(result);
    const limit = jest.fn().mockReturnValue({ exec });
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    return { exec, limit, skip, sort };
  };

  beforeEach(async () => {
    save = jest.fn().mockResolvedValue(category);
    categoryModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save,
    })) as jest.Mock & Record<string, jest.Mock>;
    categoryModel.find = jest.fn();
    categoryModel.findOne = jest.fn();
    categoryModel.findOneAndUpdate = jest.fn();
    categoryModel.findOneAndDelete = jest.fn();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getModelToken(Category.name), useValue: categoryModel },
      ],
    }).compile();

    categoriesService = moduleRef.get<CategoriesService>(CategoriesService);
  });

  it('creates a category document', async () => {
    await expect(categoriesService.create(createCategoryInput)).resolves.toBe(
      category,
    );
    expect(categoryModel).toHaveBeenCalledWith(createCategoryInput);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('finds categories with bounded pagination defaults', async () => {
    const chain = queryChain(categories);
    categoryModel.find.mockReturnValue(chain);

    await expect(categoriesService.findAll({})).resolves.toBe(categories);

    expect(categoryModel.find).toHaveBeenCalledWith({});
    expect(chain.sort).toHaveBeenCalledWith('-createdAt');
    expect(chain.skip).toHaveBeenCalledWith(0);
    expect(chain.limit).toHaveBeenCalledWith(10);
  });

  it('clamps pagination limits', async () => {
    const chain = queryChain(categories);
    categoryModel.find.mockReturnValue(chain);

    await categoriesService.findAll({ skip: -5, limit: 999 });

    expect(chain.skip).toHaveBeenCalledWith(0);
    expect(chain.limit).toHaveBeenCalledWith(100);
  });

  it('finds one category', async () => {
    const exec = jest.fn().mockResolvedValue(category);
    categoryModel.findOne.mockReturnValue({ exec });

    await expect(categoriesService.findOne({ _id: category.id })).resolves.toBe(
      category,
    );
    expect(categoryModel.findOne).toHaveBeenCalledWith({ _id: category.id });
  });

  it('updates one category', async () => {
    const exec = jest.fn().mockResolvedValue(category);
    categoryModel.findOneAndUpdate.mockReturnValue({ exec });

    await expect(
      categoriesService.update({
        where: { _id: category.id },
        data: updateCategoryInput,
      }),
    ).resolves.toBe(category);
    expect(categoryModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: category.id },
      { $set: updateCategoryInput },
      { new: true },
    );
  });

  it('removes one category', async () => {
    const exec = jest.fn().mockResolvedValue(category);
    categoryModel.findOneAndDelete.mockReturnValue({ exec });

    await expect(categoriesService.remove({ _id: category.id })).resolves.toBe(
      category,
    );
    expect(categoryModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: category.id,
    });
  });
});
