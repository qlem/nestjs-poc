import { Injectable } from '@nestjs/common';
import { Book as BookModel, Author as AuthorModel } from '@prisma/client';

import { PrismaService } from '../core/prisma.service';

type BookWithAuthorModel = BookModel & { author: AuthorModel };

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  async createOne({
    title,
    authorId,
  }: {
    title: string;
    authorId: number;
  }): Promise<BookWithAuthorModel> {
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

  async removeOneById(id: number): Promise<BookWithAuthorModel> {
    return this.prismaService.book.delete({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }

  async findMany(): Promise<BookWithAuthorModel[]> {
    return this.prismaService.book.findMany({
      include: {
        author: true,
      },
    });
  }

  async findOneById(id: number): Promise<BookWithAuthorModel> {
    return this.prismaService.book.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }

  async findManyByAuthor(authorId: number): Promise<BookWithAuthorModel[]> {
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
