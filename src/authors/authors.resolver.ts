import { Args, Query, Resolver } from '@nestjs/graphql';

import { AuthorsService } from './authors.service';
import { Author } from './models/author.model';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @Query(() => Author)
  async author(@Args('id', { type: () => String }) id: string) {
    return this.authorsService.findOneById(id);
  }
}
