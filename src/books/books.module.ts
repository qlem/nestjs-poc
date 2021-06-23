import { Module } from '@nestjs/common';

import { CoreModule } from '../core/core.module';

import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

@Module({
  providers: [BooksResolver, BooksService],
  imports: [CoreModule],
})
export class BooksModule {}
