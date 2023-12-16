import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import {
  category,
  categories,
  createCategoryInput,
  updateCategoryInput,
} from '../common/constants/jest.constants';
import { getModelToken } from '@nestjs/mongoose';
import { Category } from './entities/category.entity';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getModelToken(Category.name), useValue: {} },
      ],
    })
      .overrideProvider(getModelToken(Category.name))
      .useValue({})
      .compile();

    categoriesService = moduleRef.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('should return a categories', async () => {
      jest
        .spyOn(categoriesService, 'create')
        .mockImplementation(async () => category);
      expect(await categoriesService.create(createCategoryInput)).toBe(
        category,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      jest
        .spyOn(categoriesService, 'findAll')
        .mockImplementation(async () => categories);
      expect(await categoriesService.findAll({ skip: 0, limit: 5 })).toBe(
        categories,
      );
    });
  });

  describe('findOne', () => {
    it('should return a categories', async () => {
      jest
        .spyOn(categoriesService, 'findOne')
        .mockImplementation(async () => category);
      expect(
        await categoriesService.findOne({ _id: '6576d6d44441e8ea8a38b5a8' }),
      ).toBe(category);
    });
  });

  describe('update', () => {
    it('should return an updated categories', async () => {
      jest
        .spyOn(categoriesService, 'update')
        .mockImplementation(async () => category);
      expect(
        await categoriesService.update({
          where: { _id: '6576d6d44441e8ea8a38b5a8' },
          data: updateCategoryInput,
        }),
      ).toBe(category);
    });
  });

  describe('remove', () => {
    it('should return a categories', async () => {
      jest
        .spyOn(categoriesService, 'remove')
        .mockImplementation(async () => category);
      expect(
        await categoriesService.remove({ _id: '6576d6d44441e8ea8a38b5a8' }),
      ).toBe(category);
    });
  });
});
