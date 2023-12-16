import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesResolver } from './categories.resolver';
import { CategoriesService } from './categories.service';
import {
  category,
  categories,
  createCategoryInput,
  updateCategoryInput,
} from '../common/constants/jest.constants';
import { getModelToken } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';

describe('CategoriesResolver', () => {
  let categoriesResolver: CategoriesResolver;
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(Category.name), useValue: {} },
        CategoriesResolver,
        CategoriesService,
      ],
    })
      .overrideProvider(getModelToken(Category.name))
      .useValue({})
      .compile();

    categoriesResolver = moduleRef.get<CategoriesResolver>(CategoriesResolver);
    categoriesService = moduleRef.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('should return a category', async () => {
      jest
        .spyOn(categoriesService, 'create')
        .mockImplementation(async () => category);
      expect(await categoriesResolver.createCategory(createCategoryInput)).toBe(
        category,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      jest
        .spyOn(categoriesService, 'findAll')
        .mockImplementation(async () => categories);
      expect(await categoriesResolver.findAll(0, 5)).toBe(categories);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      jest
        .spyOn(categoriesService, 'findOne')
        .mockImplementation(async () => category);
      expect(await categoriesResolver.findOne('6576d6d44441e8ea8a38b5a8')).toBe(
        category,
      );
    });
  });

  describe('update', () => {
    it('should return an updated category', async () => {
      jest
        .spyOn(categoriesService, 'update')
        .mockImplementation(async () => category);
      expect(
        await categoriesResolver.updateCategory(
          '6576d6d44441e8ea8a38b5a8',
          updateCategoryInput,
        ),
      ).toBe(category);
    });
  });

  describe('remove', () => {
    it('should return a category', async () => {
      jest
        .spyOn(categoriesService, 'remove')
        .mockImplementation(async () => category);
      expect(
        await categoriesResolver.removeCategory('6576d6d44441e8ea8a38b5a8'),
      ).toBe(category);
    });
  });
});
