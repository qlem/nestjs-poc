import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { MethodLogger } from '../decorators';

import { Book } from './models/book.model';
import { BooksService } from './books.service';
import { NewBookInput } from './dto/newBook.input';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query(() => Book, { description: 'Query used to fetch one book by id' })
  @MethodLogger()
  async book(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.findOneById(id);
  }

  @Query(() => [Book], { description: 'Query used to fetch books by author' })
  async booksByAuthor(@Args('authorId', { type: () => Int }) authorId: number) {
    return this.booksService.findManyByAuthor(authorId);
  }

  @Mutation(() => Book, { description: 'Mutation used to create a new book' })
  async createBook(
    @Args('title', { type: () => String }) title: string,
    @Args('authorId', { type: () => Int }) authorId: number,
  ) {
    return this.booksService.createOne({ title, authorId });
  }

  @Mutation(() => Book, { description: 'Mutation used to create a new book' })
  async createBookBis(@Args('newBookArgs') newBookArgs: NewBookInput) {
    const { title, authorId } = newBookArgs;
    return this.booksService.createOne({ title, authorId });
  }

  @Mutation(() => Book, { description: 'Mutation used to remove a book by id' })
  async removeBook(@Args('id', { type: () => Int }) id: number) {
    return this.booksService.removeOneById(id);
  }
}
