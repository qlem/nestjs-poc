import { Injectable } from '@nestjs/common';
import { Book as BookModel } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

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
