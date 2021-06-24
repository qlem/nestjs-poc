import {
  Args,
  Int,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { AuthorsService } from './authors.service';
import { Author } from './models/author.model';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @Query(() => Author, { description: 'Query used to fetch one author by id' })
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOneById(id);
  }

  @Mutation(() => Author, {
    description: 'Mutation used to create a new author',
  })
  async createAuthor(@Args('name', { type: () => String }) name: string) {
    return this.authorsService.createOne({ name });
  }

  @Mutation(() => Author, {
    description: 'Mutation used to remove an author by id',
  })
  async removeAuthor(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.removeOneById(id);
  }

  @ResolveField()
  async countBooks(@Parent() author: Author) {
    const { books } = author;
    return books.length;
  }
}
