import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { PaginationArgs } from './../common/dto/pagination.args';
import { Roles } from './../common/decorators/roles.decorator';
import { ObjectIdPipe } from './../common/pipes/object-id.pipe';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Roles('ADMIN')
  @Mutation(() => Category)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query(() => [Category], { name: 'getCategories' })
  async findAll(@Args() { skip, limit }: PaginationArgs): Promise<Category[]> {
    return this.categoriesService.findAll({
      skip: skip,
      limit: limit,
    });
  }

  @Query(() => Category, { nullable: true, name: 'getCategoryById' })
  async findOne(
    @Args('id', { type: () => ID }, ObjectIdPipe) id: string,
  ): Promise<Category | null> {
    return this.categoriesService.findOne({ _id: id });
  }

  @Roles('ADMIN')
  @Mutation(() => Category, { nullable: true, name: 'updateCategory' })
  async updateCategory(
    @Args('id', { type: () => ID }, ObjectIdPipe) id: string,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<any> {
    return this.categoriesService.update({
      where: { _id: id },
      data: updateCategoryInput,
    });
  }

  @Roles('ADMIN')
  @Mutation(() => Category, { nullable: true, name: 'removeCategory' })
  async removeCategory(
    @Args('id', { type: () => ID }, ObjectIdPipe) id: string,
  ): Promise<any> {
    return this.categoriesService.remove({ _id: id });
  }
}
