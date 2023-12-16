import { Category } from './../../categories/entities/category.entity';
import { Post } from './../../posts/entities/post.entity';
import { User } from './../../users/entities/user.entity';
import { Profile } from './../../profiles/entities/profile.entity';
import { CreateCategoryInput } from 'src/categories/dto/create-category.input';
import { UpdateCategoryInput } from 'src/categories/dto/update-category.input';
import { CreatePostInput } from './../../posts/dto/create-post.input';
import { UpdatePostInput } from './../../posts/dto/update-post.input';
import { CreateProfileInput } from './../../profiles/dto/create-profile.input';
import { UpdateProfileInput } from './../../profiles/dto/update-profile.input';
import { CreateUserInput } from './../../users/dto/create-user.input';
import { UpdateUserInput } from './../../users/dto/update-user.input';

export const category: Category = {
  _id: '6576d6d44441e8ea8a38b5a8',
  id: '6576d6d44441e8ea8a38b5a8',
  name: 'Test Category',
  createdAt: new Date(),
  updatedAt: new Date(),
};
export const categories = [category];

export const createCategoryInput: CreateCategoryInput = {
  name: 'Science',
};

export const updateCategoryInput: UpdateCategoryInput = {
  name: 'Database',
};

export const post: Post = {
  _id: '6576d6d44441e8ea8a38b5a8',
  id: '6576d6d44441e8ea8a38b5a8',
  title: 'Test Post',
  published: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '6576d6d44441e8ea8a38b5a8',
  categoryIds: ['6576d6d44441e8ea8a38b5a8'],
};
export const posts: Post[] = [post];

export const createPostInput: CreatePostInput = {
  title: 'Just 5 minutes.',
  published: false,
  userId: '6576d6d44441e8ea8a38b5a8',
  categoryIds: ['6576d6d44441e8ea8a38b5a8'],
};

export const updatePostInput: UpdatePostInput = {
  title: 'Just 10 minutes.',
  published: true,
};

export const profile: Profile = {
  _id: '6576d6d44441e8ea8a38b5a8',
  id: '6576d6d44441e8ea8a38b5a8',
  bio: 'Happy',
  userId: '6576d6d44441e8ea8a38b5a8',
};
export const profiles: Profile[] = [profile];

export const createProfileInput: CreateProfileInput = {
  bio: 'Happy',
  userId: '6576d6d44441e8ea8a38b5a8',
};

export const updateProfileInput: UpdateProfileInput = {
  bio: 'Soso',
};

export const user: User = {
  _id: '6576d6d44441e8ea8a38b5a8',
  id: '6576d6d44441e8ea8a38b5a8',
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'andrew@prisma.io',
  name: 'Andrew',
  password: 'whoami',
  role: 'ADMIN',
};
export const users: User[] = [user];

export const createUserInput: CreateUserInput = {
  email: 'andrew@prisma.io',
  name: 'Andrew',
  password: 'whoami',
  role: 'ADMIN',
};

export const updateUserInput: UpdateUserInput = {
  role: 'USER',
};
