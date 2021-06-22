import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

@Module({
  providers: [BooksResolver, BooksService, PrismaService],
})
export class BooksModule {}
