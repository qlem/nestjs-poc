import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { Book } from './models/book.model';
import { BooksService } from './books.service';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query(() => Book)
  async book(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.findOneById(id);
  }
}
