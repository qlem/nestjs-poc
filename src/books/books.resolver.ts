import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';

import { AuthorsService } from '../authors/authors.service';

import { Book } from './models/book.model';
import { BooksService } from './books.service';

@Resolver(() => Book)
export class BooksResolver {
  constructor(
    private booksService: BooksService,
    private authorsService: AuthorsService,
  ) {}

  @Query(() => Book)
  async book(@Args('id', { type: () => String }) id: string) {
    return this.booksService.findOneById(id);
  }

  @ResolveField()
  async author(
    @Parent() book: { id: string; title: string; authorId: string },
  ) {
    const { authorId } = book;
    return this.authorsService.findOneById(authorId);
  }
}
