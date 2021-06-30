import { Injectable } from '@nestjs/common';
import { Book, Author } from '@prisma/client';

import { MethodLogger } from '../decorators';
import { PrismaService } from '../core/prisma.service';

export type BookModel = Book & { author: Author };

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  @MethodLogger()
  async createOne({
    title,
    authorId,
  }: {
    title: string;
    authorId: number;
  }): Promise<BookModel> {
    return this.prismaService.book.create({
      data: {
        title,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
      include: {
        author: true,
      },
    });
  }

  @MethodLogger()
  async removeOneById(id: number): Promise<BookModel> {
    return this.prismaService.book.delete({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }

  @MethodLogger()
  async findMany(): Promise<BookModel[]> {
    return this.prismaService.book.findMany({
      include: {
        author: true,
      },
    });
  }

  @MethodLogger()
  async findOneById(id: number): Promise<BookModel> {
    return this.prismaService.book.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }

  @MethodLogger()
  async findManyByAuthor(authorId: number): Promise<BookModel[]> {
    return this.prismaService.book.findMany({
      where: {
        authorId,
      },
      include: {
        author: true,
      },
    });
  }
}
