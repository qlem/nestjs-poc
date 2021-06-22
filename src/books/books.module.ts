import { Module } from '@nestjs/common';

import { AuthorsModule } from '../authors/authors.module';

import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

@Module({
  providers: [BooksResolver, BooksService],
  imports: [AuthorsModule],
})
export class BooksModule {}
