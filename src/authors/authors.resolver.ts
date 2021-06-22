import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { AuthorsService } from './authors.service';
import { Author } from './models/author.model';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @Query(() => Author)
  async author(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.findOneById(id);
  }

  @Mutation(() => Author)
  async createAuthor(@Args('name', { type: () => String }) name: string) {
    return this.authorsService.createOne({ name });
  }

  @Mutation(() => Author)
  async removeAuthor(@Args('id', { type: () => Int }) id: number) {
    return this.authorsService.removeOneById(id);
  }
}
