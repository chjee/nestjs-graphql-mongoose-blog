import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'getCategories' })
  async findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<Category[]> {
    return this.categoriesService.findAll({
      skip: skip,
      limit: limit,
    });
  }

  @Query(() => Category, { nullable: true, name: 'getCategoryById' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Category | null> {
    return this.categoriesService.findOne({ _id: id });
  }

  @Mutation(() => Category, { nullable: true, name: 'updateCategory' })
  async updateCategory(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<any> {
    return this.categoriesService.update({
      where: { _id: id },
      data: updateCategoryInput,
    });
  }

  @Mutation(() => Category, { nullable: true, name: 'removeCategory' })
  async removeCategory(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<any> {
    return this.categoriesService.remove({ _id: id });
  }
}
